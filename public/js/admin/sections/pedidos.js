export function getPedidosHTML() {
  return `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6" data-aos="fade-down">
          <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Pedidos</h1>
      </div>
      
      <div class="mb-6 bg-white dark:bg-[#23272f] p-4 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input type="text" id="searchOrder" placeholder="Buscar por ID, nombre o email..." class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
              <select id="filterStatus" class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
                  <option value="">Todos los estados</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="enviado">Enviado</option>
                  <option value="finalizado">Finalizado</option>
                  <option value="cancelado">Cancelado</option>
                  <option value="devuelto">Devuelto</option>
              </select>
              <button id="filterBtn" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                  <i data-feather="search" class="w-5 h-5 mr-2"></i>Filtrar
              </button>
          </div>
      </div>

      <div class="bg-white dark:bg-[#23272f] shadow-xl rounded-lg overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
          <table class="w-full min-w-max text-left text-sm text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 dark:bg-[#1f2328] text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                      <th scope="col" class="px-6 py-3">ID</th>
                      <th scope="col" class="px-6 py-3">Usuario</th>
                      <th scope="col" class="px-6 py-3">Datos Comprador</th>
                      <th scope="col" class="px-6 py-3">Estado</th>
                      <th scope="col" class="px-6 py-3">Total</th>
                      <th scope="col" class="px-6 py-3">Dirección</th>
                      <th scope="col" class="px-6 py-3">Tipo Envío</th>
                      <th scope="col" class="px-6 py-3">Productos</th>
                      <th scope="col" class="px-6 py-3">Fecha</th>
                      <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody id="pedidos-table-body"></tbody>
          </table>
      </div>

      <!-- Modal para Ver Detalles del Pedido -->
      <div id="orderDetailsModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4" id="modalTitle">Detalles del Pedido</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Datos del Comprador</h4>
                          <div id="buyerDetails" class="space-y-2 text-sm"></div>
                      </div>
                      <div>
                          <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Dirección de Envío</h4>
                          <div id="shippingDetails" class="space-y-2 text-sm"></div>
                      </div>
                  </div>
                  <div class="mb-4">
                      <h4 class="font-semibold text-gray-700 dark:text-gray-300 mb-2">Productos</h4>
                      <div id="orderItems" class="space-y-2"></div>
                  </div>
                  <div class="flex justify-end space-x-3">
                      <button type="button" id="closeDetailsBtn" class="px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                          Cerrar
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal para Enviar Mensaje -->
      <div id="messageModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="messageModalTitle">Enviar Mensaje al Cliente</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="messageForm" class="space-y-4">
                          <div>
                              <label for="messageSubject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Asunto</label>
                              <input type="text" id="messageSubject" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                          </div>
                          <div>
                              <label for="messageContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Mensaje</label>
                              <textarea id="messageContent" rows="5" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required></textarea>
                          </div>
                          <input type="hidden" id="customerEmail">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Enviar Mensaje
                              </button>
                              <button type="button" id="cancelMessageBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                  Cancelar
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal para Cambiar Estado -->
      <div id="statusModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Cambiar Estado del Pedido</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="statusForm" class="space-y-4">
                          <div>
                              <label for="orderStatus" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Estado</label>
                              <select id="orderStatus" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                                  <option value="pendiente">Pendiente</option>
                                  <option value="enviado">Enviado</option>
                                  <option value="finalizado">Finalizado</option>
                                  <option value="cancelado">Cancelado</option>
                                  <option value="devuelto">Devuelto</option>
                              </select>
                          </div>
                          <input type="hidden" id="orderId">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Actualizar Estado
                              </button>
                              <button type="button" id="cancelStatusBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                  Cancelar
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
    </div>
  `;
}

export async function initPedidos() {
  const tbody = document.getElementById("pedidos-table-body");
  const searchOrderInput = document.getElementById("searchOrder");
  const filterStatusSelect = document.getElementById("filterStatus");
  const filterBtn = document.getElementById("filterBtn");
  const orderDetailsModal = document.getElementById("orderDetailsModal");
  const messageModal = document.getElementById("messageModal");
  const statusModal = document.getElementById("statusModal");
  const closeDetailsBtn = document.getElementById("closeDetailsBtn");
  const cancelMessageBtn = document.getElementById("cancelMessageBtn");
  const cancelStatusBtn = document.getElementById("cancelStatusBtn");
  const messageForm = document.getElementById("messageForm");
  const statusForm = document.getElementById("statusForm");
  let allPedidosData = [];

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/pedidos");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allPedidosData = await response.json();
      renderPedidos(allPedidosData);
    } catch (error) {
      console.error("Error al cargar los pedidos:", error);
      tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-red-500">Error al cargar los pedidos.</td></tr>`;
    }
  };

  const getStatusClass = (status) => {
    const classes = {
      pendiente: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      enviado: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      finalizado: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      cancelado: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      devuelto: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
    };
    return classes[status] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  const getStatusLabel = (status) => {
    const labels = {
      pendiente: "Pendiente",
      enviado: "Enviado",
      finalizado: "Finalizado",
      cancelado: "Cancelado",
      devuelto: "Devuelto"
    };
    return labels[status] || status;
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const renderPedidos = (pedidos) => {
    tbody.innerHTML = "";
    if (pedidos.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="text-center py-4 text-gray-500 dark:text-gray-400">No hay pedidos para mostrar.</td></tr>`;
      return;
    }

    pedidos.forEach((pedido) => {
      const datosComprador = pedido.datos_comprador || {};
      const direccionEnvio = pedido.direccion_envio || {};
      const statusClass = getStatusClass(pedido.estado);
      
      // Determinar qué botones mostrar según el estado
      const mostrarBotonEstado = !['cancelado', 'devuelto'].includes(pedido.estado);
      const mostrarBotonCancelar = !['cancelado', 'devuelto', 'en_devolucion', 'finalizado'].includes(pedido.estado);
      
      const row = `
        <tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
          <td class="px-6 py-4">${pedido.id}</td>
          <td class="px-6 py-4">
            ${pedido.usuario_nombre || 'N/A'}<br>
            <span class="text-xs text-gray-500">${pedido.usuario_email || 'N/A'}</span>
          </td>
          <td class="px-6 py-4">
            <button class="view-details-btn text-blue-600 hover:underline" data-id="${pedido.id}">
              Ver detalles
            </button>
          </td>
          <td class="px-6 py-4">
            <span class="px-2 py-1 rounded-full text-xs font-semibold ${statusClass}">
              ${getStatusLabel(pedido.estado)}
            </span>
          </td>
          <td class="px-6 py-4">$${pedido.total.toFixed(2)}</td>
          <td class="px-6 py-4">
            ${direccionEnvio.calle || 'N/A'}, ${direccionEnvio.colonia || 'N/A'}<br>
            <span class="text-xs text-gray-500">${direccionEnvio.ciudad || 'N/A'}, ${direccionEnvio.cp || 'N/A'}</span>
          </td>
          <td class="px-6 py-4 capitalize">${pedido.tipo_envio || 'N/A'}</td>
          <td class="px-6 py-4">
            <button class="view-items-btn text-blue-600 hover:underline" data-id="${pedido.id}">
              Ver ${pedido.items?.length || 0} productos
            </button>
          </td>
          <td class="px-6 py-4">${formatDate(pedido.creado_en)}</td>
          <td class="px-6 py-4 text-center space-x-2">
            ${mostrarBotonEstado ? `
              <button class="status-btn text-blue-600 hover:underline" data-id="${pedido.id}">
                <i data-feather="edit" class="inline w-5 h-5 align-text-bottom"></i> Estado
              </button>
            ` : ''}
            <button class="message-btn text-green-600 hover:underline" data-id="${pedido.id}" data-email="${datosComprador.email}">
              <i data-feather="mail" class="inline w-5 h-5 align-text-bottom"></i> Mensaje
            </button>
            ${mostrarBotonCancelar ? `
              <button class="delete-btn text-red-600 hover:underline" data-id="${pedido.id}">
                <i data-feather="trash-2" class="inline w-5 h-5 align-text-bottom"></i> Cancelar
              </button>
            ` : ''}
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
    if (window.feather) window.feather.replace();
  };

  const showOrderDetails = (pedido) => {
    const datosComprador = pedido.datos_comprador || {};
    const direccionEnvio = pedido.direccion_envio || {};
    
    // Renderizar datos del comprador
    document.getElementById("buyerDetails").innerHTML = `
      <p><span class="font-medium">Nombre:</span> ${datosComprador.nombre || 'N/A'}</p>
      <p><span class="font-medium">Teléfono:</span> ${datosComprador.telefono || 'N/A'}</p>
      <p><span class="font-medium">Email:</span> ${datosComprador.email || 'N/A'}</p>
    `;

    // Renderizar dirección de envío
    document.getElementById("shippingDetails").innerHTML = `
      <p><span class="font-medium">Calle:</span> ${direccionEnvio.calle || 'N/A'}</p>
      <p><span class="font-medium">Colonia:</span> ${direccionEnvio.colonia || 'N/A'}</p>
      <p><span class="font-medium">Ciudad:</span> ${direccionEnvio.ciudad || 'N/A'}</p>
      <p><span class="font-medium">CP:</span> ${direccionEnvio.cp || 'N/A'}</p>
      <p><span class="font-medium">Referencias:</span> ${direccionEnvio.referencias || 'N/A'}</p>
    `;

    // Renderizar productos
    const orderItems = document.getElementById("orderItems");
    orderItems.innerHTML = "";
    if (pedido.items && Array.isArray(pedido.items)) {
      pedido.items.forEach(item => {
        const itemElement = document.createElement("div");
        itemElement.className = "flex items-center space-x-4 p-2 bg-gray-50 dark:bg-[#1f2328] rounded";
        itemElement.innerHTML = `
          <img src="${item.foto_producto}" alt="${item.nombre}" class="w-12 h-12 object-cover rounded">
          <div class="flex-1">
            <h5 class="font-medium">${item.nombre}</h5>
            <p class="text-sm text-gray-500">Cantidad: ${item.cantidad}</p>
            <p class="text-sm text-gray-500">Precio: $${!item.descuento_porcentaje ? item.precio.toFixed(2) : (item.precio - (item.precio * item.descuento_porcentaje / 100)).toFixed(2)}</p>
            ${item.descuento_porcentaje ? `<p class="text-sm text-green-500">Descuento: ${item.descuento_porcentaje}%</p>` : ''}
          </div>
        `;
        orderItems.appendChild(itemElement);
      });
    }

    orderDetailsModal.classList.remove("hidden");
  };

  // Event Listeners
  tbody.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const id = target.dataset.id;
    const pedido = allPedidosData.find(p => String(p.id) === String(id));
    if (!pedido) return;

    if (target.classList.contains("view-details-btn") || target.classList.contains("view-items-btn")) {
      showOrderDetails(pedido);
    }
    else if (target.classList.contains("status-btn")) {
      document.getElementById("orderId").value = id;
      const statusSelect = document.getElementById("orderStatus");
      
      // Limpiar opciones actuales
      statusSelect.innerHTML = '';
      
      // Determinar qué opciones mostrar según el estado actual
      if (pedido.estado === 'pendiente') {
        // Si está pendiente, solo permite cambiar a enviado o cancelado
        statusSelect.innerHTML = `
          <option value="pendiente" selected>Pendiente</option>
          <option value="enviado">Enviado</option>
          <option value="cancelado">Cancelado</option>
        `;
      } else if (pedido.estado === 'enviado') {
        // Si está enviado, solo permite cambiar a finalizado o cancelado
        statusSelect.innerHTML = `
          <option value="enviado" selected>Enviado</option>
          <option value="finalizado">Finalizado</option>
          <option value="cancelado">Cancelado</option>
        `;
      } else if (pedido.estado === 'finalizado') {
        // Si está finalizado, solo permite cambiar a devuelto
        statusSelect.innerHTML = `
          <option value="finalizado" selected>Finalizado</option>
          <option value="devuelto">Devuelto</option>
        `;
      } else if (pedido.estado === 'en_devolucion') {
        // Si está en devolución, solo permite cambiar a devuelto o finalizado
        statusSelect.innerHTML = `
          <option value="en_devolucion" selected>En Devolución</option>
          <option value="devuelto">Devuelto</option>
          <option value="finalizado">Finalizado</option>
        `;
      } else if (pedido.estado === 'devuelto') {
        // Si está devuelto, no permite cambios
        statusSelect.innerHTML = `
          <option value="devuelto" selected>Devuelto</option>
        `;
        statusSelect.disabled = true;
      } else if (pedido.estado === 'cancelado') {
        // Si está cancelado, no permite cambios
        statusSelect.innerHTML = `
          <option value="cancelado" selected>Cancelado</option>
        `;
        statusSelect.disabled = true;
      }
      
      statusModal.classList.remove("hidden");
    }
    else if (target.classList.contains("message-btn")) {
      const email = target.dataset.email;
      if (email) {
        document.getElementById("customerEmail").value = email;
        document.getElementById("messageModalTitle").textContent = `Enviar Mensaje a ${pedido.datos_comprador?.nombre || 'Cliente'}`;
        messageModal.classList.remove("hidden");
      } else {
        alert("No hay correo electrónico disponible para este cliente.");
      }
    }
    else if (target.classList.contains("delete-btn")) {
      if (confirm(`¿Estás seguro de que quieres cancelar el pedido #${id}?`)) {
        try {
          const response = await fetch(`/api/cancelar-pedido/${id}`, {
            method: "PATCH"
          });
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          await fetchPedidos();
          alert("Pedido cancelado exitosamente.");
        } catch (error) {
          console.error("Error al cancelar pedido:", error);
          alert("Hubo un error al cancelar el pedido. Revisa la consola.");
        }
      }
    }
  });

  // Form Submissions
  messageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("messageSubject").value.trim();
    const message = document.getElementById("messageContent").value.trim();
    const email = document.getElementById("customerEmail").value;

    if (!subject || !message) {
      alert("Por favor completa todos los campos del mensaje.");
      return;
    }

    try {
      const response = await fetch("/api/enviar-mensaje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_contacto: "KADENAS BIKES",
          mensaje_contacto: `Asunto: ${subject}\n\nMensaje:\n${message}`,
          destinatario: email
        }),
      });

      if (response.ok) {
        alert("Mensaje enviado correctamente");
        messageForm.reset();
        messageModal.classList.add("hidden");
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje. Por favor intenta de nuevo.");
    }
  });

  statusForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const id = document.getElementById("orderId").value;
    const estado = document.getElementById("orderStatus").value;

    try {
      const response = await fetch(`/api/pedidos/${id}/estado`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al actualizar estado");
      }

      const result = await response.json();
      await fetchPedidos();
      statusModal.classList.add("hidden");
      alert(`Estado del pedido actualizado a ${getStatusLabel(estado)}`);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      alert(error.message || "Error al actualizar el estado del pedido");
    }
  });

  // Modal Close Buttons
  closeDetailsBtn.addEventListener("click", () => {
    orderDetailsModal.classList.add("hidden");
  });

  cancelMessageBtn.addEventListener("click", () => {
    messageModal.classList.add("hidden");
    messageForm.reset();
  });

  cancelStatusBtn.addEventListener("click", () => {
    statusModal.classList.add("hidden");
  });

  // Filtros
  const applyFilters = () => {
    const searchTerm = searchOrderInput.value.trim().toLowerCase();
    const selectedStatus = filterStatusSelect.value;

    const filteredPedidos = allPedidosData.filter((pedido) => {
      const matchesId = String(pedido.id).includes(searchTerm);
      const matchesName = (pedido.datos_comprador?.nombre || "").toLowerCase().includes(searchTerm);
      const matchesEmail = (pedido.datos_comprador?.email || "").toLowerCase().includes(searchTerm);
      const matchesStatus = !selectedStatus || pedido.estado === selectedStatus;
      
      return (!searchTerm || matchesId || matchesName || matchesEmail) && matchesStatus;
    });

    renderPedidos(filteredPedidos);
  };

  filterBtn.addEventListener("click", applyFilters);
  searchOrderInput.addEventListener("input", () => {
    if (searchOrderInput.value.trim() === "") {
      renderPedidos(allPedidosData);
    }
  });

  // Inicialización
  await fetchPedidos();
}
