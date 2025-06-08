// /js/admin-sectionsScript.js

window.adminSections = {
  getInicioHTML: function () {
    return `
      <div class="container mx-auto">
        <div class="mb-8 p-6 bg-orange-500 dark:bg-orange-600 text-white rounded-lg shadow-lg" data-aos="fade-down">
          <h1 class="text-3xl font-oswald font-bold">¡Bienvenido al Panel de KADENAS BIKES!</h1>
          <p class="mt-2 text-lg font-poppins">Aquí podrás gestionar todos los aspectos de la tienda.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center" data-aos="fade-up" data-aos-delay="100">
            <div class="bg-orange-500 dark:bg-orange-600 text-white p-3 rounded-full mr-4">
              <i data-feather="users" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Usuarios Registrados</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">1,250</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center" data-aos="fade-up" data-aos-delay="200">
            <div class="bg-green-500 dark:bg-green-600 text-white p-3 rounded-full mr-4">
              <i data-feather="package" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Productos en Catálogo</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">320</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center" data-aos="fade-up" data-aos-delay="300">
            <div class="bg-blue-500 dark:bg-blue-600 text-white p-3 rounded-full mr-4">
              <i data-feather="shopping-cart" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Pedidos Pendientes</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">45</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg flex items-center" data-aos="fade-up" data-aos-delay="400">
            <div class="bg-yellow-500 dark:bg-yellow-600 text-white p-3 rounded-full mr-4">
              <i data-feather="dollar-sign" class="w-6 h-6"></i>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Ingresos del Mes</p>
              <p class="text-2xl font-bold text-gray-800 dark:text-white">$8,600</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="500">
            <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Ventas Mensuales</h3>
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">(Placeholder para Gráfico de Barras)</p>
            </div>
          </div>
          <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="600">
            <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Distribución de Productos</h3>
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
              <p class="text-gray-500 dark:text-gray-400">(Placeholder para Gráfico Circular)</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-[#23272f] p-6 rounded-lg shadow-lg" data-aos="fade-up" data-aos-delay="700">
          <h3 class="text-xl font-semibold font-oswald mb-4 text-gray-800 dark:text-white">Actividad Reciente</h3>
          <ul class="space-y-3">
            <li class="flex items-center text-sm">
              <i data-feather="check-circle" class="w-5 h-5 text-green-500 mr-2"></i>
              Nuevo pedido #1234 procesado.
              <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">Hace 5 min</span>
            </li>
            <li class="flex items-center text-sm">
              <i data-feather="user-plus" class="w-5 h-5 text-blue-500 mr-2"></i>
              Nuevo usuario 'Juan Perez' registrado.
              <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">Hace 1 hora</span>
            </li>
            <li class="flex items-center text-sm">
              <i data-feather="alert-triangle" class="w-5 h-5 text-yellow-500 mr-2"></i>
              Producto 'Bicicleta XWZ' bajo en stock.
              <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">Hace 3 horas</span>
            </li>
          </ul>
        </div>
      </div>
    `;
  },

  getProductosHTML: function () {
    // Retorna la estructura HTML básica para la gestión de productos
    return `
      <div class="container mx-auto">
        <div class="flex justify-between items-center mb-6" data-aos="fade-down">
            <h1 class="text-3xl font-oswald font-bold text-gray-800 dark:text-white">Gestión de Productos</h1>
            <button id="addProductBtn" class="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center transition duration-150">
            <i data-feather="plus-circle" class="w-5 h-5 mr-2"></i>
            Agregar Producto
            </button>
        </div>

        <div class="mb-6 bg-white dark:bg-[#23272f] p-4 rounded-lg shadow" data-aos="fade-up" data-aos-delay="100">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" id="searchName" placeholder="Buscar..." class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
            <select id="filterCategory" class="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] focus:ring-orange-500 focus:border-orange-500">
                <option value="">Todas las categorías</option>
                <option value="Bicicletas">Bicicletas</option>
                <option value="Refacciones">Refacciones</option>
                <option value="Accesorios">Accesorios</option>
                <option value="Otros">Otros</option>
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
                <th scope="col" class="px-6 py-3">Imagen</th>
                <th scope="col" class="px-6 py-3">Nombre</th>
                <th scope="col" class="px-6 py-3">Categoría</th>
                <th scope="col" class="px-6 py-3">Marca</th>
                <th scope="col" class="px-6 py-3">Precio</th>
                <th scope="col" class="px-6 py-3">Descripción</th>
                <th scope="col" class="px-6 py-3">Detalles</th>
                <th scope="col" class="px-6 py-3">Descuento (%)</th>
                <th scope="col" class="px-6 py-3">Proveedor ID</th>
                <th scope="col" class="px-6 py-3">Stock</th>
                <th scope="col" class="px-6 py-3">Creado en</th>
                <th scope="col" class="px-6 py-3 text-center">Acciones</th>
                </tr>
            </thead>
            <tbody id="productos-table-body">
                </tbody>
            </table>
        </div>
        <div id="productModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden z-50">
            <div class="relative top-20 mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white dark:bg-[#23272f]">
                <div class="mt-3 text-center">
                    <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modalTitle">Agregar Producto</h3>
                    <div class="mt-2 px-7 py-3">
                        <form id="productForm" class="space-y-4">
                            <div>
                                <label for="productName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Nombre</label>
                                <input type="text" id="productName" name="nombre" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                            </div>
                            <div>
                                <label for="productCategory" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Categoría</label>
                                <select id="productCategory" name="categoria" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                                    <option value="">Selecciona una categoría</option>
                                    <option value="Bicicletas">Bicicletas</option>
                                    <option value="Refacciones">Refacciones</option>
                                    <option value="Accesorios">Accesorios</option>
                                    <option value="Otros">Otros</option>
                                </select>
                            </div>
                            <div id="dynamic-details-fields" class="space-y-4">
                                </div>
                            <div>
                                <label for="productBrand" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Marca</label>
                                <input type="text" id="productBrand" name="marca" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                            </div>
                            <div>
                                <label for="productPrice" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Precio</label>
                                <input type="number" id="productPrice" name="precio" step="0.01" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                            </div>
                            <div>
                                <label for="productDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Descripción</label>
                                <textarea id="productDescription" name="descripcion" rows="3" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white"></textarea>
                            </div>
                            <div>
                                <label for="productDiscount" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Descuento (%)</label>
                                <input type="number" id="productDiscount" name="descuento_porcentaje" min="0" max="100" value="0" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">
                            </div>
                            <div>
                                <label for="productSupplierId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Proveedor</label>
                                <select id="productSupplierId" name="proveedor_id" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">
                                  <option value="">Selecciona proveedor...</option>
                                </select>
                            </div>
                            <div>
                                <label for="productStock" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Stock</label>
                                <input type="number" id="productStock" name="stock" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" required>
                            </div>
                            <div>
                                <label for="productImage" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Imagen</label>
                                <input type="file" id="productImage" name="foto_producto" accept=".jpg,.jpeg,.png" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">
                            </div>
                            <input type="hidden" id="productId">
                            <div class="items-center px-4 py-3">
                                <button type="submit" id="saveProductBtn" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                    Guardar
                                </button>
                                <button type="button" id="cancelProductBtn" class="mt-3 px-4 py-2 bg-gray-400 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
  },
};

// Solo se deja la definición de getInicioHTML y getProductosHTML para compatibilidad temporal.
window.adminSections = {
  getInicioHTML: window.adminSections.getInicioHTML,
  getProductosHTML: window.adminSections.getProductosHTML,
  sections: window.adminSections.sections
};