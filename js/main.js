/**
 * Sabor a Pecado — Main JS v3
 * ✓ Functional cart (add, remove, quantity, total)
 * ✓ Cart drawer open/close
 * ✓ Checkout flow with order summary
 * ✓ Countdown, scroll animations, parallax
 * ✓ prefers-reduced-motion respected
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ===== CART STATE =====
  var cart = [];

  function getProductData(btn) {
    var card = btn.closest('.favorito-card, .menu-card');
    if (!card) return null;
    var nameEl = card.querySelector('.favorito-card-name, .menu-card-name');
    var priceEl = card.querySelector('.favorito-card-price, .menu-card-price');
    var imgEl = card.querySelector('img');
    var name = nameEl ? nameEl.textContent.trim() : 'Producto';
    var priceText = priceEl ? priceEl.textContent.replace(/[^\d]/g, '') : '0';
    var price = parseFloat(priceText);
    var img = imgEl ? imgEl.src : '';
    return { name: name, price: price, img: img, qty: 1 };
  }

  function addToCart(product) {
    var existing = cart.find(function (item) { return item.name === product.name; });
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name: product.name, price: product.price, img: product.img, qty: 1 });
    }
    updateCartUI();
    openCartDrawer();
  }

  function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
  }

  function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCartUI();
  }

  function getCartTotal() {
    return cart.reduce(function (sum, item) { return sum + item.price * item.qty; }, 0);
  }

  function getCartCount() {
    return cart.reduce(function (sum, item) { return sum + item.qty; }, 0);
  }

  // ===== CART UI =====
  var cartCountEl = document.getElementById('cartCount');
  var cartItemsEl = document.getElementById('cartItems');
  var cartSubtotalEl = document.getElementById('cartSubtotal');
  var cartTotalEl = document.getElementById('cartTotal');

  function updateCartUI() {
    var count = getCartCount();
    var total = getCartTotal();

    // Badge
    if (cartCountEl) {
      cartCountEl.textContent = count;
      if (count > 0) { cartCountEl.classList.add('show'); } else { cartCountEl.classList.remove('show'); }
    }

    // Items
    if (cartItemsEl) {
      if (cart.length === 0) {
        cartItemsEl.innerHTML = '<div class="cart-empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"/></svg><p>Tu carrito está vacío.<br>Elegí tu primer pecado.</p></div>';
      } else {
        var html = '';
        cart.forEach(function (item, i) {
          html += '<div class="cart-item">';
          html += '<div class="cart-item-img"><img src="' + item.img + '" alt="' + item.name + '" /></div>';
          html += '<div class="cart-item-info">';
          html += '<div class="cart-item-name">' + item.name + '</div>';
          html += '<div class="cart-item-controls">';
          html += '<button class="cart-qty-btn" data-action="minus" data-index="' + i + '" aria-label="Reducir cantidad">−</button>';
          html += '<span class="cart-qty-num">' + item.qty + '</span>';
          html += '<button class="cart-qty-btn" data-action="plus" data-index="' + i + '" aria-label="Aumentar cantidad">+</button>';
          html += '</div>';
          html += '</div>';
          html += '<div style="text-align:right">';
          html += '<div class="cart-item-price">$' + (item.price * item.qty).toLocaleString() + '</div>';
          html += '<button class="cart-item-remove" data-index="' + i + '">✕ Quitar</button>';
          html += '</div>';
          html += '</div>';
        });
        cartItemsEl.innerHTML = html;

        // Bind qty and remove buttons
        cartItemsEl.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var idx = parseInt(this.dataset.index);
            var delta = this.dataset.action === 'plus' ? 1 : -1;
            changeQty(idx, delta);
          });
        });
        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(function (btn) {
          btn.addEventListener('click', function () {
            removeFromCart(parseInt(this.dataset.index));
          });
        });
      }
    }

    // Totals
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + total.toLocaleString();
    if (cartTotalEl) cartTotalEl.textContent = '$' + total.toLocaleString();

    // Update checkout summary
    updateCheckoutSummary();
  }

  // ===== CART DRAWER =====
  var cartOverlay = document.getElementById('cartOverlay');
  var cartDrawer = document.getElementById('cartDrawer');
  var cartCloseBtn = document.getElementById('cartClose');
  var cartOpenBtn = document.getElementById('cartBtn');

  function openCartDrawer() {
    if (cartOverlay) cartOverlay.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    if (cartOverlay) cartOverlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartOpenBtn) cartOpenBtn.addEventListener('click', openCartDrawer);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCartDrawer);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCartDrawer);

  // ===== ADD TO CART BUTTONS =====
  document.querySelectorAll('.favorito-card-add, .menu-card-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var product = getProductData(this);
      if (product) addToCart(product);
    });
  });

  // ===== CHECKOUT =====
  var checkoutSection = document.getElementById('checkoutSection');
  var mainContent = document.getElementById('mainContent');
  var checkoutBtn = document.getElementById('goToCheckout');
  var backToMenu = document.getElementById('backToMenu');

  function showCheckout() {
    closeCartDrawer();
    if (mainContent) mainContent.style.display = 'none';
    if (checkoutSection) checkoutSection.classList.add('active');
    window.scrollTo(0, 0);
    updateCheckoutSummary();
  }

  function hideCheckout() {
    if (checkoutSection) checkoutSection.classList.remove('active');
    if (mainContent) mainContent.style.display = '';
  }

  if (checkoutBtn) checkoutBtn.addEventListener('click', showCheckout);
  if (backToMenu) backToMenu.addEventListener('click', hideCheckout);

  function updateCheckoutSummary() {
    var summaryItems = document.getElementById('checkoutItems');
    var summarySubtotal = document.getElementById('checkoutSubtotal');
    var summaryTotal = document.getElementById('checkoutTotal');
    if (!summaryItems) return;

    var total = getCartTotal();
    var html = '';
    cart.forEach(function (item) {
      html += '<div class="checkout-item">';
      html += '<div class="checkout-item-img"><img src="' + item.img + '" alt="' + item.name + '" /></div>';
      html += '<div class="checkout-item-info"><div class="checkout-item-name">' + item.name + '</div><div class="checkout-item-qty">Cantidad: ' + item.qty + '</div></div>';
      html += '<div class="checkout-item-price">$' + (item.price * item.qty).toLocaleString() + '</div>';
      html += '</div>';
    });
    summaryItems.innerHTML = html;
    if (summarySubtotal) summarySubtotal.textContent = '$' + total.toLocaleString();
    if (summaryTotal) summaryTotal.textContent = '$' + total.toLocaleString();
  }

  // Payment method selection
  document.querySelectorAll('.payment-method').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.payment-method').forEach(function (m) { m.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // Confirm order
  var confirmBtn = document.getElementById('confirmOrder');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function () {
      if (cart.length === 0) return;
      var total = getCartTotal();
      var msg = 'Hola! Quiero hacer un pedido:%0A%0A';
      cart.forEach(function (item) {
        msg += '• ' + item.name + ' x' + item.qty + ' - $' + (item.price * item.qty).toLocaleString() + '%0A';
      });
      msg += '%0ATotal: $' + total.toLocaleString();
      window.open('https://wa.me/5491150177778?text=' + msg, '_blank');
    });
  }

  // ===== NAVBAR SCROLL =====
  var navbar = document.getElementById('navbar');
  function handleNavbarScroll() {
    if (window.scrollY > 50) { navbar.classList.add('scrolled'); } else { navbar.classList.remove('scrolled'); }
  }
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  // ===== MOBILE MENU =====
  var mobileToggle = document.getElementById('mobileToggle');
  var navLinks = document.getElementById('navLinks');
  mobileToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    mobileToggle.setAttribute('aria-expanded', isOpen);
    var spans = mobileToggle.querySelectorAll('span');
    if (isOpen) { spans[0].style.transform='rotate(45deg) translate(5px,5px)'; spans[1].style.opacity='0'; spans[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
    else { spans[0].style.transform='none'; spans[1].style.opacity='1'; spans[2].style.transform='none'; }
  });
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open'); mobileToggle.setAttribute('aria-expanded','false');
      var s = mobileToggle.querySelectorAll('span');
      s[0].style.transform='none'; s[1].style.opacity='1'; s[2].style.transform='none';
    });
  });

  // ===== ACTIVE NAV ON SCROLL =====
  var sections = document.querySelectorAll('section[id]');
  var navItems = navLinks.querySelectorAll('a');
  function updateActiveNav() {
    var sp = window.scrollY + 160;
    sections.forEach(function (sec) {
      var t = sec.offsetTop, h = sec.offsetHeight, id = sec.getAttribute('id');
      if (sp >= t && sp < t + h) {
        navItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) item.classList.add('active');
        });
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // ===== MENU SIDEBAR NAV =====
  document.querySelectorAll('.menu-cat-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.menu-cat-link').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var target = document.getElementById(this.dataset.target);
      if (target) {
        var pos = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 30;
        window.scrollTo({ top: pos, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });

  // ===== COUNTDOWN =====
  function updateCountdown() {
    var now = new Date();
    var end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    var diff = end - now;
    if (diff <= 0) return;
    var d = Math.floor(diff / 864e5);
    var h = Math.floor((diff % 864e5) / 36e5);
    var m = Math.floor((diff % 36e5) / 6e4);
    var s = Math.floor((diff % 6e4) / 1e3);
    var el = function(id) { return document.getElementById(id); };
    if (el('days')) el('days').textContent = String(d).padStart(2, '0');
    if (el('hours')) el('hours').textContent = String(h).padStart(2, '0');
    if (el('minutes')) el('minutes').textContent = String(m).padStart(2, '0');
    if (el('seconds')) el('seconds').textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ===== SCROLL ANIMATIONS =====
  if (!prefersReducedMotion.matches) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { el.classList.add('visible'); });
  }

  // ===== IMAGE FADE-IN =====
  document.querySelectorAll('.fade-in-image').forEach(function (img) {
    if (img.complete) { img.classList.add('loaded'); } else { img.addEventListener('load', function () { img.classList.add('loaded'); }); }
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      // If we're in checkout, go back first
      if (checkoutSection && checkoutSection.classList.contains('active')) hideCheckout();
      var target = document.querySelector(id);
      if (target) {
        var pos = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 20;
        window.scrollTo({ top: pos, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });

  // ===== INIT =====
  handleNavbarScroll();
  updateActiveNav();
  updateCartUI();
})();
