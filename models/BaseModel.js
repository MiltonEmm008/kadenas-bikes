// models/BaseModel.js

import db from "../config/db.js";

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  // Ejecuta una consulta que retorna varios registros.
  static all(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Ejecuta una consulta que retorna un único registro.
  static get(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Ejecuta una consulta de INSERT, UPDATE o DELETE.
  static run(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          // Retorna los resultados de la operación (por ejemplo, el último ID insertado).
          resolve({ lastID: this.lastID, changes: this.changes });
        }
      });
    });
  }
}

export default BaseModel;