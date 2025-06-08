// models/Usuario.js

import { hash, compare } from "bcrypt"; // Importa funciones para encriptar y comparar contraseñas
import BaseModel from "./BaseModel.js"; // Importa la clase base para la interacción con la base de datos
import {
  existsSync, // Para verificar si un archivo o directorio existe
  mkdirSync, // Para crear directorios si no existen
  readdirSync, // Para leer el contenido de un directorio
  unlinkSync, // Para eliminar archivos
  writeFileSync, // Para escribir datos en un archivo
} from "fs"; // Módulo de sistema de archivos de Node.js
import axios from "axios"; // Utilizado para realizar solicitudes HTTP, en este caso para descargar fotos
import { fileURLToPath } from "url"; // Permite convertir URL de módulos (ESM) a rutas de archivo
import { dirname, extname, join } from "path"; // Utilidades para trabajar con rutas de archivos y directorios

const saltRounds = 10; // Define el número de rondas de sal para el hashing de contraseñas. Un número más alto aumenta la seguridad, pero también el tiempo de procesamiento.

class Usuario extends BaseModel {
  static tableName = "usuarios"; // Establece el nombre de la tabla de la base de datos a la que este modelo está asociado.

  // Constructor de la clase Usuario.
  // Se encarga de inicializar una nueva instancia de Usuario con los datos proporcionados.
  constructor(data) {
    super(); // Llama al constructor de la clase base (BaseModel) para inicializar propiedades de la base de datos.
    Object.assign(this, data); // Asigna todas las propiedades del objeto 'data' a la instancia actual de Usuario.
  }

  // --- Métodos de Creación de Usuarios ---

  /**
   * Crea un nuevo usuario en la base de datos con el rol predeterminado de "cliente".
   * La contraseña se encripta automáticamente utilizando bcrypt si se proporciona.
   *
   * @param {Object} datos - Objeto que contiene la información del nuevo usuario:
   * @param {string} correo - El correo electrónico único del usuario.
   * @param {string} nombre_usuario - El nombre de usuario.
   * @param {string} [contra] - La contraseña en texto plano (opcional; si se omite, no se establece).
   * @param {string} [rol="cliente"] - El rol del usuario (por defecto 'cliente').
   * @param {string} [foto_perfil="/perfil/default.jpg"] - La URL o ruta de la foto de perfil (por defecto una imagen genérica).
   * @returns {Promise<Usuario>} Una promesa que resuelve con la instancia del Usuario recién creado, obtenida directamente de la base de datos.
   */
  static async createUser({
    correo,
    nombre_usuario,
    contra,
    rol = "cliente", // Valor por defecto si no se especifica un rol
    foto_perfil = "/perfil/default.jpg", // Valor por defecto para la foto de perfil
  }) {
    let hashedPassword = null;
    // Si se proporciona una contraseña, la encriptamos antes de guardarla para mayor seguridad.
    if (contra) {
      hashedPassword = await hash(contra, saltRounds);
    }
    // Consulta SQL para insertar un nuevo registro en la tabla de usuarios.
    // Se asigna un saldo inicial de 500.0 y se usa la fecha y hora actuales del servidor para 'creado_en'.
    const sql = `
      INSERT INTO ${this.tableName} (correo, nombre_usuario, contra, rol, foto_perfil, saldo, creado_en)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const params = [
      correo,
      nombre_usuario,
      hashedPassword, // La contraseña ya encriptada
      rol,
      foto_perfil,
      500.0, // Saldo inicial para un usuario cliente
    ];
    // Ejecutamos la consulta INSERT y obtenemos el resultado, que incluye el 'lastID' (el ID del nuevo registro).
    const result = await BaseModel.run(sql, params);
    // Buscamos y devolvemos la instancia completa del usuario recién creado utilizando su ID.
    return await this.findUsuarioById(result.lastID);
  }

  /**
   * Crea un nuevo usuario con el rol específico de "administrador".
   * La contraseña se encripta automáticamente si se proporciona.
   *
   * @param {Object} datos - Objeto que contiene la información del nuevo administrador:
   * @param {string} correo - El correo electrónico único del administrador.
   * @param {string} nombre_usuario - El nombre de usuario del administrador.
   * @param {string} [contra] - La contraseña en texto plano (opcional; si se omite, no se establece).
   * @returns {Promise<Usuario>} Una promesa que resuelve con la instancia del Administrador recién creado.
   */
  static async createAdmin({ correo, nombre_usuario, contra }) {
    let hashedPassword = null;
    // Si se proporciona una contraseña, la encriptamos.
    if (contra) {
      hashedPassword = await hash(contra, saltRounds);
    }
    // Consulta SQL para insertar un nuevo administrador.
    // Se establece el rol como "administrador", una foto de perfil específica para admin,
    // y un saldo inicial mayor.
    const sql = `
      INSERT INTO ${this.tableName} (correo, nombre_usuario, contra, rol, foto_perfil, saldo, creado_en)
      VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `;
    const params = [
      correo,
      nombre_usuario,
      hashedPassword,
      "administrador", // Rol explícito para administradores
      "/perfil/admin.jpg", // Foto de perfil específica para administradores
      100000.0, // Saldo inicial para un administrador (un valor más alto)
    ];
    const result = await BaseModel.run(sql, params);
    // Recuperamos y devolvemos la instancia completa del administrador recién creado.
    return await this.findUsuarioById(result.lastID);
  }

  // --- Métodos de Búsqueda de Usuarios ---

  /**
   * Resta saldo a un usuario por su ID.
   * @param {number} id - ID del usuario.
   * @param {number} cantidad - Monto a restar.
   * @returns {Promise<void>}
   */
  static async restarSaldo(id, cantidad) {
    const sql = `UPDATE ${this.tableName} SET saldo = saldo - ? WHERE id = ?`;
    await BaseModel.run(sql, [cantidad, id]);
  }

  /**
   * Busca un usuario en la base de datos por su dirección de correo electrónico.
   *
   * @param {string} correo - El correo electrónico del usuario a buscar.
   * @returns {Promise<Usuario|null>} Una promesa que resuelve con la instancia del Usuario si se encuentra, o `null` si no existe.
   */
  static async findUsuarioByCorreo(correo) {
    const sql = `SELECT * FROM ${this.tableName} WHERE correo = ? LIMIT 1`;
    const row = await BaseModel.get(sql, [correo]); // Ejecuta la consulta para obtener una única fila.
    return row ? new Usuario(row) : null; // Si se encuentra una fila, crea y devuelve una instancia de Usuario; de lo contrario, devuelve null.
  }

  /**
   * Busca un usuario por su correo electrónico, pero solo si ese usuario no tiene asociados
   * un ID de Google o un ID de GitHub (es decir, fue registrado directamente con correo/contraseña).
   *
   * @param {string} correo - El correo electrónico del usuario a buscar.
   * @returns {Promise<Usuario|null>} Una promesa que resuelve con la instancia del Usuario si se encuentra y cumple las condiciones, o `null` si no.
   */
  static async findUsuarioNormalByCorreo(correo) {
    const sql = `SELECT * FROM ${this.tableName} WHERE correo = ? AND google_id IS NULL AND github_id IS NULL LIMIT 1`;
    const row = await BaseModel.get(sql, [correo]);
    return row ? new Usuario(row) : null;
  }

  /**
   * Busca un usuario en la base de datos por su ID único.
   *
   * @param {number} id - El ID del usuario a buscar.
   * @returns {Promise<Usuario|null>} Una promesa que resuelve con la instancia del Usuario si se encuentra, o `null` si no existe.
   */
  static async findUsuarioById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const row = await BaseModel.get(sql, [id]);
    return row ? new Usuario(row) : null;
  }

  /**
   * Método auxiliar genérico para buscar un único usuario por un campo y valor específicos.
   *
   * @param {string} field - El nombre de la columna en la tabla por la que buscar (ej. "github_id", "google_id").
   * @param {*} value - El valor que se espera encontrar en la columna especificada.
   * @returns {Promise<Usuario|null>} Una promesa que resuelve con la instancia del Usuario si se encuentra, o `null` si no existe.
   */
  static async findOneByField(field, value) {
    const sql = `SELECT * FROM ${this.tableName} WHERE ${field} = ? LIMIT 1`;
    const row = await BaseModel.get(sql, [value]);
    return row ? new Usuario(row) : null;
  }

  // --- Métodos de Integración con Proveedores Externos (GitHub, Google) ---

  /**
   * Crea un nuevo usuario o recupera uno existente basado en su ID de GitHub.
   * Si un usuario con el mismo correo ya existe pero no tiene un `github_id` asociado,
   * se actualiza ese registro para vincularlo con el `github_id` y su foto de perfil.
   *
   * @param {string} github_id - El ID único del usuario en GitHub.
   * @param {string} correo - El correo electrónico del usuario proporcionado por GitHub.
   * @param {string} nombre_usuario - El nombre de usuario proporcionado por GitHub.
   * @param {string} foto_perfil - La URL de la foto de perfil proporcionada por GitHub.
   * @returns {Promise<Usuario>} Una promesa que resuelve con la instancia del Usuario existente o recién creado.
   */
  static async createUsuarioWithGithub(
    github_id,
    correo,
    nombre_usuario,
    foto_perfil
  ) {
    // Primero, intenta encontrar un usuario en la base de datos usando el correo electrónico.
    let usuario = await this.findOneByField("correo", correo);
    if (usuario) {
      // Si se encuentra un usuario por correo...
      // Y si ese usuario no tiene un `github_id` asignado, significa que es un usuario "normal"
      // al que necesitamos vincular con su cuenta de GitHub.
      if (!usuario.github_id) {
        const sql = `UPDATE ${this.tableName} SET github_id = ?, foto_perfil = ? WHERE correo = ?`; // Actualiza el `github_id` y la foto de perfil.
        const params = [github_id, foto_perfil, correo];
        await BaseModel.run(sql, params);
        // Una vez actualizado, recuperamos el registro completo del usuario para asegurarnos de que esté al día.
        usuario = await this.findOneByField("correo", correo);
      }
      return usuario; // Devuelve el usuario existente (posiblemente actualizado).
    }

    // Si no se encontró ningún usuario por correo, intentamos buscarlo por su `github_id`.
    usuario = await this.findOneByField("github_id", github_id);
    if (usuario) {
      return usuario; // Si se encuentra por `github_id`, devolvemos ese usuario.
    } else {
      // Si el usuario no se encontró ni por correo ni por `github_id`, creamos un nuevo registro.
      const sql = `
        INSERT INTO ${this.tableName} (nombre_usuario, correo, github_id, rol, foto_perfil, saldo, creado_en)
        VALUES (?, ?, ?, 'cliente', ?, ?, CURRENT_TIMESTAMP)
      `;
      const params = [nombre_usuario, correo, github_id, foto_perfil, 500.0];
      const result = await BaseModel.run(sql, params);
      // Devolvemos la instancia del usuario recién insertado.
      return await this.findUsuarioById(result.lastID);
    }
  }

  /**
   * Crea un nuevo usuario o recupera uno existente basado en su ID de Google.
   * Si ya existe un usuario con el mismo correo pero sin un `google_id` asociado,
   * se actualiza ese registro para vincularlo con el `google_id` y su foto de perfil.
   *
   * @param {string} google_id - El ID único del usuario en Google.
   * @param {string} correo - El correo electrónico del usuario proporcionado por Google.
   * @param {string} nombre_usuario - El nombre de usuario proporcionado por Google.
   * @param {string} foto_perfil - La URL de la foto de perfil proporcionada por Google.
   * @returns {Promise<Usuario>} Una promesa que resuelve con la instancia del Usuario existente o recién creado.
   */
  static async createUsuarioWithGoogle(
    google_id,
    correo,
    nombre_usuario,
    foto_perfil
  ) {
    // Primero, intenta encontrar un usuario en la base de datos usando el correo electrónico.
    let usuario = await this.findOneByField("correo", correo);
    if (usuario) {
      // Si se encuentra un usuario por correo...
      // Y si ese usuario no tiene un `google_id` asignado, lo actualizamos.
      // También podríamos querer actualizar la foto de perfil en este punto.
      if (!usuario.google_id) {
        const sql = `UPDATE ${this.tableName} SET google_id = ?, foto_perfil = ? WHERE correo = ?`; // Actualiza el `google_id` y la foto de perfil.
        const params = [google_id, foto_perfil, correo];
        await BaseModel.run(sql, params);
        // Recupera el usuario actualizado para tener la información más reciente.
        usuario = await this.findOneByField("correo", correo);
      }
      return usuario; // Devuelve el usuario existente (posiblemente actualizado).
    }

    // Si no se encontró ningún usuario por correo, intenta buscarlo por su `google_id`.
    usuario = await this.findOneByField("google_id", google_id);
    if (usuario) {
      return usuario; // Si se encuentra por `google_id`, devuelve ese usuario.
    } else {
      // Si el usuario no se encontró ni por correo ni por `google_id`, crea un nuevo registro.
      const sql = `
        INSERT INTO ${this.tableName} (nombre_usuario, correo, google_id, rol, foto_perfil, saldo, creado_en)
        VALUES (?, ?, ?, 'cliente', ?, ?, CURRENT_TIMESTAMP)
      `;
      const params = [nombre_usuario, correo, google_id, foto_perfil, 500.0];
      const result = await BaseModel.run(sql, params);
      // Devuelve la instancia del usuario recién insertado.
      return await this.findUsuarioById(result.lastID);
    }
  }

  // --- Funciones para Gestión de Fotos de Perfil ---

  /**
   * Guarda una foto de perfil descargada de un servicio externo en el sistema de archivos local
   * y actualiza la ruta de la foto en la base de datos del usuario.
   * Si la foto ya está en el directorio de perfil local, se omite la descarga.
   * También se encarga de eliminar cualquier foto anterior del mismo usuario en el directorio local.
   *
   * @param {number} id - El ID del usuario cuya foto de perfil se va a procesar.
   * @returns {Promise<string|undefined>} Una promesa que resuelve con la nueva ruta local de la foto de perfil si se guarda con éxito, o `undefined` si hay un error o no es necesario guardar.
   */
  static async saveServicePhoto(id) {
    let usuario = await this.findUsuarioById(id);
    if (!usuario) {
      return; // Si el usuario no se encuentra, no hacemos nada.
    }
    const fotoUrl = usuario.foto_perfil; // Obtenemos la URL actual de la foto de perfil del usuario.

    // Si la URL de la foto ya comienza con "/perfil/", significa que ya es una foto local,
    // por lo que no es necesario descargarla nuevamente.
    if (fotoUrl && fotoUrl.startsWith("/perfil/")) {
      return;
    }

    // Obtenemos la ruta del directorio actual del módulo y construimos la ruta de la carpeta de perfiles.
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const nombreArchivo = `${id}-${usuario.nombre_usuario}`; // Creamos un nombre de archivo único para la foto.
    // Extraemos la extensión del archivo de la URL original o usamos '.jpg' por defecto.
    const ext = extname(fotoUrl.split("?")[0]) || ".jpg";
    const rutaCarpeta = join(__dirname, "..", "public", "perfil"); // Ruta completa a la carpeta donde se guardarán las fotos.
    const rutaArchivo = join(rutaCarpeta, nombreArchivo + ext); // Ruta completa del archivo de la nueva foto.

    // Si la carpeta de perfiles no existe, la creamos de forma recursiva.
    if (!existsSync(rutaCarpeta)) {
      mkdirSync(rutaCarpeta, { recursive: true });
    }

    // Lógica para limpiar fotos de perfil antiguas del mismo usuario:
    try {
      const archivos = readdirSync(rutaCarpeta); // Leemos todos los archivos en la carpeta de perfiles.
      archivos.forEach((archivo) => {
        // Si el nombre del archivo empieza con el ID del usuario, es una foto antigua de este usuario.
        if (archivo.startsWith(`${id}-`)) {
          const rutaArchivoExistente = join(rutaCarpeta, archivo);
          try {
            unlinkSync(rutaArchivoExistente); // Intentamos eliminar el archivo antiguo.
          } catch (err) {
            // Si hay un error al eliminar (ej. permiso denegado), lo registramos, pero no detenemos el proceso.
            console.error(`Error al eliminar ${rutaArchivoExistente}:`, err);
          }
        }
      });
    } catch (error) {
      console.error("Error leyendo el directorio:", error);
    }

    // Intentamos descargar la foto de perfil desde la URL externa.
    try {
      const response = await axios.get(fotoUrl, {
        responseType: "arraybuffer", // Indicamos que la respuesta debe ser un buffer de datos binarios.
      });
      writeFileSync(rutaArchivo, response.data); // Guardamos los datos de la imagen en el archivo local.

      const nuevaRuta = `/perfil/${nombreArchivo}${ext}`; // Construimos la nueva ruta relativa para la base de datos.
      const SQL = `UPDATE usuarios SET foto_perfil = ? WHERE id = ?`;
      await BaseModel.run(SQL, [nuevaRuta, id]); // Actualizamos la base de datos con la nueva ruta de la foto de perfil.
      return nuevaRuta; // Devolvemos la nueva ruta local de la foto.
    } catch (error) {
      // Si ocurre un error al descargar o guardar la foto, lo registramos.
      console.log("Error descargando o guardando la foto", error);
      return; // Retornamos undefined en caso de error.
    }
  }

  /**
   * Actualiza la foto de perfil de un usuario, manejando la eliminación de la foto anterior
   * y guardando la nueva con el formato id-nombre_usuario.
   * 
   * @param {number} id - ID del usuario
   * @param {Object} fotoFile - Archivo de imagen subido
   * @param {Object} existingUser - Usuario existente con datos actuales
   * @param {string} nuevoNombre - Nuevo nombre de usuario (opcional)
   * @returns {Promise<string>} Ruta de la nueva foto de perfil
   */
  static async updateProfilePhoto(id, fotoFile, existingUser, nuevoNombre = null) {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const rutaCarpeta = join(__dirname, "..", "public", "perfil");
    
    // Crear carpeta si no existe
    if (!existsSync(rutaCarpeta)) {
      mkdirSync(rutaCarpeta, { recursive: true });
    }

    // Eliminar foto anterior si existe y no es la default
    if (existingUser.foto_perfil && 
        existingUser.foto_perfil !== "/perfil/default.jpg" && 
        existingUser.foto_perfil !== "/perfil/admin.jpg") {
      try {
        const rutaFotoAnterior = join(__dirname, "..", "public", existingUser.foto_perfil);
        if (existsSync(rutaFotoAnterior)) {
          unlinkSync(rutaFotoAnterior);
        }
      } catch (error) {
        console.error("Error al eliminar foto anterior:", error);
      }
    }

    // Usar el nuevo nombre si está disponible, sino el existente
    const nombreUsuario = nuevoNombre || existingUser.nombre_usuario;
    
    // Generar nombre del archivo: id-nombre_usuario.ext
    const ext = extname(fotoFile.originalname).toLowerCase();
    const nombreArchivo = `${id}-${nombreUsuario}${ext}`;
    const rutaArchivo = join(rutaCarpeta, nombreArchivo);
    const nuevaRuta = `/perfil/${nombreArchivo}`;

    // Renombrar el archivo temporal a la ubicación final
    try {
      const fs = await import('fs/promises');
      await fs.rename(fotoFile.path, rutaArchivo);
      return nuevaRuta;
    } catch (error) {
      console.error("Error al mover foto:", error);
      throw error;
    }
  }

  /**
   * Renombra la foto de perfil existente cuando solo cambia el nombre de usuario
   * 
   * @param {number} id - ID del usuario
   * @param {string} nuevoNombre - Nuevo nombre de usuario
   * @param {Object} existingUser - Usuario existente con datos actuales
   * @returns {Promise<string|null>} Nueva ruta de la foto o null si no hay foto para renombrar
   */
  static async renameProfilePhoto(id, nuevoNombre, existingUser) {
    // Solo renombrar si tiene una foto que no sea default
    if (!existingUser.foto_perfil || 
        existingUser.foto_perfil === "/perfil/default.jpg" || 
        existingUser.foto_perfil === "/perfil/admin.jpg") {
      return null;
    }

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const rutaCarpeta = join(__dirname, "..", "public", "perfil");
    const rutaFotoActual = join(__dirname, "..", "public", existingUser.foto_perfil);

    // Verificar que la foto actual existe
    if (!existsSync(rutaFotoActual)) {
      return null;
    }

    // Generar nuevo nombre: id-nuevo_nombre.ext
    const ext = extname(existingUser.foto_perfil);
    const nuevoNombreArchivo = `${id}-${nuevoNombre}${ext}`;
    const nuevaRutaArchivo = join(rutaCarpeta, nuevoNombreArchivo);
    const nuevaRuta = `/perfil/${nuevoNombreArchivo}`;

    try {
      // Renombrar archivo
      const fs = await import('fs/promises');
      await fs.rename(rutaFotoActual, nuevaRutaArchivo);
      return nuevaRuta;
    } catch (error) {
      console.error("Error al renombrar foto:", error);
      return null;
    }
  }

  // --- Métodos de Autenticación y Gestión de Datos ---

  /**
   * Método de instancia para comparar una contraseña en texto plano con el hash de contraseña almacenado en este objeto de usuario.
   *
   * @param {string} password - La contraseña en texto plano que se desea verificar.
   * @returns {Promise<boolean>} Una promesa que resuelve a `true` si la contraseña coincide con el hash, o `false` en caso contrario.
   */
  checkPassword(password) {
    return compare(password, this.contra); // Utiliza bcrypt.compare para comparar la contraseña.
  }

  /**
   * Elimina un usuario de la base de datos por su ID.
   *
   * @param {number} id - El ID del usuario que se desea eliminar.
   * @returns {Promise<Object>} Una promesa que resuelve con el resultado de la operación de eliminación de la base de datos.
   */
  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]); // Ejecuta la consulta DELETE.
  }

  /**
   * Actualiza los datos de un usuario existente en la base de datos.
   *
   * @param {number} id - El ID del usuario que se desea actualizar.
   * @param {Object} changes - Un objeto donde las claves son los nombres de las columnas a actualizar y los valores son los nuevos datos.
   * @returns {Promise<Object>} Una promesa que resuelve con el resultado de la operación de actualización de la base de datos.
   */
  static async update(id, changes) {
    // Construimos la parte 'SET' de la consulta SQL dinámicamente, creando 'clave = ?' para cada cambio.
    const updates = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(", ");
    // Creamos un array de valores que incluye los nuevos datos y el ID del usuario al final.
    const values = [...Object.values(changes), id];
    // Consulta SQL completa para la actualización.
    const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    return await BaseModel.run(sql, values); // Ejecuta la consulta UPDATE.
  }

  /**
   * Obtiene todos los registros de usuarios de la tabla.
   *
   * @returns {Promise<Array<Object>>} Una promesa que resuelve con un array de objetos, donde cada objeto representa un usuario en la base de datos, ordenados por ID.
   */
  static async all() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY id ASC`;
    return await BaseModel.all(sql); // Ejecuta la consulta para obtener todas las filas.
  }

  /**
   * Obtiene todos los usuarios que tienen el rol de 'cliente'.
   *
   * @returns {Promise<Array<Object>>} Una promesa que resuelve con un array de objetos, representando todos los usuarios clientes, ordenados por ID.
   */
  static async getAllClients() {
    const sql = `SELECT * FROM ${this.tableName} WHERE rol = 'cliente' ORDER BY id ASC`;
    return await BaseModel.all(sql);
  }

  /**
   * Obtiene todos los usuarios que tienen el rol de 'administrador'.
   *
   * @returns {Promise<Array<Object>>} Una promesa que resuelve con un array de objetos, representando todos los usuarios administradores, ordenados por ID.
   */
  static async getAllAdmins() {
    const sql = `SELECT * FROM ${this.tableName} WHERE rol = 'administrador' ORDER BY id ASC`;
    return await BaseModel.all(sql);
  }
}

export default Usuario; // Exporta la clase Usuario para que pueda ser utilizada en otras partes de la aplicación.