import { campoNoVacio } from "../utils/validaciones.js";

export function getAdministradoresHTML() {
  return `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6" data-aos="fade-down">
          <h1 class="text-2xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Administradores</h1>
          <button id="addAdminBtn" class="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold py-1.5 px-3 rounded-lg shadow-md flex items-center transition duration-150">
            <i data-feather="plus-circle" class="w-4 h-4 mr-1.5"></i>
            Agregar Administrador
          </button>
      </div>
      
      <div class="mb-6 bg-white dark:bg-[#23272f] p-4 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" id="searchUser" placeholder="Buscar por nombre o correo..." 
                class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500"
                autocomplete="off">
              <button id="filterBtn" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                  <i data-feather="search" class="w-5 h-5 mr-2"></i>Buscar
              </button>
          </div>
      </div>

      <div class="bg-white dark:bg-[#23272f] shadow-xl rounded-lg overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
          <div class="min-w-full inline-block align-middle">
              <div class="overflow-x-auto">
                  <table class="w-full min-w-max text-left text-sm text-gray-700 dark:text-gray-300">
                      <thead class="bg-gray-50 dark:bg-[#1f2328] text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                          <tr>
                              <th scope="col" class="px-4 sm:px-6 py-3 w-16">ID</th>
                              <th scope="col" class="px-4 sm:px-6 py-3">Nombre</th>
                              <th scope="col" class="px-4 sm:px-6 py-3">Correo</th>
                              <th scope="col" class="px-4 sm:px-6 py-3">Saldo</th>
                              <th scope="col" class="px-4 sm:px-6 py-3">Fecha Registro</th>
                              <th scope="col" class="px-4 sm:px-6 py-3 text-center">Acciones</th>
                          </tr>
                      </thead>
                      <tbody id="usuarios-table-body"></tbody>
                  </table>
              </div>
          </div>
      </div>

      <!-- Modal para Agregar Saldo -->
      <div id="saldoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 sm:w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Agregar Saldo</h3>
                  <div class="mt-2 px-4 sm:px-7 py-3">
                      <form id="saldoForm" class="space-y-4">
                          <div>
                              <label for="saldoAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Cantidad a Agregar</label>
                              <input type="number" id="saldoAmount" min="0" max="100000" step="0.01" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="off">
                          </div>
                          <input type="hidden" id="userId">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Agregar Saldo
                              </button>
                              <button type="button" id="cancelSaldoBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                  Cancelar
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>

      <!-- Modal para Enviar Mensaje -->
      <div id="emailModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 sm:w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="emailModalTitle">Enviar Mensaje al Administrador</h3>
                  <div class="mt-2 px-4 sm:px-7 py-3">
                      <form id="emailForm" class="space-y-4">
                          <div>
                              <label for="emailSubject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Asunto</label>
                              <input type="text" id="emailSubject" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="off">
                          </div>
                          <div>
                              <label for="emailMessage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Mensaje</label>
                              <textarea id="emailMessage" rows="5" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="off"></textarea>
                          </div>
                          <input type="hidden" id="userEmail">
                          <input type="hidden" id="userName">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Enviar Mensaje
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

      <!-- Modal para Agregar/Editar Administrador -->
      <div id="adminModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-11/12 sm:w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Agregar Administrador</h3>
                  <div class="mt-2 px-4 sm:px-7 py-3">
                      <form id="adminForm" class="space-y-4">
                          <div>
                              <label for="adminName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Nombre</label>
                              <input type="text" id="adminName" name="nombre_usuario" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="name">
                          </div>
                          <div>
                              <label for="adminEmail" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Correo Electrónico</label>
                              <input type="email" id="adminEmail" name="correo" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="email">
                          </div>
                          <div>
                              <label for="adminPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Contraseña</label>
                              <input type="password" id="adminPassword" name="password" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="new-password">
                          </div>
                          <div>
                              <label for="adminConfirmPassword" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Confirmar Contraseña</label>
                              <input type="password" id="adminConfirmPassword" name="confirm_password" 
                                class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" 
                                required
                                autocomplete="new-password">
                          </div>
                          <input type="hidden" id="adminId">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Guardar
                              </button>
                              <button type="button" id="cancelAdminBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
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

export async function initAdministradores() {
  // Verificar rol del usuario
  const checkUserRole = async () => {
    try {
      const response = await fetch("/api/check-role");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      if (!data.isSuperAdmin) {
        console.warn("Acceso denegado: Se requiere rol de superadmin");
        window.location.href = "/admin";
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar rol:", error);
      window.location.href = "/admin";
      return false;
    }
  };

  const tbody = document.getElementById("usuarios-table-body");
  const saldoModal = document.getElementById("saldoModal");
  const emailModal = document.getElementById("emailModal");
  const cancelSaldoBtn = document.getElementById("cancelSaldoBtn");
  const cancelEmailBtn = document.getElementById("cancelEmailBtn");
  const saldoForm = document.getElementById("saldoForm");
  const emailForm = document.getElementById("emailForm");
  const addAdminBtn = document.getElementById("addAdminBtn");
  const adminModal = document.getElementById("adminModal");
  const cancelAdminBtn = document.getElementById("cancelAdminBtn");
  const adminForm = document.getElementById("adminForm");
  const modalTitle = document.getElementById("modalTitle");
  let allUsersData = [];
  let editingAdminId = null;

  // Verificar rol antes de inicializar la sección
  const isAuthorized = await checkUserRole();
  if (!isAuthorized) return;

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admins");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const users = await response.json();
      allUsersData = users;
      renderUsers(users);
    } catch (error) {
      console.error("Error al cargar los administradores:", error);
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-red-500">Error al cargar los administradores.</td></tr>`;
    }
  };

  const renderUsers = (users) => {
    tbody.innerHTML = "";
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center py-4 text-gray-500 dark:text-gray-400">No hay administradores para mostrar.</td></tr>`;
      return;
    }

    users.forEach((user) => {
      const row = `
        <tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
          <td class="px-4 sm:px-6 py-4">${user.id}</td>
          <td class="px-4 sm:px-6 py-4 font-medium text-gray-900 dark:text-white">${user.nombre_usuario}</td>
          <td class="px-4 sm:px-6 py-4">${user.correo}</td>
          <td class="px-4 sm:px-6 py-4">$${parseFloat(user.saldo).toFixed(2)}</td>
          <td class="px-4 sm:px-6 py-4">${new Date(user.creado_en).toLocaleDateString()}</td>
          <td class="px-4 sm:px-6 py-4 text-center">
            <div class="flex flex-wrap justify-center gap-2">
              <button class="saldo-btn text-blue-600 hover:underline" data-id="${user.id}" data-saldo="${user.saldo}">
                <i data-feather="dollar-sign" class="inline w-5 h-5 align-text-bottom"></i> Saldo
              </button>
              <button class="message-btn text-green-600 hover:underline" data-id="${user.id}" data-email="${user.correo}" data-name="${user.nombre_usuario}">
                <i data-feather="mail" class="inline w-5 h-5 align-text-bottom"></i> Mensaje
              </button>
              <button class="edit-btn text-blue-600 hover:underline" data-id="${user.id}">
                <i data-feather="edit" class="inline w-5 h-5 align-text-bottom"></i> Editar
              </button>
              <button class="delete-btn text-red-600 hover:underline" data-id="${user.id}">
                <i data-feather="trash-2" class="inline w-5 h-5 align-text-bottom"></i> Eliminar
              </button>
            </div>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });
    if (window.feather) window.feather.replace();
  };

  // Event Listeners
  tbody.addEventListener("click", async (e) => {
    const target = e.target.closest("button");
    if (!target) return;

    const id = target.dataset.id;
    
    if (target.classList.contains("saldo-btn")) {
      document.getElementById("userId").value = id;
      document.getElementById("saldoAmount").value = "";
      saldoModal.classList.remove("hidden");
    } 
    else if (target.classList.contains("message-btn")) {
      const email = target.dataset.email;
      const name = target.dataset.name;
      if (email) {
        document.getElementById("userEmail").value = email;
        document.getElementById("userName").value = name;
        document.getElementById("emailModalTitle").textContent = `Enviar Mensaje a ${name}`;
        emailModal.classList.remove("hidden");
      } else {
        alert("No hay correo electrónico disponible para este administrador.");
      }
    }
    else if (target.classList.contains("delete-btn")) {
      if (confirm(`¿Estás seguro de que quieres eliminar al administrador con ID ${id}?`)) {
        try {
          const response = await fetch(`/api/admins/${id}`, {
            method: "DELETE"
          });
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          await fetchUsers();
          alert("Administrador eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar administrador:", error);
          alert("Hubo un error al eliminar el administrador. Revisa la consola.");
        }
      }
    }
    else if (target.classList.contains("edit-btn")) {
      editingAdminId = id;
      modalTitle.textContent = "Editar Administrador";
      
      try {
        const response = await fetch(`/api/admins/${id}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const admin = await response.json();
        
        document.getElementById("adminName").value = admin.nombre_usuario;
        document.getElementById("adminEmail").value = admin.correo;
        document.getElementById("adminPassword").value = "";
        document.getElementById("adminConfirmPassword").value = "";
        
        adminModal.classList.remove("hidden");
      } catch (error) {
        console.error("Error al cargar datos del administrador:", error);
        alert("No se pudieron cargar los datos del administrador para editar.");
      }
    }
  });

  // Manejo del formulario de saldo
  saldoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const amount = parseFloat(document.getElementById("saldoAmount").value);
    const userId = document.getElementById("userId").value;

    if (isNaN(amount) || amount <= 0) {
      alert("Por favor ingresa una cantidad válida mayor a 0.");
      return;
    }

    try {
      const response = await fetch(`/api/admins/${userId}/saldo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      saldoModal.classList.add("hidden");
      saldoForm.reset();
      await fetchUsers();
      alert("Saldo agregado exitosamente al administrador.");
    } catch (error) {
      console.error("Error al agregar saldo al administrador:", error);
      alert("Error al agregar saldo al administrador. Por favor intenta de nuevo.");
    }
  });

  // Manejo del formulario de correo
  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const subject = document.getElementById("emailSubject").value.trim();
    const message = document.getElementById("emailMessage").value.trim();
    const email = document.getElementById("userEmail").value;
    const name = document.getElementById("userName").value;

    if (!campoNoVacio(subject) || !campoNoVacio(message)) {
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
        alert("Mensaje enviado correctamente al administrador");
        emailForm.reset();
        emailModal.classList.add("hidden");
      } else {
        throw new Error("Error al enviar el mensaje al administrador");
      }
    } catch (error) {
      console.error("Error al enviar mensaje al administrador:", error);
      alert("Error al enviar el mensaje al administrador. Por favor intenta de nuevo.");
    }
  });

  cancelSaldoBtn.addEventListener("click", () => {
    saldoModal.classList.add("hidden");
    saldoForm.reset();
  });

  cancelEmailBtn.addEventListener("click", () => {
    emailModal.classList.add("hidden");
    emailForm.reset();
  });

  // Event Listeners for Admin Modal
  addAdminBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Administrador";
    adminForm.reset();
    editingAdminId = null;
    adminModal.classList.remove("hidden");
  });

  cancelAdminBtn.addEventListener("click", () => {
    adminModal.classList.add("hidden");
    adminForm.reset();
  });

  adminForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Validación
    const nombre = document.getElementById("adminName").value.trim();
    const correo = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;
    const confirmPassword = document.getElementById("adminConfirmPassword").value;

    let errorMsg = "";
    if (!campoNoVacio(nombre)) errorMsg += "El nombre es obligatorio.\n";
    if (!campoNoVacio(correo)) errorMsg += "El correo electrónico es obligatorio.\n";
    if (!editingAdminId && !campoNoVacio(password)) errorMsg += "La contraseña es obligatoria.\n";
    if (!editingAdminId && password !== confirmPassword) errorMsg += "Las contraseñas no coinciden.\n";

    if (errorMsg) {
      alert(errorMsg);
      return;
    }

    const formData = new FormData(adminForm);
    const adminData = Object.fromEntries(formData.entries());
    adminData.rol = "admin"; // Aseguramos que el rol sea admin

    // Si estamos editando, no enviamos la contraseña si está vacía
    if (editingAdminId && !password) {
      delete adminData.password;
      delete adminData.confirm_password;
    }

    let url = "/api/admins";
    let method = "POST";

    if (editingAdminId) {
      url = `/api/admins/${editingAdminId}`;
      method = "PUT";
    }

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      adminModal.classList.add("hidden");
      await fetchUsers();
      alert(`Administrador ${editingAdminId ? "actualizado" : "agregado"} exitosamente.`);
    } catch (error) {
      console.error(`Error al ${editingAdminId ? "actualizar" : "agregar"} administrador:`, error);
      alert(`Hubo un error al ${editingAdminId ? "actualizar" : "agregar"} el administrador. Revisa la consola.`);
    }
  });

  // Búsqueda y filtrado
  const searchUserInput = document.getElementById("searchUser");
  const filterBtn = document.getElementById("filterBtn");

  const applyFilters = () => {
    const searchTerm = searchUserInput.value.trim().toLowerCase();
    const filteredUsers = allUsersData.filter((user) => {
      const matchesId = String(user.id).includes(searchTerm);
      const matchesName = user.nombre_usuario.toLowerCase().includes(searchTerm);
      const matchesEmail = user.correo.toLowerCase().includes(searchTerm);
      const matchesRol = user.rol.toLowerCase().includes(searchTerm);
      
      return !searchTerm || matchesId || matchesName || matchesEmail || matchesRol;
    });
    renderUsers(filteredUsers);
  };

  filterBtn.addEventListener("click", applyFilters);
  searchUserInput.addEventListener("input", () => {
    if (searchUserInput.value.trim() === "") {
      renderUsers(allUsersData);
    }
  });

  // Inicialización
  await fetchUsers();
}