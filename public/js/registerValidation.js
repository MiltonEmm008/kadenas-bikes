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

// ENVIAR FORMULARIO DE REGISTRO CON FETCH (en lugar de submit normal)
// Supongamos que el formulario de registro tiene id="registration-form"
const registrationForm = document.getElementById("registration-form");
if (registrationForm) {
  registrationForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevenir el envío tradicional

    console.log("formulario incerceptado");

    let valid = true;
    // Obtener los inputs y elementos de error
    const nombreUsuarioInput = document.getElementById("nombre_usuario");
    const correoInput = document.getElementById("correo");
    const contraInput = document.getElementById("contra");
    const confirmarContraInput = document.getElementById("confirmar_contra");
    const aceptoTerminosInput = document.getElementById("aceptar_terminos");
    const nombreUsuarioError = document.getElementById("nombre_usuario-error");
    const correoError = document.getElementById("correo-error");
    const contraError = document.getElementById("contra-error");
    const confirmarContraError = document.getElementById(
      "confirmar_contra-error"
    );
    const aceptoTerminosError = document.getElementById(
      "aceptar_terminos-error"
    );

    // VALIDACION DE NOMBRE DE USUARIO (mínimo 10 caracteres)
    if (nombreUsuarioInput.value.trim().length < 10) {
      nombreUsuarioInput.classList.remove("border-white/20");
      nombreUsuarioInput.classList.add("border-red-500");
      nombreUsuarioError.textContent =
        "El nombre de usuario debe tener al menos 10 caracteres.";
      nombreUsuarioError.classList.remove("hidden");
      valid = false;
    } else {
      nombreUsuarioInput.classList.remove("border-red-500");
      nombreUsuarioInput.classList.add("border-white/20");
      nombreUsuarioError.classList.add("hidden");
    }

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

    // VALIDACION DE CONFIRMAR CONTRASEÑA
    if (
      confirmarContraInput.value !== contraInput.value ||
      confirmarContraInput.value.length < 8
    ) {
      confirmarContraInput.classList.remove("border-white/20");
      confirmarContraInput.classList.add("border-red-500");
      confirmarContraError.textContent =
        "Las contraseñas deben coincidir y tener al menos 8 caracteres.";
      confirmarContraError.classList.remove("hidden");
      valid = false;
    } else {
      confirmarContraInput.classList.remove("border-red-500");
      confirmarContraInput.classList.add("border-white/20");
      confirmarContraError.classList.add("hidden");
    }

    if (!aceptoTerminosInput.checked) {
      aceptoTerminosInput.classList.add("border-red-500");
      aceptoTerminosInput.classList.remove("border-white/20");
      aceptoTerminosError.textContent =
        "Debes aceptar los terminos y condiciones para poder registrarte.";
      aceptoTerminosError.classList.remove("hidden");
      valid = false;
    } else {
      aceptoTerminosError.classList.add("hidden");
      aceptoTerminosInput.classList.remove("border-red-500");
      aceptoTerminosInput.classList.add("border-white/20");
    }

    if (!valid) {
      // Si no es válido, se detiene la ejecución
      return;
    }

    // EFECTO DE ENVÍO EN EL BOTÓN
    const button = this.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;
    button.innerHTML =
      '<i data-feather="loader" class="w-5 h-5 inline mr-2 animate-spin"></i>Registrando...';
    feather.replace();

    // Convertir los datos del formulario a objeto
    const formData = new FormData(this);
    const datosRegistro = Object.fromEntries(formData.entries());

    // Enviar la solicitud de registro vía fetch (ajusta la URL al endpoint correcto)
    fetch("/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        correo: datosRegistro.correo,
        nombre_usuario: datosRegistro.nombre_usuario,
        contra: datosRegistro.contra,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            return Promise.reject(errorData);
          });
        }
        return response.json(); // Se retorna correctamente el JSON
      })
      .then((result) => {
        // Ejemplo: result debería tener { titulo: "Éxito", mensaje: "Usuario registrado" }
        button.innerHTML =
          '<i data-feather="check" class="w-5 h-5 inline mr-2"></i>Registro Exitoso';
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

        // Se puede reiniciar el formulario o redirigir según lo requieras
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
        }, 2000);
        abrirModal(result.titulo, result.mensaje);
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Error en el registro:", error);
        abrirModal(
          "ERROR",
          error.mensaje ||
            "NO SE PUDO COMPLETAR EL REGISTRO, INTENTALO MÁS TARDE"
        );
        button.innerHTML = originalText;
        feather.replace();
      });
  });
}
