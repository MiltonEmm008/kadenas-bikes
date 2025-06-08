import { campoNoVacio } from "../utils/validaciones.js";

export function getUsuariosHTML() {
  return `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6" data-aos="fade-down">
          <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>
      </div>
      
      <div class="mb-6 bg-white dark:bg-[#23272f] p-4 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" id="searchUser" placeholder="Buscar por nombre o correo..." class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
              <button id="filterBtn" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                  <i data-feather="search" class="w-5 h-5 mr-2"></i>Buscar
              </button>
          </div>
      </div>

      <div class="bg-white dark:bg-[#23272f] shadow-xl rounded-lg overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
          <table class="w-full min-w-max text-left text-sm text-gray-700 dark:text-gray-300">
              <thead class="bg-gray-50 dark:bg-[#1f2328] text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
                  <tr>
                      <th scope="col" class="px-6 py-3 w-16">ID</th>
                      <th scope="col" class="px-6 py-3 w-20">Foto</th>
                      <th scope="col" class="px-6 py-3">Nombre</th>
                      <th scope="col" class="px-6 py-3">Correo</th>
                      <th scope="col" class="px-6 py-3">Saldo</th>
                      <th scope="col" class="px-6 py-3">Fecha Registro</th>
                      <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                  </tr>
              </thead>
              <tbody id="usuarios-table-body"></tbody>
          </table>
      </div>

      <!-- Modal para Agregar Saldo -->
      <div id="saldoModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Agregar Saldo</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="saldoForm" class="space-y-4">
                          <div>
                              <label for="saldoAmount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Cantidad a Agregar</label>
                              <input type="number" id="saldoAmount" min="0" max="100000" step="0.01" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
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
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="emailModalTitle">Enviar Mensaje al Usuario</h3>
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
    </div>
  `;
}

export async function initUsuarios() {
  const tbody = document.getElementById("usuarios-table-body");
  const saldoModal = document.getElementById("saldoModal");
  const emailModal = document.getElementById("emailModal");
  const cancelSaldoBtn = document.getElementById("cancelSaldoBtn");
  const cancelEmailBtn = document.getElementById("cancelEmailBtn");
  const saldoForm = document.getElementById("saldoForm");
  const emailForm = document.getElementById("emailForm");
  let allUsersData = [];

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/usuarios");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const users = await response.json();
      allUsersData = users;
      renderUsers(users);
    } catch (error) {
      console.error("Error al cargar los usuarios:", error);
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Error al cargar los usuarios.</td></tr>`;
    }
  };

  const renderUsers = (users) => {
    tbody.innerHTML = "";
    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500 dark:text-gray-400">No hay usuarios para mostrar.</td></tr>`;
      return;
    }

    users.forEach((user) => {
      const row = `
        <tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
          <td class="px-6 py-4">${user.id}</td>
          <td class="px-6 py-4">
            <img src="${user.foto_perfil}" alt="Foto de perfil" class="w-10 h-10 rounded-full object-cover">
          </td>
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">${user.nombre_usuario}</td>
          <td class="px-6 py-4">${user.correo}</td>
          <td class="px-6 py-4">$${parseFloat(user.saldo).toFixed(2)}</td>
          <td class="px-6 py-4">${new Date(user.creado_en).toLocaleDateString()}</td>
          <td class="px-6 py-4 text-center">
            <button class="saldo-btn text-blue-600 hover:underline mr-2" data-id="${user.id}" data-saldo="${user.saldo}">
              <i data-feather="dollar-sign" class="inline w-5 h-5 align-text-bottom"></i> Agregar Saldo
            </button>
            <button class="message-btn text-green-600 hover:underline mr-2" data-id="${user.id}" data-email="${user.correo}" data-name="${user.nombre_usuario}">
              <i data-feather="mail" class="inline w-5 h-5 align-text-bottom"></i> Mensaje
            </button>
            <button class="delete-btn text-red-600 hover:underline" data-id="${user.id}">
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
        alert("No hay correo electrónico disponible para este usuario.");
      }
    }
    else if (target.classList.contains("delete-btn")) {
      if (confirm(`¿Estás seguro de que quieres eliminar al usuario con ID ${id}?`)) {
        try {
          const response = await fetch(`/api/usuarios/${id}`, {
            method: "DELETE"
          });
          
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          
          await fetchUsers();
          alert("Usuario eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
          alert("Hubo un error al eliminar el usuario. Revisa la consola.");
        }
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
      const response = await fetch(`/api/usuarios/${userId}/saldo`, {
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
      alert("Saldo agregado exitosamente.");
    } catch (error) {
      console.error("Error al agregar saldo:", error);
      alert("Error al agregar saldo. Por favor intenta de nuevo.");
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
        alert("Mensaje enviado correctamente");
        emailForm.reset();
        emailModal.classList.add("hidden");
      } else {
        throw new Error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      alert("Error al enviar el mensaje. Por favor intenta de nuevo.");
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
