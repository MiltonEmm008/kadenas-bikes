export async function getInicioHTML() {
  return `
    <div class="container mx-auto p-4">
      <div class="mb-8 p-6 bg-orange-500 dark:bg-orange-600 text-white rounded-lg shadow-lg">
        <h1 class="text-3xl font-oswald font-bold">¡Bienvenido al Panel de KADENAS BIKES!</h1>
        <p class="mt-2 text-lg font-poppins">Aquí podrás gestionar todos los aspectos de la tienda.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center">
          <div class="bg-orange-500 dark:bg-orange-600 text-white p-3 rounded-full mr-4">
            <i data-feather="users" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Usuarios Registrados</p>
            <p id="usuarios-count" class="text-2xl font-bold text-gray-800 dark:text-white"></p>
          </div>
        </div>
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center">
          <div class="bg-green-500 dark:bg-green-600 text-white p-3 rounded-full mr-4">
            <i data-feather="package" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Productos en Catálogo</p>
            <p id="productos-count" class="text-2xl font-bold text-gray-800 dark:text-white"></p>
          </div>
        </div>
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center">
          <div class="bg-blue-500 dark:bg-blue-600 text-white p-3 rounded-full mr-4">
            <i data-feather="shopping-cart" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Pedidos Pendientes</p>
            <p id="pedidos-count" class="text-2xl font-bold text-gray-800 dark:text-white"></p>
          </div>
        </div>
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center">
          <div class="bg-yellow-500 dark:bg-yellow-600 text-white p-3 rounded-full mr-4">
            <i data-feather="dollar-sign" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Ingresos del Mes</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-white">$<span id="ingresos-mes"></span></p>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Ventas Mensuales</h3>
          <div class="relative h-72">
            <canvas id="ventasChart"></canvas>
          </div>
        </div>
        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg">
          <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Distribución de Productos</h3>
          <div class="relative h-72">
            <canvas id="productosChart"></canvas>
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Incidencias Reciente</h3>
        <ul class="space-y-3" id="incidencias-list">
          
        </ul>
      </div>
    </div>
  `;
}

//
// Hook para inicializar los gráficos al cargar la sección
export async function initInicio() {
  if (!window.Chart) return;

  // Gráfico de barras: Ventas Mensuales
  const ventasCanvas = document.getElementById("ventasChart");
  try {
    const res = await fetch("/api/obtener-ventas");
    if (res.ok) {
      const datos = await res.json();
      const ventasMes = datos.map((mes) => mes.cantidad);
      if (ventasCanvas) {
        const ventasCtx = ventasCanvas.getContext("2d");
        new Chart(ventasCtx, {
          type: "bar",
          data: {
            labels: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            datasets: [
              {
                label: "Ventas",
                data: ventasMes,
                backgroundColor: "rgba(251, 146, 60, 0.7)",
                borderColor: "rgba(251, 146, 60, 1)",
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true, // ¡Importante! Habilita la responsividad
            maintainAspectRatio: false, // ¡Importante! Permite que el gráfico no mantenga su relación de aspecto original
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      }
    } else {
      throw new Error("Hubo un error al solicitar las ventas");
    }
  } catch (err) {}

  // Gráfico circular: Distribución de Productos
  const productosCanvas = document.getElementById("productosChart");
  try {
    // Suponiendo que la respuesta es un array como el que muestras
    const res = await fetch("/api/chart-category-count");
    let categoryCounts = {
      Bicicletas: 0,
      Refacciones: 0,
      Accesorios: 0,
      Otros: 0,
    };
    if (res.ok) {
      const data = await res.json();
      data.forEach((item) => {
        if (categoryCounts.hasOwnProperty(item.categoria)) {
          categoryCounts[item.categoria] = item.total;
        } else {
          categoryCounts.Otros += item.total;
        }
      });
    }
    if (productosCanvas) {
      const productosCtx = productosCanvas.getContext("2d");
      new Chart(productosCtx, {
        type: "doughnut",
        data: {
          labels: ["Bicicletas", "Refacciones", "Accesorios", "Otros"],
          datasets: [
            {
              data: [
                categoryCounts.Bicicletas,
                categoryCounts.Refacciones,
                categoryCounts.Accesorios,
                categoryCounts.Otros,
              ],
              backgroundColor: [
                "rgba(251, 146, 60, 0.8)",
                "rgba(34,197,94,0.8)",
                "rgba(59,130,246,0.8)",
                "rgba(253,224,71,0.8)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true, // ¡Importante! Habilita la responsividad
          maintainAspectRatio: false, // ¡Importante! Permite que el gráfico no mantenga su relación de aspecto original
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
    }
  } catch (e) {
    console.log("No se pudo obtener los conteos de categorias: ", e);
  }

  // Obtener los conteos reales
  let counts = { productos: 0, usuarios: 0, pedidos: 0 };
  const productosCount = document.getElementById("productos-count");
  const pedidosCount = document.getElementById("pedidos-count");
  const usuariosCount = document.getElementById("usuarios-count");
  try {
    const res = await fetch("/api/dashboard-counts");
    if (res.ok) counts = await res.json();
    if (productosCount && pedidosCount && usuariosCount) {
      productosCount.textContent = counts.productos;
      pedidosCount.textContent = counts.pedidos;
      usuariosCount.textContent = counts.usuarios;
    }
  } catch (e) {
    console.log("No se pudo obtener los conteos ", e);
  }

  const ingresosMes = document.getElementById("ingresos-mes");
  if (ingresosMes) {
    try {
      const res = await fetch("/api/ingresos-mes");
      if (res.ok) {
        const data = await res.json();
        ingresosMes.textContent = data.ingresos;
      }
    } catch (err) {
      console.log("No se pudo obtener los ingresos del mes: ", err);
    }
  }

  const incidencias_list = document.getElementById("incidencias-list");
  if (incidencias_list) {
    try {
      const res = await fetch("/api/incidencias-rec");
      if (res.ok) {
        const data = await res.json();
        data.forEach((incidencia) => {
          incidencias_list.innerHTML += `
          <li class="flex items-center text-sm">
            <i data-feather="alert-triangle" class="w-5 h-5 ${
              incidencia.urgencia === "alta"
                ? "text-red-500"
                : incidencia.urgencia === "baja"
                ? "text-yellow-500"
                : "text-orange-500"
            } mr-2"></i>
            ${
              incidencia.length >= 100
                ? incidencia.situacion.slice(0, 100) + "..."
                : incidencia.situacion
            }
            <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">${
              incidencia.creado_en
            }</span>
          </li>
          `;
        });
      }
    } catch (err) {}
  }
}
