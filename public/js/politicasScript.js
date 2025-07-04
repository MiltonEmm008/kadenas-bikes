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