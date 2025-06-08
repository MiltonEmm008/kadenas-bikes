import Pedido from "../models/Pedido.js";
import ItemCarrito from "../models/ItemCarrito.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Producto.js";

export const getMonthSales = async (req, res) => {
  try {
    const ventas = await Pedido.getPedidosPerMonth();
    res.json(ventas);
  } catch (err) {
    // registrar el error en consola
    console.error("error al obtener las ventas:", error);
    // enviar respuesta de error del servidor
    res.status(500).json({ error: "error al obtener las ventas" });
  }
};

export const createPedido = async (req, res) => {
  console.log('=== INICIO createPedido ===');
  console.log('Datos recibidos:', req.body);
  
  // Recibe datos del frontend
  const { datosPersonales, direccionEnvio, tipoEntrega, instrucciones } = req.body;

  if (!datosPersonales || !direccionEnvio || !tipoEntrega) {
    console.log('Error: Faltan datos requeridos');
    return res.status(400).json({
      title: "Error",
      message: "Debes ingresar todos los datos solicitados",
    });
  }

  try {
    const usuario_id = req.user && req.user.id ? req.user.id : null;
    console.log('Usuario ID:', usuario_id);
    
    if (!usuario_id) {
      console.log('Error: Usuario no autenticado');
      return res.status(401).json({
        title: "Error",
        message: "Usuario no autenticado",
      });
    }

    console.log('Buscando items del carrito para usuario:', usuario_id);
    const items = await ItemCarrito.findByUsuarioId(usuario_id);
    console.log('Items encontrados:', items?.length || 0);
    
    if (!items || items.length === 0) {
      console.log('Error: Carrito vacío');
      return res.status(400).json({
        title: "Error",
        message: "El carrito está vacío",
      });
    }

    // Calcular subtotal
    let subtotal = items.reduce((total, item) => {
      const precioDesc =
        item.descuento_porcentaje > 0
          ? (item.precio - (item.precio * item.descuento_porcentaje) / 100) * 1.16
          : item.precio * 1.16;
      return total + precioDesc * item.cantidad;
    }, 0);
    console.log('Subtotal calculado:', subtotal);

    // Calcular costo de envío
    let costoEnvio = 100;
    if (tipoEntrega.toLowerCase() === "express") {
      costoEnvio = 350;
    }
    const total = subtotal + costoEnvio;
    console.log('Total con envío:', total);

    // Parsear los JSON recibidos
    let datos_comprador = {};
    let direccion_envio = {};
    try {
      datos_comprador = JSON.parse(datosPersonales);
      direccion_envio = JSON.parse(direccionEnvio);
      console.log('Datos parseados correctamente');
    } catch (e) {
      console.error('Error al parsear JSON:', e);
      datos_comprador = {};
      direccion_envio = {};
    }
    const tipo_envio = tipoEntrega.toLowerCase();
    const instrucciones_envio = instrucciones;

    // Verificar saldo del usuario
    console.log('Verificando saldo del usuario');
    const usuario = await Usuario.findUsuarioById(usuario_id);
    console.log('Saldo actual:', usuario?.saldo);
    
    if (!usuario || usuario.saldo < total) {
      console.log('Error: Saldo insuficiente');
      return res.status(400).json({
        title: "Saldo insuficiente",
        message:
          "No tienes saldo suficiente para realizar este pedido. Tu saldo actual es $" +
          (usuario?.saldo ?? 0).toFixed(2) +
          ".",
      });
    }

    // Restar saldo al usuario
    console.log('Restando saldo al usuario');
    await Usuario.restarSaldo(usuario_id, total);
    console.log('Saldo restado exitosamente');

    // Restar stock a los productos
    console.log('Restando stock a los productos');
    for (const item of items) {
      await Producto.restarStock(item.id, item.cantidad);
      console.log(`Stock restado para producto ${item.id}: ${item.cantidad} unidades`);
    }

    // Crear el pedido
    console.log('Creando pedido en la base de datos');
    const pedido = await Pedido.create({
      usuario_id,
      datos_comprador: JSON.stringify(datos_comprador),
      total,
      direccion_envio: JSON.stringify(direccion_envio),
      tipo_envio,
      instrucciones_envio,
      items,
    });

    if (!pedido) {
      console.log('Error: No se pudo crear el pedido');
      // Si no se pudo crear el pedido, revertir los cambios
      console.log('Revirtiendo cambios...');
      await Usuario.addSaldo(usuario_id, total);
      for (const item of items) {
        await Producto.addStock(item.id, item.cantidad);
      }
      console.log('Cambios revertidos');
      return res.status(500).json({
        title: "Error",
        message: "Sucedió un error al crear el pedido, inténtalo más tarde",
      });
    }
    console.log('Pedido creado exitosamente con ID:', pedido.id);

    // Limpiar el carrito
    console.log('Intentando limpiar el carrito...');
    const carritoEliminado = await ItemCarrito.deleteByUsuarioId(usuario_id);
    console.log('Resultado de limpiar carrito:', carritoEliminado);
    
    if (!carritoEliminado) {
      console.error('Error al limpiar el carrito después de crear el pedido');
    } else {
      console.log('Carrito limpiado exitosamente');
    }

    // Enviar correo de confirmación al usuario
    try {
      console.log('Enviando correo de confirmación...');
      const mensajeUsuario = {
        nombre_contacto: "KADENAS BIKES",
        mensaje_contacto: `¡Hola ${datos_comprador.nombre}!

Gracias por realizar tu pedido en Kadenas Bikes. Tu pedido #${pedido.id} ha sido registrado exitosamente y está en proceso de revisión.

Detalles de tu pedido:
- Total: $${total.toFixed(2)}
- Estado: Pendiente
- Tipo de envío: ${tipo_envio}

Nos pondremos en contacto contigo próximamente para atender tu pedido.

¡Gracias por apoyar a Kadenas Bikes!

Saludos cordiales,
El equipo de Kadenas Bikes`,
        destinatario: datos_comprador.email,
      };

      await fetch(
        `${process.env.URL_BASE || "http://localhost:3000"}/api/enviar-mensaje`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mensajeUsuario),
        }
      );
      console.log('Correo enviado exitosamente');
    } catch (error) {
      console.error("Error al enviar correo de confirmación:", error);
    }

    console.log('=== FIN createPedido - ÉXITO ===');
    return res.status(200).json({
      title: "Pedido creado",
      message: "Tu pedido ha sido procesado exitosamente",
      pedido,
    });

  } catch (err) {
    console.error('=== ERROR en createPedido ===');
    console.error('Error detallado:', err);
    return res.status(500).json({
      title: "Error",
      message: "Sucedió un error al crear el pedido, inténtalo más tarde",
    });
  }
};

// Función auxiliar para manejar la devolución de saldo y stock
async function manejarDevolucionPedido(pedido) {
  try {
    // 1. Regresar stock de los productos
    if (Array.isArray(pedido.items)) {
      for (const item of pedido.items) {
        const productoId = item.producto_id || item.id;
        if (productoId && item.cantidad) {
          try {
            const producto = await Producto.findById(productoId);
            if (!producto) {
              console.warn(
                `Producto con id ${productoId} no encontrado al procesar devolución del pedido ${pedido.id}.`
              );
              continue;
            }
            const nuevoStock =
              Number(producto.stock || 0) + Number(item.cantidad);
            await Producto.update(productoId, { stock: nuevoStock });
          } catch (err) {
            console.error(
              `Error al actualizar stock para producto ${productoId} al procesar devolución del pedido ${pedido.id}:`,
              err
            );
            continue;
          }
        }
      }
    }

    // 2. Regresar saldo al usuario si existe usuario_id y total
    if (pedido.usuario_id && pedido.total) {
      const usuario = await Usuario.findUsuarioById(pedido.usuario_id);
      if (usuario) {
        const nuevoSaldo = Number(usuario.saldo || 0) + Number(pedido.total);
        await Usuario.update(usuario.id, { saldo: nuevoSaldo });
      }
    }
  } catch (error) {
    console.error("Error al procesar devolución de saldo y stock:", error);
    throw error;
  }
}

export const updatePedidoEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    // Validar que el pedido existe
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Validar que el estado es válido usando el modelo
    if (!Pedido.esEstadoValido(estado)) {
      return res.status(400).json({
        error: "Estado no válido",
        estadosValidos: Object.values(Pedido.ESTADOS_VALIDOS),
      });
    }

    // Si el pedido ya está cancelado o devuelto, no permitir cambios
    if (
      pedido.estado === Pedido.ESTADOS_VALIDOS.CANCELADO ||
      pedido.estado === Pedido.ESTADOS_VALIDOS.DEVUELTO
    ) {
      return res.status(400).json({
        error: "No se puede modificar un pedido cancelado o devuelto",
        estadoActual: pedido.estado,
      });
    }

    // Si el pedido está finalizado, solo permitir cambiar a devuelto
    if (
      pedido.estado === Pedido.ESTADOS_VALIDOS.FINALIZADO &&
      estado !== Pedido.ESTADOS_VALIDOS.DEVUELTO
    ) {
      return res.status(400).json({
        error: "Un pedido finalizado solo puede cambiar a estado devuelto",
        estadoActual: pedido.estado,
        estadoSolicitado: estado,
      });
    }

    // Si se está cancelando o devolviendo el pedido, manejar el stock y balance
    if (
      estado === Pedido.ESTADOS_VALIDOS.CANCELADO ||
      estado === Pedido.ESTADOS_VALIDOS.DEVUELTO
    ) {
      await manejarDevolucionPedido(pedido);
    }

    // Actualizar el estado del pedido
    const resultado = await Pedido.updateEstado(id, estado);
    if (!resultado) {
      return res
        .status(500)
        .json({ error: "Error al actualizar el estado del pedido" });
    }

    res.json({
      message: "Estado del pedido actualizado exitosamente",
      nuevoEstado: estado,
    });
  } catch (error) {
    console.error("Error al actualizar estado del pedido:", error);
    res.status(500).json({ error: "Error al actualizar el estado del pedido" });
  }
};

export const cancelarPedido = async (req, res) => {
  const pedido_id = req.params.id;
  try {
    // 1. Buscar el pedido completo
    const pedido = await Pedido.findById(pedido_id);
    if (!pedido) {
      return res.status(404).json({
        title: "Pedido no encontrado",
        message: `No se encontró un pedido con ID ${pedido_id}.`,
      });
    }

    // 2. Validar que el pedido no esté ya cancelado o devuelto
    if (
      pedido.estado === Pedido.ESTADOS_VALIDOS.CANCELADO ||
      pedido.estado === Pedido.ESTADOS_VALIDOS.DEVUELTO
    ) {
      return res.status(400).json({
        title: "Pedido ya procesado",
        message: `El pedido con ID ${pedido_id} ya está ${pedido.estado}.`,
      });
    }

    // 3. Manejar la devolución de saldo y stock
    await manejarDevolucionPedido(pedido);

    // 4. Actualizar estado del pedido a "cancelado"
    const resultado = await Pedido.updateEstado(
      pedido_id,
      Pedido.ESTADOS_VALIDOS.CANCELADO
    );
    if (!resultado) {
      return res.status(500).json({
        title: "Error al actualizar",
        message: "No se pudo actualizar el estado del pedido.",
      });
    }

    return res.status(200).json({
      title: "Pedido cancelado",
      message: `El pedido con ID ${pedido_id} ha sido cancelado correctamente. Se devolvió el saldo y el stock de los productos.`,
    });
  } catch (error) {
    console.error("Error al cancelar pedido:", error);
    return res.status(500).json({
      title: "Error interno",
      message: "Ocurrió un error al intentar cancelar el pedido.",
    });
  }
};

export const getAllPedidos = async (req, res) => {
  try {
    const pedidos = await Pedido.getAllWithUserInfo();
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos:", error);
    res.status(500).json({ error: "Error al obtener los pedidos" });
  }
};

export const solicitarDevolucion = async (req, res) => {
  const { id } = req.params;
  const { motivo } = req.body;

  try {
    // Validar que el pedido existe
    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ error: "Pedido no encontrado" });
    }

    // Validar que el pedido está finalizado
    if (pedido.estado !== Pedido.ESTADOS_VALIDOS.FINALIZADO) {
      return res.status(400).json({
        error: "Solo se pueden solicitar devoluciones de pedidos finalizados",
        estadoActual: pedido.estado,
      });
    }

    // Actualizar el estado del pedido a "en_devolucion"
    await Pedido.updateEstado(id, Pedido.ESTADOS_VALIDOS.EN_DEVOLUCION);

    // Preparar mensaje para la empresa
    const mensajeEmpresa = `
      Se ha recibido una solicitud de devolución para el pedido #${id}

      Datos del solicitante:
      Nombre: ${pedido.datos_comprador?.nombre}
      Email: ${pedido.datos_comprador?.email}

      Motivo de la devolución:
      ${motivo}

      Detalles del pedido:
      Total: $${pedido.total}
      Fecha: ${pedido.creado_en}
      Productos:
      ${pedido.items
        .map((item) => `- ${item.nombre} (${item.cantidad} unidades)`)
        .join("\n")}
    `;

    // Preparar mensaje para el cliente
    const mensajeCliente = `
      Hemos recibido tu solicitud de devolución para el pedido #${id}.

      Nos pondremos en contacto contigo pronto para coordinar los detalles de la devolución.

      Detalles de tu pedido:
      Total: $${pedido.total}
      Fecha: ${pedido.creado_en}
      Productos:
      ${pedido.items
        .map((item) => `- ${item.nombre} (${item.cantidad} unidades)`)
        .join("\n")}

      Motivo de devolución registrado:
      ${motivo}

      Si tienes alguna pregunta, no dudes en contactarnos.

      Saludos cordiales,
      El equipo de Kadenas Bikes
    `;

    // Enviar correo a la empresa usando el endpoint de contacto
    const responseEmpresa = await fetch(
      `${process.env.URL_BASE || "http://localhost:3000"}/api/enviar-mensaje`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_contacto: "Sistema de Devoluciones",
          mensaje_contacto: mensajeEmpresa,
          destinatario: "kadenasbikes@gmail.com",
          asunto: `Solicitud de Devolución - Pedido #${id}`,
        }),
      }
    );

    if (!responseEmpresa.ok) {
      throw new Error("Error al enviar correo a la empresa");
    }

    // Enviar correo al cliente usando el endpoint de contacto
    const responseCliente = await fetch(
      `${process.env.URL_BASE || "http://localhost:3000"}/api/enviar-mensaje`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre_contacto: "Kadenas Bikes",
          mensaje_contacto: mensajeCliente,
          destinatario: pedido.datos_comprador?.email,
          asunto: "Confirmación de Solicitud de Devolución - Kadenas Bikes",
        }),
      }
    );

    if (!responseCliente.ok) {
      throw new Error("Error al enviar correo al cliente");
    }

    res.json({
      message: "Solicitud de devolución procesada exitosamente",
      nuevoEstado: Pedido.ESTADOS_VALIDOS.EN_DEVOLUCION,
    });
  } catch (error) {
    console.error("Error al procesar solicitud de devolución:", error);
    res
      .status(500)
      .json({ error: "Error al procesar la solicitud de devolución" });
  }
};
