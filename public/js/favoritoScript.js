feather.replace(); // Para los iconos de Feather

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

// Función para quitar de favoritos (modificada para recibir el evento)
function removeFromFavorites(event, productId) {
  // Detener la propagación del evento para evitar que el <a> se active
  event.stopPropagation();
  event.preventDefault(); // Opcional, si el botón tuviera un comportamiento por defecto

  fetch(`/api/manejar-favorito/${productId}`, {
    method: "POST", // O DELETE, dependiendo de cómo lo tengas en el backend
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    credentials: "same-origin",
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Error en la solicitud: " + res.statusText);
      }
      return res.json();
    })
    .then((data) => {
      abrirModal("Éxito", data.message || "Producto eliminado de favoritos.");
      setTimeout(() => {
        location.reload(); // Recarga la página después de un pequeño retraso
      }, 80); // 400ms para permitir que el usuario vea el modal
    })
    .catch((err) => {
      console.error("Error al quitar de favoritos:", err);
      abrirModal(
        "Error",
        err.message || "Hubo un problema al quitar el producto de favoritos."
      );
    });
}

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