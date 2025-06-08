// controllers/resetPasswordController.js

import pkg from "jsonwebtoken";
const { sign, verify } = pkg;
import { createTransport } from "nodemailer";
import { hash } from "bcrypt";
const saltRounds = 10;
import Usuario from "../models/Usuario.js";

// --- Controladores de Vistas ---

// Esta función se encarga de renderizar la página donde el usuario solicita un restablecimiento de contraseña.
// Simplemente muestra la vista "forgot", que debería contener un formulario para ingresar el correo electrónico.
const forgotPasswordPage = (req, res) => {
  res.render("forgot");
};

// Esta función se encarga de mostrar la página donde el usuario puede ingresar su nueva contraseña.
// Espera recibir un 'token' de restablecimiento como parámetro de consulta en la URL.
const resetPasswordPage = (req, res) => {
  // Obtenemos el token de la URL.
  const token = req.query.token;

  // Si no hay token, enviamos un error 400 (Bad Request) y renderizamos una página de error.
  if (!token) {
    return res.status(400).render("error", {
      error: {
        title: "Error 400",
        message: "No se encontró el token para restablecer la contraseña.",
      },
    });
  }

  // Verificamos el token usando la clave secreta definida en las variables de entorno.
  verify(token, process.env.JWT_RESET_SECRET, (err, decoded) => {
    // Si hay un error al verificar el token (ej. es inválido o expiró),
    // enviamos un error 400 y mostramos una página de error.
    if (err) {
      return res.status(400).render("error", {
        error: {
          title: "Error 400",
          message: "Token inválido o expirado.",
        },
      });
    }
    // Si el token es válido, renderizamos la vista "reset" y le pasamos el token.
    // El formulario en esa vista usará este token para la solicitud de actualización.
    return res.render("reset", { token });
  });
};

// --- Controladores de Lógica (API Endpoints) ---

// Este endpoint procesa la solicitud para enviar un correo de restablecimiento de contraseña.
// Espera recibir el 'correo' electrónico del usuario en el cuerpo de la solicitud.
const forgotPassword = async (req, res) => {
  const { correo } = req.body;

  // Validamos si se proporcionó un correo. Si no, enviamos un error 400.
  if (!correo) {
    return res
      .status(400)
      .json({ titulo: "ERROR", mensaje: "Debe proporcionar un correo." });
  }

  try {
    // Intentamos encontrar al usuario por su correo electrónico.
    const user = await Usuario.findUsuarioByCorreo(correo);

    // Por **seguridad**, siempre enviamos un mensaje genérico al usuario.
    // Esto evita que atacantes puedan adivinar correos válidos en nuestro sistema.
    if (!user) {
      return res.status(200).json({
        titulo: "ÉXITO",
        mensaje:
          "SI EL CORREO EXISTE, SE LE ENVIARÁ UN ENLACE PARA RESTABLECER LA CONTRASEÑA",
      });
    }

    // Generamos un token de restablecimiento de contraseña usando jsonwebtoken.
    // Incluye el ID y el correo del usuario, y tiene un tiempo de expiración.
    const resetToken = sign(
      { id: user.id, correo: user.correo },
      process.env.JWT_RESET_SECRET, // Clave secreta para firmar el token
      { expiresIn: process.env.JWT_RESET_EXPIRES_IN } // Tiempo de validez del token (ej. "1h")
    );

    // Construimos el enlace completo de restablecimiento que se enviará al usuario.
    const resetLink = `${process.env.APP_URL}/auth/reset?token=${resetToken}`;

    // Configuramos Nodemailer para enviar el correo.
    // Las credenciales del SMTP deben estar en las variables de entorno (.env).
    let transporter = createTransport({
      host: "smtp.gmail.com", // Servidor SMTP (ej. para Gmail)
      port: 587, // Puerto SMTP
      auth: {
        user: process.env.EMAIL_USER, // Correo del remitente
        pass: process.env.EMAIL_PASSWORD, // Contraseña del correo del remitente
      },
    });

    // Definimos las opciones del correo electrónico a enviar.
    let mailOptions = {
      from: process.env.EMAIL_USER, // Quién envía el correo
      to: user.correo, // A quién se envía el correo
      subject: "Restablecimiento de contraseña", // Asunto del correo
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`, // Contenido en texto plano
      html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
             <p><a href="${resetLink}">${resetLink}</a></p>`, // Contenido en HTML (más amigable)
    };

    // Enviamos el correo electrónico.
    let info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId); // Registramos el ID del mensaje enviado para depuración.

    // Finalmente, enviamos el mensaje genérico de éxito al cliente.
    return res.status(200).json({
      titulo: "ÉXITO",
      mensaje:
        "SI EL CORREO EXISTE, SE LE ENVIARÁ UN ENLACE PARA RESTABLECER LA CONTRASEÑA",
    });
  } catch (error) {
    // Si ocurre un error inesperado durante el proceso, lo registramos.
    console.error("Error en forgotPassword:", error);
    // Y enviamos una respuesta de error del servidor.
    return res.status(500).json({
      titulo: "ERROR",
      mensaje: "Ocurrió un error al procesar la solicitud.",
    });
  }
};

// Este endpoint se encarga de actualizar la contraseña del usuario.
// Espera recibir el 'token' de restablecimiento y la 'newPassword' (nueva contraseña)
// en el cuerpo de la solicitud.
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  // Validamos que tanto el token como la nueva contraseña estén presentes.
  // Si falta alguno, enviamos un error 400 y una página de error.
  if (!token || !newPassword) {
    return res.status(400).render("error", {
      error: {
        title: "Error 400",
        message: "Faltan datos requeridos.",
      },
    });
  }

  try {
    // Verificamos y decodificamos el token para obtener el ID del usuario.
    const decoded = verify(token, process.env.JWT_RESET_SECRET);
    const userId = decoded.id; // Extraemos el ID del usuario del token decodificado.

    // Encriptamos la nueva contraseña usando bcrypt para almacenarla de forma segura.
    const hashedPassword = await hash(newPassword, saltRounds);

    // Definimos la consulta SQL para actualizar la contraseña del usuario.
    const sql = "UPDATE usuarios SET contra = ? WHERE id = ?";
    // Ejecutamos la consulta en la base de datos.
    await Usuario.run(sql, [hashedPassword, userId]);

    // Si todo es exitoso, enviamos un mensaje de éxito.
    return res.status(200).json({
      titulo: "ÉXITO",
      mensaje: "LA CONTRASEÑA SE ACTUALIZÓ CORRECTAMENTE",
    });
  } catch (error) {
    // Si ocurre un error (ej. el token es inválido o expiró), lo registramos.
    console.error("Error en resetPassword:", error);
    // Y enviamos una respuesta de error al cliente, indicando un problema con el token.
    return res.status(400).render("error", {
      error: {
        title: "Error 400",
        message: "Token inválido o expirado.",
      },
    });
  }
};

// --- Exportaciones ---

// Exportamos las funciones para que puedan ser usadas como controladores de ruta.
export { forgotPasswordPage, forgotPassword, resetPasswordPage, resetPassword };