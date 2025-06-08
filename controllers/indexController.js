// controllers/indexController.js
// importar el modelo de usuario
import Usuario from "../models/Usuario.js";
// importar el modelo de producto
import Producto from "../models/Producto.js";
// importar el modelo de favorito
import Favorito from "../models/Favorito.js";
// importar el modelo de itemcarrito
import ItemCarrito from "../models/ItemCarrito.js";

import Pedido from "../models/Pedido.js";

// funcion auxiliar para obtener los datos completos del usuario a partir de su id
async function getDataOfUser(id) {
  // buscar el usuario por su id
  const usuarioEncontrado = await Usuario.findUsuarioById(id);
  // si el usuario es encontrado, devolverlo en un objeto
  if (usuarioEncontrado) {
    return { user: usuarioEncontrado };
  }
  // si no se encuentra, devolver user como nulo
  return { user: null };
}

/**
 * funcion generadora para renderizar cualquier vista
 * verifica si req.user ya fue asignado (por ejemplo por un middleware) y,
 * de ser asi, usa el id para obtener los datos completos del usuario
 * si no, se renderiza la vista con user: null
 *
 * @param {string} view nombre de la vista (ej. "bienvenida", "nosotros")
 */
function renderPage(view) {
  // devolver una funcion asincrona que sera el handler de la ruta
  return async (req, res) => {
    // si req.user existe y tiene un id (asignado por un middleware)
    if (req.user && req.user.id) {
      // obtener los datos completos del usuario usando el id
      const userData = await getDataOfUser(req.user.id);
      // renderizar la vista con los datos del usuario
      return res.render(view, userData);
    } else {
      // si no hay datos de usuario, renderizar la vista con user nulo
      return res.render(view, { user: null });
    }
  };
}

/**
 * renderiza la pagina de busqueda pasando usuario y productos
 * si ocurre un error, renderiza la vista de error
 */
export const renderBusquedaPage = async (req, res) => {
  try {
    // obtener datos del usuario, si existe un id en req.user
    const userData =
      req.user && req.user.id
        ? await getDataOfUser(req.user.id)
        : { user: null };

    let productosData;

    // asignar valores vacios si no vienen parametros en la query
    const queryCategory = req.query.category || "";
    const querySearch = req.query.search || "";

    // si se proporciono la categoria, normalizarla (primera letra mayuscula, resto minuscula)
    const category = queryCategory
      ? `${queryCategory.charAt(0).toUpperCase()}${queryCategory
          .slice(1)
          .toLowerCase()}`.trim()
      : "";
    // normalizar el termino de busqueda (a minusculas y sin espacios extra)
    const search = querySearch ? querySearch.toLowerCase().trim() : "";

    // si se especifico una categoria
    if (category) {
      // si la categoria es "todos", obtener todos los productos con join de proveedor
      if (category === "Todos") {
        productosData = await Producto.allWithSupplierJoinForSearch();
        return res.render("busqueda", {
          ...userData,
          productos: productosData,
        });
      }

      // si es una categoria especifica, buscar productos por esa categoria
      productosData = await Producto.searchByCategory(category);
      return res.render("busqueda", { ...userData, productos: productosData });
    }

    // si se especifico un termino de busqueda
    if (search) {
      // obtener todos los productos con join de proveedor para filtrar
      productosData = await Producto.allWithSupplierJoin();

      // filtrar productos cuyos nombre, marca o categoria incluyan el termino de busqueda
      let productosFiltrados = productosData.filter(
        (producto) =>
          producto.nombre.trim().toLowerCase().includes(search) ||
          producto.marca.trim().toLowerCase().includes(search) ||
          producto.categoria.trim().toLowerCase().includes(search)
      );

      // renderizar la pagina de busqueda con los productos filtrados
      return res.render("busqueda", {
        ...userData,
        productos: productosFiltrados,
      });
    }

    // si no hay categoria ni busqueda, obtener un limite de 25 productos
    productosData = await Producto.allWithLimit(25);
    return res.render("busqueda", { ...userData, productos: productosData });
  } catch (error) {
    // registrar cualquier error en consola
    console.error("error en renderbusquedapage:", error);
    // renderizar una pagina de error en caso de fallo
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar la búsqueda.",
      },
    });
  }
};

export const renderProductoPage = async (req, res) => {
  try {
    // obtener los datos del usuario
    const userData = await getDataOfUser(req.user.id);
    // convertir el parametro id de la url a numero
    const id = Number(req.params.id);
    // obtener los datos del producto por su id
    const productData = await Producto.findById(id);

    // si se obtuvieron datos del usuario y del producto
    if (userData && productData) {
      // obtener productos relacionados por categoria, excluyendo el producto actual
      const productosRelacionados = await Producto.getReleatedProducts(
        productData.categoria,
        productData.id
      );
      // verificar si el producto es favorito del usuario
      const esFavorito = await Favorito.findByUsuarioIdAndProductoId(
        userData.user.id,
        productData.id
      );
      // renderizar la pagina de producto con todos los datos
      return res.render("producto", {
        ...userData,
        producto: productData,
        relacionados: productosRelacionados,
        favorito: esFavorito,
      });
    } else {
      // si no se encuentra el producto, renderizar error 404
      return res.status(404).render("error", {
        error: {
          title: "error 404",
          message: "no se encontro el producto",
        },
      });
    }
  } catch (err) {
    // registrar cualquier error interno al renderizar el producto
    console.log("error interno al renderizar el producto: ", err);
    // renderizar una pagina de error 500
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar el producto",
      },
    });
  }
};

export const renderFavoritoPage = async (req, res) => {
  try {
    // obtener los datos del usuario
    const userData = await getDataOfUser(req.user.id);
    // obtener el id del usuario desde req.user
    const usuario_id = req.user.id;
    // buscar todos los favoritos del usuario
    const favoritos = await Favorito.findAllByUsuarioId(usuario_id);
    // renderizar la pagina de favoritos con los datos del usuario y sus favoritos
    return res.render("favorito", {
      ...userData,
      favoritos: favoritos,
    });
  } catch (err) {
    // registrar cualquier error interno al renderizar los favoritos
    console.log("error interno al renderizar los favoritos: ", err);
    // renderizar una pagina de error 500
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar los favoritos",
      },
    });
  }
};

export const renderCarritoPage = async (req, res) => {
  try {
    const userData = await getDataOfUser(req.user.id);
    const elementosCarrito = await ItemCarrito.findByUsuarioId(req.user.id);

    // Calcular subtotal e impuestos
    let subtotal = 0;
    let impuestos = 0;

    for (const item of elementosCarrito) {
      // Calcular precio con descuento
      const precioDesc =
        item.descuento_porcentaje > 0
          ? item.precio - (item.precio * item.descuento_porcentaje) / 100
          : item.precio;
      const subtotalItem = precioDesc * item.cantidad;
      subtotal += subtotalItem;
      impuestos += subtotalItem * 0.16;
    }

    // Opcional: Redondear a dos decimales
    subtotal = Math.round(subtotal * 100) / 100;
    impuestos = Math.round(impuestos * 100) / 100;

    return res.render("carrito", {
      ...userData,
      carrito: elementosCarrito,
      subtotal,
      impuestos,
      total: subtotal + impuestos,
    });
  } catch (err) {
    console.log("error interno al renderizar el carrito: ", err);
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar el carrito",
      },
    });
  }
};

export const renderMisPedidosPage = async (req, res) => {
  try {
    const userData = await getDataOfUser(req.user.id);
    const pedidos = await Pedido.findByUsuarioId(req.user.id);
    return res.render("mis-pedidos", {
      ...userData,
      pedidos: pedidos,
    });
  } catch (err) {
    console.log("error interno al renderizar los pedidos: ", err);
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar los pedidos",
      },
    });
  }
};

// exportar funciones especificas reutilizando renderpage para paginas estaticas
export const renderWelcomePage = renderPage("bienvenida");
export const renderNosotrosPage = renderPage("nosotros");
export const renderPoliticasPage = renderPage("politicas");
// export const renderCarritoPage = renderPage("carrito");
export const renderPerfilPage = renderPage("userPerfil");
// export const renderFavoritoPage = renderPage("favorito"); // esta linea esta comentada en el original
export const renderAdminDashboard = async (req, res) => {
  try {
    // Verifica que el usuario esté autenticado y tenga el rol adecuado
    if (!req.user || !req.user.id) {
      return res.status(403).render("error", {
        error: {
          title: "Acceso denegado",
          message: "Debes iniciar sesión como administrador para acceder a esta página.",
        },
      });
    }
    // Obtener datos completos del usuario
    const userData = await getDataOfUser(req.user.id);
    if (!userData.user || (userData.user.rol !== "administrador" && userData.user.rol !== "superadmin")) {
      return res.status(403).render("error", {
        error: {
          title: "Acceso denegado",
          message: "No tienes permisos para acceder a esta página.",
        },
      });
    }
    // Renderizar dashboard si el usuario tiene permisos
    return res.render("admin-dashboard", userData);
  } catch (err) {
    console.error("error interno al renderizar el dashboard de admin: ", err);
    return res.status(500).render("error", {
      error: {
        title: "error 500",
        message: "error interno al cargar el dashboard de administrador",
      },
    });
  }
};
