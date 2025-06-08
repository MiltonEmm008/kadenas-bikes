// config/passport.js

import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Usuario from "../models/Usuario.js";
//GUARDAR FOTO EXISTENTE

// Estrategia de GitHub
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extrae la información necesaria del perfil de GitHub.
        const correo =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const fotoPerfil =
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : "/perfil/default.jpg";

        // Llama al método adaptado de nuestro modelo Usuario para crear o recuperar un usuario por GitHub.
        let user = await Usuario.createUsuarioWithGithub(
          profile.id,
          correo,
          profile.username,
          fotoPerfil
        );

        Usuario.saveServicePhoto(user.id);
        user = await Usuario.findUsuarioById(user.id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Estrategia de Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Extrae la información del perfil de Google.
        const correo =
          profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        const nombre_usuario = profile.displayName;
        const fotoPerfil =
          profile.photos && profile.photos[0]
            ? profile.photos[0].value
            : "/perfil/default.jpg";

        // Usa el método adaptado para crear o recuperar el usuario a partir de su Google ID.
        let user = await Usuario.createUsuarioWithGoogle(
          profile.id,
          correo,
          nombre_usuario,
          fotoPerfil
        );

        Usuario.saveServicePhoto(user.id);
        user = await Usuario.findUsuarioById(user.id);
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialización del usuario (almacena solo el ID en la sesión)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización: se busca el usuario por su ID usando nuestro método adaptado.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Usuario.findUsuarioById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export default passport;
