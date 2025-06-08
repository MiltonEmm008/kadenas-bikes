async function fetchPhotos() {
  try {
    let response = await fetch("/api/fotos-carrusel");
    const carousel = document.getElementById("carousel-inner-container");
    if (!carousel) {
      return;
    }
    if (!response.ok) {
      carousel.innerHTML = `<p class="text-3xl text-center text-red-600 font-extrabold">NO SE ENCONTRARON PRODUCTOS ACTUALMENTE (Error de red)</p>`;
      return;
    }
    const data = await response.json();
    const products = Array.isArray(data.photos) ? data.photos : [];
    if (products.length === 0) {
      carousel.innerHTML = `<p class="text-3xl text-center text-red-600 font-extrabold">NO SE ENCONTRARON PRODUCTOS ACTUALMENTE</p>`;
      return;
    }
    let carouselHTML = products
      .map((product, idx) => {
        if (!product.foto_producto || !product.nombre) {
          return "";
        }
        const itemClass = idx === 0 ? "carousel-item active absolute inset-0 w-full h-full" : "carousel-item hidden absolute inset-0 w-full h-full";
        return `<div class="${itemClass}" id="${product.nombre}-${product.foto_producto}">
              <img
                src="${product.foto_producto}"
                class="w-full h-full object-cover"
                alt="${product.nombre}"
                onerror="this.onerror=null;this.src='/images/4.jpg';"
              />
              <div
                class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-4 text-center"
              >
                <h5 class="text-xl font-bold mb-2">${product.nombre}</h5>
                <p class="mb-4">${product.descripcion || ""}</p>
              </div>
            </div>`;
      })
      .join("");
    carouselHTML += `<!-- Controles del carrusel -->
          <button
            class="carousel-prev absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            ❮
          </button>
          <button
            class="carousel-next absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition"
          >
            ❯
          </button>`;
    carousel.innerHTML = carouselHTML;
    new Carousel(carousel);
  } catch (err) {
    const carousel = document.getElementById("carousel-inner-container");
    if (carousel) {
      carousel.innerHTML = `<p class=\"text-3xl text-center text-red-600 font-extrabold\">ERROR AL CARGAR EL CARRUSEL</p>`;
    }
  }
}

// INICIALIZAR AOS Y FEATHER ICONS
// Carrusel personalizado con transicion suave
class Carousel {
  constructor(container) {
    this.container = container;
    this.items = Array.from(container.querySelectorAll(".carousel-item"));
    this.currentIndex = 0;
    this.inner = container.querySelector(".carousel-inner");
    this.transitioning = false;
    this.init();
  }

  init() {
    const prevBtn = this.container.querySelector(".carousel-prev");
    const nextBtn = this.container.querySelector(".carousel-next");
    if (!prevBtn || !nextBtn) {
      return;
    }
    prevBtn.addEventListener("click", () => {
      this.prev();
    });
    nextBtn.addEventListener("click", () => {
      this.next();
    });
    this.showItem(this.currentIndex, false);
  }

  showItem(index, animate = true) {
    if (this.transitioning) return;
    this.transitioning = true;
    this.items.forEach((item, i) => {
      if (i === index) {
        item.classList.remove("hidden");
        if (animate) {
          item.classList.add("opacity-0");
          setTimeout(() => {
            item.classList.add("transition-opacity", "duration-500");
            item.classList.remove("opacity-0");
          }, 10);
        } else {
          item.classList.remove(
            "opacity-0",
            "transition-opacity",
            "duration-500"
          );
        }
      } else {
        item.classList.add("hidden");
        item.classList.remove(
          "opacity-0",
          "transition-opacity",
          "duration-500"
        );
      }
    });
    setTimeout(() => {
      this.transitioning = false;
    }, 520);
  }

  prev() {
    if (this.transitioning) return;
    const prevIndex =
      (this.currentIndex - 1 + this.items.length) % this.items.length;
    this.currentIndex = prevIndex;
    this.showItem(this.currentIndex);
  }

  next() {
    if (this.transitioning) return;
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.currentIndex = nextIndex;
    this.showItem(this.currentIndex);
  }
}

// Scroll suave para los enlaces internos
document.addEventListener("DOMContentLoaded", () => {
  fetchPhotos();
  AOS.init({ duration: 1000 });
  feather.replace();
  // Scroll suave para todos los enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 70,
          behavior: "smooth",
        });
      }
    });
  });
});

// MENU HAMBURGUESA RESPONSIVE PARA MOVIL
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

if (perfil_toggle && menu_perfil) {
  perfil_toggle.addEventListener("click", function (e) {
    e.preventDefault();
    if (menu.classList.contains("hidden")) {
      menu_perfil.classList.toggle("hidden");
    } else {
      menu.classList.add("hidden");
      menu_perfil.classList.remove("hidden");
    }
  });
}

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle.addEventListener("click", function () {
  if (menu_perfil && perfil_toggle) {
    if (menu_perfil.classList.contains("hidden")) {
      menu.classList.toggle("hidden");
    } else {
      menu_perfil.classList.add("hidden");
      menu.classList.remove("hidden");
    }
  } else {
    menu.classList.toggle("hidden");
  }
});

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

//ENVIAR EL CORREO
const contactForm = document.getElementById("formulario-contacto");
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Evita el reload de la página
    console.log("submit interceptado");

    // Recoger los datos del formulario (podrías usar FormData)
    const formData = new FormData(this);
    const datos = Object.fromEntries(formData.entries());
    console.log(datos);

    // Enviar el formulario vía fetch (o tu método preferido)
    fetch("/email/enviar-mensaje", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_contacto: datos.nombre_contacto,
        correo_contacto: datos.correo_contacto,
        mensaje_contacto: datos.mensaje_contacto,
      }),
    })
      .then((response) => response.json())
      .then((msg) => {
        abrirModal(msg.titulo, msg.mensaje);
        contactForm.reset();
      })
      .catch((error) => {
        console.error("Error al enviar el email:", error);
        abrirModal("ERROR", "ERROR AL MANDAR EL CORREO, INTENTALO MÁS TARDE");
      });
  });
}
