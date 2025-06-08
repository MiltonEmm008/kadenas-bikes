document.addEventListener("DOMContentLoaded", function () {
  AOS.init({ duration: 1000 });
  feather.replace();

  // Validación de campos
  const validarTelefono = (telefono) => {
    return /^\d{10}$/.test(telefono);
  };

  const validarEmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const validarCP = (cp) => {
    return /^\d{5}$/.test(cp);
  };

  const validarNombre = (nombre) => {
    return nombre.trim().length >= 3 && /^[a-zA-ZÀ-ÿ\s]+$/.test(nombre);
  };

  const validarDireccion = (direccion) => {
    return direccion.trim().length >= 5;
  };

  const validarColonia = (colonia) => {
    return colonia.trim().length >= 3;
  };

  const validarCiudad = (ciudad) => {
    return ciudad.trim().length >= 3;
  };

  const mostrarError = (campo, mensaje) => {
    const errorElement = document.getElementById(`${campo}-error`);
    if (errorElement) {
      errorElement.textContent = mensaje;
      errorElement.classList.remove('hidden');
    }
  };

  const ocultarError = (campo) => {
    const errorElement = document.getElementById(`${campo}-error`);
    if (errorElement) {
      errorElement.classList.add('hidden');
    }
  };

  // Event listeners para validación en tiempo real
  document.getElementById('nombre')?.addEventListener('input', function() {
    if (!validarNombre(this.value)) {
      mostrarError('nombre', 'El nombre debe contener solo letras y espacios, mínimo 3 caracteres');
    } else {
      ocultarError('nombre');
    }
  });

  document.getElementById('telefono')?.addEventListener('input', function() {
    if (!validarTelefono(this.value)) {
      mostrarError('telefono', 'Ingresa un número de teléfono válido de 10 dígitos');
    } else {
      ocultarError('telefono');
    }
  });

  document.getElementById('email')?.addEventListener('input', function() {
    if (!validarEmail(this.value)) {
      mostrarError('email', 'Ingresa un email válido');
    } else {
      ocultarError('email');
    }
  });

  document.getElementById('calle')?.addEventListener('input', function() {
    if (!validarDireccion(this.value)) {
      mostrarError('calle', 'La dirección debe tener al menos 5 caracteres');
    } else {
      ocultarError('calle');
    }
  });

  document.getElementById('colonia')?.addEventListener('input', function() {
    if (!validarColonia(this.value)) {
      mostrarError('colonia', 'La colonia debe tener al menos 3 caracteres');
    } else {
      ocultarError('colonia');
    }
  });

  document.getElementById('ciudad')?.addEventListener('input', function() {
    if (!validarCiudad(this.value)) {
      mostrarError('ciudad', 'La ciudad debe tener al menos 3 caracteres');
    } else {
      ocultarError('ciudad');
    }
  });

  document.getElementById('cp')?.addEventListener('input', function() {
    if (!validarCP(this.value)) {
      mostrarError('cp', 'Ingresa un código postal válido de 5 dígitos');
    } else {
      ocultarError('cp');
    }
  });

  // MODAL PEDIDO
  const modal = document.getElementById("modal-pedido");
  const btnAbrir = document.getElementById("btn-proceder-pedido");
  const btnCerrar = document.getElementById("cerrar-modal-pedido");
  const form = document.getElementById("form-pedido");

  // Secciones
  const sectionPersonal = document.getElementById("section-personal");
  const sectionDireccion = document.getElementById("section-direccion");
  const sectionEntrega = document.getElementById("section-entrega");

  // Botones navegación
  const btnSiguientePersonal = document.getElementById("siguiente-personal");
  const btnAnteriorDireccion = document.getElementById("anterior-direccion");
  const btnSiguienteDireccion = document.getElementById("siguiente-direccion");
  const btnAnteriorEntrega = document.getElementById("anterior-entrega");

  // Mostrar modal
  if (btnAbrir) {
    btnAbrir.addEventListener("click", () => {
      modal.classList.remove("hidden");
      sectionPersonal.classList.remove("hidden");
      sectionDireccion.classList.add("hidden");
      sectionEntrega.classList.add("hidden");
    });
  }

  // Cerrar modal
  if (btnCerrar) {
    btnCerrar.addEventListener("click", () => {
      modal.classList.add("hidden");
      form.reset();
      // Limpiar mensajes de error
      ['nombre', 'telefono', 'email', 'calle', 'colonia', 'ciudad', 'cp'].forEach(ocultarError);
    });
  }

  // Navegación secciones
  if (btnSiguientePersonal) {
    btnSiguientePersonal.addEventListener("click", () => {
      const nombre = document.getElementById('nombre')?.value;
      const telefono = document.getElementById('telefono')?.value;
      const email = document.getElementById('email')?.value;

      let hayErrores = false;
      if (!validarNombre(nombre)) {
        mostrarError('nombre', 'El nombre debe contener solo letras y espacios, mínimo 3 caracteres');
        hayErrores = true;
      }
      if (!validarTelefono(telefono)) {
        mostrarError('telefono', 'Ingresa un número de teléfono válido de 10 dígitos');
        hayErrores = true;
      }
      if (!validarEmail(email)) {
        mostrarError('email', 'Ingresa un email válido');
        hayErrores = true;
      }

      if (hayErrores) {
        abrirModal('Error de Validación', 'Por favor, corrige los errores en los datos personales antes de continuar.');
        return;
      }

      sectionPersonal.classList.add("hidden");
      sectionDireccion.classList.remove("hidden");
    });
  }

  if (btnAnteriorDireccion) {
    btnAnteriorDireccion.addEventListener("click", () => {
      sectionDireccion.classList.add("hidden");
      sectionPersonal.classList.remove("hidden");
    });
  }

  if (btnSiguienteDireccion) {
    btnSiguienteDireccion.addEventListener("click", () => {
      const calle = document.getElementById('calle')?.value;
      const colonia = document.getElementById('colonia')?.value;
      const ciudad = document.getElementById('ciudad')?.value;
      const cp = document.getElementById('cp')?.value;

      let hayErrores = false;
      if (!validarDireccion(calle)) {
        mostrarError('calle', 'La dirección debe tener al menos 5 caracteres');
        hayErrores = true;
      }
      if (!validarColonia(colonia)) {
        mostrarError('colonia', 'La colonia debe tener al menos 3 caracteres');
        hayErrores = true;
      }
      if (!validarCiudad(ciudad)) {
        mostrarError('ciudad', 'La ciudad debe tener al menos 3 caracteres');
        hayErrores = true;
      }
      if (!validarCP(cp)) {
        mostrarError('cp', 'Ingresa un código postal válido de 5 dígitos');
        hayErrores = true;
      }

      if (hayErrores) {
        abrirModal('Error de Validación', 'Por favor, corrige los errores en la dirección antes de continuar.');
        return;
      }

      sectionDireccion.classList.add("hidden");
      sectionEntrega.classList.remove("hidden");
    });
  }

  if (btnAnteriorEntrega) {
    btnAnteriorEntrega.addEventListener("click", () => {
      sectionEntrega.classList.add("hidden");
      sectionDireccion.classList.remove("hidden");
    });
  }

  // ---- Calcular y mostrar total con envío en el modal ----
  const totalSinEnvio = parseFloat(
    document.getElementById("total")?.innerText.replace("$", "") || 0
  );
  const totalConEnvioModal = document.getElementById("total-con-envio-modal");
  const tipoEntregaRadios = document.getElementsByName("tipoEntrega");
  let costoEnvio = 100; // Por defecto Estandar

  function actualizarTotalConEnvio() {
    const tipo = Array.from(tipoEntregaRadios).find((r) => r.checked)?.value;
    costoEnvio = tipo === "Express" ? 350 : 100;
    if (totalConEnvioModal) {
      totalConEnvioModal.innerText = `$${(totalSinEnvio + costoEnvio).toFixed(2)}`;
    }
  }

  tipoEntregaRadios.forEach((radio) => {
    radio.addEventListener("change", actualizarTotalConEnvio);
  });

  // Inicializar al abrir modal
  if (btnAbrir) {
    btnAbrir.addEventListener("click", actualizarTotalConEnvio);
  }

  // ---- Enviar formulario ----
  const finalizarPedidoBtn = document.getElementById('finalizar-pedido');
  
  if (finalizarPedidoBtn) {
    finalizarPedidoBtn.addEventListener('click', async function(e) {
      e.preventDefault();
      
      const nombre = document.getElementById('nombre')?.value;
      const telefono = document.getElementById('telefono')?.value;
      const email = document.getElementById('email')?.value;
      const calle = document.getElementById('calle')?.value;
      const colonia = document.getElementById('colonia')?.value;
      const ciudad = document.getElementById('ciudad')?.value;
      const cp = document.getElementById('cp')?.value;

      let hayErrores = false;

      if (!validarNombre(nombre)) {
        mostrarError('nombre', 'El nombre debe contener solo letras y espacios, mínimo 3 caracteres');
        hayErrores = true;
      }
      if (!validarTelefono(telefono)) {
        mostrarError('telefono', 'Ingresa un número de teléfono válido de 10 dígitos');
        hayErrores = true;
      }
      if (!validarEmail(email)) {
        mostrarError('email', 'Ingresa un email válido');
        hayErrores = true;
      }
      if (!validarDireccion(calle)) {
        mostrarError('calle', 'La dirección debe tener al menos 5 caracteres');
        hayErrores = true;
      }
      if (!validarColonia(colonia)) {
        mostrarError('colonia', 'La colonia debe tener al menos 3 caracteres');
        hayErrores = true;
      }
      if (!validarCiudad(ciudad)) {
        mostrarError('ciudad', 'La ciudad debe tener al menos 3 caracteres');
        hayErrores = true;
      }
      if (!validarCP(cp)) {
        mostrarError('cp', 'Ingresa un código postal válido de 5 dígitos');
        hayErrores = true;
      }

      if (hayErrores) {
        abrirModal('Error de Validación', 'Por favor, corrige los errores en el formulario antes de continuar.');
        return;
      }

      // Deshabilitar el botón para evitar doble envío
      finalizarPedidoBtn.disabled = true;
      finalizarPedidoBtn.textContent = 'Procesando...';

      try {
        // Guardar datos de las dos primeras secciones en objeto
        const datosPersonales = {
          nombre: form.nombre.value,
          telefono: form.telefono.value,
          email: form.email.value,
        };
        const direccionEnvio = {
          calle: form.calle.value,
          colonia: form.colonia.value,
          ciudad: form.ciudad.value,
          cp: form.cp.value,
          referencias: form.referencias.value,
        };
        const tipoEntrega = form.tipoEntrega.value;
        const instrucciones = form.instrucciones.value;

        const res = await fetch("/api/crear-pedido", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            datosPersonales: JSON.stringify(datosPersonales),
            direccionEnvio: JSON.stringify(direccionEnvio),
            tipoEntrega,
            instrucciones,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          // Limpiar el formulario y cerrar el modal
          form.reset();
          modal.classList.add("hidden");
          
          // Limpiar mensajes de error
          ['nombre', 'telefono', 'email', 'calle', 'colonia', 'ciudad', 'cp'].forEach(ocultarError);
          
          // Mostrar mensaje de éxito
          abrirModal(data.title, data.message);
          
          // Limpiar el carrito en el frontend
          const cartContainer = document.getElementById('cart-container');
          if (cartContainer) {
            cartContainer.innerHTML = `
              <div class="text-center py-16 text-gray-400">
                <h2 class="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-4">
                  Tu carrito está vacío
                </h2>
                <p>¡Agrega algunos productos increíbles!</p>
              </div>
            `;
          }

          // Actualizar los totales
          const subtotalElement = document.getElementById('subtotal');
          const taxesElement = document.getElementById('taxes');
          const totalElement = document.getElementById('total');
          if (subtotalElement) subtotalElement.textContent = '$0.00';
          if (taxesElement) taxesElement.textContent = '$0.00';
          if (totalElement) totalElement.textContent = '$0.00';

          // Ocultar el botón de proceder al pedido
          const btnProceder = document.getElementById('btn-proceder-pedido');
          if (btnProceder) btnProceder.style.display = 'none';

          // Redirigir después de un breve delay
          setTimeout(() => {
            window.location.href = "/mis-pedidos";
          }, 2000);
        } else {
          // Mostrar el error y mantener el modal abierto
          abrirModal(data.title || "Error", data.message || "Error al procesar el pedido");
          // Volver a habilitar el botón
          finalizarPedidoBtn.disabled = false;
          finalizarPedidoBtn.textContent = 'Finalizar Pedido';
        }
      } catch (err) {
        console.error("Error al procesar el pedido:", err);
        abrirModal("Error", "Error al procesar el pedido. Por favor, intenta de nuevo.");
        // Volver a habilitar el botón
        finalizarPedidoBtn.disabled = false;
        finalizarPedidoBtn.textContent = 'Finalizar Pedido';
      }
    });
  }

  // Remover el event listener del submit del formulario ya que ahora usamos el botón
  form.removeEventListener("submit", () => {});

  // Manejo de botones del carrito
  document.addEventListener('click', async function(e) {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const productId = button.dataset.productId;

    if (!productId) return;

    try {
      let endpoint;
      switch (action) {
        case 'increase':
          endpoint = `/api/carrito/incrementar/${productId}`;
          break;
        case 'decrease':
          endpoint = `/api/carrito/decrementar/${productId}`;
          break;
        case 'remove':
          endpoint = `/api/carrito/${productId}`;
          break;
        default:
          return;
      }

      const method = action === 'remove' ? 'DELETE' : 'PATCH';
      const response = await fetch(endpoint, { method });
      
      if (response.ok) {
        location.reload();
      } else {
        throw new Error(`Error al ${action === 'remove' ? 'eliminar' : 'actualizar'} el producto`);
      }
    } catch (error) {
      console.error(`Error al ${action === 'remove' ? 'eliminar' : 'actualizar'} el producto:`, error);
      abrirModal('Error', `Error al ${action === 'remove' ? 'eliminar' : 'actualizar'} el producto del carrito`);
    }
  });
});

// MENU HAMBURGUESA RESPONSIVE
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

perfil_toggle?.addEventListener("click", function (e) {
  e.preventDefault();
  if (menu.classList.contains("hidden")) {
    menu_perfil.classList.toggle("hidden");
  } else {
    menu.classList.add("hidden");
    menu_perfil.classList.remove("hidden");
  }
});

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle?.addEventListener("click", function () {
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

// Cerrar modal al hacer clic en el botón de cerrar
const modalClose = document.getElementById("modalClose");
if (modalClose) {
  modalClose.addEventListener("click", cerrarModal);
}

// OCULTA EL MENU AL HACER CLICK EN UN ENLACE EN PANTALLAS PEQUENAS
const menuLinks = menu?.querySelectorAll("a");
menuLinks?.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      menu.classList.add("hidden");
    }
  });
});

