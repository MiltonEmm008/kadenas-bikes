import puppeteer from "puppeteer";
import path from "path";
import Producto from "../models/Producto.js";
import { fileURLToPath } from "url";
import ejs from "ejs";
import Usuario from "../models/Usuario.js";
import Pedido from '../models/Pedido.js'
import { imgToBase64 } from "../utils/imgToBase64.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateUserReport(req, res) {
  if (!req.user || !["administrador", "superadmin"].includes(req.user.rol)) {
    return res.status(403).redirect("/");
  }
  try {
    // 1. Obtener todos los usuarios
    const usuarios = await Usuario.all();
    // 2. Últimos 5 usuarios
    const ultimosUsuarios = [...usuarios]
      .sort((a, b) => new Date(b.creado_en) - new Date(a.creado_en))
      .slice(0, 5);

    // 3. Gráfico método de registro
    let github = 0,
      google = 0,
      manual = 0;
    usuarios.forEach((u) => {
      if (u.github_id) github++;
      else if (u.google_id) google++;
      else manual++;
    });
    const datosMetodo = { github, google, manual };

    // 4. Gráfico registros últimos 7 días
    const dias = [];
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
      });
      labels.push(label);
      dias.push(0);
    }
    usuarios.forEach((u) => {
      const fecha = new Date(u.creado_en);
      for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        if (fecha.toDateString() === d.toDateString()) {
          dias[i]++;
        }
      }
    });
    const datosDias = { labels, data: dias };

    // 5. Gráfico roles
    const datosRoles = {};
    usuarios.forEach((u) => {
      datosRoles[u.rol] = (datosRoles[u.rol] || 0) + 1;
    });

    // 6. Convertir imágenes a base64
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "logotipo.png"
    );
    const logoBase64 = await imgToBase64(logoPath);

    for (const u of usuarios) {
      u.foto_perfil_base64 = await imgToBase64(
        path.join(process.cwd(), "public", u.foto_perfil)
      );
    }
    for (const u of ultimosUsuarios) {
      u.foto_perfil_base64 = await imgToBase64(
        path.join(process.cwd(), "public", u.foto_perfil)
      );
    }

    // 7. Renderizar EJS
    const ejsPath = path.join(__dirname, "../views/REPORTE-USUARIOS.ejs");
    const html = await ejs.renderFile(ejsPath, {
      usuarios,
      ultimosUsuarios,
      datosMetodo,
      datosDias,
      datosRoles,
      logoBase64,
    });

    // 7. Generar PDF con Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 24, bottom: 24, left: 16, right: 16 },
    });
    await browser.close();

    // 8. Enviar PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=reporte_usuarios.pdf",
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar el reporte de usuarios:", error);
    res.status(500).send("Error al generar el reporte de usuarios");
  }
}

export async function generateProductReport(req, res) {
  if (!req.user || !["administrador", "superadmin"].includes(req.user.rol)) {
    return res.status(403).redirect("/");
  }
  try {
    // 1. Obtener productos con proveedor
    const productos = await Producto.allWithSupplierJoin();
    // 2. Preparar datos para gráficos
    const categorias = {};
    const proveedores = {};
    let stockAlto = 0,
      stockBajo = 0,
      stockCero = 0;
    const dias = Array(7).fill(0);
    const diasLabels = [];
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      diasLabels.push(
        d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" })
      );
    }
    const ahora = new Date();
    productos.forEach((p) => {
      categorias[p.categoria] = (categorias[p.categoria] || 0) + 1;
      proveedores[p.proveedor_nombre] =
        (proveedores[p.proveedor_nombre] || 0) + 1;
      if (p.stock === 0) stockCero++;
      else if (p.stock <= 5) stockBajo++;
      else stockAlto++;
      if (p.creado_en) {
        const creado = new Date(p.creado_en);
        for (let i = 0; i < 7; i++) {
          const d = new Date(ahora);
          d.setDate(ahora.getDate() - (6 - i));
          if (
            creado.getDate() === d.getDate() &&
            creado.getMonth() === d.getMonth() &&
            creado.getFullYear() === d.getFullYear()
          ) {
            dias[i]++;
          }
        }
      }
    });
    // 3. Convertir imágenes a base64
    const logoPath = path.join(
      process.cwd(),
      "public",
      "images",
      "logotipo.png"
    );
    const logoBase64 = await imgToBase64(logoPath);
    for (const p of productos) {
      p.foto_producto_base64 = await imgToBase64(
        path.join(process.cwd(), "public", p.foto_producto)
      );
    }
    // 4. Renderizar EJS
    const ejsPath = path.join(__dirname, "../views/REPORTE-PRODUCTOS.ejs");
    const html = await ejs.renderFile(ejsPath, {
      productos,
      logoBase64,
      categorias,
      proveedores,
      stock: { alto: stockAlto, bajo: stockBajo, cero: stockCero },
      dias,
      diasLabels,
    });
    // 5. Generar PDF
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=reporte_productos.pdf"
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al generar el reporte de productos.");
  }
}

export async function generateSalesReport(req, res) {
  if (!req.user || !["administrador", "superadmin"].includes(req.user.rol)) {
    return res.status(403).redirect("/");
  }
  try {
    // 1. Obtener todos los pedidos con información del usuario
    const pedidos = await Pedido.getAllWithUserInfo();
    
    // 2. Preparar datos para las tarjetas resumen
    const totalVentas = pedidos.reduce((sum, p) => sum + (p.estado === 'finalizado' ? p.total : 0), 0);
    const pedidosFinalizados = pedidos.filter(p => p.estado === 'finalizado').length;
    const totalProductos = pedidos.reduce((sum, p) => {
      if (p.estado === 'finalizado' && p.items) {
        return sum + p.items.reduce((itemSum, item) => itemSum + item.cantidad, 0);
      }
      return sum;
    }, 0);
    const clientesUnicos = new Set(pedidos.map(p => p.usuario_id)).size;

    // 3. Preparar datos para gráfico de ventas últimos 7 días
    const ventasDias = {
      labels: [],
      data: Array(7).fill(0)
    };
    const hoy = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      ventasDias.labels.push(
        d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit" })
      );
    }
    pedidos.forEach(p => {
      if (p.estado === 'finalizado') {
        const fecha = new Date(p.creado_en);
        for (let i = 0; i < 7; i++) {
          const d = new Date(hoy);
          d.setDate(hoy.getDate() - (6 - i));
          if (
            fecha.getDate() === d.getDate() &&
            fecha.getMonth() === d.getMonth() &&
            fecha.getFullYear() === d.getFullYear()
          ) {
            ventasDias.data[i] += p.total;
          }
        }
      }
    });

    // 4. Preparar datos para gráfico de distribución de estados
    const estadosPedidos = {};
    pedidos.forEach(p => {
      estadosPedidos[p.estado] = (estadosPedidos[p.estado] || 0) + 1;
    });

    // 5. Preparar datos para gráfico de productos más vendidos
    const productosVendidos = {};
    pedidos.forEach(p => {
      if (p.estado === 'finalizado' && p.items) {
        p.items.forEach(item => {
          if (!productosVendidos[item.id]) {
            productosVendidos[item.id] = {
              id: item.id,
              nombre: item.nombre,
              cantidad: 0,
              foto_producto: item.foto_producto
            };
          }
          productosVendidos[item.id].cantidad += item.cantidad;
        });
      }
    });
    const productosMasVendidos = Object.values(productosVendidos)
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    // 6. Preparar datos para gráfico de ganancias últimos 7 días
    const gananciasDias = {
      labels: ventasDias.labels,
      data: Array(7).fill(0)
    };
    pedidos.forEach(p => {
      if (p.estado === 'finalizado') {
        const fecha = new Date(p.creado_en);
        for (let i = 0; i < 7; i++) {
          const d = new Date(hoy);
          d.setDate(hoy.getDate() - (6 - i));
          if (
            fecha.getDate() === d.getDate() &&
            fecha.getMonth() === d.getMonth() &&
            fecha.getFullYear() === d.getFullYear()
          ) {
            // Calcular ganancia (asumiendo un margen del 30%)
            const ganancia = p.total * 0.3;
            gananciasDias.data[i] += ganancia;
          }
        }
      }
    });

    // 7. Convertir logo a base64
    const logoPath = path.join(process.cwd(), "public", "images", "logotipo.png");
    const logoBase64 = await imgToBase64(logoPath);

    // 8. Obtener últimos 50 pedidos
    const ultimosPedidos = pedidos.slice(0, 50);

    // 9. Renderizar EJS
    const ejsPath = path.join(__dirname, "../views/REPORTE-VENTAS.ejs");
    const html = await ejs.renderFile(ejsPath, {
      pedidos: ultimosPedidos,
      totalVentas,
      pedidosFinalizados,
      totalProductos,
      clientesUnicos,
      ventasDias,
      estadosPedidos,
      productosMasVendidos,
      gananciasDias,
      logoBase64
    });

    // 10. Generar PDF con Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: 24, bottom: 24, left: 16, right: 16 }
    });
    await browser.close();

    // 11. Enviar PDF
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=reporte_ventas.pdf"
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error al generar el reporte de ventas:", error);
    res.status(500).send("Error al generar el reporte de ventas");
  }
}
