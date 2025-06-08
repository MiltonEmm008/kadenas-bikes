// routes/emailRoutes.js
import { Router } from "express";
const router = Router();
import { enviarMensajeBienvenida } from "../controllers/emailController.js";

// Cuando recibe un fetch en post, se usa el controlador del email para enviar el mensaje
router.post("/enviar-mensaje", enviarMensajeBienvenida);

export default router;