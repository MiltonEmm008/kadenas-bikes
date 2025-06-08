import { campoNoVacio } from "../utils/validaciones.js";

export function getSoporteHTML() {
  return `
    <div class="container mx-auto">
      <div class="flex justify-between items-center mb-6" data-aos="fade-down">
          <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Soporte</h1>
      </div>
      
      <div class="bg-white dark:bg-[#23272f] shadow-xl rounded-lg overflow-x-auto" data-aos="fade-up" data-aos-delay="200">
          <table class="w-full min-w-max text-left text-sm text-gray-700 dark:text-gray-300">
          <thead class="bg-gray-50 dark:bg-[#1f2328] text-xs text-gray-700 dark:text-gray-400 uppercase tracking-wider">
              <tr>
                  <th scope="col" class="px-6 py-3">ID</th>
                  <th scope="col" class="px-6 py-3">Usuario</th>
                  <th scope="col" class="px-6 py-3">Correo</th>
                  <th scope="col" class="px-6 py-3">Situación</th>
                  <th scope="col" class="px-6 py-3">Urgencia</th>
                  <th scope="col" class="px-6 py-3">Fecha</th>
                  <th scope="col" class="px-6 py-3 text-center">Acciones</th>
              </tr>
          </thead>
          <tbody id="soporte-table-body"></tbody>
          </table>
      </div>

      <!-- Modal Reutilizado de Productos -->
      <div id="soporteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
          <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
              <div class="mt-3 text-center">
                  <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Responder Incidencia</h3>
                  <div class="mt-2 px-7 py-3">
                      <form id="respuestaForm" class="space-y-4">
                          <div>
                              <label for="respuestaMensaje" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Mensaje de respuesta</label>
                              <textarea id="respuestaMensaje" rows="5" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required></textarea>
                          </div>
                          <input type="hidden" id="incidenciaId">
                          <input type="hidden" id="correoUsuario">
                          <div class="items-center px-4 py-3">
                              <button type="submit" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                  Enviar Respuesta
                              </button>
                              <button type="button" onclick="document.getElementById('soporteModal').classList.add('hidden')" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
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

export async function initSoporte() {
  const tbody = document.getElementById("soporte-table-body");
  const respuestaForm = document.getElementById("respuestaForm");

  const renderIncidencias = (incidencias) => {
    tbody.innerHTML = "";
    incidencias.forEach((incidencia) => {
      const row = `
        <tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
          <td class="px-6 py-4">${incidencia.id}</td>
          <td class="px-6 py-4">${incidencia.nombre}</td>
          <td class="px-6 py-4">${incidencia.correo}</td>
          <td class="px-6 py-4">${incidencia.situacion}</td>
          <td class="px-6 py-4">${incidencia.urgencia}</td>
          <td class="px-6 py-4">${new Date(
            incidencia.creado_en
          ).toLocaleDateString()}</td>
          <td class="px-6 py-4 text-center">
            <button class="responder-btn text-blue-600 hover:underline mr-2" data-id="${
              incidencia.id
            }" data-correo="${incidencia.correo}">
              <i data-feather="mail" class="inline w-5 h-5 align-text-bottom"></i> Responder
            </button>
          </td>
        </tr>
      `;
      tbody.insertAdjacentHTML("beforeend", row);
    });

    document.querySelectorAll(".responder-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.getElementById("soporteModal").classList.remove("hidden");
        document.getElementById("incidenciaId").value = btn.dataset.id;
        document.getElementById("correoUsuario").value = btn.dataset.correo;
      });
    });

    if (window.feather) window.feather.replace();
  };

  try {
    const response = await fetch("/api/soporte");
    const data = await response.json();
    renderIncidencias(data);
  } catch (error) {
    console.error("Error al cargar incidencias:", error);
    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Error al cargar las incidencias</td></tr>`;
  }

  respuestaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const mensaje = document.getElementById("respuestaMensaje").value;
    const incidenciaId = document.getElementById("incidenciaId").value;
    const correo = document.getElementById("correoUsuario").value;

    // Validación: no permitir enviar si el campo está vacío
    if (!campoNoVacio(mensaje)) {
      alert("El mensaje de respuesta no puede estar vacío.");
      document.getElementById("respuestaMensaje").focus();
      return;
    }

    try {
      const response = await fetch("/api/enviar-respuesta-soporte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          incidenciaId,
          destinatario: correo,
          mensaje,
        }),
      });

      if (response.ok) {
        alert("Respuesta enviada correctamente");
        document.getElementById("respuestaMensaje").value = "";
        document.getElementById("soporteModal").classList.add("hidden");
        try {
          const response = await fetch("/api/soporte");
          const data = await response.json();
          renderIncidencias(data);
        } catch (error) {
          console.error("Error al cargar incidencias:", error);
          tbody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-red-500">Error al cargar las incidencias</td></tr>`;
        }
      }
    } catch (error) {
      console.error("Error al enviar respuesta:", error);
      alert("Error al enviar la respuesta");
    }
  });
}