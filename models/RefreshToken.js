// models/RefreshToken.js

import BaseModel from "./BaseModel.js";

class RefreshToken extends BaseModel {
  // Definimos el nombre real de la tabla
  static tableName = "refresh_tokens";

  /**
   * Obtiene todos los refresh tokens para un usuario.
   * @param {number} user_id - El ID del usuario.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con el array de tokens encontrados.
   */
  static async findByUserId(user_id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE user_id = ?`;
    return await BaseModel.all(sql, [user_id]);
  }

  /**
   * Busca un refresh token específico.
   * @param {string} token - El token a buscar.
   * @returns {Promise<Object|null>} - Promesa que resuelve con el token encontrado o null.
   */
  static async findToken(token) {
    const sql = `SELECT * FROM ${this.tableName} WHERE token = ? LIMIT 1`;
    return await BaseModel.get(sql, [token]);
  }

  /**
   * Inserta o reemplaza un refresh token en la base de datos.
   * Si ya existe un token para ese user_id, se reemplaza.
   *
   * @param {Object} data - Objeto con { user_id, token }.
   * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la operación.
   */
  static async createToken({ user_id, token }) {
    const sql = `
    INSERT OR REPLACE INTO ${this.tableName} (user_id, token) VALUES (?, ?)
  `;
    return await BaseModel.run(sql, [user_id, token]);
  }

  /**
   * Elimina un refresh token específico.
   * @param {string} token - El token a eliminar.
   * @returns {Promise<Object>} - Promesa que resuelve con el resultado de la operación (cantidad de registros afectados, etc.).
   */
  static async deleteToken(token) {
    const sql = `DELETE FROM ${this.tableName} WHERE token = ?`;
    return await BaseModel.run(sql, [token]);
  }
}

export default RefreshToken;
