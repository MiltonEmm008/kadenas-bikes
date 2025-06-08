// controllers/userController.js

import Usuario from "../models/Usuario.js";
import { hash } from "bcrypt";
const saltRounds = 10;

// --- Funciones para Obtener Usuarios ---

// Obtener todos los usuarios con rol de cliente.
// Esta función recupera una lista de todos los usuarios que tienen el rol de "cliente".
// Se asegura de que la contraseña (campo 'contra') no se incluya en la respuesta por seguridad.
export const getAllUsers = async (req, res) => {
  try {
    const users = await Usuario.getAllClients();
    // Usamos desestructuración para crear un nuevo array de objetos sin la propiedad 'contra'.
    const usersWithoutPassword = users.map(({ contra, ...user }) => user);
    res.json(usersWithoutPassword);
  } catch (error) {
    // Si hay un problema al obtener los clientes, registramos el error para depuración.
    console.error("Error al obtener los clientes:", error);
    // Y enviamos una respuesta de error 500 (Internal Server Error) al cliente.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al obtener los clientes",
    });
  }
};

// Obtener todos los usuarios con rol de administrador.
// Esta función se encarga de obtener y devolver una lista de todos los usuarios
// que han sido designados como administradores.
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Usuario.getAllAdmins();
    res.json(admins);
  } catch (error) {
    // En caso de un error al recuperar los administradores, lo registramos.
    console.error("Error al obtener administradores:", error);
    // Y enviamos una respuesta de error 500 al cliente.
    res
      .status(500)
      .json({
        titulo: "ERROR",
        mensaje: "Error al obtener los administradores",
      });
  }
};

// Obtener un administrador por su ID.
// Esta función busca y proporciona los detalles de un administrador específico, utilizando su ID.
// Por seguridad, la contraseña del administrador se omite de la respuesta.
export const getAdminById = async (req, res) => {
  try {
    // Extraemos el 'id' del administrador de los parámetros de la URL.
    const { id } = req.params;
    const admin = await Usuario.findUsuarioById(id);

    // Si no se encuentra un administrador con el ID proporcionado, respondemos con un error 404 (No Encontrado).
    if (!admin) {
      return res.status(404).json({
        titulo: "ERROR",
        mensaje: "Administrador no encontrado",
      });
    }

    // Usamos la desestructuración de objetos para crear una nueva versión del objeto 'admin'
    // que excluye la propiedad 'contra' (contraseña) antes de enviarla al cliente.
    const { contra, ...adminWithoutPassword } = admin;
    res.json(adminWithoutPassword);
  } catch (error) {
    // Si ocurre un error durante la obtención del administrador, lo registramos.
    console.error("Error al obtener administrador:", error);
    // Y enviamos una respuesta de error 500.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al obtener el administrador",
    });
  }
};

// --- Funciones para Manipulación de Administradores ---

// Crear un nuevo administrador.
// Esta función permite registrar un nuevo usuario con el rol de administrador.
// Es necesario proporcionar un nombre de usuario, un correo electrónico y una contraseña.
export const createAdmin = async (req, res) => {
  try {
    // Obtenemos los datos necesarios (nombre de usuario, correo, contraseña) del cuerpo de la solicitud.
    const { nombre_usuario, correo, password } = req.body;

    // Validamos que todos los campos requeridos estén presentes. Si falta alguno, enviamos un error 400.
    if (!nombre_usuario || !correo || !password) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "Faltan datos requeridos para crear el administrador",
      });
    }

    // Verificamos si ya existe un usuario (administrador o cliente) con el correo electrónico proporcionado.
    const existingUser = await Usuario.findUsuarioByCorreo(correo);
    if (existingUser) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "El correo ya está registrado para otro administrador",
      });
    }

    // Encriptamos la contraseña proporcionada utilizando bcrypt antes de almacenarla en la base de datos.
    const hashedPassword = await hash(password, saltRounds);

    // Creamos el nuevo registro de administrador en la base de datos.
    const admin = await Usuario.createAdmin({
      nombre_usuario,
      correo,
      contra: hashedPassword, // Almacenamos la contraseña encriptada.
      rol: "admin", // Asignamos explícitamente el rol de "admin".
      saldo: 0, // Inicializamos el saldo del administrador a 0.
    });

    // Para la respuesta al cliente, excluimos la contraseña del objeto 'admin'.
    const { contra, ...adminWithoutPassword } = admin;

    // Enviamos una respuesta de éxito con el administrador recién creado (sin contraseña)
    // y un estado 201 (Created) para indicar que el recurso ha sido creado.
    res.status(201).json({
      titulo: "ÉXITO",
      mensaje: "Administrador creado exitosamente",
      admin: adminWithoutPassword,
    });
  } catch (error) {
    // Si ocurre un error inesperado durante el proceso de creación, lo registramos.
    console.error("Error al crear administrador:", error);
    // Y enviamos una respuesta de error 500 al cliente.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al crear el administrador",
    });
  }
};

// Actualizar un administrador existente.
// Esta función permite modificar la información de un administrador ya registrado,
// como su nombre de usuario, correo electrónico o contraseña.
export const updateAdmin = async (req, res) => {
  try {
    // Obtenemos el 'id' del administrador a actualizar de los parámetros de la URL.
    const { id } = req.params;
    // Obtenemos los datos a actualizar (nombre de usuario, correo, y opcionalmente, una nueva contraseña)
    // del cuerpo de la solicitud.
    const { nombre_usuario, correo, password } = req.body;

    // Validamos que los campos esenciales (nombre de usuario y correo) estén presentes.
    // Si falta alguno, enviamos un error 400.
    if (!nombre_usuario || !correo) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "Faltan datos requeridos para actualizar el administrador",
      });
    }

    // Primero, verificamos si el administrador con el 'id' dado realmente existe en la base de datos.
    const existingUser = await Usuario.findUsuarioById(id);
    if (!existingUser) {
      return res.status(404).json({
        titulo: "ERROR",
        mensaje: "Administrador no encontrado",
      });
    }

    // Implementamos una restricción de seguridad: no se permite modificar al "administrador principal".
    // Esto se define por su rol ("superadmin") y un correo electrónico específico.
    if (
      existingUser.rol === "superadmin" &&
      existingUser.correo === "ADMINKADENAS@gmail.com"
    ) {
      return res.status(403).json({
        // Respondemos con un error 403 (Prohibido).
        titulo: "ERROR",
        mensaje: "No se puede modificar al administrador principal",
      });
    }

    // Si el correo electrónico se está cambiando, verificamos que el nuevo correo
    // no esté ya en uso por otro usuario (otro administrador con un ID diferente).
    if (correo !== existingUser.correo) {
      const userWithEmail = await Usuario.findUsuarioByCorreo(correo);
      // Si encontramos un usuario con ese correo y su ID no coincide con el actual, significa que está duplicado.
      if (userWithEmail && userWithEmail.id !== parseInt(id)) {
        return res.status(400).json({
          titulo: "ERROR",
          mensaje: "El correo ya está registrado por otro administrador",
        });
      }
    }

    // Preparamos un objeto con los datos que se van a actualizar en la base de datos.
    const updateData = {
      nombre_usuario,
      correo,
      rol: "administrador", // Aseguramos que el rol permanezca como "administrador".
    };

    // Si se proporciona una nueva contraseña en la solicitud, la encriptamos
    // y la añadimos a los datos que se van a actualizar.
    if (password) {
      updateData.contra = await hash(password, saltRounds);
    }

    // Realizamos la actualización del administrador en la base de datos.
    await Usuario.update(id, updateData);

    // Enviamos una respuesta de éxito indicando que la actualización fue exitosa.
    res.json({
      titulo: "ÉXITO",
      mensaje: "Administrador actualizado exitosamente",
    });
  } catch (error) {
    // Si ocurre un error durante la actualización, lo registramos.
    console.error("Error al actualizar administrador:", error);
    // Y enviamos una respuesta de error 500.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al actualizar el administrador",
    });
  }
};

// Agregar saldo a un administrador.
// Esta función permite aumentar el saldo disponible de un administrador específico.
export const addSaldo = async (req, res) => {
  try {
    // Obtenemos el 'id' del administrador de los parámetros de la URL.
    const { id } = req.params;
    // Obtenemos la 'cantidad' (amount) a agregar al saldo del cuerpo de la solicitud.
    const { amount } = req.body;

    // Validamos que la cantidad sea un número válido y positivo. Si no, enviamos un error 400.
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "La cantidad debe ser un número positivo",
      });
    }

    // Buscamos al usuario por su ID para verificar su existencia y obtener su saldo actual.
    const user = await Usuario.findUsuarioById(id);
    if (!user) {
      return res.status(404).json({
        titulo: "ERROR",
        mensaje: "Administrador no encontrado",
      });
    }

    // Calculamos el nuevo saldo sumando el saldo actual y la cantidad proporcionada.
    // Usamos parseFloat para asegurar que la suma se realice con números flotantes.
    const newSaldo = parseFloat(user.saldo) + parseFloat(amount);
    // Actualizamos el saldo del usuario en la base de datos.
    await Usuario.update(id, { saldo: newSaldo });

    // Enviamos una respuesta de éxito con el mensaje y el nuevo saldo.
    res.json({
      titulo: "ÉXITO",
      mensaje: "Saldo agregado correctamente al administrador",
      nuevoSaldo: newSaldo,
    });
  } catch (error) {
    // Si ocurre un error al agregar el saldo, lo registramos.
    console.error("Error al agregar saldo al administrador:", error);
    // Y enviamos una respuesta de error 500.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al agregar saldo al administrador",
    });
  }
};

// Eliminar un administrador.
// Esta función permite eliminar un usuario con el rol de administrador.
// Incluye una restricción de seguridad para evitar la eliminación del administrador principal.
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtenemos el 'id' del administrador a eliminar.

    // Buscamos el usuario por su ID para verificar su existencia y su rol.
    const user = await Usuario.findUsuarioById(id);
    if (!user) {
      return res.status(404).json({
        titulo: "ERROR",
        mensaje: "Administrador no encontrado",
      });
    }

    // Impedimos la eliminación del administrador principal.
    // La condición verifica el rol "administrador" (es probable que deba ser "superadmin" aquí,
    // o el mismo rol usado en 'updateAdmin' para el principal) y un correo específico.
    if (
      user.rol === "administrador" && // Nota: asegúrate de que 'administrador' o 'superadmin' sea el rol correcto del administrador principal aquí.
      user.correo === "ADMINKADENAS@gmail.com"
    ) {
      return res.status(403).json({
        // Respondemos con un error 403 (Prohibido).
        titulo: "ERROR",
        mensaje: "No se puede eliminar al administrador principal",
      });
    }

    // Si las validaciones anteriores pasan, procedemos a eliminar el administrador de la base de datos.
    await Usuario.delete(id);

    // Enviamos una respuesta de éxito confirmando la eliminación.
    res.json({
      titulo: "ÉXITO",
      mensaje: "Administrador eliminado correctamente",
    });
  } catch (error) {
    // Si ocurre un error durante la eliminación, lo registramos.
    console.error("Error al eliminar administrador:", error);
    // Y enviamos una respuesta de error 500.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al eliminar el administrador",
    });
  }
};

// Verificar el rol del usuario actual.
// Esta función determina si el usuario que ha iniciado sesión tiene el rol de "superadmin"
// y devuelve su rol actual.
export const checkUserRole = async (req, res) => {
  try {
    // Verificamos si existe un usuario autenticado en la solicitud (asumiendo que 'req.user'
    // es establecido por un middleware de autenticación previo).
    if (!req.user) {
      return res.status(401).json({
        // Si no hay usuario autenticado, respondemos con un error 401 (No Autorizado).
        titulo: "ERROR",
        mensaje: "No hay usuario autenticado",
        isSuperAdmin: false,
      });
    }

    // Comprobamos si el rol del usuario autenticado es "superadmin".
    const isSuperAdmin = req.user.rol === "superadmin";

    // Devolvemos una respuesta de éxito que incluye si el usuario es superadmin y su rol.
    res.json({
      titulo: "ÉXITO",
      isSuperAdmin,
      rol: req.user.rol,
    });
  } catch (error) {
    // Si ocurre un error al verificar el rol, lo registramos.
    console.error("Error al verificar rol:", error);
    // Y enviamos una respuesta de error 500.
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al verificar el rol del usuario",
      isSuperAdmin: false,
    });
  }
};

// Actualizar perfil de usuario (foto, nombre, correo)
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, correo } = req.body;
    const fotoFile = req.file;

    // Validar que el usuario existe
    const existingUser = await Usuario.findUsuarioById(id);
    if (!existingUser) {
      return res.status(404).json({
        titulo: "ERROR",
        mensaje: "Usuario no encontrado",
      });
    }

    // Validar que los campos requeridos estén presentes
    if (!nombre_usuario || !correo) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "Faltan datos requeridos para actualizar el perfil",
      });
    }

    // Verificar si el correo ya está en uso por otro usuario
    if (correo !== existingUser.correo) {
      const userWithEmail = await Usuario.findUsuarioByCorreo(correo);
      if (userWithEmail && userWithEmail.id !== parseInt(id)) {
        return res.status(400).json({
          titulo: "ERROR",
          mensaje: "El correo ya está registrado por otro usuario",
        });
      }
    }

    // Preparar datos de actualización
    const updateData = {
      nombre_usuario,
      correo,
    };

    // Manejar la foto de perfil si se proporcionó una nueva
    if (fotoFile) {
      const nuevaFotoPath = await Usuario.updateProfilePhoto(id, fotoFile, existingUser, nombre_usuario);
      if (nuevaFotoPath) {
        updateData.foto_perfil = nuevaFotoPath;
      }
    } else if (nombre_usuario !== existingUser.nombre_usuario) {
      // Si solo cambió el nombre, renombrar la foto existente
      const nuevaFotoPath = await Usuario.renameProfilePhoto(id, nombre_usuario, existingUser);
      if (nuevaFotoPath) {
        updateData.foto_perfil = nuevaFotoPath;
      }
    }

    // Actualizar el usuario en la base de datos
    await Usuario.update(id, updateData);

    // Obtener el usuario actualizado
    const updatedUser = await Usuario.findUsuarioById(id);
    const { contra, ...userWithoutPassword } = updatedUser;

    res.json({
      titulo: "ÉXITO",
      mensaje: "Perfil actualizado exitosamente",
      usuario: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({
      titulo: "ERROR",
      mensaje: "Error al actualizar el perfil",
    });
  }
};