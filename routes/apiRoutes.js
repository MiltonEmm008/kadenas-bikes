// routes/apiRoutes.js

import { Router } from "express";
const router = Router();
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllSuppliers,
  getDashboardCounts,
  getCarousellPhotos,
  getCategoryCounts,
} from "../controllers/productoController.js";
import {
  getIncidencias,
  sendIncidenciaResponse,
} from "../controllers/incidenciaController.js";
import { handleFavorito } from "../controllers/reseñaController.js";
import {
  getAllSuppliers as getSuppliers,
  getSupplierById,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../controllers/proveedorController.js";
import { getIncidenciasRecientes } from "../controllers/incidenciaController.js";
import multer, { diskStorage } from "multer";
import { dirname, join, extname } from "path";
import { fileURLToPath } from "url";
import { enviarMensaje } from "../controllers/emailController.js";
import {
  getAllUsers,
  addSaldo,
  deleteUser,
  createAdmin,
  updateAdmin,
  getAllAdmins,
  getAdminById,
  checkUserRole,
  updateUserProfile,
} from "../controllers/userController.js";
import {
  getMonthSales,
  createPedido,
  cancelarPedido,
  getAllPedidos,
  updatePedidoEstado,
  solicitarDevolucion,
} from "../controllers/pedidoController.js";
import {
  addToCarrito,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  getSalesOfMonth
} from "../controllers/ecommerceController.js";
import {
  generateUserReport,
  generateProductReport,
  generateSalesReport
} from "../controllers/reporteController.js";

// Solución ES Modules para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "..", "public", "productos"));
  },
  filename: function (req, file, cb) {
    // Nombre temporal, se renombrará en el controlador
    const ext = extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const profileStorage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, "..", "public", "perfil"));
  },
  filename: function (req, file, cb) {
    // Nombre temporal, se renombrará en el controlador
    const ext = extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png"];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Solo se permiten imágenes .jpg, .jpeg, .png"));
  },
});

const uploadProfile = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    const allowed = [".jpg", ".jpeg", ".png", ".gif"];
    const ext = extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Solo se permiten imágenes .jpg, .jpeg, .png, .gif"));
  },
});

// Ruta para obtener todos los productos
router.get("/productos", getAllProducts);

// Ruta para crear un nuevo producto
router.post("/productos", upload.single("foto_producto"), createProduct);

// Ruta para actualizar un producto por ID
router.put("/productos/:id", upload.single("foto_producto"), updateProduct);

// Ruta para eliminar un producto por ID
router.delete("/productos/:id", deleteProduct);

// Ruta para obtener todos los proveedores
router.get("/proveedores", getSuppliers);

// Ruta para obtener los conteos para el dashboard
router.get("/dashboard-counts", getDashboardCounts);

//Ruta para obtener los datos del grafico de pastel de categorias
router.get("/chart-category-count", getCategoryCounts);

router.get("/ingresos-mes",getSalesOfMonth)

router.get("/incidencias-rec", getIncidenciasRecientes);

//Ruta para obtener las fotos del carrusel
router.get("/fotos-carrusel", getCarousellPhotos);

// Ruta para obtener un proveedor por ID
router.get("/proveedores/:id", getSupplierById);

// Ruta para crear un nuevo proveedor
router.post("/proveedores", createSupplier);

// Ruta para actualizar un proveedor por ID
router.put("/proveedores/:id", updateSupplier);

// Ruta para eliminar un proveedor por ID
router.delete("/proveedores/:id", deleteSupplier);

// Ruta para cambiar agregar el producto a favorito
router.post("/manejar-favorito/:id_producto", handleFavorito);

router.get("/soporte", getIncidencias);

router.post("/enviar-respuesta-soporte", sendIncidenciaResponse);

// Ruta para enviar mensajes (usada tanto para soporte como para proveedores)
router.post("/enviar-mensaje", enviarMensaje);

// Reporte PDF de usuarios
router.get("/reportes/usuarios/pdf", generateUserReport);
router.get("/reportes/productos/pdf", generateProductReport);
router.get("/reportes/ventas/pdf", generateSalesReport);

// Rutas para usuarios
router.get("/usuarios", getAllUsers);
router.post("/usuarios/:id/saldo", addSaldo);
router.delete("/usuarios/:id", deleteUser);
router.put("/usuarios/:id/perfil", uploadProfile.single("foto_perfil"), updateUserProfile);

// Rutas para administradores
router.get("/check-role", checkUserRole);
router.get("/admins", getAllAdmins);
router.get("/admins/:id", getAdminById);
router.post("/admins", createAdmin);
router.put("/admins/:id", updateAdmin);
router.post("/admins/:id/saldo", addSaldo);
router.delete("/admins/:id", deleteUser);

// Rutas para los pedidos
router.get("/pedidos", getAllPedidos);
router.get("/obtener-ventas", getMonthSales);
router.post("/crear-pedido", createPedido);
router.patch("/cancelar-pedido/:id", cancelarPedido);
router.patch("/pedidos/:id/estado", updatePedidoEstado);
router.post("/pedidos/:id/devolucion", solicitarDevolucion);

// Rutas para manejar el carrito
router.post("/agregar-carrito/:id", addToCarrito);
router.delete("/carrito/:id", removeFromCart);
router.patch("/carrito/incrementar/:id", increaseQuantity);
router.patch("/carrito/decrementar/:id", decreaseQuantity);

export default router;
