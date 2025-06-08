// middlewares/roleRedirect.js
export function roleBasedRedirect(req, res, next) {
  // Si es una ruta de API o un archivo estático, continuar sin redirección
  if (
    req.path.startsWith('/api/') || 
    req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/) ||
    req.path === '/favicon.ico' ||
    req.path.startsWith('/socket.io/')
  ) {
    return next();
  }

  const user = req.user;
  const userRole = user && user.rol;
  
  // Rutas permitidas para administradores (además de /admin)
  const adminAllowedPaths = [
    '/auth/logout',  // Ruta de logout
    '/admin',        // Ruta principal de admin
    '/admin/'        // Cualquier subruta de admin
  ];

  if (userRole === "administrador" || userRole === "superadmin") {
    // Verificar si la ruta actual está permitida para administradores
    const isAllowedPath = adminAllowedPaths.some(path => 
      req.path === path || 
      (path.endsWith('/') && req.path.startsWith(path))
    );

    // Si no es una ruta permitida, redirigir a /admin
    if (!isAllowedPath) {
      return res.redirect('/admin');
    }
  } else {
    // Si no es administrador y está intentando acceder a /admin, redirigir a la página principal
    if (req.path.startsWith('/admin')) {
      return res.redirect('/');
    }
  }

  // Continuar al siguiente middleware o ruta
  next();
}