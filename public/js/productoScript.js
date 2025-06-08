const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

if (perfil_toggle && menu_perfil) {
  perfil_toggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (menu.classList.contains("hidden")) {
      menu_perfil.classList.toggle("hidden");
    } else {
      menu.classList.add("hidden");
      menu_perfil.classList.remove("hidden");
    }
  });
}

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle.addEventListener("click", function () {
  if (menu_perfil && perfil_toggle) {
    if (menu_perfil.classList.contains("hidden")) {
      menu.classList.toggle("hidden");
    } else {
      menu_perfil.classList.add("hidden");
      menu.classList.remove("hidden");
    }
  } else {
    menu.classList.toggle("hidden");
  }
});

// Función para abrir el modal y actualizar sus contenidos
function abrirModal(titulo, mensaje) {
  const modal = document.getElementById("customModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");

  modalTitle.textContent = titulo;
  modalMessage.textContent = mensaje;
  modal.classList.remove("hidden");
}

// Función para cerrar el modal
function cerrarModal() {
  const modal = document.getElementById("customModal");
  modal.classList.add("hidden");
}

// Asocia el botón de cierre
document.getElementById("modalClose").addEventListener("click", cerrarModal);

// Agregar al carrito
const btn_carrito = document.getElementById("btn-add-carrito");

if (btn_carrito) {
  btn_carrito.addEventListener("click", async () => {
    const id_producto = Number(btn_carrito.getAttribute("data-producto-id"));

    try {
      const response = await fetch(`/api/agregar-carrito/${id_producto}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      abrirModal(data.title, data.message);
    } catch (err) {
      console.error(err);
      abrirModal("Error", "Sucedio un error al agregar al carrito");
    }
  });
}

// Toggle favoritos con cambio de icono y color naranja cuando está activo
async function toggleFavorite() {
  const btn = document.getElementById("favorite-btn");
  const icon = document.getElementById("favorite-icon");
  const notification = document.getElementById("favorite-notification");
  const message = document.getElementById("favorite-message");
  const notificationIcon = document.getElementById("notification-icon");

  // Utilizamos window.favorito como estado actual
  const isActive = window.favorito;

  try {
    const response = await fetch(
      `/api/manejar-favorito/${window.producto_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "same-origin",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    // Se puede usar el dato devuelto si es necesario, en este ejemplo no se utiliza
    const data = await response.json();

    // Alternar el valor de window.favorito solo si la petición fue exitosa
    window.favorito = !window.favorito;
    const newActive = window.favorito;

    // Actualizar UI según el nuevo estado
    if (newActive) {
      btn.classList.add("bg-orange-500", "text-white");
      btn.classList.remove("text-primary");
      icon.textContent = "♥️";
      icon.classList.add("text-white");
      icon.classList.remove("text-primary");
      message.textContent = "Añadido a favoritos";
      notificationIcon.classList.remove("text-red-500");
      notificationIcon.classList.add("text-green-500");
      notificationIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />';
    } else {
      btn.classList.remove("bg-orange-500", "text-white");
      btn.classList.add("text-primary");
      icon.textContent = "♡";
      icon.classList.remove("text-white");
      icon.classList.add("text-primary");
      message.textContent = "Eliminado de favoritos";
      notificationIcon.classList.remove("text-green-500");
      notificationIcon.classList.add("text-red-500");
      notificationIcon.innerHTML =
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    }

    // Mostrar notificación con animación
    notification.classList.remove("hidden", "animate-fade-out");
    notification.classList.add("animate-fade-in");

    // Después de 3 segundos ocultamos la notificación
    setTimeout(() => {
      notification.classList.remove("animate-fade-in");
      notification.classList.add("animate-fade-out");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 300);
    }, 3000);
  } catch (error) {
    // Manejo de errores
    message.textContent = "Error al actualizar favorito";
    notificationIcon.classList.remove("text-green-500");
    notificationIcon.classList.add("text-red-500");
    notificationIcon.innerHTML =
      '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    notification.classList.remove("hidden", "animate-fade-out");
    notification.classList.add("animate-fade-in");
    setTimeout(() => {
      notification.classList.remove("animate-fade-in");
      notification.classList.add("animate-fade-out");
      setTimeout(() => {
        notification.classList.add("hidden");
      }, 300);
    }, 3000);
  }
}

// Inicializar el estado visual del botón favorito al cargar la página
function initFavoriteButton() {
  const btn = document.getElementById("favorite-btn");
  const icon = document.getElementById("favorite-icon");
  if (window.favorito) {
    btn.classList.add("bg-orange-500", "text-white");
    btn.classList.remove("text-primary");
    icon.textContent = "♥️";
    icon.classList.add("text-white");
    icon.classList.remove("text-primary");
  } else {
    btn.classList.remove("bg-orange-500", "text-white");
    btn.classList.add("text-primary");
    icon.textContent = "♡";
    icon.classList.remove("text-white");
    icon.classList.add("text-primary");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  feather.replace();
  // window.favorito puede venir como string 'true'/'false', lo convertimos a booleano real
  if (typeof window.favorito === "string") {
    window.favorito = window.favorito === "true";
  }
  initFavoriteButton();
});

// JavaScript para el carrusel de productos relacionados
const relatedTrack = document.getElementById("relatedProductsTrack");
const relatedCards = document.querySelectorAll(
  "#relatedProductsTrack > .carrusel-item"
);
let relatedIndex = 0;
const cardsToShow = 4; // Siempre mostrar 4 elementos

function moveRelatedCarousel(direction) {
  const totalCards = relatedCards.length;

  relatedIndex += direction;

  // Ajustar índices para no salirse de los límites
  if (relatedIndex < 0) relatedIndex = 0;
  if (relatedIndex > totalCards - cardsToShow)
    relatedIndex = totalCards - cardsToShow;

  // Calcular el desplazamiento basado en el ancho de cada tarjeta
  const cardWidth = relatedCards[0].offsetWidth + 16; // Incluye el gap
  const moveX = -(relatedIndex * cardWidth);

  relatedTrack.style.transform = `translateX(${moveX}px)`;
}

// Feather icons en toda la página
document.addEventListener("DOMContentLoaded", () => {
  feather.replace();
});

// Ajustar el carrusel al redimensionar la ventana
window.addEventListener("resize", () => {
  moveRelatedCarousel(0);
});

// Inicializar posición
moveRelatedCarousel(0);
