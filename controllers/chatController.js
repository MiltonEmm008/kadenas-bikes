// controllers/chatController.js
// importar funciones de jsonwebtoken
import pkg from "jsonwebtoken";
// extraer la funcion 'verify' del paquete
const { verify } = pkg;
// importar funciones de servicio de gemini
import {
  getOrCreateChatSession,
  generateChatResponseWithMemory,
} from "../services/geminiService.js";
// importar funcion para reportar incidencias
import { reportarIncidencia } from "./incidenciaController.js";
// importar el modelo de soporte
import Soporte from "../models/Soporte.js";
// importar el modelo de usuario
import Usuario from "../models/Usuario.js";
// importar el modelo de producto
import Producto from "../models/Producto.js";

// objeto para almacenar las sesiones de chat por id de usuario
const userChatSessions = {};

/**
 * handler para get /chat
 * verifica el token y renderiza la vista supportchat, pasando la informacion del usuario
 */
async function getDataOfUser(id) {
  // buscar usuario por id
  const usuarioEncontrado = await Usuario.findUsuarioById(id);
  // si se encuentra el usuario, devolver sus datos
  if (usuarioEncontrado) {
    return { user: usuarioEncontrado };
  }
  // si no se encuentra, devolver usuario nulo
  return { user: null };
}

const getChat = async (req, res) => {
  // obtener el token de las cookies
  const token = req.cookies && req.cookies.access_token;
  // si hay un token
  if (token) {
    // verificar el token
    verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      // si hay un error al verificar el token
      if (err) {
        // renderizar la vista de chat sin usuario
        return res.render("supportChat", { user: null });
      } else {
        // obtener datos del usuario decodificado
        const userData = await getDataOfUser(decoded.id);
        // renderizar la vista de chat con los datos del usuario
        return res.render("supportChat", userData);
      }
    });
  } else {
    // si no hay token, renderizar la vista de chat sin usuario
    res.render("supportChat", { user: null });
  }
};

/**
 * Procesa las acciones relacionadas con productos en el mensaje
 * @param {string} message - El mensaje del usuario
 * @returns {Promise<string|null>} - La respuesta procesada o null si no hay acción
 */
async function processProductActions(message) {
  // Buscar acciones en el formato ///accion///
  const actionMatch = message.match(/\/\/([^/]+)\/\//);
  if (!actionMatch) return null;

  const action = actionMatch[1].trim();
  let response = "";

  try {
    switch (action) {
      case "buscar_ofertas":
        const ofertas = await Producto.getProductsOnSale(5);
        if (ofertas.length === 0) {
          response = "No hay productos en oferta en este momento.";
        } else {
          response = "Últimos 5 productos en oferta:\n";
          ofertas.forEach((prod) => {
            response += `- ${prod.nombre}: $${
              prod.precio * (1 - prod.descuento_porcentaje / 100)
            } (${prod.descuento_porcentaje}% de descuento)\n`;
          });
        }
        break;

      case "categorias_disponibles":
        const categorias = await Producto.getCategoryStats();
        if (categorias.length === 0) {
          response = "No hay categorías disponibles en este momento.";
        } else {
          response = "Categorías disponibles y cantidad de productos:\n";
          categorias.forEach((cat) => {
            response += `- ${cat.categoria}: ${cat.cantidad} productos\n`;
          });
        }
        break;

      case "ultimos_productos":
        const ultimos = await Producto.getLatestProducts();
        if (ultimos.length === 0) {
          response = "No hay productos disponibles en este momento.";
        } else {
          response = "Últimos 5 productos agregados:\n";
          ultimos.forEach((prod) => {
            response += `- ${prod.nombre}: $${prod.precio}\n`;
          });
        }
        break;

      default:
        return null;
    }
    return response;
  } catch (error) {
    console.error("Error procesando acción de producto:", error);
    return "Lo siento, hubo un error al procesar tu solicitud.";
  }
}

/**
 * handler para post /chat
 * recibe el prompt y el userid, gestiona la sesion del chat y genera la respuesta
 */
const postChat = async (req, res) => {
  try {
    const { userId, prompt } = req.body;
    if (!userId) {
      return res.status(400).json({
        error:
          "falta proporcionar el userid para mantener el contexto de la conversación.",
      });
    }
    if (!prompt) {
      return res.status(400).json({ error: "falta proporcionar el prompt." });
    }

    // Primero intentar procesar acciones de productos
    const productActionResponse = await processProductActions(prompt);
    if (productActionResponse) {
      return res.status(200).json({ answer: productActionResponse });
    }

    // Si no hay acción de producto, continuar con el flujo normal del chat
    let chatSession = userChatSessions[userId];
    if (!chatSession) {
      chatSession = getOrCreateChatSession(
        [],
        `eres "kadenas-bot", un asistente virtual de soporte especializado para la tienda online kadenas bikes. tu función es recopilar información de contacto y registrar incidencias relacionadas únicamente con la tienda o responder dudas acerca del correo de contacto de la empresa (kadenasbikes@gmail.com) o sus dueños. además, puedes responder consultas sobre productos usando las siguientes acciones:

acciones disponibles:
- ///buscar_ofertas///: muestra los últimos 5 productos en oferta
- ///categorias_disponibles///: muestra las categorías disponibles y la cantidad de productos en cada una
- ///ultimos_productos///: muestra los últimos 5 productos agregados

* Cuando el usuario haga alguna pregunta acerca de estas distintas acciones, tu responderar de esa forma, por ejemplo, si el usuario dice: 'dime las ultimas ofertas', tu generaras un mensaje asi: ///buscar_ofertas///, lo mismo con las otras dos acciones

objetivo:
- recoger la siguiente información del usuario:
  • nombre
  • correo
  • situacion (una breve descripción de la incidencia o aclaración)
  • urgencia (por ejemplo: alta, media o baja)
- una vez que hayas recibido todos los datos, debes generar inmediatamente un json con la siguiente estructura:
  {
    "nombre": "valor",
    "correo": "valor",
    "situacion": "valor",
    "urgencia": "valor"
  }
- además, tu respuesta debe incluir un mensaje adicional confirmando "incidencia registrada".

restricciones:
- responde únicamente sobre incidencias o datos de contacto relacionados con la tienda online kadenas bikes.
- si el usuario introduce temas que no guarden relación con el soporte o las incidencias o preguntas acerca de la tienda, indícale amablemente que solo brindas ayuda sobre estas cuestiones.
- tus respuestas no pueden ir con caracteres especiales o markdown.
- si el usuario solicita información sobre productos, usa las acciones disponibles mencionadas arriba.

tono y estilo:
- sé siempre amable, profesional y directo.
- no te desvíes del tema; mantente enfocado en guiar al usuario a proporcionar los datos solicitados o darle información sobre los dueños de la empresa y el contacto (su correo).

ejemplo de interacción:
bot: "¡hola! soy kadenas-bot, tu asistente de soporte para kadenas bikes. ¿cómo te llamas?"
usuario: "juan pérez"
bot: "gracias, juan. ¿cuál es tu correo electrónico?"
usuario: "juan@example.com"
bot: "perfecto. cuéntame brevemente cuál es la incidencia o situación que deseas reportar en nuestra tienda."
usuario: "no he recibido mi comprobante de pago."
bot: "entendido. por último, ¿cómo calificarías la urgencia de este asunto? (alta, media o baja)"
usuario: "alta"
bot (al detectar que se han proporcionado todos los datos) debe responder:
{
  "nombre": "juan pérez",
  "correo": "juan@example.com",
  "situacion": "no he recibido mi comprobante de pago.",
  "urgencia": "alta"
}
incidencia registrada.

contacto:
si en algún momento se solicitan datos de contacto, como el correo de la empresa o información de los dueños, puedes proporcionar:
- correo de la empresa: kadenasbikes@gmail.com
- dueños: milton emmanuel rodríguez pérez, william paul macías vazquez, carlos antonio gonzalez gomez, cristopher acosta castañeda

recuerda: solo atiende consultas sobre incidencias, cuestiones sobre los productos acerca de las acciones que tienes disponibles (no le diras textualmente al usuario que puedes realizar eso, solo que puedes consultar algunos datos de los productos) y datos de contacto referentes a kadenas bikes, o si se solicitan datos de contacto como el correo de la empresa o los dueños de la tienda.`
      );
      userChatSessions[userId] = chatSession;
    }

    // generar la respuesta del chat con memoria
    const answer = await generateChatResponseWithMemory(chatSession, prompt);
    let finalAnswer = answer;

    // buscar la porcion de json en la respuesta del bot
    const match = answer.match(/(\{[\s\S]*?\})/);

    // si se encuentra un json en la respuesta
    if (match) {
      // extraer la cadena json
      const jsonStr = match[0];
      // parsear el json y extraer los datos
      const { nombre, correo, situacion, urgencia } = JSON.parse(jsonStr);

      // obtener el token de acceso de las cookies
      const token = req.cookies && req.cookies.access_token;
      // si hay un token
      if (token) {
        let decoded;
        try {
          // verificar el token de forma sincrona
          decoded = verify(token, process.env.JWT_SECRET);
        } catch (err) {
          // si hay error al verificar el token, enviar respuesta de error
          return res.status(200).json({
            answer:
              "hubo un error al generar tu incidencia, inténtalo más tarde.",
          });
        }
        // obtener el id de usuario decodificado
        const usuario_id = decoded.id;
        // crear un nuevo registro de soporte en la base de datos
        await Soporte.create({
          usuario_id,
          nombre,
          correo,
          situacion,
          urgencia,
        });
        // reportar la incidencia por correo
        let incidencia_enviada = await reportarIncidencia(
          nombre,
          usuario_id,
          correo,
          urgencia,
          situacion
        );
        // si la incidencia no se pudo enviar por correo
        if (!incidencia_enviada) {
          finalAnswer =
            "hubo un error al mandar tu correo para registrar la incidencia, intentalo más tarde.";
        } else {
          // si la incidencia se registro correctamente
          finalAnswer = "incidencia registrada, ¡gracias por contactarse!.";
        }
      } else {
        // si no hay token, enviar respuesta de error
        return res.status(200).json({
          answer:
            "hubo un error al generar tu incidencia, inténtalo más tarde.",
        });
      }
    } else {
      // Si no hay JSON, verificar si hay acciones de productos en la respuesta
      const actionMatch = finalAnswer.match(/\/\/([^/]+)\/\//);
      if (actionMatch) {
        const actionResult = await processProductActions(finalAnswer);
        if (actionResult) {
          finalAnswer = actionResult;
        }
      }
    }

    // enviar la respuesta final del bot
    return res.status(200).json({ answer: finalAnswer });
  } catch (error) {
    // registrar cualquier error en consola
    console.error("error en post /chat:", error);
    // enviar respuesta de error del servidor
    return res
      .status(500)
      .json({ error: "error al generar respuesta del bot con memoria." });
  }
};

// exportar funciones para su uso en otros archivos
export default {
  getChat,
  postChat,
};

export { getChat, postChat };