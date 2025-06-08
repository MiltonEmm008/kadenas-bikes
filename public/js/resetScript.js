function togglePassword(inputId, iconId) {
  const input = document.querySelector(`[name='${inputId}']`);
  const icon = document.getElementById(iconId);
  if (input.type === "password") {
    input.type = "text";
    icon.setAttribute("data-feather", "eye-off");
  } else {
    input.type = "password";
    icon.setAttribute("data-feather", "eye");
  }
  if (window.feather) {
    feather.replace();
  }
}

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

// Asocia el botón de cierre del modal
document.getElementById("modalClose").addEventListener("click", cerrarModal);

// public/js/resetPassword.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const token = document.getElementById("token").value;
    const newPassword = document.getElementById("newPassword").value;

    fetch("/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, newPassword }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            return Promise.reject(errorData);
          });
        }
        return response.json();
      })
      .then((result) => {
        abrirModal(result.titulo || "ÉXITO", result.mensaje);
        // Redirige a la página de login o donde desees luego de unos segundos
        setTimeout(() => {
          window.location.href = "/auth/login";
        }, 300);
      })
      .catch((error) => {
        abrirModal(
          error.titulo || "ERROR",
          error.mensaje || "Ocurrió un error"
        );
      });
  });
});
