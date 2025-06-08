// routes/authRoutes.js
import { Router } from "express";
const router = Router();
import { forgotPasswordPage, forgotPassword, resetPasswordPage, resetPassword } from "../controllers/resetPasswordController.js";

// Se necesitan las estrategias de google y github para poder usar el login de ambos
import passport from "../config/passport.js";

// Importacion del controlador de autenticacion
import { setAuthCookies, loginPage, login, registerPage, register, logout, generateAccessToken, generateRefreshToken } from "../controllers/authController.js";
import redirectIfAuthenticated from "../middlewares/redirectIfAuthenticated.js";

// Reemplaza el uso de require por import para RefreshToken
import RefreshToken from "../models/RefreshToken.js";

//Rutas de github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Despues de la autenticacion se dirije siempre a esta ruta
router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login", // Redirige a /auth/login si la autenticación falla
    session: false,
  }),
  async (req, res) => {
    try {
      // Se obtiene el usuario autenticado
      const user = req.user;
      // Se importan las funciones para generar tokens desde el controlador

      // Se generan los tokens utilizando el payload del usuario
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await RefreshToken.createToken({ user_id: user.id, token: refreshToken });
      setAuthCookies(res, accessToken, refreshToken);

      // Redirige al usuario a la página de inicio
      res.redirect("/");
    } catch (error) {
      console.error("Error al guardar refresh token (GitHub):", error);
      res.status(500).send("ERROR AL GUARDAR REFRESH TOKEN");
    }
  }
);

//Rutas de google

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: false,
  }),
  async (req, res) => {
    try {
      // Se obtiene el usuario autenticado
      const user = req.user;

      // Genera los tokens de acceso y refresh
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      await RefreshToken.createToken({ user_id: user.id, token: refreshToken });
      setAuthCookies(res, accessToken, refreshToken);

      res.redirect("/");
    } catch (error) {
      console.error("Error al guardar refresh token (Google):", error);
      res.status(500).send("ERROR AL GUARDAR REFRESH TOKEN");
    }
  }
);

//Rutas para inicio de sesion y registro
router.get("/login", redirectIfAuthenticated, loginPage);
router.post("/login", login);
router.get("/register", redirectIfAuthenticated, registerPage);
router.post("/register", register);

//Rutas relacionadas con autenticacion
// router.post("/token", authController.refreshAccessToken);
router.get("/logout", logout);

//Rutas para restablecer la contraseña

// Página para solicitar el restablecimiento (ingresar email)
router.get("/forgot", forgotPasswordPage);

// Procesa el formulario de solicitud de restablecimiento
router.post("/forgot", forgotPassword);

// Página en la que el usuario ingresa su nueva contraseña (accedida a través del enlace en el correo)
router.get("/reset", resetPasswordPage);

// Procesa el envío de la nueva contraseña y actualiza la base de datos
router.post("/reset", resetPassword);

export default router;

