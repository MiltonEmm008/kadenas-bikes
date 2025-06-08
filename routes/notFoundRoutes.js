import { Router } from "express";
const router = Router();

// Se aplica a todas las rutas que no se hayan manejado antes y renderiza la vista 404.ejs
router.use((req, res) => {
  res.status(404).render("error", { error:{
    title:"Error 404",
    message:"La página que buscas no existe",
  } });
});

export default router;