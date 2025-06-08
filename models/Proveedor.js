// models/Proveedor.js

import BaseModel from "./BaseModel.js";

class Proveedor extends BaseModel {
  // Definimos el nombre de la tabla según la base de datos.
  static tableName = "proveedores";

  /**
   * Busca un proveedor por su ID.
   * @param {number} id - El ID del proveedor.
   * @returns {Promise<Object|null>} - Promesa que resuelve con el proveedor encontrado o null.
   */
  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    return await BaseModel.get(sql, [id]);
  }

  /**
   * Busca un proveedor por su nombre de empresa.
   * @param {string} nombre_empresa - El nombre de la empresa.
   * @returns {Promise<Object|null>} - Promesa que resuelve con el proveedor encontrado o null.
   */
  static async findByNombreEmpresa(nombre_empresa) {
    const sql = `SELECT * FROM ${this.tableName} WHERE nombre_empresa = ? LIMIT 1`;
    return await BaseModel.get(sql, [nombre_empresa]);
  }

  /**
   * Obtiene todos los proveedores con el conteo de productos asociados.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con los proveedores y su conteo de productos.
   */
  static async getAllWithProductCount() {
    const sql = `
      SELECT p.*, COUNT(pr.id) as productos_count 
      FROM ${this.tableName} p 
      LEFT JOIN productos pr ON p.id = pr.proveedor_id 
      GROUP BY p.id 
      ORDER BY p.id ASC
    `;
    return await BaseModel.all(sql);
  }

  /**
   * Obtiene un proveedor específico con su conteo de productos.
   * @param {number} id - El ID del proveedor.
   * @returns {Promise<Object|null>} - Promesa que resuelve con el proveedor y su conteo de productos.
   */
  static async getWithProductCount(id) {
    const sql = `
      SELECT p.*, COUNT(pr.id) as productos_count 
      FROM ${this.tableName} p 
      LEFT JOIN productos pr ON p.id = pr.proveedor_id 
      WHERE p.id = ? 
      GROUP BY p.id
    `;
    return await BaseModel.get(sql, [id]);
  }

  /**
   * Crea un nuevo proveedor.
   * @param {Object} proveedorData - Objeto con los datos del proveedor.
   *   Se espera tener: { nombre_empresa, nombre_contacto, telefono, correo, direccion }
   * @returns {Promise<number>} - Promesa que resuelve con el ID del nuevo proveedor insertado.
   */
  static async create(proveedorData) {
    const columns = Object.keys(proveedorData).join(", ");
    const placeholders = Object.keys(proveedorData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(proveedorData);
    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    return await BaseModel.run(sql, values);
  }

  /**
   * Actualiza un proveedor.
   * @param {number} id - ID del proveedor a actualizar.
   * @param {Object} changes - Objeto con los cambios a aplicar.
   * @returns {Promise<number>} - Promesa que resuelve con el resultado de la operación.
   */
  static async update(id, changes) {
    const updates = Object.keys(changes)
      .map((key) => `${key} = ?`)
      .join(", ");
    const values = [...Object.values(changes), id];
    const sql = `UPDATE ${this.tableName} SET ${updates} WHERE id = ?`;
    return await BaseModel.run(sql, values);
  }

  /**
   * Elimina un proveedor.
   * @param {number} id - ID del proveedor a eliminar.
   * @returns {Promise<number>} - Promesa que resuelve con el resultado de la operación.
   */
  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]);
  }

  /**
   * Obtiene todos los proveedores de la tabla.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con todos los proveedores.
   */
  static async all() {
    const sql = `SELECT * FROM ${this.tableName} ORDER BY nombre_empresa ASC`;
    return await BaseModel.all(sql);
  }
}

export default Proveedor;