//server.js
//Punto de entrada a la página

//Importaciones de modulos de node.js y rutas
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import passport from "passport";
import authRoutes from "./routes/authRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import notFoundRoutes from "./routes/notFoundRoutes.js";
import emailRoutes from "./routes/emailRoutes.js";
import protectedIndexRoutes from "./routes/protectedIndexRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const { urlencoded, json } = bodyParser;

//Se inicializa la aplicación y se especifica que rutas y que modulos usara, ademas del puerto
const app = express();
const port = process.env.PORT || 3000;
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cookieParser());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use("/", indexRoutes);
app.use("/", protectedIndexRoutes);
app.use("/auth", authRoutes);
app.use("/email", emailRoutes);
app.use("/api", apiRoutes);
app.use(notFoundRoutes);

//Se escucha al puerto 3000 (http://localhost:3000)
app.listen(port, () => {
  console.log(`
SERVIDOR CORRIENDO EN EL PUERTO ${port} 
http://localhost:${port}`);
});