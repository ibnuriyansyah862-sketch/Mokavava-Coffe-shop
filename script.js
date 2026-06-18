/* ===========================
   MOKAVAVA — JAVASCRIPT
   =========================== */

// --- NAVBAR SCROLL ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// --- MOBILE HAMBURGER ---
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// --- MENU FILTER TABS ---
const tabs = document.querySelectorAll('.tab');
const cards = document.querySelectorAll('.product-card');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    const filter = tab.dataset.filter;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hidden', !show);
    });
  });
});

// --- CART STATE ---
let cart = {};

function addToCart(btn, name, price) {
  // Animate button
  btn.classList.add('spin');
  setTimeout(() => btn.classList.remove('spin'), 400);

  if (cart[name]) {
    cart[name].qty += 1;
  } else {
    cart[name] = { price, qty: 1 };
  }
  updateCartUI();

  // Show mini toast
  showToast(`${name} added to cart!`);
}

function updateCartUI() {
  const items = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');

  const entries = Object.entries(cart);
  const totalQty = entries.reduce((s, [, v]) => s + v.qty, 0);
  const totalPrice = entries.reduce((s, [, v]) => s + v.price * v.qty, 0);

  countEl.textContent = totalQty;
  totalEl.textContent = `$${totalPrice.toFixed(2)}`;

  if (entries.length === 0) {
    items.innerHTML = `<div class="cart-empty"><span>🛒</span><p>Your cart is empty</p></div>`;
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  items.innerHTML = entries.map(([name, { price, qty }]) => `
    <div class="cart-item">
      <div class="cart-item-emoji">${getEmoji(name)}</div>
      <div class="cart-item-info">
        <strong>${name}</strong>
        <span>$${(price * qty).toFixed(2)}</span>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="changeQty('${name}', -1)">−</button>
        <span class="qty-num">${qty}</span>
        <button class="qty-btn" onclick="changeQty('${name}', 1)">+</button>
      </div>
    </div>
  `).join('');
}

function changeQty(name, delta) {
  if (!cart[name]) return;
  cart[name].qty += delta;
  if (cart[name].qty <= 0) delete cart[name];
  updateCartUI();
}

function getEmoji(name) {
  const map = {
    'Classic Espresso': '☕',
    'Caramel Latte': '🍵',
    'Hazelnut Cappuccino': '🫗',
    'Mocha Supreme': '🍫',
    'Iced Brown Sugar Latte': '🧋',
    'Cold Brew': '🥤',
    'Affogato Float': '🍦',
    'Matcha Cold Latte': '🍵',
    'Butter Croissant': '🥐',
    'Coffee Cheesecake': '🍰',
    'Avocado Toast': '🥪',
    'Glazed Donut': '🍩',
  };
  return map[name] || '☕';
}

// --- TOGGLE CART ---
function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

// --- CHECKOUT ---
function checkout() {
  if (Object.keys(cart).length === 0) return;
  alert('🎉 Order placed! Thank you for choosing Mokavava.\nWe\'ll have your order ready shortly ☕');
  cart = {};
  updateCartUI();
  toggleCart();
}

// --- TOAST ---
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 6rem;
      right: 2rem;
      background: #2C1A0E;
      color: #fff;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 9999;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
      box-shadow: 0 8px 24px rgba(44,26,14,0.4);
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = `✓  ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 2500);
}

// --- CONTACT FORM ---
function submitForm(e) {
  e.preventDefault();
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  form.style.display = 'none';
  success.style.display = 'block';
}

// --- SCROLL REVEAL ---
const reveals = document.querySelectorAll('.product-card, .testimonial-card, .about-grid, .contact-grid, .stat');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});

// --- ORDER NOW BUTTON (nav) scrolls to menu ---
document.querySelector('.order-btn').addEventListener('click', () => {
  document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
});
