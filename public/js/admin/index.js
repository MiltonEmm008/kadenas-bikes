// Punto de entrada para admin modular
import { getInicioHTML, initInicio } from "./sections/inicio.js";
import { getProductosHTML, initProductos } from "./sections/productos.js";
import { getSoporteHTML, initSoporte } from "./sections/soporte.js";
import { getProveedoresHTML, initProveedores } from "./sections/proveedores.js";
import { getUsuariosHTML, initUsuarios } from "./sections/usuarios.js";
import { getAdministradoresHTML, initAdministradores } from "./sections/administradores.js";
import { getReportesHTML, initReportes } from "./sections/reportes.js";
import { getPedidosHTML, initPedidos } from "./sections/pedidos.js";

window.adminSections = {
  sections: {
    inicio: {
      html: getInicioHTML,
      title: "Panel de Administración",
      init: initInicio,
    },
    productos: {
      html: getProductosHTML,
      title: "Gestión de Productos",
      init: initProductos,
    },
    pedidos: {
      html: getPedidosHTML,
      title: "Gestión de Pedidos",
      init: initPedidos,
    },
    soporte: {
      html: getSoporteHTML,
      title: "Incidencias y Soporte",
      init: initSoporte,
    },
    proveedores: {
      html: getProveedoresHTML,
      title: "Gestión de Proveedores",
      init: initProveedores,
    },
    usuarios: {
      html: getUsuariosHTML,
      title: "Gestión de Usuarios",
      init: initUsuarios,
    },
    administradores: {
      html: getAdministradoresHTML,
      title: "Gestión de Administradores",
      init: initAdministradores,
    },
    reportes: {
      html: getReportesHTML,
      title: "Reportes",
      init: initReportes,
    },
  },
};
