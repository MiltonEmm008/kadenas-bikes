// models/Pedido.js

import BaseModel from "./BaseModel.js";

class Pedido extends BaseModel {
  // Definimos el nombre de la tabla en la base de datos.
  static tableName = "pedidos";

  static ESTADOS_VALIDOS = {
    PENDIENTE: "pendiente",
    CANCELADO: "cancelado",
    ENVIADO: "enviado",
    FINALIZADO: "finalizado",
    DEVUELTO: "devuelto",
    EN_DEVOLUCION: "en_devolucion"
  };

  static esEstadoValido(estado) {
    return Object.values(this.ESTADOS_VALIDOS).includes(estado);
  }

  /**
   * Obtiene todos los pedidos asociados a un usuario específico.
   * Se parsea el campo `items` (almacenado en formato JSON) para facilitar su uso.
   * @param {number} usuarioId - El ID del usuario.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con los pedidos encontrados.
   */
  static async findByUsuarioId(usuarioId) {
    const sql = `SELECT * FROM ${this.tableName} WHERE usuario_id = ? ORDER BY creado_en DESC`;
    const pedidos = await BaseModel.all(sql, [usuarioId]);

    return pedidos.map((pedido) => {
      // Lista de campos que queremos intentar parsear si son JSON
      const camposJson = ["items", "datos_comprador", "direccion_envio"];

      camposJson.forEach((campo) => {
        try {
          // Solo intentar parsear si el campo existe y es tipo string
          if (typeof pedido[campo] === "string") {
            pedido[campo] = JSON.parse(pedido[campo]);
          }
        } catch (e) {
          pedido[campo] = null;
        }
      });

      return pedido;
    });
  }

  /**
   * Crea un nuevo pedido.
   * @param {Object} data - Los datos del pedido.
   *    { usuario_id, estado, total, direccion_envio, items }
   *    El campo `items` debe ser un objeto o un arreglo, que se almacenará como JSON.
   * @returns {Promise<Object>} - El pedido recién creado.
   */
  static async create(data) {
    const {
      usuario_id,
      estado = "pendiente",
      total,
      direccion_envio,
      items,
      tipo_envio,
      instrucciones_envio,
      datos_comprador,
    } = data;

    // Convertir items a JSON solo si no es string
    const itemsStr = typeof items === "string" ? items : JSON.stringify(items);
    const sql = `
      INSERT INTO ${this.tableName} (usuario_id, estado, total, direccion_envio, items, tipo_envio, instrucciones_envio, datos_comprador)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const result = await BaseModel.run(sql, [
      usuario_id,
      estado,
      total,
      direccion_envio,
      itemsStr,
      tipo_envio,
      instrucciones_envio,
      datos_comprador,
    ]);

    // Obtener el pedido recién creado
    if (result && result.lastID) {
      const pedido = await this.findById(result.lastID);
      return pedido;
    }
    
    return null;
  }

  /**
   * Actualiza un pedido existente.
   * Si se actualiza el campo `items` y éste no es una cadena, se convierte a JSON.
   * @param {number} id - El ID del pedido a actualizar.
   * @param {Object} changes - Los cambios a aplicar.
   * @returns {Promise<void>}
   */
  static async update(id, changes) {
    if (changes.items && typeof changes.items !== "string") {
      changes.items = JSON.stringify(changes.items);
    }
    const updates = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(changes), id];
    const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    return await BaseModel.run(sql, values);
  }

  /**
   * Actualiza el estado de un pedido existente.
   * @param {number} id - El ID del pedido a actualizar.
   * @param {string} nuevoEstado - El nuevo estado del pedido.
   * @returns {Promise<void>}
   */
  static async updateEstado(id, nuevoEstado) {
    if (!this.esEstadoValido(nuevoEstado)) {
      throw new Error("Estado de pedido no válido");
    }

    const sql = `
      UPDATE ${this.tableName}
      SET estado = ?
      WHERE id = ?
    `;
    
    return await this.run(sql, [nuevoEstado, id]);
  }

  /**
   * Elimina un pedido según su ID.
   * @param {number} id - El ID del pedido a eliminar.
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]);
  }

  static async getPedidosPerMonth() {
    const sql = `
    SELECT
    m.mes_nombre AS mes,
    COALESCE(p.cantidad, 0) AS cantidad
    FROM (
        SELECT '01' AS mes, 'Enero' AS mes_nombre UNION ALL
        SELECT '02', 'Febrero' UNION ALL
        SELECT '03', 'Marzo' UNION ALL
        SELECT '04', 'Abril' UNION ALL
        SELECT '05', 'Mayo' UNION ALL
        SELECT '06', 'Junio' UNION ALL
        SELECT '07', 'Julio' UNION ALL
        SELECT '08', 'Agosto' UNION ALL
        SELECT '09', 'Septiembre' UNION ALL
        SELECT '10', 'Octubre' UNION ALL
        SELECT '11', 'Noviembre' UNION ALL
        SELECT '12', 'Diciembre'
    ) AS m
    LEFT JOIN (
        SELECT strftime('%m', creado_en) AS mes, COUNT(*) AS cantidad
        FROM ${this.tableName}
        WHERE estado = 'finalizado'
        GROUP BY mes
    ) AS p ON m.mes = p.mes
    ORDER BY m.mes
    `;
    return await BaseModel.all(sql);
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    const row = await this.get(sql, [id]);
    if (!row) return null;
    // Parsear campos JSON relevantes
    const camposJson = ["items", "datos_comprador", "direccion_envio"];
    camposJson.forEach((campo) => {
      if (row[campo] && typeof row[campo] === "string") {
        try {
          row[campo] = JSON.parse(row[campo]);
        } catch (e) {}
      }
    });
    return row;
  }

  /**
   * Obtiene todos los pedidos con información del usuario
   * @returns {Promise<Array<Object>>} Lista de pedidos con datos del usuario
   */
  static async getAllWithUserInfo() {
    const sql = `
      SELECT 
        p.*,
        u.nombre_usuario as usuario_nombre,
        u.correo as usuario_email
      FROM ${this.tableName} p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.creado_en DESC
    `;
    const pedidos = await this.all(sql);
    
    // Parsear campos JSON
    return pedidos.map(pedido => {
      const camposJson = ["items", "datos_comprador", "direccion_envio"];
      camposJson.forEach(campo => {
        if (pedido[campo] && typeof pedido[campo] === "string") {
          try {
            pedido[campo] = JSON.parse(pedido[campo]);
          } catch (e) {
            console.warn(`Error parsing ${campo} for pedido ${pedido.id}:`, e);
            pedido[campo] = null;
          }
        }
      });
      return pedido;
    });
  }
}

export default Pedido;
