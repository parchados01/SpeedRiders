// Variables globales
let carrito = [];

// Agregar producto al carrito
document.querySelectorAll(".agregar-carrito").forEach(boton => {
    boton.addEventListener("click", () => {
        const nombre = boton.getAttribute("data-nombre");
        const precio = parseFloat(boton.getAttribute("data-precio"));
        carrito.push({ nombre, precio });
        actualizarCarrito();
    });
});

// Actualizar el contenido del carrito
function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const totalElemento = document.getElementById("total-carrito");
    lista.innerHTML = "";

    let total = 0;
    carrito.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        lista.appendChild(li);
        total += item.precio;
    });

    totalElemento.textContent = total.toFixed(2);
}

// Vaciar carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Cerrar modal
document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-confirmacion").style.display = "none";
});

// Filtro por categoría
document.getElementById("filtro-categoria").addEventListener("change", function () {
    const valor = this.value;
    document.querySelectorAll(".producto").forEach(producto => {
        if (valor === "todos" || producto.classList.contains(valor)) {
            producto.style.display = "block";
        } else {
            producto.style.display = "none";
        }
    });
});

// Botón Comprar normal (sin PayPal, solo simulado)
document.getElementById("boton-comprar").addEventListener("click", () => {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
    } else {
        document.getElementById("modal-confirmacion").style.display = "flex";
        vaciarCarrito();
    }
});

// Inicialización de PayPal
function cargarPayPal() {
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: document.getElementById('total-carrito').textContent
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
                alert('Gracias por tu compra, ' + details.payer.name.given_name + '!');
                vaciarCarrito();
                document.getElementById("modal-confirmacion").style.display = "flex";
            });
        }
    }).render('#paypal-button-container');
}

// Cargar SDK PayPal
const paypalScript = document.createElement('script');
paypalScript.src = "https://www.paypal.com/sdk/js?client-id=sb&currency=USD";
paypalScript.onload = cargarPayPal;
document.body.appendChild(paypalScript);

// Inicializar al cargar
document.addEventListener("DOMContentLoaded", actualizarCarrito);
