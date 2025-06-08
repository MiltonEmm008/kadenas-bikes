import Favorito from "../models/Favorito.js"; // importar el modelo de favorito

// maneja la adicion o eliminacion de un producto de los favoritos de un usuario
export const handleFavorito = async (req, res) => {
  // obtiene el id del usuario de la solicitud (asumiendo que fue seteado por un middleware)
  const usuario_id = req.user && req.user.id;
  // obtiene el id del producto de los parametros de la solicitud
  const producto_id = req.params.id_producto;

  // verifica si tanto el id del usuario como el del producto estan disponibles
  if (usuario_id && producto_id) {
    try {
      // llama al metodo setfavorito para añadir o quitar el favorito
      const favorito = await Favorito.setFavorito(usuario_id, producto_id);
      // responde con un mensaje de exito y el estado del favorito (true si se añadió, false si se eliminó)
      return res
        .status(200)
        .json({ message: "manejado con éxito", favorito: favorito });
    } catch (err) {
      // registra el error para depuracion
      console.error("error al manejar el favorito:", err);
      // responde con un mensaje de error del servidor
      return res
        .status(500)
        .json({ message: "hubo un error al manejar el favorito" });
    }
  } else {
    // si faltan datos esenciales, responde con un error de solicitud incorrecta
    return res.status(400).json({ message: "faltan datos" });
  }
};