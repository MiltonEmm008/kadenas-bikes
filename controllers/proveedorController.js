import Proveedor from "../models/Proveedor.js";

// obtener todos los proveedores con conteo de productos
export const getAllSuppliers = async (req, res) => {
  try {
    // buscar todos los proveedores y contar sus productos asociados
    const suppliers = await Proveedor.getAllWithProductCount();
    // enviar los proveedores como respuesta json
    res.json(suppliers);
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener proveedores:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al obtener los proveedores" });
  }
};

// obtener un proveedor por id
export const getSupplierById = async (req, res) => {
  try {
    // obtener el id de los parametros de la solicitud
    const { id } = req.params;
    // buscar un proveedor por su id
    const supplier = await Proveedor.findById(id);

    // si el proveedor no se encuentra
    if (!supplier) {
      return res.status(404).json({ error: "proveedor no encontrado" });
    }

    // enviar el proveedor encontrado como respuesta json
    res.json(supplier);
  } catch (error) {
    // registrar el error en consola
    console.error("error al obtener proveedor:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al obtener el proveedor" });
  }
};

// crear un nuevo proveedor
export const createSupplier = async (req, res) => {
  try {
    // extraer datos del cuerpo de la solicitud
    const { nombre_empresa, telefono, correo, direccion } = req.body;

    // validar que el nombre de empresa no exista previamente
    const existingSupplier = await Proveedor.findByNombreEmpresa(
      nombre_empresa
    );
    if (existingSupplier) {
      return res
        .status(400)
        .json({ error: "ya existe un proveedor con ese nombre de empresa" });
    }

    // preparar los datos del nuevo proveedor
    const supplierData = {
      nombre_empresa,
      telefono,
      correo,
      direccion,
    };

    // crear el proveedor en la base de datos y obtener su id
    const supplierId = await Proveedor.create(supplierData);
    // buscar el nuevo proveedor por su id para devolverlo completo
    const newSupplier = await Proveedor.findById(supplierId);

    // enviar el nuevo proveedor como respuesta json con estado 201 (creado)
    res.status(201).json(newSupplier);
  } catch (error) {
    // registrar el error en consola
    console.error("error al crear proveedor:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al crear el proveedor" });
  }
};

// actualizar un proveedor existente
export const updateSupplier = async (req, res) => {
  try {
    // obtener el id del proveedor de los parametros de la solicitud
    const { id } = req.params;
    // extraer datos a actualizar del cuerpo de la solicitud
    const { nombre_empresa, telefono, correo, direccion } = req.body;

    // verificar si el proveedor a actualizar existe
    const existingSupplier = await Proveedor.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ error: "proveedor no encontrado" });
    }

    // si se esta cambiando el nombre de empresa, verificar que el nuevo nombre no este en uso por otro proveedor
    if (nombre_empresa !== existingSupplier.nombre_empresa) {
      const duplicateSupplier = await Proveedor.findByNombreEmpresa(
        nombre_empresa
      );
      // si se encuentra un duplicado y su id es diferente al actual
      if (duplicateSupplier && duplicateSupplier.id !== parseInt(id)) {
        return res
          .status(400)
          .json({
            error: "ya existe otro proveedor con ese nombre de empresa",
          });
      }
    }

    // preparar los datos para la actualizacion
    const updateData = {
      nombre_empresa,
      telefono,
      correo,
      direccion,
    };

    // actualizar el proveedor en la base de datos
    await Proveedor.update(id, updateData);
    // obtener el proveedor actualizado para devolverlo
    const updatedSupplier = await Proveedor.findById(id);

    // enviar el proveedor actualizado como respuesta json
    res.json(updatedSupplier);
  } catch (error) {
    // registrar el error en consola
    console.error("error al actualizar proveedor:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al actualizar el proveedor" });
  }
};

// eliminar un proveedor
export const deleteSupplier = async (req, res) => {
  try {
    // obtener el id del proveedor de los parametros de la solicitud
    const { id } = req.params;

    // verificar si el proveedor a eliminar existe
    const existingSupplier = await Proveedor.findById(id);
    if (!existingSupplier) {
      return res.status(404).json({ error: "proveedor no encontrado" });
    }

    // verificar si el proveedor tiene productos asociados antes de eliminarlo
    const supplierWithProducts = await Proveedor.getWithProductCount(id);
    if (supplierWithProducts.productos_count > 0) {
      return res.status(400).json({
        error:
          "no se puede eliminar el proveedor porque tiene productos asociados",
      });
    }

    // eliminar el proveedor de la base de datos
    await Proveedor.delete(id);
    // enviar mensaje de exito
    res.json({ message: "proveedor eliminado exitosamente" });
  } catch (error) {
    // registrar el error en consola
    console.error("error al eliminar proveedor:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al eliminar el proveedor" });
  }
};