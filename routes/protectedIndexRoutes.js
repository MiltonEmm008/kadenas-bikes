// routes/protectedIndexRoutes.js
import { Router } from "express";
const router = Router();
import { authenticateToken } from "../middlewares/authenticateToken.js";
import {
  renderCarritoPage,
  renderBusquedaPage,
  renderMisPedidosPage,
  renderPerfilPage,
  renderProductoPage,
  renderFavoritoPage,
  renderAdminDashboard,
} from "../controllers/indexController.js";
import { getChat, postChat } from "../controllers/chatController.js";
import refreshTokenMiddleware from "../middlewares/refreshTokenMiddleware.js";

// Todas las rutas protegidas pasan primero por el middleware
router.use(refreshTokenMiddleware);

// Rutas solo accesibles si el usuario se registro o inicio sesión
router.get("/busqueda", authenticateToken, renderBusquedaPage);
router.get("/carrito", authenticateToken, renderCarritoPage);
router.get("/chat", authenticateToken, getChat);
router.post("/chat", authenticateToken, postChat);

router.get("/perfil", authenticateToken, renderPerfilPage);
router.get("/mis-pedidos", authenticateToken, renderMisPedidosPage);
router.get("/producto/:id", authenticateToken, renderProductoPage);
router.get("/producto", authenticateToken, (req, res) => {
  return res.redirect("/");
});
router.get("/favoritos", authenticateToken, renderFavoritoPage);

// Protege la ruta de admin SOLO con authenticateToken, el rol se valida en el controlador
router.get("/admin", authenticateToken, renderAdminDashboard);

export default router;
