// routes/indexRoutes.js
import { Router } from "express";
const router = Router();
import { renderWelcomePage, renderNosotrosPage, renderPoliticasPage } from "../controllers/indexController.js";
import refreshTokenMiddleware from "../middlewares/refreshTokenMiddleware.js";
import { roleBasedRedirect } from "../middlewares/roleRedirect.js";

// Todas las rutas protegidas pasan primero por el middleware
router.use(refreshTokenMiddleware);
router.use(roleBasedRedirect);

// Si accede a una de estas rutas, se redirecciona
router.get("/login", (req, res) => res.redirect("/auth/login"));
router.get("/register", (req, res) => res.redirect("/auth/register"));

// Rutas publicas que renderizan vistas
router.get("/", renderWelcomePage);
router.get("/nosotros", renderNosotrosPage);
router.get("/politicas", renderPoliticasPage);

export default router;
