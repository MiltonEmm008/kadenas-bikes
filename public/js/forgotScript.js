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
// public/js/forgotPassword.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgot-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const correoInput = document.getElementById("correo");
    const correo = correoInput.value;

    fetch("/auth/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo }),
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
      })
      .catch((error) => {
        abrirModal(
          error.titulo || "ERROR",
          error.mensaje || "Ocurrió un error"
        );
      });
  });
});
