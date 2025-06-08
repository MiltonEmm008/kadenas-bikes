// models/Producto.js

import BaseModel from "./BaseModel.js";

class Producto extends BaseModel {
  /**
   * Busca un producto por su ID.
   * @param {number} id - ID del producto.
   * @returns {Promise<Object|null>} - El producto encontrado o null.
   */
  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ? LIMIT 1`;
    return await this.get(sql, [id]);
  }

  // Establecemos el nombre de la tabla de forma centralizada.
  static tableName = "productos";

  /**
   * Busca todos los productos que pertenezcan a la categoría especificada.
   * En la nueva estructura, la categoría se almacena en un campo de texto llamado "categoria".
   *
   * @param {string} categoria - Nombre de la categoría.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con los productos encontrados.
   */
  static async findByCategoria(categoria) {
    const sql = `SELECT * FROM ${this.tableName} WHERE categoria = ?`;
    return await BaseModel.all(sql, [categoria]);
  }

  /**
   * Busca todos los productos que pertenezcan a la marca especificada.
   * En la nueva estructura, la marca se almacena en un campo de texto llamado "marca".
   *
   * @param {string} marca - Nombre de la marca.
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con los productos encontrados.
   */
  static async findByMarca(marca) {
    const sql = `SELECT * FROM ${this.tableName} WHERE marca = ?`;
    return await BaseModel.all(sql, [marca]);
  }

  static async getCategoryCounts() {
    const sql = `SELECT categoria, COUNT(*) AS total
                  FROM ${this.tableName}
                  GROUP BY categoria;`;
    return await BaseModel.all(sql);
  }

  /**
   * Busca un producto en base a su ID.
   *
   * @param {number} id - ID del producto.
   * @returns {Promise<Object>} - Promesa que resuelve con el producto encontrado.
   */
  static async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.get(sql, [id]);
  }

  /**
   * Crea un nuevo producto.
   *
   * @param {Object} productData - Objeto con la información del producto.
   * Se espera tener por lo menos: { nombre, descripcion, proveedor_id, foto_producto, stock, precio, detalles, marca, categoria }
   * @returns {Promise<number>} - Promesa que resuelve con el ID del nuevo producto insertado.
   */
  static async create(productData) {
    const columns = Object.keys(productData).join(", ");
    const placeholders = Object.keys(productData)
      .map(() => "?")
      .join(", ");
    const values = Object.values(productData);
    const sql = `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders})`;
    const result = await BaseModel.run(sql, values);
    return result; // BaseModel.run ya devuelve { id: this.lastID }
  }

  /**
   * Actualiza un producto existente.
   *
   * @param {number} id - ID del producto a actualizar.
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

  /**
   * Elimina un producto por su ID.
   *
   * @param {number} id - ID del producto a eliminar.
   * @returns {Promise<void>}
   */
  static async delete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    return await BaseModel.run(sql, [id]);
  }

  /**
   * Obtiene todos los registros de la tabla.
   * Este método es general y se asume que está en BaseModel.
   * Si no lo está, deberás añadirlo a BaseModel o implementarlo aquí.
   *
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con todos los productos.
   */
  static async all() {
    const sql = `SELECT * FROM ${this.tableName}`;
    return await BaseModel.all(sql);
  }

  /**
   * Obtiene todos los registros de la tabla.
   * Este método es general y se asume que está en BaseModel.
   * Si no lo está, deberás añadirlo a BaseModel o implementarlo aquí.
   *
   * @returns {Promise<Array<Object>>} - Promesa que resuelve con todos los productos.
   */
  static async allWithSupplierJoin() {
    const sql = `SELECT p.*, p2.nombre_empresa as proveedor_nombre 
    FROM ${this.tableName} p
    LEFT JOIN proveedores p2 
    ON p.proveedor_id = p2.id;`;
    return await BaseModel.all(sql);
  }

  static async allWithSupplierJoinForSearch() {
    const sql = `SELECT p.*, p2.nombre_empresa as proveedor_nombre 
    FROM ${this.tableName} p
    LEFT JOIN proveedores p2 
    ON p.proveedor_id = p2.id
    ORDER BY p.stock DESC;`;
    return await BaseModel.all(sql);
  }

  static async allWithLimit(limit) {
    const sql = `SELECT p.*, p2.nombre_empresa as proveedor_nombre 
    FROM ${this.tableName} p
    INNER JOIN proveedores p2 
    ON p.proveedor_id = p2.id
    ORDER BY p.stock DESC
    LIMIT ${limit};`;
    return await BaseModel.all(sql);
  }

  static async getReleatedProducts(category, id) {
    const sql = `SELECT p.*
    FROM ${this.tableName} p
    WHERE p.categoria = ? AND p.id != ? AND p.stock > 0
    ORDER BY RANDOM()
    LIMIT 6;`;
    return await BaseModel.all(sql, [category, id]);
  }

  static async searchByCategory(category) {
    const sql = `
    SELECT p.*, p2.nombre_empresa as proveedor_nombre 
    FROM ${this.tableName} p
    INNER JOIN proveedores p2 ON p.proveedor_id = p2.id
    WHERE p.categoria = ?
    ORDER BY p.stock DESC;
  `;
    return await BaseModel.all(sql, [category]);
  }

  /**
   * Resta stock a un producto por su ID.
   * @param {number} id - ID del producto.
   * @param {number} cantidad - Cantidad a restar.
   * @returns {Promise<void>}
   */
  static async restarStock(id, cantidad) {
    const sql = `UPDATE ${this.tableName} SET stock = stock - ? WHERE id = ?`;
    await BaseModel.run(sql, [cantidad, id]);
  }

  static async getCarousellPhotos() {
    const sql = `SELECT p.foto_producto,p.nombre,p.descripcion FROM productos p WHERE p.stock > ? ORDER BY RANDOM() LIMIT 5;`;
    return await BaseModel.all(sql, [0]);
  }
}

export default Producto;
