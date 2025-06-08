// models/Soporte.js
import BaseModel from "./BaseModel.js";
//

class Soporte extends BaseModel {
  // Definimos el nombre de la tabla en la base de datos.
  static tableName = "soporte";

  static async create(data) {
    const { usuario_id, nombre, correo, situacion, urgencia } = data;
    const sql = `
      INSERT INTO ${this.tableName} (id_usuario, nombre, correo, situacion, urgencia)
      VALUES (?, ?, ?, ?, ?)
    `;
    return await BaseModel.run(sql, [
      usuario_id,
      nombre,
      correo,
      situacion,
      urgencia,
    ]);
  }

  static async findAll() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY creado_en DESC`;
    return await BaseModel.all(sql);
  }

  static async findRecent() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY id DESC LIMIT 3`;
    return await BaseModel.all(sql);
  }

  static async deleteIncidencia(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]);
  }

  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    return await BaseModel.get(sql, [id]);
  }

  static async findByUserId(usuario_id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id_usuario = ? ORDER BY creado_en DESC`;
    return await BaseModel.all(sql, [usuario_id]);
  }
}

export default Soporte;
