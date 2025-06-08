import sqlite3Pkg from "sqlite3";
const sqlite3 = sqlite3Pkg.verbose();
import { hash } from "bcrypt";
const saltRounds = 10;
const dbName = "kadenastienda.db";

const db = new sqlite3.Database(dbName, (error) => {
  if (error) {
    console.log("Error al conectar la base de datos", error);
  }
});

db.serialize(() => {
  // ACTIVAR FOREIGN KEYS
  db.run(`PRAGMA foreign_keys = ON;`);

  // TABLA DE USUARIOS
  db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_usuario TEXT NOT NULL,
    correo TEXT NOT NULL,
    contra TEXT,
    github_id TEXT,
    google_id TEXT,
    rol TEXT DEFAULT 'cliente',
    foto_perfil TEXT DEFAULT '/perfil/default.jpg',
    saldo NUMERIC(10,2) DEFAULT 500.00,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

  // TABLA DE PROVEEDORES
  db.run(`
  CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_empresa TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    correo TEXT
  );
`);

  // TABLA DE PRODUCTOS
  db.run(`
  CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    proveedor_id INTEGER,
    foto_producto TEXT DEFAULT '/productos/producto-default.jpg',
    stock INTEGER DEFAULT 0,
    precio NUMERIC(10,2) NOT NULL,
    descuento_porcentaje INTEGER DEFAULT 0,
    detalles TEXT,
    marca TEXT,        
    categoria TEXT,    
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL
  );
`);

  // TABLA DE PEDIDOS
  db.run(`
  CREATE TABLE IF NOT EXISTS pedidos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    datos_comprador TEXT,
    estado TEXT DEFAULT 'pendiente',
    total NUMERIC(10,2),
    direccion_envio TEXT,
    tipo_envio TEXT,
    instrucciones_envio TEXT,
    items TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`);

  // TABLA DE FAVORITOS
  db.run(`
  CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    producto_id INTEGER,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`);

  // TABLA DE ITEMS_CARRITO
  db.run(`
  CREATE TABLE IF NOT EXISTS items_carrito (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    producto_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`);

  // TABLA DE REFRESH TOKENS
  db.run(`
  CREATE TABLE IF NOT EXISTS refresh_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    token TEXT,
    FOREIGN KEY(user_id) REFERENCES usuarios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`);

  // TABLA DE SOPORTE
  db.run(`
  CREATE TABLE IF NOT EXISTS soporte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_usuario INTEGER,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    situacion TEXT,
    urgencia TEXT,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
      ON UPDATE CASCADE
      ON DELETE CASCADE
  );
`);

  // Verificar si la tabla "usuarios" está vacía y si es así, insertar un usuario superadmin.
  db.get("SELECT COUNT(*) as count FROM usuarios", (err, row) => {
    if (err) {
      console.error("Error al contar usuarios:", err);
    } else if (row.count === 0) {
      // Hashear la contraseña "admin123" usando bcrypt
      hash("ADMIN12345", saltRounds, (hashErr, hashedPassword) => {
        if (hashErr) {
          console.error("Error al hashear la contraseña del admin:", hashErr);
        } else {
          const adminData = {
            nombre_usuario: "ADMINISTRADOR",
            correo: "ADMINKADENAS@gmail.com",
            contra: hashedPassword, // contraseña hasheada
            rol: "superadmin",
            foto_perfil: "/perfil/admin.jpg",
            saldo: 99999999.99,
          };

          const sql = `
            INSERT INTO usuarios (nombre_usuario, correo, contra, rol, foto_perfil, saldo, creado_en)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `;
          const params = [
            adminData.nombre_usuario,
            adminData.correo,
            adminData.contra,
            adminData.rol,
            adminData.foto_perfil,
            adminData.saldo,
          ];
          db.run(sql, params, function (error) {
            if (error) {
              console.error("Error al insertar usuario ADMIN:", error);
            }
          });
        }
      });
    } else {
      console.log("La tabla 'usuarios' ya tiene registros.");
    }
  });
});

export default db;