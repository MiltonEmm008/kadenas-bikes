// models/ItemCarrito.js

import BaseModel from "./BaseModel.js";

class ItemCarrito extends BaseModel {
  // Definimos el nombre de la tabla de forma centralizada.
  static tableName = "items_carrito";

  /**
   * Retorna todos los ítems del carrito de un usuario dado.
   * @param {number} usuarioId - El ID del usuario.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con los ítems del carrito.
   */
  static async findByUsuarioId(usuarioId) {
    const sql = `SELECT c.id as item_carrito_Id, p.*, c.cantidad FROM ${this.tableName} c
INNER JOIN productos p ON p.id = c.producto_id
WHERE c.usuario_id = ?
ORDER BY p.id`;
    return await BaseModel.all(sql, [usuarioId]);
  }

  static async findByUsuarioIdAndProductoId(usuarioId, productoId) {
    const sql = `SELECT c.id as item_carrito_Id, p.*, c.cantidad FROM ${this.tableName} c
INNER JOIN productos p ON p.id = c.producto_id
WHERE c.usuario_id = ? AND c.producto_id = ?`;
    return await BaseModel.get(sql, [usuarioId, productoId]);
  }

  /**
   * Crea un nuevo ítem en el carrito.
   * @param {Object} itemData - Objeto con los datos del ítem, por ejemplo:
   *   { usuario_id, producto_id, cantidad, precio, detalles }
   * @returns {Promise<number>} - Promesa que resuelve con el ID del nuevo registro.
   */
  static async create(itemData) {
    const columns = Object.keys(itemData).join(", ");
    const placeholders = Object.keys(itemData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(itemData);
    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    return await BaseModel.run(sql, values);
  }

  /**
   * Actualiza un ítem del carrito.
   * @param {number} id - El ID del ítem a actualizar.
   * @param {Object} changes - Objeto con los cambios a aplicar.
   * @returns {Promise<void>}
   */
  static async update(id, changes) {
    const updates = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(changes), id];
    const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    return await BaseModel.run(sql, values);
  }

  static async updateCantidad(usuarioId, productoId, cantidad) {
    const sql = `UPDATE ${this.tableName} SET cantidad = cantidad + ? WHERE usuario_id = ? AND producto_id = ?`;
    return await BaseModel.run(sql, [cantidad, usuarioId, productoId]);
  }

  /**
   * Elimina un ítem del carrito.
   * @param {number} id - El ID del ítem a eliminar.
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]);
  }

  static async deleteByUsuarioIdAndProductoId(usuarioId, productoId) {
    const sql = `DELETE FROM ${this.tableName} WHERE usuario_id = ? AND producto_id = ?`;
    return await BaseModel.run(sql, [usuarioId, productoId]);
  }

  static async deleteByUsuarioId(usuarioId) {
    const sql = `DELETE FROM ${this.tableName} WHERE usuario_id = ?`;
    return await BaseModel.run(sql, [usuarioId]);
  }
}

export default ItemCarrito;
