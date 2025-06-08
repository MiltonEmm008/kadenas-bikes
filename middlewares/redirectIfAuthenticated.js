// models/redirectIfAuthenticated.js
import pkg from 'jsonwebtoken';
const { verify } = pkg;

/*
  Middleware para redirigir al usuario si ya está autenticado.
  Verifica que la cookie "access_token" contenga un token válido:
    - Si no hay token o es inválido, se continúa con el flujo (por ejemplo, para acceder a la página de login).
    - Si el token es válido, se redirige al usuario a "/dashboard".
*/
const redirectIfAuthenticated = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    // No hay token, así que continúa al siguiente middleware o controlador.
    return next();
  }
  // Se verifica el token con el secret configurado.
  verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      // Si ocurre un error (token expirado o mal formado), se continúa el flujo.
      return next();
    }
    // Si el token es válido, redirecciona al dashboard.
    return res.redirect("/");
  });
};

export default redirectIfAuthenticated;