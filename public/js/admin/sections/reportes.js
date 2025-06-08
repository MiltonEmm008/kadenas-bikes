// Sección REPORTES

export function getReportesHTML() {
  return `
    <div class="container mx-auto px-2 py-6">
      <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white mb-8 text-center">Reportes</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Reporte de Usuarios -->
        <div id="reporteUsuariosCard" class="bg-white hover:cursor-pointer dark:bg-[#23272f] rounded-xl shadow-lg p-6 sm:py-10 flex flex-col items-center justify-center min-h-[320px] transition hover:scale-105 hover:shadow-2xl duration-150">
          <div class="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 sm:w-16 sm:h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.5 19.5L20 21M4 21C4 17.134 7.13401 14 11 14M19 17.5C19 18.8807 17.8807 20 16.5 20C15.1193 20 14 18.8807 14 17.5C14 16.1193 15.1193 15 16.5 15C17.8807 15 19 16.1193 19 17.5ZM15 7C15 9.20914 13.2091 11 11 11C8.79086 11 7 9.20914 7 7C7 4.79086 8.79086 3 11 3C13.2091 3 15 4.79086 15 7Z" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </div>
          <h2 class="text-xl font-semibold font-oswald text-gray-800 dark:text-white mb-2">Reporte de Usuarios</h2>
          <p class="text-gray-600 dark:text-gray-300 text-center">Visualiza y exporta información relevante sobre los usuarios registrados.</p>
        </div>
        <!-- Reporte de Productos -->
        <div id="reporteProductosCard" class="bg-white hover:cursor-pointer dark:bg-[#23272f] rounded-xl shadow-lg p-6 sm:py-10 flex flex-col items-center justify-center min-h-[320px] transition hover:scale-105 hover:shadow-2xl duration-150">
          <div class="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 sm:w-16 sm:h-16" fill="none" viewBox="0 0 32 32" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;" xmlns="http://www.w3.org/2000/svg"><g><g transform="matrix(1,0,0,1,-144,-288)"><g transform="matrix(1.2,0,0,1,-29.6,-3)"><path d="M168,300L148,300L148,318C148,318.53 148.176,319.039 148.488,319.414C148.801,319.789 149.225,320 149.667,320C153.433,320 162.567,320 166.333,320C166.775,320 167.199,319.789 167.512,319.414C167.824,319.039 168,318.53 168,318C168,312.935 168,300 168,300Z" style="fill:#bef264;"></path></g><path d="M148,297C148,297 149.581,293.839 150.447,292.106C150.786,291.428 151.479,291 152.236,291C155.527,291 164.473,291 167.764,291C168.521,291 169.214,291.428 169.553,292.106C170.419,293.839 172,297 172,297" style="fill:#bef264;"></path><path d="M167.764,290L152.236,290C151.1,290 150.061,290.642 149.553,291.658L147.115,296.535C147.041,296.674 147,296.832 147,297L147,315C147,315.796 147.316,316.559 147.879,317.121C148.441,317.684 149.204,318 150,318C154.52,318 165.48,318 170,318C170.796,318 171.559,317.684 172.121,317.121C172.684,316.559 173,315.796 173,315C173,309.935 173,297 173,297C173,296.832 172.959,296.674 172.885,296.535L170.447,291.658C169.939,290.642 168.9,290 167.764,290ZM164,298L164,301C164,301.53 163.789,302.039 163.414,302.414C163.039,302.789 162.53,303 162,303C160.89,303 159.11,303 158,303C157.47,303 156.961,302.789 156.586,302.414C156.211,302.039 156,301.53 156,301L156,298L149,298L149,315C149,315.265 149.105,315.52 149.293,315.707C149.48,315.895 149.735,316 150,316L170,316C170.265,316 170.52,315.895 170.707,315.707C170.895,315.52 171,315.265 171,315L171,298L164,298ZM152,314L154,314C154.552,314 155,313.552 155,313C155,312.448 154.552,312 154,312L152,312C151.448,312 151,312.448 151,313C151,313.552 151.448,314 152,314ZM152,310L156,310C156.552,310 157,309.552 157,309C157,308.448 156.552,308 156,308L152,308C151.448,308 151,308.448 151,309C151,309.552 151.448,310 152,310ZM162,301L158,301C158,301 158,298 158,298L162,298L162,301ZM163.18,292L163.847,296L170.382,296L168.658,292.553C168.489,292.214 168.143,292 167.764,292L163.18,292ZM156.82,292L152.236,292C151.857,292 151.511,292.214 151.342,292.553L149.618,296L156.153,296L156.82,292ZM158.18,296L158.847,292L161.153,292L161.82,296L158.18,296Z" style="fill:#22c55e;"></path></g></g></svg>
          </div>
          <h2 class="text-xl font-semibold font-oswald text-gray-800 dark:text-white mb-2">Reporte de Productos</h2>
          <p class="text-gray-600 dark:text-gray-300 text-center">Consulta el inventario y el movimiento de productos de la tienda.</p>
        </div>
        <!-- Reporte de Ventas -->
        <div id="reporteVentasCard" class="bg-white hover:cursor-pointer dark:bg-[#23272f] rounded-xl shadow-lg p-6 sm:py-10 flex flex-col items-center justify-center min-h-[320px] transition hover:scale-105 hover:shadow-2xl duration-150">
          <div class="bg-orange-100 dark:bg-orange-900 rounded-full p-4 mb-6 flex items-center justify-center">
            <svg class="w-12 h-12 sm:w-16 sm:h-16" fill="#f59e42" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g><path d="M136.948 908.811c5.657 0 10.24-4.583 10.24-10.24V610.755c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v287.816c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V610.755c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v287.816c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.96c5.657 0 10.24-4.583 10.24-10.24V551.322c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v347.249c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V551.322c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v347.249c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.342c5.657 0 10.24-4.583 10.24-10.24V492.497c0-5.651-4.588-10.24-10.24-10.24h-81.92c-5.652 0-10.24 4.589-10.24 10.24v406.692c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V492.497c0-28.271 22.924-51.2 51.2-51.2h81.92c28.276 0 51.2 22.929 51.2 51.2v406.692c0 28.278-22.922 51.2-51.2 51.2zm278.414-40.958c5.657 0 10.24-4.583 10.24-10.24V441.299c0-5.657-4.583-10.24-10.24-10.24h-81.92a10.238 10.238 0 00-10.24 10.24v457.892c0 5.657 4.583 10.24 10.24 10.24h81.92zm0 40.96h-81.92c-28.278 0-51.2-22.922-51.2-51.2V441.299c0-28.278 22.922-51.2 51.2-51.2h81.92c28.278 0 51.2 22.922 51.2 51.2v457.892c0 28.278-22.922 51.2-51.2 51.2zm-6.205-841.902C677.379 271.088 355.268 367.011 19.245 387.336c-11.29.683-19.889 10.389-19.206 21.679s10.389 19.889 21.679 19.206c342.256-20.702 670.39-118.419 964.372-284.046 9.854-5.552 13.342-18.041 7.79-27.896s-18.041-13.342-27.896-7.79z"></path><path d="M901.21 112.64l102.39.154c11.311.017 20.494-9.138 20.511-20.449s-9.138-20.494-20.449-20.511l-102.39-.154c-11.311-.017-20.494 9.138-20.511 20.449s9.138 20.494 20.449 20.511z"></path><path d="M983.151 92.251l-.307 101.827c-.034 11.311 9.107 20.508 20.418 20.542s20.508-9.107 20.542-20.418l.307-101.827c.034-11.311-9.107-20.508-20.418-20.542s-20.508 9.107-20.542 20.418z"></path></g></svg>
          </div>
          <h2 class="text-xl font-semibold font-oswald text-gray-800 dark:text-white mb-2">Reporte de Ventas</h2>
          <p class="text-gray-600 dark:text-gray-300 text-center">Accede a estadísticas y resúmenes de ventas por periodo.</p>
        </div>
      </div>
    </div>
  `;
}

export function initReportes() {
  // Al hacer click en la tarjeta de usuarios, descarga el PDF
  const cardUsuarios = document.getElementById("reporteUsuariosCard");
  if (cardUsuarios) {
    cardUsuarios.addEventListener("click", () => {
      window.open("/api/reportes/usuarios/pdf", "_blank");
    });
  }
  const cardProductos = document.getElementById("reporteProductosCard");
  if (cardProductos) {
    cardProductos.addEventListener("click", () => {
      window.open("/api/reportes/productos/pdf", "_blank");
    });
  }

  const cardVentas = document.getElementById("reporteVentasCard");
  if (cardVentas) {
    cardVentas.addEventListener("click", () => {
      window.open("/api/reportes/ventas/pdf", "_blank");
    });
  }
}
