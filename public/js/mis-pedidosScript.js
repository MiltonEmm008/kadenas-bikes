// Inicialización de Feather Icons
feather.replace();

// Variables globales
let pedidoCancelarId = null;
let modoConfirmacion = false;

// MENU HAMBURGUESA RESPONSIVE PARA MOVIL
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

if (perfil_toggle) {
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

if (menuToggle) {
  menuToggle.addEventListener("click", function () {
    if (menu_perfil.classList.contains("hidden")) {
      menu.classList.toggle("hidden");
    } else {
      menu_perfil.classList.add("hidden");
      menu.classList.remove("hidden");
    }
  });
}

// OCULTA EL MENU AL HACER CLICK EN UN ENLACE EN PANTALLAS PEQUENAS
if (menu) {
  const menuLinks = menu.querySelectorAll("a");
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth < 768) {
        menu.classList.add("hidden");
      }
    });
  });
}

// Funciones para manejar la cancelación
window.iniciarCancelacionPedido = function(id) {
  pedidoCancelarId = id;
  modoConfirmacion = true;
  mostrarConfirmacionCancelar(id);
};

// Funciones para manejar la devolución
window.iniciarDevolucionPedido = function(id) {
  document.getElementById("devolucionPedidoId").value = id;
  document.getElementById("devolucionModal").classList.remove("hidden");
};

window.cerrarModalDevolucion = function() {
  document.getElementById("devolucionModal").classList.add("hidden");
  document.getElementById("devolucionForm").reset();
};

// Funciones auxiliares
function mostrarConfirmacionCancelar(id) {
  const modal = document.getElementById("customModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const btnAceptar = document.getElementById("modalClose");
  const btnCancelar = document.getElementById("modalCancel");

  modalTitle.textContent = "Cancelar pedido";
  modalMessage.textContent = `¿Seguro que deseas cancelar el pedido #${id}?`;
  btnAceptar.textContent = "ACEPTAR";
  btnCancelar.style.display = "";
  modal.classList.remove("hidden");
}

function mostrarPedidoCancelado(id) {
  const modal = document.getElementById("customModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalMessage = document.getElementById("modalMessage");
  const btnAceptar = document.getElementById("modalClose");
  const btnCancelar = document.getElementById("modalCancel");

  modalTitle.textContent = "Pedido cancelado";
  modalMessage.textContent = `Pedido número ${id} cancelado`;
  btnAceptar.textContent = "ACEPTAR";
  btnCancelar.style.display = "none";
  modal.classList.remove("hidden");
}

async function cancelarPedido(id) {
  try {
    const res = await fetch(`/api/cancelar-pedido/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      mostrarPedidoCancelado(id);
      setTimeout(() => {
        location.reload();
      }, 300);
    } else {
      const error = await res.json();
      alert(`${error.title}: ${error.message}`);
    }
  } catch (error) {
    console.error("Error al cancelar pedido:", error);
  }
}

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
  feather.replace();

  // Manejar los botones de acción
  document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]').dataset.action;
      const pedidoId = e.target.closest('[data-action]').dataset.pedidoId;
      
      if (action === 'cancelar') {
        window.iniciarCancelacionPedido(pedidoId);
      } else if (action === 'devolver') {
        window.iniciarDevolucionPedido(pedidoId);
      }
    });
  });

  // Manejar el formulario de devolución
  const devolucionForm = document.getElementById("devolucionForm");
  if (devolucionForm) {
    devolucionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      const pedidoId = document.getElementById("devolucionPedidoId").value;
      const motivo = document.getElementById("devolucionMotivo").value.trim();

      if (!motivo) {
        alert("Por favor, describe el motivo de la devolución.");
        return;
      }

      try {
        const response = await fetch(`/api/pedidos/${pedidoId}/devolucion`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ motivo })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || "Error al procesar la solicitud de devolución");
        }

        const result = await response.json();
        alert("Solicitud de devolución enviada correctamente. Nos pondremos en contacto contigo pronto.");
        window.cerrarModalDevolucion();
        location.reload();
      } catch (error) {
        console.error("Error al procesar devolución:", error);
        alert(error.message || "Error al procesar la solicitud de devolución");
      }
    });
  }

  // Manejar el botón de cancelar devolución
  const cancelarDevolucionBtn = document.getElementById("cancelarDevolucionBtn");
  if (cancelarDevolucionBtn) {
    cancelarDevolucionBtn.addEventListener("click", window.cerrarModalDevolucion);
  }

  // Manejar el modal de confirmación
  const modal = document.getElementById("customModal");
  const btnAceptar = document.getElementById("modalClose");
  const btnCancelar = document.getElementById("modalCancel");

  if (btnAceptar) {
    btnAceptar.addEventListener("click", () => {
      if (modoConfirmacion && pedidoCancelarId !== null) {
        modoConfirmacion = false;
        cancelarPedido(pedidoCancelarId);
        pedidoCancelarId = null;
      } else {
        modal.classList.add("hidden");
        modoConfirmacion = false;
        pedidoCancelarId = null;
      }
    });
  }

  if (btnCancelar) {
    btnCancelar.addEventListener("click", () => {
      modal.classList.add("hidden");
      modoConfirmacion = false;
      pedidoCancelarId = null;
    });
  }
});
