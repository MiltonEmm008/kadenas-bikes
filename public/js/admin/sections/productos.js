import { esEnteroPositivo, campoNoVacio } from "../utils/validaciones.js";

// Sección PRODUCTOS
export function getProductosHTML() {
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
              <th scope="col" class="px-6 py-3">Proveedor</th>
              <th scope="col" class="px-6 py-3">Stock</th>
              <th scope="col" class="px-6 py-3">Creado en</th>
              <th scope="col" class="px-6 py-3 text-center">Acciones</th>
              </tr>
          </thead>
          <tbody id="productos-table-body"></tbody>
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
                          <div id="dynamic-details-fields" class="space-y-4"></div>
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
}

export async function initProductos() {
  const tbody = document.getElementById("productos-table-body");
  const addProductBtn = document.getElementById("addProductBtn");
  const productModal = document.getElementById("productModal");
  const cancelProductBtn = document.getElementById("cancelProductBtn");
  const productForm = document.getElementById("productForm");
  const modalTitle = document.getElementById("modalTitle");
  const productCategorySelect = document.getElementById("productCategory");
  const dynamicDetailsFields = document.getElementById(
    "dynamic-details-fields"
  );
  let editingProductId = null;

  // --- Lógica proveedor ---
  const supplierSelectHTML = `<label for="productSupplierId" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Proveedor</label>\n<select id="productSupplierId" name="proveedor_id" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">\n  <option value="">Selecciona proveedor...</option>\n</select>`;

  const populateSupplierSelect = async (selectedId = "") => {
    const select = document.getElementById("productSupplierId");
    if (!select) return;
    select.innerHTML = '<option value="">Selecciona proveedor...</option>';
    try {
      const res = await fetch("/api/proveedores");
      if (!res.ok) return;
      const proveedores = await res.json();
      proveedores.forEach((p) => {
        const option = document.createElement("option");
        option.value = p.id;
        option.textContent = `${p.id} - ${p.nombre_empresa}`;
        if (String(p.id) === String(selectedId)) option.selected = true;
        select.appendChild(option);
      });
    } catch (e) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "Error al cargar proveedores";
      select.appendChild(option);
    }
  };

  function replaceSupplierInput(selectedId = "") {
    const supplierInputDiv =
      document.querySelector("#productForm [for='productSupplierId']")
        ?.parentElement ||
      document.getElementById("productSupplierId")?.parentElement;
    if (supplierInputDiv) {
      supplierInputDiv.innerHTML = supplierSelectHTML;
      populateSupplierSelect(selectedId);
    }
  }
  // --- Fin lógica proveedor ---

  // Configuración de campos de detalles por categoría
  const categoryDetailsConfig = {
    Bicicletas: [
      { name: "color", label: "Color", type: "text" },
      {
        name: "rodado",
        label: "Rodado (pulgadas)",
        type: "select",
        options: ["12", "14", "16", "18", "20", "24", "26", "27", "29"],
      },
      { name: "material", label: "Material del Cuadro", type: "text" },
      { name: "tipo_bici", label: "Tipo de Bicicleta", type: "text" },
      { name: "tipo_freno", label: "Tipo de Freno", type: "text" },
      { name: "suspension", label: "¿Tiene Suspensión?", type: "checkbox" },
    ],
    Refacciones: [
      { name: "parte_bici", label: "Parte de la Bicicleta", type: "text" },
      {
        name: "compatibilidad",
        label: "Compatibilidad (modelo/marca)",
        type: "text",
      },
      { name: "material", label: "Material", type: "text" },
    ],
    Accesorios: [
      { name: "tipo_accesorio", label: "Tipo de Accesorio", type: "text" },
      { name: "talla", label: "Talla (si aplica)", type: "text" },
      { name: "compatibilidad", label: "Compatibilidad", type: "text" },
    ],
    Otros: [{ name: "notas", label: "Notas Adicionales", type: "textarea" }],
  };

  const generateDynamicDetailsFields = (category, currentDetails = {}) => {
    dynamicDetailsFields.innerHTML = "";
    const fields = categoryDetailsConfig[category];
    if (fields) {
      fields.forEach((field) => {
        let inputHTML = "";
        const fieldId = `detail-${field.name}`;
        const currentValue =
          currentDetails[field.name] !== undefined
            ? currentDetails[field.name]
            : "";
        switch (field.type) {
          case "text":
          case "number":
            inputHTML = `<input type="${
              field.type
            }" id="${fieldId}" name="detalles[${
              field.name
            }]" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white" value="${currentValue}" ${
              field.type === "number" ? 'step="any"' : ""
            }>`;
            break;
          case "textarea":
            inputHTML = `<textarea id="${fieldId}" name="detalles[${field.name}]" rows="2" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">${currentValue}</textarea>`;
            break;
          case "checkbox":
            inputHTML = `<input type="checkbox" id="${fieldId}" name="detalles[${
              field.name
            }]" class="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500" ${
              currentValue ? "checked" : ""
            }>`;
            break;
          case "select":
            inputHTML = `<select id="${fieldId}" name="detalles[${
              field.name
            }]" class="mt-1 block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-[#18181b] dark:text-white">${field.options
              .map(
                (option) =>
                  `<option value="${option}" ${
                    currentValue === option ? "selected" : ""
                  }>${option}</option>`
              )
              .join("")}</select>`;
            break;
        }
        const fieldWrapper = `<div><label for="${fieldId}" class="block text-sm font-medium text-gray-700 dark:text-gray-300 text-left">${field.label}</label>${inputHTML}</div>`;
        dynamicDetailsFields.insertAdjacentHTML("beforeend", fieldWrapper);
      });
    }
  };

  productCategorySelect.addEventListener("change", () => {
    const selectedCategory = productCategorySelect.value;
    generateDynamicDetailsFields(selectedCategory);
  });

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const products = await response.json();
      renderProducts(products);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
      tbody.innerHTML = `<tr><td colspan="13" class="text-center py-4 text-red-500">Error al cargar los productos.</td></tr>`;
    }
  };

  const renderProducts = (products) => {
    tbody.innerHTML = "";
    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="13" class="text-center py-4 text-gray-500 dark:text-gray-400">No hay productos para mostrar.</td></tr>`;
      return;
    }
    products.forEach((product) => {
      const stockClass =
        product.stock === 0
          ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
          : product.stock < 10
          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      const stockText =
        product.stock === 0
          ? "Agotado (0)"
          : product.stock < 10
          ? `Bajo Stock (${product.stock})`
          : `En Stock (${product.stock})`;
      let displayedDetails = "N/A";
      try {
        if (product.detalles) {
          const detailsObj =
            typeof product.detalles === "string"
              ? JSON.parse(product.detalles)
              : product.detalles;
          if (
            detailsObj &&
            typeof detailsObj === "object" &&
            Object.keys(detailsObj).length > 0
          ) {
            displayedDetails = Object.entries(detailsObj)
              .filter(([key, value]) => typeof value !== "object")
              .map(([key, value]) => {
                if (key === "suspension") {
                  return `suspensión: <span style='color:${
                    value ? "#16a34a" : "#dc2626"
                  };font-weight:bold'>${value ? "Sí" : "No"}</span>`;
                }
                return `${key}: ${value}`;
              })
              .join("<br>");
          }
        }
      } catch (e) {
        displayedDetails = "N/A";
      }
      const row = `<tr class="bg-white dark:bg-[#23272f] border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2f37]">
        <td class="px-6 py-4">${product.id}</td>
        <td class="px-6 py-4"><img src="${
          product.foto_producto ||
          "https://via.placeholder.com/60x40.png?text=No+Img"
        }" alt="${product.nombre}" class="w-16 h-10 object-cover rounded"></td>
        <td class="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">${
          product.nombre
        }</td>
        <td class="px-6 py-4">${product.categoria}</td>
        <td class="px-6 py-4">${product.marca}</td>
        <td class="px-6 py-4">$${product.precio.toFixed(2)}</td>
        <td class="px-6 py-4">${product.descripcion || "N/A"}</td>
        <td class="px-6 py-4">${displayedDetails}</td>
        <td class="px-6 py-4">${product.descuento_porcentaje || 0}%</td>
        <td class="px-6 py-4">${
          product.proveedor_nombre || "Sin proveedor"
        }</td>
        <td class="px-6 py-4"><span class="${stockClass}">${stockText}</span></td>
        <td class="px-6 py-4">${
          product.creado_en
            ? new Date(product.creado_en).toLocaleDateString()
            : "N/A"
        }</td>
        <td class="px-6 py-4 text-center">
          <button class="edit-btn text-blue-600 hover:underline mr-2" data-id="${
            product.id
          }"><i data-feather="edit" class="inline w-5 h-5 align-text-bottom"></i> Editar</button>
          <button class="delete-btn text-red-600 hover:underline" data-id="${
            product.id
          }"><i data-feather="trash-2" class="inline w-5 h-5 align-text-bottom"></i> Eliminar</button>
        </td>
      </tr>`;
      tbody.insertAdjacentHTML("beforeend", row);
    });
    if (window.feather) window.feather.replace();
  };

  // Manejo del formulario de agregar/editar
  addProductBtn.addEventListener("click", () => {
    modalTitle.textContent = "Agregar Producto";
    productForm.reset();
    productCategorySelect.value = "";
    generateDynamicDetailsFields("");
    editingProductId = null;
    productModal.classList.remove("hidden");
    replaceSupplierInput("");
  });

  cancelProductBtn.addEventListener("click", () => {
    productModal.classList.add("hidden");
  });

  // Validación en tiempo real para stock y descuento
  document.getElementById("productStock").addEventListener("input", (e) => {
    if (!/^\d*$/.test(e.target.value))
      e.target.value = e.target.value.replace(/\D/g, "");
  });
  document.getElementById("productDiscount").addEventListener("input", (e) => {
    if (!/^\d*$/.test(e.target.value))
      e.target.value = e.target.value.replace(/\D/g, "");
  });

  productForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Validación estricta
    const nombre = document.getElementById("productName").value.trim();
    const categoria = document.getElementById("productCategory").value;
    const marca = document.getElementById("productBrand").value.trim();
    const precio = document.getElementById("productPrice").value;
    const proveedor = document.getElementById("productSupplierId").value;
    const stock = document.getElementById("productStock").value;
    const descuento = document.getElementById("productDiscount").value;
    let errorMsg = "";
    if (!campoNoVacio(nombre)) errorMsg += "El nombre es obligatorio.\n";
    if (!campoNoVacio(categoria))
      errorMsg += "Debes seleccionar una categoría.\n";
    if (!campoNoVacio(marca)) errorMsg += "La marca es obligatoria.\n";
    if (!precio || isNaN(precio) || Number(precio) <= 0)
      errorMsg += "El precio es obligatorio y debe ser mayor a 0.\n";
    if (!campoNoVacio(proveedor))
      errorMsg += "Debes seleccionar un proveedor.\n";
    if (!esEnteroPositivo(stock) && stock !== "0")
      errorMsg +=
        "El stock es obligatorio y debe ser un número entero mayor o igual a 0.\n";
    if (
      descuento === "" ||
      isNaN(descuento) ||
      !Number.isInteger(Number(descuento)) ||
      Number(descuento) < 0 ||
      Number(descuento) > 100
    )
      errorMsg += "El descuento debe ser un número entero entre 0 y 100.\n";
    // Validar detalles dinámicos
    const selectedCategory = categoria;
    const fields = categoryDetailsConfig[selectedCategory];
    if (fields) {
      for (const field of fields) {
        if (field.type !== "checkbox") {
          const el = document.getElementById(`detail-${field.name}`);
          if (el && !campoNoVacio(el.value)) {
            errorMsg += `El campo '${field.label}' es obligatorio.\n`;
          }
        }
      }
    }
    if (errorMsg) {
      alert(errorMsg);
      return;
    }
    // Recopilar datos y enviar
    const formData = new FormData(productForm);
    const detailsData = {};
    for (let [key, value] of formData.entries()) {
      if (key.startsWith("detalles[")) {
        const detailKey = key.substring(key.indexOf("[") + 1, key.indexOf("]"));
        const inputElement = document.getElementById(`detail-${detailKey}`);
        if (inputElement && inputElement.type === "checkbox") {
          detailsData[detailKey] = inputElement.checked;
        } else {
          detailsData[detailKey] = value;
        }
      }
    }
    // Serializar detalles correctamente
    for (const key of [...formData.keys()]) {
      if (key.startsWith("detalles[")) formData.delete(key);
    }
    formData.set("detalles", JSON.stringify(detailsData));
    if (formData.has("precio"))
      formData.set("precio", parseFloat(formData.get("precio")));
    if (formData.has("stock"))
      formData.set("stock", parseInt(formData.get("stock"), 10));
    if (formData.has("descuento_porcentaje"))
      formData.set(
        "descuento_porcentaje",
        parseInt(formData.get("descuento_porcentaje"), 10)
      );
    if (formData.has("proveedor_id") && formData.get("proveedor_id") !== "")
      formData.set("proveedor_id", parseInt(formData.get("proveedor_id"), 10));
    else formData.set("proveedor_id", "");
    let url = "/api/productos";
    let method = "POST";
    if (editingProductId) {
      url = `/api/productos/${editingProductId}`;
      method = "PUT";
    }
    try {
      const response = await fetch(url, { method, body: formData });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }
      productModal.classList.add("hidden");
      await fetchAndStoreAllProducts();
      alert(
        `Producto ${
          editingProductId ? "actualizado" : "agregado"
        } exitosamente.`
      );
    } catch (error) {
      console.error(
        `Error al ${editingProductId ? "actualizar" : "agregar"} producto:`,
        error
      );
      alert(
        `Hubo un error al ${
          editingProductId ? "actualizar" : "agregar"
        } el producto. Revisa la consola.`
      );
    }
  });

  // Delegación de eventos para editar y eliminar
  tbody.addEventListener("click", async (e) => {
    if (e.target.closest(".edit-btn")) {
      const id = e.target.closest(".edit-btn").dataset.id;
      editingProductId = id;
      modalTitle.textContent = "Editar Producto";
      const product = allProductsData.find((p) => String(p.id) === String(id));
      if (!product) {
        alert("No se pudo cargar la información del producto para editar.");
        return;
      }
      document.getElementById("productName").value = product.nombre;
      document.getElementById("productCategory").value = product.categoria;
      document.getElementById("productBrand").value = product.marca;
      document.getElementById("productPrice").value = product.precio;
      document.getElementById("productDescription").value =
        product.descripcion || "";
      document.getElementById("productDiscount").value =
        product.descuento_porcentaje || 0;
      replaceSupplierInput(product.proveedor_id || "");
      document.getElementById("productStock").value = product.stock;
      document.getElementById("productImage").value = "";
      let currentDetails = {};
      if (product.detalles) {
        try {
          currentDetails = JSON.parse(product.detalles);
        } catch (parseError) {
          console.warn("No se pudo parsear el JSON de detalles:", parseError);
        }
      }
      generateDynamicDetailsFields(product.categoria, currentDetails);
      productModal.classList.remove("hidden");
    } else if (e.target.closest(".delete-btn")) {
      const id = e.target.closest(".delete-btn").dataset.id;
      if (
        confirm(
          `¿Estás seguro de que quieres eliminar el producto con ID ${id}?`
        )
      ) {
        try {
          const response = await fetch(`/api/productos/${id}`, {
            method: "DELETE",
          });
          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
          await fetchProducts();
          alert("Producto eliminado exitosamente.");
        } catch (error) {
          console.error("Error al eliminar producto:", error);
          alert("Hubo un error al eliminar el producto. Revisa la consola.");
        }
      }
    }
  });

  // Filtros y búsqueda
  const searchNameInput = document.getElementById("searchName");
  const filterCategorySelect = document.getElementById("filterCategory");
  const filterBtn = document.getElementById("filterBtn");
  let allProductsData = [];
  const fetchAndStoreAllProducts = async () => {
    try {
      const response = await fetch("/api/productos");
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      allProductsData = await response.json();
      renderProducts(allProductsData);
    } catch (error) {
      console.error("Error al cargar todos los productos para filtrar:", error);
      tbody.innerHTML = `<tr><td colspan="13" class="text-center py-4 text-red-500">Error al cargar los productos para el filtro.</td></tr>`;
    }
  };
  const applyFilters = () => {
    const searchTerm = searchNameInput.value.trim().toLowerCase();
    const selectedCategory = filterCategorySelect.value;
    const filteredProducts = allProductsData.filter((product) => {
      const matchesId = String(product.id).includes(searchTerm);
      const matchesName = product.nombre.toLowerCase().includes(searchTerm);
      const matchesBrand =
        product.marca && product.marca.toLowerCase().includes(searchTerm);
      const matchesSupplier =
        product.proveedor_id &&
        String(product.proveedor_id).includes(searchTerm);
      const matchesCategory =
        selectedCategory === "" || product.categoria === selectedCategory;
      const matchesText =
        !searchTerm ||
        matchesId ||
        matchesName ||
        matchesBrand ||
        matchesSupplier;
      return matchesText && matchesCategory;
    });
    renderProducts(filteredProducts);
  };
  filterBtn.addEventListener("click", applyFilters);
  searchNameInput.addEventListener("input", () => {
    if (searchNameInput.value.trim() === "") {
      renderProducts(allProductsData);
    }
  });
  fetchAndStoreAllProducts();
}
