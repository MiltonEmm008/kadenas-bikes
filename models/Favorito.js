// models/Valoracion.js

import BaseModel from "./BaseModel.js";

class Favorito extends BaseModel {
  // Nombre real de la tabla en la base de datos.
  static tableName = "favoritos";

  /**
   * Busca la valoración de un usuario para un producto específico.
   * @param {number} usuario_id - ID del usuario.
   * @param {number} producto_id - ID del producto.
   * @returns {Promise<Object|null>} - Promesa que resuelve con la valoración encontrada o null.
   */
  static async findByUsuarioIdAndProductoId(usuario_id, producto_id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE usuario_id = ? AND producto_id = ?`;
    const result = await BaseModel.all(sql, [usuario_id, producto_id]);
    return result && result.length > 0;
  }

  static async findAllByUsuarioId(usuario_id) {
    // Trae todos los productos favoritos del usuario, devolviendo todos los campos del producto
    const sql = `SELECT p.* FROM ${this.tableName} f INNER JOIN productos p ON f.producto_id = p.id WHERE f.usuario_id = ?`;
    const result = await BaseModel.all(sql, [usuario_id]);
    return result;
  }

  /**
   * Establece el valor de "favorito" para la valoración de un producto de un usuario.
   *
   * Si la valoración existe, solo se actualiza el campo "favorito".
   * Si no existe, se crea una nueva valoración con el valor de favorito indicado (y sin puntuación ni comentario).
   *
   * @param {number} usuario_id - ID del usuario.
   * @param {number} producto_id - ID del producto.
   * @returns {Promise<number>} - Promesa que resuelve con el resultado de la operación.
   */
  static async setFavorito(usuario_id, producto_id) {
    const exists = await this.findByUsuarioIdAndProductoId(
      usuario_id,
      producto_id
    );
    if (exists) {
      const sql = `DELETE FROM ${this.tableName} WHERE usuario_id = ? AND producto_id = ?`;
      return await BaseModel.run(sql, [usuario_id, producto_id]);
    } else {
      const sql = `INSERT INTO ${this.tableName} (usuario_id, producto_id) VALUES (?, ?)`;
      return await BaseModel.run(sql, [usuario_id, producto_id]);
    }
  }
}

export default Favorito;
