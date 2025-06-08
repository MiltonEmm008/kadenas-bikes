// middlewares/refreshTokenMiddleware.js
import pkg from "jsonwebtoken";
const { verify } = pkg;
import { generateAccessToken } from "../controllers/authController.js";
import RefreshToken from "../models/RefreshToken.js";
import Usuario from "../models/Usuario.js";

const refreshTokenMiddleware = async (req, res, next) => {
  let accessToken = req.cookies && req.cookies.access_token;

  try {
    // Intentamos verificar el access token
    const decoded = verify(accessToken, process.env.JWT_SECRET);
    req.user = decoded; // Si es válido, adjunta la información del usuario a la request
    return next();
  } catch (err) {
    const refreshToken = req.cookies && req.cookies.refresh_token;
    if (!refreshToken) {
      // Si no hay refresh token, simplemente asignamos null y continuamos
      req.user = null;
      return next();
    }

    try {
      // Verificamos que el refresh token exista en la base de datos
      const tokenData = await RefreshToken.findToken(refreshToken);
      if (!tokenData) {
        req.user = null;
        return next();
      }

      // Verifica el refresh token usando el secret adecuado
      const decodedRefresh = verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      // Buscar el usuario en la base de datos para obtener el rol
      const user = await Usuario.findUsuarioById(decodedRefresh.id);
      if (!user) {
        req.user = null;
        return next();
      }

      // Generamos un nuevo access token con el rol correcto
      const newAccessToken = generateAccessToken({
        id: user.id,
        rol: user.rol,
      });

      // Actualizamos la cookie del access token
      res.cookie("access_token", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 60 * 1000,
        sameSite: "lax",
      });

      // Actualizamos también req.user para continuar como autenticado
      req.user = verify(newAccessToken, process.env.JWT_SECRET);
      return next();
    } catch (refreshError) {
      console.error("Error al renovar token:", refreshError);
      req.user = null;
      return next();
    }
  }
};

export default refreshTokenMiddleware;