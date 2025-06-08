// INICIALIZA LOS ICONOS SVG DE FEATHER
feather.replace();

// MENU HAMBURGUESA RESPONSIVE PARA MOVIL
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

perfil_toggle.addEventListener("click", function (e) {
  e.preventDefault();
  if (menu.classList.contains("hidden")) {
    menu_perfil.classList.toggle("hidden");
  } else {
    menu.classList.add("hidden");
    menu_perfil.classList.remove("hidden");
  }
});

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle.addEventListener("click", function () {
  if (menu_perfil.classList.contains("hidden")) {
    menu.classList.toggle("hidden");
  } else {
    menu_perfil.classList.add("hidden");
    menu.classList.remove("hidden");
  }
});

// OCULTA EL MENU AL HACER CLICK EN UN ENLACE EN PANTALLAS PEQUENAS
const menuLinks = menu.querySelectorAll("a");
menuLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth < 768) {
      menu.classList.add("hidden");
    }
  });
});

// Obtiene los productos enviados desde el backend (si existen, inyectados por EJS)
// window.productos es inyectado por el backend si se desea manipulación JS
const productosBackend =
  typeof window !== "undefined" && window.productos ? window.productos : [];

// Si necesitas lógica de filtrado/búsqueda en el frontend, puedes implementarla aquí usando productosBackend
// Por ejemplo:
// function filtrarPorTipo(tipo) { ... } // usando productosBackend
// function mostrarProductosBackend(lista) { ... } // ya implementada si se requiere

// El resto del código de menú y utilidades permanece igual

// FUNCION QUE MUESTRA LOS PRODUCTOS DEL BACKEND EN EL CATALOGO

// CLASE PARA EL CARRUSEL DE BICICLETAS DESTACADAS
class Carousel {
  // CONSTRUCTOR RECIBE SELECTORES DEL CONTENEDOR Y BOTONES
  constructor(containerSelector, prevButtonSelector, nextButtonSelector) {
    this.container = document.querySelector(containerSelector);
    if (!this.container) return;
    this.inner = this.container.querySelector(".carousel-inner");
    this.items = []; // SE LLENAN DINAMICAMENTE
    this.currentIndex = 0;
    this.transitioning = false;
    this.prevButton = document.querySelector(prevButtonSelector);
    this.nextButton = document.querySelector(nextButtonSelector);
    this.initControls();
  }
  // AGREGA EVENTOS A LOS BOTONES DE NAVEGACION
  initControls() {
    if (this.prevButton)
      this.prevButton.addEventListener("click", () => this.prev());
    if (this.nextButton)
      this.nextButton.addEventListener("click", () => this.next());
  }
  // CARGA LAS TARJETAS DEL CARRUSEL
  // MODIFICADO: Ahora recibe 'productosData' directamente
  loadItems(productosData) {
    // Cambiado 'bicicletasData' a 'productosData'
    if (!this.inner) return;
    this.inner.innerHTML = productosData
      .map((prod, index) => {
        const precioConDescuento = prod.descuento
          ? prod.precio - (prod.precio * prod.descuento) / 100
          : prod.precio;
        const precioOriginalHtml = prod.descuento
          ? `<span class="text-gray-300 line-through ml-1">MX$${prod.precio.toLocaleString()}</span>`
          : "";
        const descuentoHtml = prod.descuento ? `(-${prod.descuento}%)` : "";

        return `
            <div class="carousel-item ${
              index === 0 ? "active" : "hidden"
            } absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out">
                <img src="${
                  prod.foto_producto || "/images/1.jpg"
                }" class="w-full h-full object-cover" alt="${prod.nombre}"/>
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-3 sm:p-4 text-center">
                    <h5 class="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2">${
                      prod.nombre
                    }</h5>
                    <p class="text-xs sm:text-sm mb-2 sm:mb-3">
                        MX$${precioConDescuento.toLocaleString()} ${precioOriginalHtml} ${descuentoHtml}
                    </p>
                    <button onclick="addToCarrito(${
                      prod.id
                    })" class="bg-orange-600 hover:bg-orange-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm transition active:scale-95 text-center"><i data-feather="shopping-cart" class="inline-block w-3 h-3 sm:w-4 sm:h-4 mr-1"></i> AGREGAR</button>
                </div>
            </div>
          `;
      })
      .join("");
    this.items = Array.from(this.inner.querySelectorAll(".carousel-item"));
    feather.replace();
    this.showItem(0, false);
  }
  // MUESTRA EL ITEM ACTUAL DEL CARRUSEL
  showItem(index, animate = true) {
    if (this.transitioning || this.items.length === 0) return;
    this.transitioning = true;
    this.items.forEach((item, i) => {
      item.classList.add("hidden");
      item.classList.remove("active", "opacity-0");
    });
    const currentItem = this.items[index];
    currentItem.classList.remove("hidden");
    if (animate) {
      currentItem.classList.add("opacity-0");
      setTimeout(() => {
        currentItem.classList.add("active");
        currentItem.classList.remove("opacity-0");
      }, 10);
    } else {
      currentItem.classList.add("active");
    }
    this.currentIndex = index;
    setTimeout(() => {
      this.transitioning = false;
    }, 550);
  }
  // MUESTRA EL ITEM ANTERIOR
  prev() {
    if (this.transitioning || this.items.length === 0) return;
    const prevIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.showItem(prevIndex);
  }
  // MUESTRA EL SIGUIENTE ITEM
  next() {
    if (this.transitioning || this.items.length === 0) return;
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.showItem(nextIndex);
  }
}

// FUNCION QUE MUESTRA LAS BICICLETAS DESTACADAS EN EL CARRUSEL
function mostrarDestacadasCarrusel() {
  const carruselContainer = document.querySelector(".carousel-container");
  const carruselInner = document.querySelector(".carousel-inner");
  // Si no hay productos, muestra alerta y oculta el carrusel
  if (!productosBackend || productosBackend.length === 0) {
    if (carruselInner) carruselInner.innerHTML = "";
    if (carruselContainer) {
      carruselContainer.innerHTML = `<div class="w-full text-center py-10"><span class="text-red-600 font-bold text-3xl">No se encontraron coincidencias...</span></div>`;
    }
    return;
  }
  // Si hay productos, renderiza el carrusel normalmente
  const destacadas = productosBackend.slice(0, 5);
  const carruselDestacadas = new Carousel(
    ".carousel-container",
    ".carousel-prev-destacadas",
    ".carousel-next-destacadas"
  );
  carruselDestacadas.loadItems(destacadas);
}

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

// Asocia el botón de cierre
document.getElementById("modalClose").addEventListener("click", cerrarModal);

// FUNCION QUE MUESTRA LOS PRODUCTOS EN EL CATALOGO (si aún la necesitas para el filtrado)
function mostrarBicicletas(productosAMostrar) {
  const catalogo = document.getElementById("catalogo-bicicletas");
  if (!catalogo) return; // Asegúrate de que el elemento exista
  catalogo.innerHTML = ""; // Limpia el catálogo actual

  if (productosAMostrar && productosAMostrar.length > 0) {
    productosAMostrar.forEach(function (prod) {
      const precioConDescuento = prod.descuento_porcentaje
        ? prod.precio - (prod.precio * prod.descuento_porcentaje) / 100
        : prod.precio;
      const cardHtml = `
        <div class="flex flex-col bg-gray-50 dark:bg-[#23272f] border dark:border-gray-700 rounded-xl shadow hover:shadow-lg transition duration-300 p-0 overflow-hidden h-[420px] sm:h-[450px] md:h-[470px] aspect-[3/4] max-w-xs mx-auto w-full min-w-0">
          <img src="${prod.foto_producto || "/images/1.jpg"}" alt="${
        prod.nombre
      }" class="w-full h-2/5 min-h-[120px] max-h-[180px] object-cover rounded-t-xl">
          <div class="flex flex-col flex-1 p-3 md:p-4 justify-between">
            <div>
              <h3 class="text-sm sm:text-base md:text-lg font-semibold mb-1 text-center dark:text-white">${
                prod.nombre
              }</h3>
              <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2 text-center">${
                prod.descripcion
              }</p>
            </div>
            <div class="text-orange-600 font-bold text-xs sm:text-sm md:text-base text-center">
              ${
                prod.descuento_porcentaje
                  ? `<span class="text-green-600 dark:text-green-500">MX$${precioConDescuento.toLocaleString()}</span> <span class="text-xs md:text-sm text-gray-400 dark:text-gray-500 line-through ml-1">MX$${prod.precio.toLocaleString()}</span>`
                  : `MX$${prod.precio.toLocaleString()}`
              }
            </div>
            ${
              prod.descuento_porcentaje
                ? `<div class="text-green-600 dark:text-green-500 text-xs md:text-sm mb-1 text-center">-${prod.descuento_porcentaje}% de descuento</div>`
                : ""
            }
            <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 text-center">
              <span class="ml-2">${
                prod.proveedor_nombre || "Sin proveedor"
              }</span>
            </div>
            <a href="${
              prod.stock > 0 ? `/producto/${prod.id}` : "/busqueda"
            }" class="mt-auto w-full text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 text-sm sm:text-base md:text-lg py-1.5 md:py-2 bg-[#2a2e37] dark:bg-[#100804] rounded-lg font-semibold transition active:scale-95 text-center">
              <i data-feather="arrow-up-left" class="inline-block w-4 h-4 mr-1"></i> 
              ${prod.stock > 0 ? "Ver Más" : "Sin stock"}
            </a>
            ${
              prod.stock > 0
                ? `
              <button onclick="addToCarrito(${prod.id})" class="mt-auto w-full text-orange-600 hover:text-orange-700 dark:text-orange-500 dark:hover:text-orange-400 text-sm sm:text-base md:text-lg py-1.5 md:py-2 bg-gray-100 dark:bg-[#2a2e37] rounded-lg font-semibold transition active:scale-95 text-center">
                <i data-feather="shopping-cart" class="inline-block w-4 h-4 mr-1"></i> 
                Añadir
              </button>`
                : ""
            }
          </div>
        </div>
      `;
      catalogo.insertAdjacentHTML("beforeend", cardHtml);
    });
    feather.replace(); // Asegúrate de reemplazar los iconos después de agregar los elementos
  } else {
    catalogo.innerHTML = `<div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">No hay productos para mostrar.</div>`;
  }
}

const addToCarrito = async (id_producto) => {
  try {
    const response = await fetch(`/api/agregar-carrito/${id_producto}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "same-origin",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    abrirModal(data.title, data.message);
  } catch (err) {
    console.error(err);
    abrirModal("Error", "Sucedio un error al agregar al carrito");
  }
};

// EVENTO PRINCIPAL AL CARGAR EL DOCUMENTO
document.addEventListener("DOMContentLoaded", () => {
  // MUESTRA EL CARRUSEL DE DESTACADAS
  mostrarDestacadasCarrusel();
  // Inicialmente, muestra todos los productos en el catálogo
  mostrarBicicletas(productosBackend);

  // AGREGA EVENTO AL BOTÓN DE BÚSQUEDA PARA BUSCAR AL HACER CLICK
  const btnBuscar = document.getElementById("btn-buscar");
  const inputBusqueda = document.getElementById("input-busqueda");
  if (btnBuscar) {
    btnBuscar.addEventListener("click", function () {
      const texto = inputBusqueda.value.trim();
      if (texto !== "") {
        window.location.href = `/busqueda?search=${encodeURIComponent(texto)}`;
      }
    });
  }
  // TAMBIÉN PERMITE BUSCAR AL PRESIONAR ENTER EN EL INPUT
  inputBusqueda.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      const texto = inputBusqueda.value.trim();
      if (texto !== "") {
        window.location.href = `/busqueda?search=${encodeURIComponent(texto)}`;
      }
    }
  });
});
