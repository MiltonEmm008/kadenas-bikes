// importar funciones de jsonwebtoken
import pkg from "jsonwebtoken";
// extraer la funcion 'sign' del paquete
const { sign } = pkg;
// importar el modelo de usuario
import Usuario from "../models/Usuario.js";
// importar el modelo de refresh token
import RefreshToken from "../models/RefreshToken.js";

// funcion para generar tokens
const generateToken = (option, user, secret, expiresIn) => {
  // segun la opcion, generar un token diferente
  switch (option) {
    // opcion 1: token con id y rol
    case 1:
      return sign(
        {
          id: user.id,
          rol: user.rol,
        },
        secret,
        { expiresIn }
      );
    // opcion 2: token solo con id
    case 2:
      return sign(
        {
          id: user.id,
        },
        secret,
        { expiresIn }
      );
  }
};

// funcion para generar un access token
const generateAccessToken = (user) =>
  // usar generate token con opcion 1 y la clave secreta de acceso
  generateToken(1, user, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN);

// funcion para generar un refresh token
const generateRefreshToken = (user) =>
  // usar generate token con opcion 2 y la clave secreta de refresh
  generateToken(
    2,
    user,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN
  );

// funcion para configurar las cookies de autenticacion
const setAuthCookies = (res, accessToken, refreshToken) => {
  // establecer la cookie de access token
  res.cookie("access_token", accessToken, {
    httpOnly: true, // solo accesible por el servidor
    maxAge: 60 * 60 * 1000, // expira en 1 hora
    sameSite: "lax", // protege contra ataques csrf
  });

  // establecer la cookie de refresh token
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true, // solo accesible por el servidor
    maxAge: 7 * 24 * 60 * 60 * 1000, // expira en 7 dias
    sameSite: "lax", // protege contra ataques csrf
  });
};

// pagina de inicio de sesion
const loginPage = (req, res) => res.render("login");
// pagina de registro
const registerPage = (req, res) => res.render("register");

// funcion para iniciar sesion
const login = async (req, res) => {
  // extraer correo y contraseña del cuerpo de la peticion
  const { correo, contra } = req.body;
  // verificar si faltan datos
  if (!correo || !contra) {
    return res.status(400).send({ titulo: "ERROR", mensaje: "FALTAN DATOS" });
  }

  try {
    // buscar usuario por correo
    const user = await Usuario.findUsuarioByCorreo(correo);
    // si no se encuentra el usuario
    if (!user)
      return res
        .status(400)
        .send({ titulo: "ERROR", mensaje: "NO SE ENCONTRO AL USUARIO" });

    // verificar la contraseña
    const valid = await user.checkPassword(contra);
    // si la contraseña es incorrecta
    if (!valid)
      return res
        .status(400)
        .send({ titulo: "ERROR", mensaje: "CONTRASEÑA INCORRECTA" });

    // generar access y refresh tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // guardar el refresh token en la base de datos
    await RefreshToken.createToken({ user_id: user.id, token: refreshToken });
    // establecer las cookies de autenticacion
    setAuthCookies(res, accessToken, refreshToken);

    // enviar respuesta de exito
    return res
      .status(200)
      .send({ titulo: "ÉXITO", mensaje: "REDIRECCIONANDO..." });
  } catch (error) {
    // registrar el error en consola
    console.error(error);
    // enviar respuesta de error del servidor
    return res.status(500).send({
      titulo: "ERROR",
      mensaje: "SURGIO UN ERROR AL INICIAR SESIÓN, INTENTALO MÁS TARDE",
    });
  }
};

// funcion para registrar un nuevo usuario
const register = async (req, res) => {
  // extraer correo, nombre de usuario y contraseña del cuerpo de la peticion
  const { correo, nombre_usuario, contra } = req.body;
  // verificar si faltan datos
  if (!correo || !nombre_usuario || !contra)
    return res.status(400).send({ titulo: "ERROR", mensaje: "FALTAN DATOS" });

  try {
    // buscar si el correo ya esta registrado
    const existingUser = await Usuario.findUsuarioByCorreo(correo);
    // si el usuario ya existe
    if (existingUser)
      return res
        .status(400)
        .send({ titulo: "ERROR", mensaje: "EL CORREO YA ESTA REGISTRADO" });

    // crear un nuevo usuario
    const newUser = await Usuario.createUser({
      correo,
      nombre_usuario,
      contra,
      rol: "cliente",
    });

    // generar access y refresh tokens para el nuevo usuario
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

    // guardar el refresh token en la base de datos
    await RefreshToken.createToken({
      user_id: newUser.id,
      token: refreshToken,
    });
    // establecer las cookies de autenticacion
    setAuthCookies(res, accessToken, refreshToken);

    // enviar respuesta de exito
    return res
      .status(201)
      .send({ titulo: "ÉXITO", mensaje: "REDIRECCIONANDO..." });
  } catch (error) {
    // registrar el error en consola
    console.error(error);
    // enviar respuesta de error del servidor
    return res.status(500).send({
      titulo: "ERROR",
      mensaje: "SURGIO UN ERROR CREANDO AL USUARIO, INTENTALO MÁS TARDE",
    });
  }
};

// funcion para cerrar sesion
const logout = async (req, res) => {
  // obtener el refresh token de las cookies
  const refreshToken = req.cookies.refresh_token;
  // si no hay refresh token, redirigir a la pagina principal
  if (!refreshToken) return res.redirect("/");

  try {
    // eliminar el refresh token de la base de datos
    await RefreshToken.deleteToken(refreshToken);
    // limpiar la cookie de access token
    res.clearCookie("access_token");
    // limpiar la cookie de refresh token
    res.clearCookie("refresh_token");
    // redirigir a la pagina principal
    res.redirect("/");
  } catch (error) {
    // registrar el error en consola
    console.error(error);
    // en caso de error, redirigir a la pagina principal
    res.redirect("/");
  }
};

// exportar funciones para su uso en otros archivos
export {
  loginPage,
  registerPage,
  login,
  register,
  logout,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
};