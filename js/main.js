/**
 * Sabor a Pecado — Main JS v4
 * ✓ Custom Cursor follow
 * ✓ Social Proof Ticker
 * ✓ Menu Dynamic Filtering
 * ✓ Lazy-loading Dark Map
 * ✓ Functional cart & Checkout
 */
(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ===== CUSTOM CURSOR =====
  if (!prefersReducedMotion.matches && window.innerWidth > 1024) {
    var cursor = document.getElementById('customCursor');
    var follower = document.getElementById('customCursorFollower');
    var posX = 0, posY = 0;
    var mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      posX += (mouseX - posX) / 6;
      posY += (mouseY - posY) / 6;
      if (cursor) cursor.style.transform = 'translate(' + mouseX + 'px, ' + mouseY + 'px) translate(-50%, -50%)';
      if (follower) follower.style.transform = 'translate(' + posX + 'px, ' + posY + 'px) translate(-50%, -50%)';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, [role="button"]').forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.style.transform += ' scale(2)'; cursor.style.background = 'rgba(212, 175, 55, 0.2)'; });
      el.addEventListener('mouseleave', function () { cursor.style.background = 'rgba(212, 175, 55, 0.4)'; });
    });
  }

  // ===== SOCIAL PROOF TICKER =====
  var ticker = document.getElementById('socialTicker');
  var tickerName = document.getElementById('tickerName');
  var tickerTime = document.getElementById('tickerTime');
  var names = ['Marcos R.', 'Elena G.', 'Andrés M.', 'Julieta S.', 'Facundo P.', 'Lucía D.', 'Ricardo T.'];
  var products = ['una Tentación Suprema', 'un Pecado Clásico', 'una Lujuria de Queso', 'unas Papas del Diablo', 'un Inferno Spicy', 'unos Nuggets', 'una Salchipapa'];

  function showTicker() {
    if (!ticker) return;
    var name = names[Math.floor(Math.random() * names.length)];
    var product = products[Math.floor(Math.random() * products.length)];
    tickerName.textContent = name;
    var textNode = document.getElementById('tickerText');
    if (textNode) textNode.textContent = ' acaba de pedir ' + product + '.';
    if (tickerTime) tickerTime.textContent = 'Hace ' + (Math.floor(Math.random() * 5) + 1) + ' minutos';
    
    ticker.classList.add('show');
    setTimeout(function() {
      ticker.classList.remove('show');
    }, 5000);

    // Schedule next show between 30s and 3min (180s)
    var nextDelay = 30000 + Math.random() * 150000;
    setTimeout(showTicker, nextDelay);
  }

  // First show after 3s
  setTimeout(showTicker, 3000);

  // ===== MENU FILTERING =====
  var filterBtns = document.querySelectorAll('.filter-tag');
  var menuCards = document.querySelectorAll('#menuGrid .menu-card');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = this.dataset.filter;
      
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');

      menuCards.forEach(function (card) {
        if (filter === 'all' || (card.dataset.tags && card.dataset.tags.indexOf(filter) !== -1)) {
          card.style.display = '';
          setTimeout(function() { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(function() { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ===== MENU SIDEBAR NAV =====
  document.querySelectorAll('.menu-cat-link').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.menu-cat-link').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var target = document.getElementById(this.dataset.target);
      if (target) {
        var pos = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0) - 30;
        window.scrollTo({ top: pos, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });

  // ===== LAZY LOAD MAP =====
  function initMap() {
    var mapEl = document.getElementById('deliveryMap');
    if (!mapEl || mapEl.classList.contains('initialized')) return;

    const lat = -34.66505236342747;
    const lng = -58.484301567077644;
    const radiusInMeters = 3000;

    const map = L.map('deliveryMap', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const fireIcon = L.divIcon({
      className: '',
      html: `<div style="
        background: linear-gradient(135deg, #FF6B35, #D4AF37);
        width: 40px; height: 40px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid #fff;
        box-shadow: 0 4px 15px rgba(255,107,53,0.6);
        display:flex;align-items:center;justify-content:center;
      "><span style="transform:rotate(45deg);font-size:18px;">🔥</span></div>`,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -45]
    });

    const marker = L.marker([lat, lng], { icon: fireIcon }).addTo(map);
    marker.bindPopup(
      '<div style="font-family:\'Playfair Display\',serif;text-align:center;padding:4px 8px">'
      + '<strong style="color:#D4AF37;font-size:1rem;">Sabor a Pecado</strong>'
      + '<br><span style="font-size:0.8rem;color:#555;">🚀 ¡Nuestra zona!</span>'
      + '</div>'
    );

    L.circle([lat, lng], {
      color: '#FF6B35',
      fillColor: '#D4AF37',
      fillOpacity: 0.12,
      weight: 2.5,
      dashArray: '8, 6',
      radius: radiusInMeters
    }).addTo(map);

    mapEl.classList.add('initialized');
  }

  var mapObserver = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      initMap();
      mapObserver.disconnect();
    }
  }, { threshold: 0.1 });

  var mapSection = document.querySelector('.delivery-map-section');
  if (mapSection) mapObserver.observe(mapSection);

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
    if (cartCountEl) {
      cartCountEl.textContent = count;
      if (count > 0) { cartCountEl.classList.add('show'); } else { cartCountEl.classList.remove('show'); }
    }
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
    if (cartSubtotalEl) cartSubtotalEl.textContent = '$' + total.toLocaleString();
    if (cartTotalEl) cartTotalEl.textContent = '$' + total.toLocaleString();
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

  // ===== ADD TO CART =====
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

  // Payment methods
  document.querySelectorAll('.payment-method').forEach(function (el) {
    el.addEventListener('click', function () {
      document.querySelectorAll('.payment-method').forEach(function (m) { m.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  // WhatsApp confirm
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

  // ===== NAVIGATION & SCROLL =====
  var navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) { if (navbar) navbar.classList.add('scrolled'); } 
    else { if (navbar) navbar.classList.remove('scrolled'); }
    
    var sp = window.scrollY + 160;
    document.querySelectorAll('section[id]').forEach(function (sec) {
      var t = sec.offsetTop, h = sec.offsetHeight, id = sec.getAttribute('id');
      if (sp >= t && sp < t + h) {
        document.querySelectorAll('#navLinks a').forEach(function (item) {
          item.classList.remove('active');
          if (item.getAttribute('href') === '#' + id) item.classList.add('active');
        });
      }
    });
  }, { passive: true });

  var mobileToggle = document.getElementById('mobileToggle');
  var navLinks = document.getElementById('navLinks');
  if (mobileToggle) {
    mobileToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      var spans = mobileToggle.querySelectorAll('span');
      if (isOpen) { spans[0].style.transform='rotate(45deg) translate(5px,5px)'; spans[1].style.opacity='0'; spans[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
      else { spans[0].style.transform='none'; spans[1].style.opacity='1'; spans[2].style.transform='none'; }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (id === '#') return;
      e.preventDefault();
      if (checkoutSection && checkoutSection.classList.contains('active')) hideCheckout();
      var target = document.querySelector(id);
      if (target) {
        var pos = target.getBoundingClientRect().top + window.scrollY - (navbar ? navbar.offsetHeight : 0) - 20;
        window.scrollTo({ top: pos, behavior: prefersReducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  });

  function updateCountdown() {
    var now = new Date();
    var end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    var diff = end - now;
    if (diff <= 0) return;
    var d = Math.floor(diff / 864e5), h = Math.floor((diff % 864e5) / 36e5), m = Math.floor((diff % 36e5) / 6e4), s = Math.floor((diff % 6e4) / 1e3);
    if (document.getElementById('days')) document.getElementById('days').textContent = String(d).padStart(2, '0');
    if (document.getElementById('hours')) document.getElementById('hours').textContent = String(h).padStart(2, '0');
    if (document.getElementById('minutes')) document.getElementById('minutes').textContent = String(m).padStart(2, '0');
    if (document.getElementById('seconds')) document.getElementById('seconds').textContent = String(s).padStart(2, '0');
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  if (!prefersReducedMotion.matches) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll('.animate-on-scroll').forEach(function (el) { el.classList.add('visible'); });
  }

  document.querySelectorAll('.fade-in-image').forEach(function (img) {
    if (img.complete) { img.classList.add('loaded'); } else { img.addEventListener('load', function () { img.classList.add('loaded'); }); }
  });

  updateCartUI();
})();
