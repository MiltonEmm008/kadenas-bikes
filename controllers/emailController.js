// controllers/emailController.js
// importar el objeto transporter desde la configuracion de correo
import transporter from "../config/mail.js";

// funcion para enviar mensajes (usada tanto para soporte como para proveedores)
export const enviarMensaje = async (req, res) => {
  try {
    // extraer nombre_contacto, mensaje_contacto y destinatario del cuerpo de la solicitud
    const { nombre_contacto, mensaje_contacto, destinatario } = req.body;

    // validar que se hayan recibido todos los campos necesarios
    if (!nombre_contacto || !mensaje_contacto || !destinatario) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "faltan datos en la solicitud",
      });
    }

    // configurar las opciones del correo a enviar
    const mailOptions = {
      from: process.env.EMAIL_USER, // remitente: el correo configurado en las variables de entorno
      to: destinatario, // destinatario del correo
      subject: `mensaje de ${nombre_contacto}`, // asunto del correo
      text: mensaje_contacto, // cuerpo del mensaje en texto plano
    };

    // intentar enviar el correo electronico
    await transporter.sendMail(mailOptions);

    // enviar respuesta de exito si el correo se envio correctamente
    return res.status(200).json({
      titulo: "Éxito",
      mensaje: "Email enviado correctamente",
    });
  } catch (error) {
    // registrar cualquier error que ocurra durante el envio del correo
    console.error("error al enviar: ", error);
    // enviar respuesta de error del servidor
    return res.status(500).json({
      titulo: "Error",
      mensaje: "Error enviando el correo: " + error.message,
    });
  }
};

export const enviarMensajeBienvenida = async (req, res) => {
  try {
    // extraer nombre_contacto, mensaje_contacto y destinatario del cuerpo de la solicitud
    const { nombre_contacto, mensaje_contacto, correo_contacto } = req.body;

    // validar que se hayan recibido todos los campos necesarios
    if (!nombre_contacto || !mensaje_contacto || !correo_contacto) {
      return res.status(400).json({
        titulo: "ERROR",
        mensaje: "faltan datos en la solicitud",
      });
    }

    // configurar las opciones del correo a enviar
    const mailOptions = {
      from: process.env.EMAIL_USER, // remitente: el correo configurado en las variables de entorno
      to: process.env.EMAIL_USER, // destinatario del correo
      subject: `Mensaje de ${nombre_contacto} - ${correo_contacto}`, // asunto del correo
      text: mensaje_contacto, // cuerpo del mensaje en texto plano
    };

    // intentar enviar el correo electronico
    await transporter.sendMail(mailOptions);

    // enviar respuesta de exito si el correo se envio correctamente
    return res.status(200).json({
      titulo: "Éxito",
      mensaje: "Email enviado correctamente",
    });
  } catch (error) {
    // registrar cualquier error que ocurra durante el envio del correo
    console.error("error al enviar: ", error);
    // enviar respuesta de error del servidor
    return res.status(500).json({
      titulo: "Error",
      mensaje: "Error enviando el correo: " + error.message,
    });
  }
};
