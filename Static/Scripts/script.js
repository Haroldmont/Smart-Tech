const productos = {
    'smartphone-1': { nombre: 'Smartphone-1', precio: 500, stock: 10, descuento: 0.1 },
    'smartphone-2': { nombre: 'Smartphone-2', precio: 600, stock: 12, descuento: 0.15 },
    'smartphone-3': { nombre: 'Smartphone-3', precio: 450, stock: 8, descuento: 0.05 },
    'smartphone-4': { nombre: 'Smartphone-4', precio: 700, stock: 20, descuento: 0 },
    'smartphone-5': { nombre: 'Smartphone-5', precio: 650, stock: 25, descuento: 0.1 },
    'smartphone-6': { nombre: 'Smartphone-6', precio: 750, stock: 15, descuento: 0.2 },
    'smartphone-7': { nombre: 'Smartphone-7', precio: 500, stock: 10, descuento: 0.1 },
    'smartphone-8': { nombre: 'Smartphone-8', precio: 600, stock: 12, descuento: 0.15 },
    'smartphone-9': { nombre: 'Smartphone-9', precio: 450, stock: 8, descuento: 0.05 },
    'smartphone-10': { nombre: 'Smartphone-10', precio: 700, stock: 20, descuento: 0 },
    'smartphone-11': { nombre: 'Smartphone-11', precio: 650, stock: 25, descuento: 0.1 },
    'smartphone-12': { nombre: 'Smartphone-12', precio: 750, stock: 15, descuento: 0.2 },
};

const IVA = 0.21;

function generarProductos() {
    const productosContainer = document.getElementById('productos');
    Object.keys(productos).forEach(productoKey => {
        const producto = productos[productoKey];
        
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('card');
        tarjeta.innerHTML = `
            <img src="../img/${producto.nombre}.png" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Precio: $${producto.precio}</p>
            <p>Stock: <span id="stock-${productoKey}">${producto.stock}</span></p>
            <button onclick="agregarAlCarrito('${producto.nombre}', ${producto.precio}, '${productoKey}')">Agregar al carrito</button>
        `;
        productosContainer.appendChild(tarjeta);
    });
}

function agregarAlCarrito(nombre, precio, productoKey) {
    const producto = productos[productoKey];

    if (producto.stock <= 0) {
        alert('¡Producto agotado!');
        return;
    }

    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    carrito.push({ nombre, precio, productoKey });
    producto.stock--;
    document.getElementById(`stock-${productoKey}`).textContent = producto.stock;

    localStorage.setItem('carrito', JSON.stringify(carrito));
    renderizarCarrito();
}

function renderizarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalCarrito = document.getElementById('subtotal-carrito');
    const descuentoCarrito = document.getElementById('descuento-carrito');
    const ivaCarrito = document.getElementById('iva-carrito');
    const totalCarrito = document.getElementById('total-carrito');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    listaCarrito.innerHTML = '';
    
    let subtotal = 0;
    let descuentoTotal = 0;

    carrito.forEach((producto, index) => {
        const productoInfo = productos[producto.productoKey];
        const li = document.createElement('li');
        
        const descuentoProducto = productoInfo.descuento * producto.precio;
        li.innerHTML = `${producto.nombre} - $${producto.precio} 
                        ${productoInfo.descuento > 0 ? `<span class="descuento">(Desc. ${(productoInfo.descuento * 100).toFixed(0)}%: -$${descuentoProducto.toFixed(2)})</span>` : ''}`;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        subtotal += producto.precio;
        descuentoTotal += descuentoProducto;
    });

    const ivaTotal = (subtotal - descuentoTotal) * IVA;
    const total = subtotal - descuentoTotal + ivaTotal;

    subtotalCarrito.textContent = subtotal.toFixed(2);
    descuentoCarrito.textContent = descuentoTotal.toFixed(2);
    ivaCarrito.textContent = ivaTotal.toFixed(2);
    totalCarrito.textContent = total.toFixed(2);
}

function eliminarDelCarrito(index) {
    let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    
    const producto = productos[carrito[index].productoKey];
    producto.stock++;
    document.getElementById(`stock-${carrito[index].productoKey}`).textContent = producto.stock;
    
    carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(carrito));
    
    renderizarCarrito();
}

function vaciarCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    carrito.forEach(item => {
        const producto = productos[item.productoKey];
        producto.stock++;
        document.getElementById(`stock-${item.productoKey}`).textContent = producto.stock;
    });
    
    localStorage.removeItem('carrito');
    renderizarCarrito();
}

function mostrarCheckout() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    if (carrito.length === 0) {
        alert('El carrito está vacío');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    modal.style.display = 'block';
    
    const subtotal = carrito.reduce((total, item) => total + item.precio, 0);
    const descuento = carrito.reduce((total, item) => total + productos[item.productoKey].descuento * item.precio, 0);
    const iva = (subtotal - descuento) * IVA;
    const total = subtotal - descuento + iva;

    document.getElementById('modal-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('modal-descuento').textContent = descuento.toFixed(2);
    document.getElementById('modal-iva').textContent = iva.toFixed(2);
    document.getElementById('modal-total').textContent = total.toFixed(2);
}

function cerrarCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function realizarCompra() {
    localStorage.removeItem('carrito');
    alert('¡Compra realizada con éxito!');
    renderizarCarrito();
}

document.addEventListener('DOMContentLoaded', () => {
    generarProductos();
    renderizarCarrito();
});

const carousel = document.querySelector('.sponsor-carousel');
const items = Array.from(carousel.children);

// Clonamos los elementos para crear el efecto infinito
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    carousel.appendChild(clone);
});
