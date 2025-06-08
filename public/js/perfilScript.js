AOS.init({
  once: true,
  duration: 700, // Default duration for AOS elements
  offset: 50, // Offset (in px) from the original trigger point
});

feather.replace(); // Initialize Feather Icons

// Existing JavaScript functions
function mostrarInputNombre() {
  document.getElementById("nombreDisplay").classList.add("hidden");
  const nombreInput = document.getElementById("nombre");
  nombreInput.classList.remove("hidden");
  nombreInput.focus();
}

function mostrarInputEmail() {
  document.getElementById("emailDisplay").classList.add("hidden");
  const emailInput = document.getElementById("email");
  emailInput.classList.remove("hidden");
  emailInput.focus();
}

async function guardarCambios() {
  const nombreInput = document.getElementById("nombre");
  const emailInput = document.getElementById("email");
  const fotoInput = document.getElementById("inputFoto");
  const guardarBtn = document.querySelector('button[onclick="guardarCambios()"]');

  const nombre = nombreInput.value.trim();
  const email = emailInput.value.trim();
  const fotoFile = fotoInput.files[0];

  // Validar que al menos el nombre y email estén presentes
  if (!nombre || !email) {
    abrirModal("ERROR", "Por favor, completa todos los campos requeridos");
    return;
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    abrirModal("ERROR", "Por favor, ingresa un formato de email válido");
    return;
  }

  // Obtener el ID del usuario desde la sesión (asumiendo que está disponible)
  const userId = document.querySelector('[data-user-id]')?.dataset.userId;
  if (!userId) {
    abrirModal("ERROR", "No se pudo identificar al usuario");
    return;
  }

  // Mostrar indicador de carga
  const originalText = guardarBtn.textContent;
  guardarBtn.textContent = "Guardando...";
  guardarBtn.disabled = true;

  try {
    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('nombre_usuario', nombre);
    formData.append('correo', email);
    
    if (fotoFile) {
      formData.append('foto_perfil', fotoFile);
    }

    // Enviar datos al servidor
    const response = await fetch(`/api/usuarios/${userId}/perfil`, {
      method: 'PUT',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      abrirModal(data.titulo || "ERROR", data.mensaje || "Error al actualizar el perfil");
      return;
    }

    // Actualizar la interfaz con los nuevos datos
    document.getElementById("nombreDisplay").textContent = nombre;
    document.getElementById("emailDisplay").textContent = email;
    
    // Si se actualizó la foto, actualizar la imagen
    if (data.usuario && data.usuario.foto_perfil) {
      document.getElementById("fotoPerfil").src = data.usuario.foto_perfil + '?t=' + Date.now();
    }

    // Ocultar inputs y mostrar displays
    nombreInput.classList.add("hidden");
    document.getElementById("nombreDisplay").classList.remove("hidden");
    emailInput.classList.add("hidden");
    document.getElementById("emailDisplay").classList.remove("hidden");

    // Limpiar el input de foto
    fotoInput.value = "";

    // Mostrar mensaje de éxito
    abrirModal(data.titulo, data.mensaje);

  } catch (error) {
    console.error("Error al guardar cambios:", error);
    abrirModal("ERROR", "Ocurrió un error al guardar los cambios. Inténtalo de nuevo.");
  } finally {
    // Restaurar botón
    guardarBtn.textContent = originalText;
    guardarBtn.disabled = false;
  }
}

function cambiarFoto(event) {
  const input = event.target;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    const validTypes = ["image/jpeg", "image/png", "image/gif"]; // Added gif
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!validTypes.includes(file.type)) {
      alert(
        "Por favor, selecciona un archivo de imagen válido (JPG, PNG, GIF)."
      );
      input.value = "";
      return;
    }

    if (file.size > maxSize) {
      alert("La imagen es demasiado grande. El tamaño máximo es de 2MB.");
      input.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("fotoPerfil").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

const cambiarContra = async (correo) => {
  try {
    const res = await fetch("/auth/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correo }),
    });

    const data = await res.json();

    return abrirModal(data.titulo, data.mensaje)
  } catch (err) {
    console.error(err);
    return abrirModal("EROR AL ENVIAR ENLACE", "SUCEDIO UN ERROR AL ENVIARTE EL ENLACE DE RESTABLECIMIENTO, INTENTALO MÁS TARDE")
  }
};

const btnContra = document.getElementById("cambiar-contra");
if (btnContra) {
  btnContra.addEventListener("click", () => cambiarContra(btnContra.dataset.correo));
}

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