// INICIALIZAR AOS PARA ANIMACIONES
AOS.init({ duration: 800, easing: "ease-in-out", once: true });
// INICIALIZAR ICONOS FEATHER
feather.replace();

// FUNCION PARA MOSTRAR U OCULTAR CONTRASENA
function togglePassword(inputId, iconId) {
  const passwordInput = document.getElementById(inputId);
  const eyeIcon = document.getElementById(iconId);
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeIcon.setAttribute("data-feather", "eye-off");
  } else {
    passwordInput.type = "password";
    eyeIcon.setAttribute("data-feather", "eye");
  }
  feather.replace();
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

// EFECTO DE ENVIO DEL FORMULARIO Y VALIDACION PARA LOGIN
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío tradicional
    console.log("formulario incerceptado");

    let valid = true;
    const correoInput = document.getElementById("correo");
    const contraInput = document.getElementById("contra");
    const correoError = document.getElementById("correo-error");
    const contraError = document.getElementById("contra-error");

    // REGEX PARA EMAIL
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // VALIDACION DE EMAIL
    if (!emailRegex.test(correoInput.value)) {
      correoInput.classList.remove("border-white/20");
      correoInput.classList.add("border-red-500");
      correoError.textContent = "Ingrese un correo válido.";
      correoError.classList.remove("hidden");
      valid = false;
    } else {
      correoInput.classList.remove("border-red-500");
      correoInput.classList.add("border-white/20");
      correoError.classList.add("hidden");
    }

    // VALIDACION DE CONTRASEÑA (mínimo 8 caracteres)
    if (contraInput.value.length < 8) {
      contraInput.classList.remove("border-white/20");
      contraInput.classList.add("border-red-500");
      contraError.textContent =
        "La contraseña debe tener al menos 8 caracteres.";
      contraError.classList.remove("hidden");
      valid = false;
    } else {
      contraInput.classList.remove("border-red-500");
      contraInput.classList.add("border-white/20");
      contraError.classList.add("hidden");
    }

    if (!valid) {
      return;
    }

    // EFECTO DE CARGANDO EN EL BOTÓN
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML =
      '<i data-feather="loader" class="w-5 h-5 inline mr-2 animate-spin"></i>Iniciando...';
    feather.replace();

    // Enviar la solicitud de login con fetch
    fetch("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: correoInput.value,
        contra: contraInput.value,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          //       // Obtener el JSON de error y rechazar la promesa con él
          return response.json().then((errorData) => {
            return Promise.reject(errorData);
          });
        }
        return response.json();
      })
      .then((result) => {
        // Actualizar el botón para mostrar que se inició correctamente
        button.innerHTML =
          '<i data-feather="check" class="w-5 h-5 inline mr-2"></i>Bienvenido';
        button.classList.remove(
          "bg-gradient-to-r",
          "from-[#ff6b35]",
          "to-[#ff8c42]",
          "dark:from-[#c2410c]",
          "dark:to-[#ff6b35]"
        );
        button.classList.add(
          "bg-gradient-to-r",
          "from-green-500",
          "to-green-700"
        );
        feather.replace();

        // Opcionalmente, después de un tiempo puedes redirigir o revertir el botón
        setTimeout(() => {
          button.innerHTML = originalText;
          button.classList.remove(
            "bg-gradient-to-r",
            "from-green-500",
            "to-green-700"
          );
          button.classList.add(
            "bg-gradient-to-r",
            "from-[#ff6b35]",
            "to-[#ff8c42]",
            "dark:from-[#c2410c]",
            "dark:to-[#ff6b35]"
          );
          feather.replace();
          // Por ejemplo, redireccionar:
          // window.location.href = "/dashboard";
        }, 2000);
        abrirModal(result.titulo, result.mensaje);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error en el login:", error);
        abrirModal(
          "ERROR",
          error.mensaje || "NO SE PUDO INICIAR SESIÓN, INTENTALO MÁS TARDE"
        );
        // Revertir apariencia del botón en caso de error
        button.innerHTML = originalText;
        feather.replace();
      });
  });
}
