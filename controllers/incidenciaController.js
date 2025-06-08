// controllers/incidenciaController.js
// importar el objeto transporter desde la configuracion de correo
import transporter from "../config/mail.js";
// importar el modelo de soporte
import Soporte from "../models/Soporte.js";

// funcion para reportar una incidencia por correo
export const reportarIncidencia = async (
  nombre_usuario,
  usuario_id,
  correo_usuario,
  tipo_incidencia,
  descripcion
) => {
  // configurar las opciones del correo a enviar
  const mailOptions = {
    from: process.env.EMAIL_USER, // remitente: el correo configurado en las variables de entorno
    to: "kadenasbikes@gmail.com", // destinatario fijo para todas las incidencias
    subject: `incidencia reportada - ${tipo_incidencia}`, // asunto del correo con el tipo de incidencia
    text: `usuario: ${nombre_usuario}
    id del usuario: ${usuario_id}
    email: ${correo_usuario}
    tipo de incidencia: ${tipo_incidencia}
    descripción: ${descripcion}`, // cuerpo del mensaje con los detalles de la incidencia
  };

  try {
    // intentar enviar el correo electronico
    await transporter.sendMail(mailOptions);
    // si el envio es exitoso, devolver true
    return true;
  } catch (error) {
    // si hay un error, registrarlo en consola
    console.log("error al reportar incidencia: ", error);
    // devolver false si el envio falla
    return false;
  }
};

// funcion para obtener todas las incidencias
export const getIncidencias = async (req, res) => {
  try {
    // buscar todas las incidencias en la base de datos
    const incidencias = await Soporte.findAll();
    // enviar las incidencias como respuesta json
    res.json(incidencias);
  } catch (err) {
    // registrar cualquier error al obtener las incidencias
    console.error("error al obtener incidencias:", error); // nota: el mensaje de error menciona 'productos', quizas quieras cambiarlo a 'incidencias'
    // enviar una respuesta de error del servidor
    res
      .status(500)
      .json({ message: "error interno del servidor al obtener incidencias." }); // nota: el mensaje de error menciona 'productos', quizas quieras cambiarlo a 'incidencias'
  }
};

//funcion para obtener las incidencias recientes, para mostrar en el inicio.js
export const getIncidenciasRecientes = async (req,res) => {
  try{
    // buscar las primeras 3 incidencias recientes
    const incidencias = await Soporte.findRecent();
    //enviarlas como json
    res.json(incidencias)
  } catch (err) {
    //en caso de error se regresa un json con el mensaje de error
    console.error("Error al obtener las incidencias recientes: ",err)
    res.status(500).json({message:"Error interno del servidor al obtener incidencias"})
  }
}

// funcion para enviar una respuesta a una incidencia y eliminarla
export const sendIncidenciaResponse = async (req, res) => {
  // extraer id de la incidencia, destinatario y mensaje del cuerpo de la solicitud
  const { incidenciaId, destinatario, mensaje } = req.body;

  // obtener la fecha actual
  const fechaActual = new Date();

  // formatear la fecha a dd/mm/aaaa
  const fechaString = `${fechaActual.getDate()}/${
    fechaActual.getMonth() + 1
  }/${fechaActual.getFullYear()}`;

  // configurar las opciones del correo de respuesta
  const mailOptions = {
    from: process.env.EMAIL_USER, // remitente: el correo configurado en las variables de entorno
    to: destinatario, // destinatario de la respuesta
    subject: `respuesta incidencia - ${incidenciaId} | kadenas bikes`, // asunto del correo
    text: `${fechaString} - respuesta
    ${mensaje}
    `, // cuerpo del mensaje con la fecha y la respuesta
  };

  try {
    // intentar enviar el correo de respuesta
    await transporter.sendMail(mailOptions);
    // intentar eliminar la incidencia de la base de datos
    const incidenciaRespondida = await Soporte.deleteIncidencia(incidenciaId);
    // si la incidencia no se elimino correctamente, lanzar un error
    if (!incidenciaRespondida) {
      throw new Error("la incidencia no se elimino correctamente");
    }
    // si todo es exitoso, enviar respuesta de exito
    return res.status(200).send({
      titulo: "éxito",
      mensaje: "incidencia reportada correctamente", // nota: el mensaje dice 'reportada', quiza deberia ser 'respuesta enviada' o 'incidencia resuelta'
    });
  } catch (error) {
    // registrar cualquier error que ocurra
    console.log("error al reportar incidencia: ", error); // nota: el mensaje dice 'reportar incidencia', quiza deberia ser 'enviar respuesta de incidencia'
    // enviar respuesta de error del servidor
    return res.status(500).send({
      titulo: "error",
      mensaje: "error al reportar la incidencia", // nota: el mensaje dice 'reportar incidencia', quiza deberia ser 'enviar respuesta de incidencia'
    });
  }
};