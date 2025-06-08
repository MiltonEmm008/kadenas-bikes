import { campoNoVacio } from "../utils/validaciones.js";

export function getProveedoresHTML() {
  return `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6" data-aos="fade-down">
          <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Proveedores</h1>
          <button id="addSupplierBtn" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150">
            <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
            Agregar Proveedor
          </button>
      </div>
      
      <div class="mb-6 bg-white dark:bg-[#23272f] p-4 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" id="searchName" placeholder="Buscar por nombre o correo..." class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
              <button id="filterBtn" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                  <i data-feather="search" class="w-5 h-5 mr-2"></i>Buscar
              </button>
          </div>
      </div>

      <div class="bg-white dark:bg-[#23272f] shadow-xl rounded-lg overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
          <table class="w-full min-w-max text-left text-sm text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 dark:bg-[#1f2328] text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                      <th scope="col" class="px-6 py-3">ID</th>
                      <th scope="col" class="px-6 py-3">Nombre Empresa</th>
                      <th scope="col" class="px-6 py-3">Teléfono</th>
                      <th scope="col" class="px-6 py-3">Correo</th>
                      <th scope="col" class="px-6 py-3">Dirección</th>
                      <th scope="col" class="px-6 py-3">Productos</th>
                      <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody id="proveedores-table-body"></tbody>
          </table>
      </div>

      <!-- Modal para Agregar/Editar Proveedor -->
      <div id="supplierModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Agregar Proveedor</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="supplierForm" class="space-y-4">
                          <div>
                              <label for="supplierName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Nombre de la Empresa</label>
                              <input type="text" id="supplierName" name="nombre_empresa" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                          </div>
                          <div>
                              <label for="supplierPhone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Teléfono</label>
                              <input type="tel" id="supplierPhone" name="telefono" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                          </div>
                          <div>
                              <label for="supplierEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Correo Electrónico</label>
                              <input type="email" id="supplierEmail" name="correo" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                          </div>
                          <div>
                              <label for="supplierAddress" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Dirección</label>
                              <textarea id="supplierAddress" name="direccion" rows="2" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required></textarea>
                          </div>
                          <input type="hidden" id="supplierId">
                          <div class="items-center px-4 py-3">
                              <button type="submit" id="saveSupplierBtn" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Guardar
                              </button>
                              <button type="button" id="cancelSupplierBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                  Cancelar
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal para Enviar Correo al Proveedor -->
      <div id="emailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="emailModalTitle">Enviar Correo al Proveedor</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="emailForm" class="space-y-4">
                          <div>
                              <label for="emailSubject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Asunto</label>
                              <input type="text" id="emailSubject" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                          </div>
                          <div>
                              <label for="emailMessage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Mensaje</label>
                              <textarea id="emailMessage" rows="5" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required></textarea>
                          </div>
                          <input type="hidden" id="supplierEmail">
                          <input type="hidden" id="supplierName">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Enviar Correo
                              </button>
                              <button type="button" id="cancelEmailBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
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

export async function initProveedores() {
  const tbody = document.getElementById("proveedores-table-body");
  const addSupplierBtn = document.getElementById("addSupplierBtn");
  const supplierModal = document.getElementById("supplierModal");
  const emailModal = document.getElementById("emailModal");
  const cancelSupplierBtn = document.getElementById("cancelSupplierBtn");
  const cancelEmailBtn = document.getElementById("cancelEmailBtn");
  const supplierForm = document.getElementById("supplierForm");
  const emailForm = document.getElementById("emailForm");
  const modalTitle = document.getElementById("modalTitle");
  let editingSupplierId = null;

  const fetchSuppliers = async () => {
    try {
      const response = await fetch("/api/proveedores");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const suppliers = await response.json();
      renderSuppliers(suppliers);
    } catch (error) {
      console.error("Error al cargar los proveedores:", error);
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-500">Error al cargar los proveedores.</td></tr>`;
    }
  };

  const renderSuppliers = (suppliers) => {
    tbody.innerHTML = "";
    if (suppliers.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-gray-500 dark:text-gray-400">No hay proveedores para mostrar.</td></tr>`;
      return;
    }

    suppliers.forEach((supplier) => {
      const row = `
        <tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
          <td class="px-6 py-4">${supplier.id}</td>
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${supplier.nombre_empresa}</td>
          <td class="px-6 py-4">${supplier.telefono || 'N/A'}</td>
          <td class="px-6 py-4">${supplier.correo || 'N/A'}</td>
          <td class="px-6 py-4">${supplier.direccion || 'N/A'}</td>
          <td class="px-6 py-4">${supplier.productos_count || 0}</td>
          <td class="px-6 py-4 text-center">
            <button class="edit-btn text-blue-600 hover:underline mr-2" data-id="${supplier.id}">
              <i data-feather="edit" class="inline w-5 h-5 align-text-bottom"></i> Editar
            </button>
            <button class="message-btn text-green-600 hover:underline mr-2" data-id="${supplier.id}" data-email="${supplier.correo}" data-name="${supplier.nombre_empresa}">
              <i data-feather="mail" class="inline w-5 h-5 align-text-bottom"></i> Mensaje
            </button>
            <button class="delete-btn text-red-600 hover:underline" data-id="${supplier.id}">
              <i data-feather="trash-2" class="inline w-5 h-5 align-text-bottom"></i> Eliminar
            </button>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
    if (window.feather) window.feather.replace();
  };

  // Event Listeners
  addSupplierBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Proveedor";
    supplierForm.reset();
    editingSupplierId = null;
    supplierModal.classList.remove("hidden");
  });

  cancelSupplierBtn.addEventListener("click", () => {
    supplierModal.classList.add("hidden");
  });

  supplierForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validación
    const nombreEmpresa = document.getElementById("supplierName").value.trim();
    const telefono = document.getElementById("supplierPhone").value.trim();
    const correo = document.getElementById("supplierEmail").value.trim();
    const direccion = document.getElementById("supplierAddress").value.trim();

    let errorMsg = "";
    if (!campoNoVacio(nombreEmpresa)) errorMsg += "El nombre de la empresa es obligatorio.\n";
    if (!campoNoVacio(telefono)) errorMsg += "El teléfono es obligatorio.\n";
    if (!campoNoVacio(correo)) errorMsg += "El correo electrónico es obligatorio.\n";
    if (!campoNoVacio(direccion)) errorMsg += "La dirección es obligatoria.\n";

    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    const formData = new FormData(supplierForm);
    const supplierData = Object.fromEntries(formData.entries());

    let url = "/api/proveedores";
    let method = "POST";

    if (editingSupplierId) {
      url = `/api/proveedores/${editingSupplierId}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplierData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      supplierModal.classList.add("hidden");
      await fetchSuppliers();
      alert(`Proveedor ${editingSupplierId ? "actualizado" : "agregado"} exitosamente.`);
    } catch (error) {
      console.error(`Error al ${editingSupplierId ? "actualizar" : "agregar"} proveedor:`, error);
      alert(`Hubo un error al ${editingSupplierId ? "actualizar" : "agregar"} el proveedor. Revisa la consola.`);
    }
  });

  // Delegación de eventos para editar, mensaje y eliminar
  tbody.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const id = target.dataset.id;
    
    if (target.classList.contains("edit-btn")) {
      editingSupplierId = id;
      modalTitle.textContent = "Editar Proveedor";
      
      try {
        const response = await fetch(`/api/proveedores/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const supplier = await response.json();
        
        document.getElementById("supplierName").value = supplier.nombre_empresa;
        document.getElementById("supplierPhone").value = supplier.telefono || "";
        document.getElementById("supplierEmail").value = supplier.correo || "";
        document.getElementById("supplierAddress").value = supplier.direccion || "";
        
        supplierModal.classList.remove("hidden");
      } catch (error) {
        console.error("Error al cargar datos del proveedor:", error);
        alert("No se pudieron cargar los datos del proveedor para editar.");
      }
    } 
    else if (target.classList.contains("message-btn")) {
      const email = target.dataset.email;
      const name = target.dataset.name;
      if (email) {
        document.getElementById("supplierEmail").value = email;
        document.getElementById("supplierName").value = name;
        document.getElementById("emailModalTitle").textContent = `Enviar Correo a ${name}`;
        emailModal.classList.remove("hidden");
      } else {
        alert("No hay correo electrónico disponible para este proveedor.");
      }
    }
    else if (target.classList.contains("delete-btn")) {
      if (confirm(`¿Estás seguro de que quieres eliminar el proveedor con ID ${id}?`)) {
        try {
          const response = await fetch(`/api/proveedores/${id}`, {
            method: "DELETE"
          });
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          await fetchSuppliers();
          alert("Proveedor eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar proveedor:", error);
          alert("Hubo un error al eliminar el proveedor. Revisa la consola.");
        }
      }
    }
  });

  // Manejo del formulario de correo
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("emailSubject").value.trim();
    const message = document.getElementById("emailMessage").value.trim();
    const email = document.getElementById("supplierEmail").value;
    const name = document.getElementById("supplierName").value;

    if (!campoNoVacio(subject) || !campoNoVacio(message)) {
      alert("Por favor completa todos los campos del correo.");
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
        alert("Correo enviado correctamente");
        emailForm.reset();
        emailModal.classList.add("hidden");
      } else {
        throw new Error("Error al enviar el correo");
      }
    } catch (error) {
      console.error("Error al enviar correo:", error);
      alert("Error al enviar el correo. Por favor intenta de nuevo.");
    }
  });

  cancelEmailBtn.addEventListener("click", () => {
    emailModal.classList.add("hidden");
    emailForm.reset();
  });

  // Búsqueda y filtrado
  const searchNameInput = document.getElementById("searchName");
  const filterBtn = document.getElementById("filterBtn");
  let allSuppliersData = [];

  const fetchAndStoreAllSuppliers = async () => {
    try {
      const response = await fetch("/api/proveedores");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      allSuppliersData = await response.json();
      renderSuppliers(allSuppliersData);
    } catch (error) {
      console.error("Error al cargar todos los proveedores para filtrar:", error);
      tbody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-red-500">Error al cargar los proveedores para el filtro.</td></tr>`;
    }
  };

  const applyFilters = () => {
    const searchTerm = searchNameInput.value.trim().toLowerCase();
    const filteredSuppliers = allSuppliersData.filter((supplier) => {
      const matchesId = String(supplier.id).includes(searchTerm);
      const matchesName = supplier.nombre_empresa.toLowerCase().includes(searchTerm);
      const matchesEmail = supplier.correo && supplier.correo.toLowerCase().includes(searchTerm);
      
      return !searchTerm || matchesId || matchesName || matchesEmail;
    });
    renderSuppliers(filteredSuppliers);
  };

  filterBtn.addEventListener("click", applyFilters);
  searchNameInput.addEventListener("input", () => {
    if (searchNameInput.value.trim() === "") {
      renderSuppliers(allSuppliersData);
    }
  });

  // Inicialización
  await fetchAndStoreAllSuppliers();
} 