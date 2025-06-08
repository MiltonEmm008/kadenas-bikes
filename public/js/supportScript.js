// MENU HAMBURGUESA RESPONSIVE PARA MOVIL
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

perfil_toggle.addEventListener("click", function (e) {
  e.preventDefault();
  if (menu.classList.contains("hidden")) {
    menu_perfil.classList.toggle("hidden");
  } else {
    menu.classList.add("hidden");
    menu_perfil.classList.remove("hidden");
  }
});

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle.addEventListener("click", function () {
  if (menu_perfil.classList.contains("hidden")) {
    menu.classList.toggle("hidden");
  } else {
    menu_perfil.classList.add("hidden");
    menu.classList.remove("hidden");
  }
});

// OCULTA EL MENU AL HACER CLICK EN UN ENLACE EN PANTALLAS PEQUENAS
const menuLinks = menu.querySelectorAll("a");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      menu.classList.add("hidden");
    }
  });
});
// Generar un userId aleatorio al cargar la página si no existe
// Esto asegura que el mismo usuario tenga el mismo ID durante la sesión
let userId = localStorage.getItem("chatUserId");
if (!userId) {
  userId =
    "user_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);
  localStorage.setItem("chatUserId", userId);
}
console.log("Current User ID:", userId); // Para depuración

const chatHistoryDiv = document.getElementById("chat-history");

// Función para añadir mensajes al historial del chat
function addMessageToHistory(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  if (sender === "user") {
    messageDiv.classList.add("text-right", "text-orange-600", "mb-2", "sm:text-xl", "md:text-2xl");
    messageDiv.textContent = `Tú: ${message}`;
  } else if (sender === "kadenas") {
    messageDiv.classList.add("text-left", "text-green-600", "mb-2", "sm:text-xl", "md:text-2xl");
    messageDiv.textContent = `Kadenas-Bot: ${message}`;
  } else {
    messageDiv.classList.add("text-center", "text-red-500", "mb-2", "sm:text-xl", "md:text-2xl");
    messageDiv.textContent = message;
  }
  chatHistoryDiv.appendChild(messageDiv);
  // Desplazarse al final del chat para ver el mensaje más reciente
  chatHistoryDiv.scrollTop = chatHistoryDiv.scrollHeight;
}

document.getElementById("chat-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const promptInput = document.getElementById("prompt");
  const prompt = promptInput.value;

  if (!prompt.trim()) {
    // Evita enviar mensajes vacíos
    return;
  }

  addMessageToHistory("user", prompt); // Muestra el mensaje del usuario en el historial
  promptInput.value = ""; // Limpia el input después de enviar

  try {
    // Se envía el userId junto con el prompt
    const response = await fetch("/chat", {
      // Asegúrate que esta ruta coincida con tu Express (ej. /chat o /api/chat)
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, prompt }), // Enviamos userId y prompt
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Error en la solicitud");
    }

    const result = await response.json();
    addMessageToHistory("kadenas", result.answer); // Muestra la respuesta de Gemini
  } catch (error) {
    console.error("Error durante el fetch:", error);
    addMessageToHistory("system", `Error: ${error.message}`); // Muestra errores en el historial
  }
});
