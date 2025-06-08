// middlewares/authenticateToken.js
export const authenticateToken = (req, res, next) => {
  if (!req.user) {
    // Si no existe req.user, significa que ni el access token ni el refresh token
    // fueron válidos, por lo que se redirige al login.
    return res.redirect("/auth/login");
  }
  next();
};