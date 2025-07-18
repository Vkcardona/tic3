const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalDiv = document.getElementById('cart-total');
const cartCount = document.getElementById('cart-count');
const addCartBtns = document.querySelectorAll('.add-cart-btn');

// Leer carrito de storage
let cart = [];
if (localStorage.getItem('cart')) {
  try {
    cart = JSON.parse(localStorage.getItem('cart'));
  } catch(e) {
    cart = [];
  }
}
updateCart();

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCart() {
  if (!cartItemsDiv || !cartTotalDiv || !cartCount) return;
  cartItemsDiv.innerHTML = '';
  let total = 0;
  cart.forEach((item, idx) => {
    total += item.price * item.quantity;
    cartItemsDiv.innerHTML += `
      <div class="cart-item">
        <span>${item.name}</span>
        <input type="number" min="1" value="${item.quantity}" data-idx="${idx}" class="qty-input"/>
        <span>Q${item.price}</span>
        <span>Q${item.price * item.quantity}</span>
        <button class="remove-btn" data-idx="${idx}">Quitar</button>
      </div>
    `;
  });
  cartTotalDiv.innerHTML = "Total: Q" + total;
  const n = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = n;

  // Cambia ícono del carrito según estado
  const cartIconImg = document.getElementById('cart-icon-img');
  if(cartIconImg){
    if (n > 0) {
      cartIconImg.src = "Imagen/Carro Lleno-02.png";
    } else {
      cartIconImg.src = "Imagen/Carro Vacio_Mesa de trabajo 1.png";
    }
  }

  saveCart();
}

// Botones de imagen para agregar
if (addCartBtns.length) {
  addCartBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10);
      if (!name || isNaN(price)) return;
      const idx = cart.findIndex(item => item.name === name);
      if (idx > -1) {
        cart[idx].quantity += 1;
      } else {
        cart.push({ name, price, quantity: 1 });
      }
      updateCart();
    });
  });
}

// Para páginas individuales (evento personalizado)
window.addEventListener('add-product', (e) => {
  const detail = e.detail || {};
  if (
    typeof detail.name !== 'string' ||
    !detail.name.trim() ||
    typeof detail.price !== 'number' ||
    isNaN(detail.price) ||
    detail.price <= 0
  ) return;
  const idx = cart.findIndex(item => item.name === detail.name);
  if (idx > -1) {
    cart[idx].quantity += 1;
  } else {
    cart.push({ name: detail.name, price: detail.price, quantity: 1 });
  }
  updateCart();
});

// Control del modal
if (cartBtn && cartModal) {
  cartBtn.addEventListener('click', () => {
    cartModal.style.display = 'flex';
    updateCart();
  });
}
if (closeCart && cartModal) {
  closeCart.addEventListener('click', () => {
    cartModal.style.display = 'none';
  });
}

// Cambiar cantidad y quitar
if (cartItemsDiv) {
  cartItemsDiv.addEventListener('input', (e) => {
    if (e.target.classList.contains('qty-input')) {
      const idx = e.target.getAttribute('data-idx');
      let val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) val = 1;
      cart[idx].quantity = val;
      updateCart();
    }
  });
  cartItemsDiv.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const idx = e.target.getAttribute('data-idx');
      cart.splice(idx, 1);
      updateCart();
    }
  });
}

// Cierra modal si se hace click fuera
window.onclick = function(event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
};