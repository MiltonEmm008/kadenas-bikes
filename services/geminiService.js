// services/geminiService.js
//Servicio usado para el chatbot de soporte
//
import { GoogleGenerativeAI } from "@google/generative-ai";

//Api key que se encuentra en las variables de entorno
const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

//Funcion para generar el chat, recibe un contexto anterior y uno inicial
function getOrCreateChatSession(history = [], initialContext = "") {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Modelo de gemini rapido y ligero

  const chat = model.startChat({
    history: history,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  // Si hay un contexto inicial y no está ya en el historial, lo agregamos.
  // Esto es para establecer el "rol" o la "personalidad" del bot.
  if (
    initialContext &&
    !history.some(
      (item) => item.role === "user" && item.parts[0].text === initialContext
    )
  ) {
    chat.sendMessage(initialContext); // Agrega el contexto inicial si no se paso antes
  }

  return chat;
}

//Funcion asincrona que genera las respuestas
async function generateChatResponseWithMemory(chat, message) {
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response;
    //Si todo se satisface, se retorna la respuesta en formato string
    return response.text();
  } catch (error) {
    console.error("Error al llamar a Gemini API:", error);
    throw new Error("Error al generar respuesta de Gemini con memoria");
  }
}

export {
  getOrCreateChatSession,
  generateChatResponseWithMemory,
};
