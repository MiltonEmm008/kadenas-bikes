feather.replace(); // Initialize Feather Icons

function calculateTotals() {
  const subtotal = 0; // No hay productos definidos

  // Calcular envío
  const deliveryType = document.getElementById("deliveryType").value;
  let shippingCost = 0;
  if (deliveryType === "standard") shippingCost = 3.5;
  else if (deliveryType === "express") shippingCost = 6.0;

  // Total final
  const finalTotal = subtotal + shippingCost;

  // Actualizar display
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById(
    "shippingCost"
  ).textContent = `$${shippingCost.toFixed(2)}`;
  document.getElementById("finalTotal").textContent = `$${finalTotal.toFixed(
    2
  )}`;
}

function previewOrder() {
  const orderData = {
    customer: {
      name: document.getElementById("customerName").value,
      phone: document.getElementById("customerPhone").value,
      email: document.getElementById("customerEmail").value,
    },
    address: {
      street: document.getElementById("street").value,
      neighborhood: document.getElementById("neighborhood").value,
      city: document.getElementById("city").value,
      zipCode: document.getElementById("zipCode").value,
      notes: document.getElementById("addressNotes").value,
    },
    delivery: {
      type: document.getElementById("deliveryType").value,
      notes: document.getElementById("deliveryNotes").value,
    },
  };

  if (!validateOrder(orderData)) return;

  let preview = `🛒 VISTA PREVIA DEL PEDIDO
═══════════════════════════════

👤 CLIENTE:
${orderData.customer.name}
📱 ${orderData.customer.phone}
${orderData.customer.email ? "📧 " + orderData.customer.email : ""}

📍 ENTREGA:
${orderData.address.street}
${orderData.address.neighborhood}, ${orderData.address.city}
CP: ${orderData.address.zipCode}
${orderData.address.notes ? "Notas: " + orderData.address.notes : ""}

🚚 ENTREGA: ${getDeliveryTypeText(orderData.delivery.type)}

💰 TOTAL: ${document.getElementById("finalTotal").textContent}
`;

  alert(preview);
}

function getDeliveryTypeText(type) {
  const types = {
    standard: "Entrega Estándar",
    express: "Entrega Express",
    pickup: "Recoger en Tienda",
  };
  return types[type] || type;
}

function validateOrder(data) {
  if (!data.customer.name || !data.customer.phone) {
    alert("Por favor completa la información personal obligatoria");
    return false;
  }

  if (
    !data.address.street ||
    !data.address.neighborhood ||
    !data.address.city ||
    !data.address.zipCode
  ) {
    alert("Por favor completa la dirección de entrega");
    return false;
  }

  if (!data.delivery.type) {
    alert("Por favor selecciona el tipo de entrega");
    return false;
  }

  return true;
}

function submitOrder() {
  const orderData = {
    customer: {
      name: document.getElementById("customerName").value,
      phone: document.getElementById("customerPhone").value,
      email: document.getElementById("customerEmail").value,
    },
    address: {
      street: document.getElementById("street").value,
      neighborhood: document.getElementById("neighborhood").value,
      city: document.getElementById("city").value,
      zipCode: document.getElementById("zipCode").value,
      notes: document.getElementById("addressNotes").value,
    },
    delivery: {
      type: document.getElementById("deliveryType").value,
      notes: document.getElementById("deliveryNotes").value,
    },
  };

  if (!validateOrder(orderData)) return;

  // Generar número de orden
  const orderNumber =
    "ORD-" + new Date().getFullYear() + "-" + Math.floor(Math.random() * 10000);

  alert(`🎉 ¡PEDIDO CONFIRMADO!

Número de Orden: ${orderNumber}

Tu pedido ha sido recibido y está siendo procesado.
Te contactaremos pronto para confirmar los detalles.

¡Gracias por tu preferencia!`);

  console.log("Datos del pedido:", orderData);
  // Reset form after submission
  document.getElementById("orderForm").reset();
  calculateTotals(); // Recalculate totals to reset them to $0.00
}

// Calcular totales al cargar la página
calculateTotals();

// MENU HAMBURGUESA RESPONSIVE PARA MOVIL
const menuToggle = document.getElementById("menu-toggle");
const menu = document.getElementById("menu");
const perfil_toggle = document.getElementById("foto_usuario");
const menu_perfil = document.getElementById("menu-usuarios");

perfil_toggle.addEventListener("click", function (e) {
  e.preventDefault();
  if (menu.classList.contains("hidden")) {
    menu_perfil.classList.toggle("hidden");
  } else {
    menu.classList.add("hidden");
    menu_perfil.classList.remove("hidden");
  }
});

// ABRE O CIERRA EL MENU AL HACER CLICK EN EL BOTON
menuToggle.addEventListener("click", function () {
  if (menu_perfil.classList.contains("hidden")) {
    menu.classList.toggle("hidden");
  } else {
    menu_perfil.classList.add("hidden");
    menu.classList.remove("hidden");
  }
});
