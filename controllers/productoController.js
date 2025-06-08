// controllers/productoController.js

// importar el modelo de producto
import Producto from "../models/Producto.js";
// importar el modelo de proveedor
import Proveedor from "../models/Proveedor.js";
// importar utilidades de path para manejo de rutas de archivos
import { dirname, join, extname } from "path";
// importar utilidad para obtener la ruta del archivo actual
import { fileURLToPath } from "url";
// importar utilidades para manejo de archivos del sistema de archivos
import { renameSync, existsSync, unlinkSync, mkdirSync } from "fs";
// importar la configuracion de la base de datos
import db from "../config/db.js";

// obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
// obtener el directorio del archivo actual
const __dirname = dirname(__filename);

export const getAllProducts = async (req, res) => {
  try {
    // obtener todos los productos con informacion de su proveedor
    const productos = await Producto.allWithSupplierJoin();
    // enviar los productos como respuesta json
    res.json(productos);
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener productos:", error);
    // enviar una respuesta de error del servidor
    res
      .status(500)
      .json({ message: "error interno del servidor al obtener productos." });
  }
};

export const createProduct = async (req, res) => {
  try {
    let productData = req.body;
    let fileName = null;

    // si se sube una imagen
    if (req.file) {
      // el nombre temporal se usara para el archivo subido
      fileName = req.file.filename;
    }

    // insertar el producto en la base de datos sin la ruta de la imagen aun
    const result = await Producto.create(productData);
    // obtener el id del producto insertado (compatible con sqlite)
    const id = result.id || result.lastID;

    // si se subio un archivo de imagen
    if (req.file) {
      // obtener la extension del archivo original
      const ext = extname(req.file.originalname);
      // crear un nombre seguro para el archivo usando el id y el nombre del producto
      const safeName = productData.nombre
        ? productData.nombre.replace(/[^a-zA-Z0-9_-]/g, "_")
        : id;
      // construir el nuevo nombre del archivo
      const newFileName = `${id}-${safeName}${ext}`;
      // construir la ruta de destino final para la imagen
      const destPath = join(
        __dirname,
        "..",
        "public",
        "productos",
        newFileName
      );
      // construir la ruta del directorio de destino
      const destDir = join(__dirname, "..", "public", "productos");

      // asegurar que el directorio de destino exista, creandolo si es necesario
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

      // verificar si el archivo temporal existe antes de intentar moverlo
      if (!existsSync(req.file.path)) {
        throw new Error(`el archivo temporal no existe: ${req.file.path}`);
      }

      // renombrar y mover el archivo temporal a su ubicacion final
      renameSync(req.file.path, destPath);
      // actualizar el producto en la base de datos con la ruta de la imagen
      await Producto.update(id, {
        foto_producto: `/productos/${newFileName}`,
      });
    }
    // enviar respuesta de exito con el id del producto creado
    res.status(201).json({ message: "producto creado exitosamente", id });
  } catch (error) {
    // registrar el error en consola
    console.error("error al crear producto:", error);
    // enviar una respuesta de error del servidor
    res
      .status(500)
      .json({ message: "error interno del servidor al crear el producto." });
  }
};

export const getCarousellPhotos = async (req, res) => {
  try {
    // obtener fotos para el carrusel
    const photos = await Producto.getCarousellPhotos();
    // si se obtuvieron fotos
    if (photos) {
      // enviar respuesta de exito con las fotos
      res.status(200).json({
        message: "productos obtenidos correctamente",
        photos: photos,
      });
    } else {
      // si no se obtuvieron fotos, enviar respuesta de error con array vacio
      res.status(400).json({
        message: "no se obtuvieron los productos",
        photos: [],
      });
    }
  } catch (err) {
    // registrar el error en consola
    console.log("error al obtener las fotos: ", err);
    // enviar una respuesta de error del servidor
    res.status(500).json({
      message: "error al intentar obtener las fotos de productos",
      photos: [],
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    // obtener el id del producto desde los parametros de la url
    const { id } = req.params;
    let changes = req.body;

    // serializar el campo 'detalles' si viene como objeto (para guardarlo como json string)
    if (typeof changes.detalles === "object") {
      changes.detalles = JSON.stringify(changes.detalles);
    }

    // si se sube una nueva imagen
    if (req.file) {
      // buscar el producto actual para obtener su foto previa
      const producto = await Producto.findById(id);
      // solo borrar la imagen anterior si no es la imagen por defecto
      if (
        producto &&
        producto.foto_producto &&
        producto.foto_producto !== "/productos/producto-default.jpg"
      ) {
        // construir la ruta completa de la imagen antigua
        const oldPath = join(__dirname, "..", "public", producto.foto_producto);
        // si el archivo antiguo existe, eliminarlo
        if (existsSync(oldPath)) unlinkSync(oldPath);
      }
      // obtener la extension del nuevo archivo
      const ext = extname(req.file.originalname);
      // crear un nombre seguro para el nuevo archivo
      const safeName = changes.nombre
        ? changes.nombre.replace(/[^a-zA-Z0-9_-]/g, "_")
        : id;
      // construir el nuevo nombre de archivo
      const newFileName = `${id}-${safeName}${ext}`;
      // construir la ruta de destino final para la nueva imagen
      const destPath = join(
        __dirname,
        "..",
        "public",
        "productos",
        newFileName
      );
      // construir la ruta del directorio de destino
      const destDir = join(__dirname, "..", "public", "productos");

      // asegurar que el directorio de destino exista
      if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });

      // verificar si el archivo temporal existe
      if (!existsSync(req.file.path)) {
        throw new Error(`el archivo temporal no existe: ${req.file.path}`);
      }

      // renombrar y mover el archivo temporal
      renameSync(req.file.path, destPath);
      // actualizar la ruta de la foto en los cambios
      changes.foto_producto = `/productos/${newFileName}`;
    } else {
      // si no hay nueva imagen, pero el nombre del producto cambio, renombrar la imagen existente
      const producto = await Producto.findById(id);
      // solo si el producto existe, tiene una foto y no es la foto por defecto
      if (
        producto &&
        producto.foto_producto &&
        producto.foto_producto !== "/productos/producto-default.jpg"
      ) {
        // construir la ruta completa de la imagen actual
        const oldPath = join(__dirname, "..", "public", producto.foto_producto);
        // obtener la extension del archivo actual
        const ext = extname(producto.foto_producto);
        // si el nombre del producto cambio
        if (changes.nombre && producto.nombre !== changes.nombre) {
          // crear un nuevo nombre seguro
          const safeName = changes.nombre.replace(/[^a-zA-Z0-9_-]/g, "_");
          // construir el nuevo nombre de archivo
          const newFileName = `${id}-${safeName}${ext}`;
          // construir la nueva ruta completa
          const newPath = join(
            __dirname,
            "..",
            "public",
            "productos",
            newFileName
          );
          // si el archivo existe y las rutas son diferentes, renombrarlo
          if (existsSync(oldPath) && oldPath !== newPath) {
            renameSync(oldPath, newPath);
            // actualizar la ruta de la foto en los cambios
            changes.foto_producto = `/productos/${newFileName}`;
          }
        }
      }
    }
    // actualizar el producto en la base de datos con los cambios
    await Producto.update(id, changes);
    // enviar respuesta de exito
    res.json({ message: "producto actualizado exitosamente" });
  } catch (error) {
    // registrar el error en consola
    console.error("error al actualizar producto:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno del servidor al actualizar el producto.",
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    // obtener el id del producto desde los parametros de la url
    const { id } = req.params;
    // buscar el producto para obtener la ruta de su imagen
    const producto = await Producto.findById(id);
    // si el producto existe, tiene una foto y no es la foto por defecto
    if (
      producto &&
      producto.foto_producto &&
      producto.foto_producto !== "/productos/producto-default.jpg"
    ) {
      // construir la ruta completa de la imagen
      const imgPath = join(__dirname, "..", "public", producto.foto_producto);
      // si el archivo de imagen existe, eliminarlo
      if (existsSync(imgPath)) unlinkSync(imgPath);
    }
    // eliminar el producto de la base de datos
    await Producto.delete(id);
    // enviar respuesta de exito
    res.json({ message: "producto eliminado exitosamente" });
  } catch (error) {
    // registrar el error en consola
    console.error("error al eliminar producto:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno del servidor al eliminar el producto.",
    });
  }
};

export const getAllSuppliers = async (req, res) => {
  try {
    // obtener todos los proveedores
    const proveedores = await Proveedor.all();
    // enviar los proveedores como respuesta json
    res.json(proveedores);
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener proveedores:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno del servidor al obtener proveedores.",
    });
  }
};

export const getCategoryCounts = async (req, res) => {
  try {
    // obtener el conteo de productos por categoria
    const conteoCategorias = await Producto.getCategoryCounts();
    // enviar el conteo de categorias como respuesta json
    res.json(conteoCategorias);
  } catch (err) {
    // registrar el error en consola
    console.log("sucedio un error al intentar obtener las categorias: ", err);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno del servidor al obtener conteos de categorias.",
    });
  }
};

export const getDashboardCounts = async (req, res) => {
  try {
    // obtener conteo de pedidos pendientes
    const pedidosRow = await new Promise((resolve, reject) => {
      db.get(
        "select count(*) as count from pedidos where estado = ?",
        ["pendiente"],
        (err, row) => {
          if (err) {
            console.error("error en consulta de pedidos:", err); // registrar error para depuracion
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // obtener conteo de usuarios con rol 'cliente'
    const usuariosRow = await new Promise((resolve, reject) => {
      db.get(
        "select count(*) as count from usuarios where rol = ?",
        ["cliente"],
        (err, row) => {
          if (err) {
            console.error("error en consulta de usuarios:", err); // registrar error para depuracion
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // obtener conteo de productos con stock mayor a 0
    const productosRow = await new Promise((resolve, reject) => {
      db.get(
        "select count(*) as count from productos where stock > ?",
        [0],
        (err, row) => {
          if (err) {
            console.error("error en consulta de productos:", err); // registrar error para depuracion
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // obtener los valores de 'count' de cada resultado, asegurando que sean 0 si no hay filas
    const pedidosCount = pedidosRow ? pedidosRow.count : 0;
    const usuariosCount = usuariosRow ? usuariosRow.count : 0;
    const productosCount = productosRow ? productosRow.count : 0;

    // enviar los conteos como respuesta json
    res.json({
      productos: productosCount,
      pedidos: pedidosCount,
      usuarios: usuariosCount,
    });
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener los conteos del dashboard:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno al obtener los conteos del dashboard.",
    });
  }
};