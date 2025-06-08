import ItemCarrito from "../models/ItemCarrito.js";
import Producto from "../models/Producto.js";
// importar la configuracion de la base de datos
import db from "../config/db.js";

export const addToCarrito = async (req, res) => {
  const producto_id = req.params.id;
  const user_id = req.user.id;
  try {
    const productoData = await Producto.findById(producto_id);
    if (productoData.stock <= 0) {
      return res.status(400).json({
        title: "No se agrego",
        message: "No se puede agregar ya que no hay stock",
      });
    }

    const itemExistente = await ItemCarrito.findByUsuarioIdAndProductoId(
      user_id,
      producto_id
    );

    if (itemExistente) {
      if (itemExistente.cantidad >= productoData.stock) {
        return res.status(200).json({
          title: "No se agrego",
          message: "No se puede agregar ya que no hay stock suficiente",
        });
      }

      const itemActualizado = await ItemCarrito.updateCantidad(
        user_id,
        producto_id,
        1
      );

      if (itemActualizado) {
        return res.status(200).json({
          title: "Se aumento la cantidad",
          message: "La cantidad del producto se aumento en tu carrito",
        });
      }

      return res.status(400).json({
        title: "No se aumento la cantidad",
        message: "La cantidad del producto no se aumento en tu carrito",
      });
    }

    const nuevoItem = await ItemCarrito.create({
      usuario_id: user_id,
      producto_id: producto_id,
      cantidad: 1,
    });

    if (nuevoItem) {
      return res.status(200).json({
        title: "Se añadio al carrito",
        message: "El producto se añadio a tu carrito",
      });
    }

    return res.status(400).json({
      title: "No se añadio al carrito",
      message: "El producto no se añadio a tu carrito",
    });
  } catch (err) {
    console.error("Sucedio un error al añadir al carrito: ", err);
    return res.status(500).json({
      title: "ERROR",
      message: "Sucedio un error en el servidor",
    });
  }
};

export const removeFromCart = async (req, res) => {
  const producto_id = req.params.id;
  const user_id = req.user.id;
  try {
    const itemEliminado = await ItemCarrito.deleteByUsuarioIdAndProductoId(
      user_id,
      producto_id
    );

    if (itemEliminado) {
      return res.status(200).json({
        title: "Se elimino del carrito",
        message: "El producto se elimino de tu carrito",
      });
    }

    return res.status(400).json({
      title: "No se elimino del carrito",
      message: "El producto no se elimino de tu carrito",
    });
  } catch (err) {
    console.error("Sucedio un error al eliminar del carrito: ", err);
    return res.status(500).json({
      title: "ERROR",
      message: "Sucedio un error en el servidor",
    });
  }
};

export const increaseQuantity = async (req, res) => {
  const producto_id = req.params.id;
  const user_id = req.user.id;
  try {
    const item = await ItemCarrito.findByUsuarioIdAndProductoId(
      user_id,
      producto_id
    );

    if (item.cantidad >= item.stock) {
      return res.status(400).json({
        title: "No se aumento la cantidad",
        message: "La cantidad del producto no se aumento en tu carrito",
      });
    }

    const itemActualizado = await ItemCarrito.updateCantidad(
      user_id,
      producto_id,
      1
    );

    if (itemActualizado) {
      return res.status(200).json({
        title: "Se aumento la cantidad",
        message: "La cantidad del producto se aumento en tu carrito",
      });
    }

    return res.status(400).json({
      title: "No se aumento la cantidad",
      message: "La cantidad del producto no se aumento en tu carrito",
    });
  } catch (err) {
    console.error("Sucedio un error al aumentar la cantidad: ", err);
    return res.status(500).json({
      title: "ERROR",
      message: "Sucedio un error en el servidor",
    });
  }
};

export const decreaseQuantity = async (req, res) => {
  const producto_id = req.params.id;
  const user_id = req.user.id;
  try {
    const item = await ItemCarrito.findByUsuarioIdAndProductoId(
      user_id,
      producto_id
    );

    if (item.cantidad === 1) {
      await ItemCarrito.deleteByUsuarioIdAndProductoId(user_id, producto_id);
      return res.status(200).json({
        title: "Se elimino del carrito",
        message: "El producto se elimino de tu carrito",
      });
    }

    const itemActualizado = await ItemCarrito.updateCantidad(
      user_id,
      producto_id,
      -1
    );

    if (itemActualizado) {
      return res.status(200).json({
        title: "Se disminuyo la cantidad",
        message: "La cantidad del producto se disminuyo en tu carrito",
      });
    }

    return res.status(400).json({
      title: "No se disminuyo la cantidad",
      message: "La cantidad del producto no se disminuyo en tu carrito",
    });
  } catch (err) {
    console.error("Sucedio un error al disminuir la cantidad: ", err);
    return res.status(500).json({
      title: "ERROR",
      message: "Sucedio un error en el servidor",
    });
  }
};

export const getSalesOfMonth = async (req, res) => {
  try {
    // obtener conteo de pedidos pendientes
    const ingresosRow = await new Promise((resolve, reject) => {
      db.get(
        `SELECT SUM(total) AS ingresos_mes_actual
FROM pedidos
WHERE estado = ?
  AND strftime('%Y-%m', creado_en) = strftime('%Y-%m', 'now');
`,
        ["finalizado"],
        (err, row) => {
          if (err) {
            console.error("error en consulta de ingresos:", err); // registrar error para depuracion
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // obtener los valores de 'count' de cada resultado, asegurando que sean 0 si no hay filas
    const ingresos = ingresosRow ? ingresosRow.ingresos_mes_actual : 0;

    // enviar los conteos como respuesta json
    res.json({
      ingresos: ingresos,
    });
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener los ingresos del mes actual:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({
      message: "error interno al obtener los ingresos del mes.",
    });
  }
}