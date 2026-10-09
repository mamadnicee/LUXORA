/* ============================================================
   LUXORA — SCRIPT
   محصولات، گالری، نظرات، سبد خرید، واتساپ
   ============================================================ */

/* ---------- CONFIG (تنظیمات پایه) ---------- */
const CONFIG = {
  whatsapp: '989120000000',      // شماره واتساپ فروشگاه
  currency: 'تومان',
  // مسیر محصولات و گالری: از products.json خونده می‌شه
  productsFile: 'products.json',
  // لیست عکس‌های گالری (فقط شماره‌ی فایل عکس در پوشه assets/images/)
  // ترتیب هرچی که اینجا باشه همون‌طور نمایش داده می‌شه.
  gallery: [
    { img: '1', label: 'کلکسیون کلاسیک' },
    { img: '2', label: 'طراحی مدرن' },
    { img: '3', label: 'جزئیات بدنه' },
    { img: '4', label: 'بند چرم' },
    { img: '5', label: 'صفحه مروارید' },
    { img: '6', label: 'بازل استیل' },
    { img: '7', label: 'بسته‌بندی لوکس' },
    { img: '8', label: 'ساخت دست' },
    { img: '9', label: 'کلکسیون ویژه' }
  ],
  testimonials: [
    { text: 'کیفیت و اصالت ساعت فوق‌العاده بود. دقیقاً همون چیزی که توی عکس‌ها دیدم.', author: 'سارا محمدی', role: 'مشتری' },
    { text: 'مشاوره‌ی تخصصی و صبورانه‌شون باعث شد بهترین انتخاب رو داشته باشم.', author: 'امیر رضایی', role: 'مشتری' },
    { text: 'ارسال سریع و بسته‌بندی بی‌نقص. حتماً دوباره خرید می‌کنم.', author: 'نگار کریمی', role: 'مشتری' }
  ]
};

/* ---------- Helpers ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const toFa = n => Number(n).toLocaleString('fa-IR');
const imgPath = n => `assets/images/${n}.jpg`;

/* ---------- State ---------- */
let PRODUCTS = [];

/* ---------- 1. LOAD PRODUCTS FROM JSON ---------- */
async function loadProducts() {
  try {
    const res = await fetch(CONFIG.productsFile, { cache: 'no-store' });
    if (!res.ok) throw new Error('products.json not found');
    PRODUCTS = await res.json();
  } catch (err) {
    console.warn('products.json قابل خواندن نبود، از داده‌ی پیش‌فرض استفاده می‌شود.', err);
    PRODUCTS = [];
  }
}

/* ---------- 2. RENDER PRODUCTS ---------- */
function renderProducts() {
  const grid = $('#productsGrid');
  if (!grid) return;

  if (!PRODUCTS.length) {
    grid.innerHTML = '<div class="cart-empty" style="grid-column:1/-1;text-align:center;padding:3rem 0;color:var(--c-muted)">محصولی برای نمایش وجود ندارد.</div>';
    return;
  }

  grid.innerHTML = PRODUCTS.map((p, i) => `
    <article class="product-card reveal" style="transition-delay:${i * 60}ms">
      <div class="product-media">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
        <img src="${imgPath(p.id)}" alt="${p.name || ''}" loading="lazy"
             onerror="this.style.display='none'">
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name || ''}</h3>
        <p class="product-desc">${p.desc || ''}</p>
        <div class="product-foot">
          <span class="product-price">${toFa(p.price || 0)}<small>${CONFIG.currency}</small></span>
          <button class="add-btn" data-add="${p.id}" aria-label="افزودن به سبد">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

/* ---------- 3. RENDER GALLERY ---------- */
function renderGallery() {
  const track = $('#galleryTrack');
  const dots  = $('#galleryDots');
  if (!track) return;

  track.innerHTML = CONFIG.gallery.map((g, i) => `
    <div class="gallery-item" data-label="${g.label || ''}" data-index="${i}">
      <img src="${imgPath(g.img)}" alt="${g.label || ''}" loading="lazy" draggable="false"
           onerror="this.style.display='none'">
    </div>
  `).join('');

  if (dots) {
    dots.innerHTML = CONFIG.gallery.map((_, i) =>
      `<button data-dot="${i}" ${i === 0 ? 'class="active"' : ''} aria-label="تصویر ${i + 1}"></button>`
    ).join('');
  }
}

/* ---------- 4. RENDER TESTIMONIALS ---------- */
function renderTestimonials() {
  const track = $('#testiTrack'), dots = $('#testiDots');
  if (!track) return;

  track.innerHTML = CONFIG.testimonials.map(t => `
    <div class="testi-item">
      <blockquote>${t.text}</blockquote>
      <div class="testi-author">${t.author}</div>
      <div class="testi-role">${t.role}</div>
    </div>
  `).join('');

  dots.innerHTML = CONFIG.testimonials.map((_, i) =>
    `<button data-dot="${i}" ${i === 0 ? 'class="active"' : ''} aria-label="نظر ${i + 1}"></button>`
  ).join('');

  let idx = 0;
  const go = i => {
    idx = i;
    track.style.transform = `translateX(${i * 100}%)`;
    $$('#testiDots button').forEach((b, k) => b.classList.toggle('active', k === i));
  };
  dots.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    go(+b.dataset.dot);
  });
  let timer = setInterval(() => go((idx + 1) % CONFIG.testimonials.length), 5500);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(timer));
  track.parentElement.addEventListener('mouseleave', () => {
    timer = setInterval(() => go((idx + 1) % CONFIG.testimonials.length), 5500);
  });
}

/* ---------- 5. SCROLL REVEAL ---------- */
function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => io.observe(el));
}

/* ---------- 6. HEADER SCROLL ---------- */
function initHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- 7. MOBILE NAV ---------- */
function initNav() {
  const burger = $('#burger'), nav = $('#nav');
  burger?.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    nav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
  });
  nav?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      burger.classList.remove('open');
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ---------- 8. HERO PARALLAX ---------- */
function initParallax() {
  const img = $('.hero-bg img');
  if (!img) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let raf;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight);
      img.style.transform = `translate3d(0, ${y * 0.3}px, 0) scale(1.06)`;
    });
  }, { passive: true });
}

/* ---------- 9. GALLERY SCROLL & DRAG ---------- */
function initGallery() {
  const track = $('#galleryTrack');
  const wrap  = $('#galleryWrap');
  const dots  = $('#galleryDots');
  const arrows = $$('.gallery-arrow');
  if (!track) return;

  const itemWidth = () => {
    const item = track.querySelector('.gallery-item');
    if (!item) return 300;
    const gap = parseFloat(getComputedStyle(track).gap) || 16;
    return item.getBoundingClientRect().width + gap;
  };

  const scrollByStep = dir => {
    const step = itemWidth();
    track.scrollBy({ left: dir === 'next' ? step : -step, behavior: 'smooth' });
  };

  arrows.forEach(a => {
    a.addEventListener('click', () => scrollByStep(a.dataset.dir));
  });

  // دات‌های گالری
  dots?.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const i = +b.dataset.dot;
    track.scrollTo({ left: itemWidth() * i, behavior: 'smooth' });
  });

  // آپدیت دات فعال در حین اسکرول
  const updateActiveDot = () => {
    if (!dots) return;
    const w = itemWidth();
    const idx = Math.round(track.scrollLeft / w);
    $$('#galleryDots button').forEach((b, k) => b.classList.toggle('active', k === idx));
  };
  track.addEventListener('scroll', () => {
    clearTimeout(track._t);
    track._t = setTimeout(updateActiveDot, 60);
  }, { passive: true });

  // Drag با موس (فقط دسکتاپ)
  let isDown = false, startX = 0, startScroll = 0;
  track.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX;
    startScroll = track.scrollLeft;
    wrap.classList.add('dragging');
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    wrap.classList.remove('dragging');
  });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = startScroll - (e.pageX - startX) * 1.2;
  });

  // Wheel افقی روی گالری (برای دسکتاپ وقتی موس روی گالری‌ست)
  track.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      // اجازه بده اسکرول عمودی صفحه ادامه پیدا کنه، فقط اگه انتهای گالری بود
      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      track.scrollLeft += e.deltaY;
    }
  }, { passive: false });
}

/* ---------- 10. CART ---------- */
const Cart = {
  key: 'luxora_cart',
  items: [],
  init() {
    try { this.items = JSON.parse(localStorage.getItem(this.key) || '[]'); }
    catch { this.items = []; }
  },
  save() { localStorage.setItem(this.key, JSON.stringify(this.items)); },
  add(id) {
    const p = PRODUCTS.find(x => Number(x.id) === Number(id));
    if (!p) return;
    const ex = this.items.find(i => Number(i.id) === Number(id));
    if (ex) ex.qty++;
    else this.items.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
    this.save(); this.render();
    UI.flashCount();
  },
  remove(id) {
    this.items = this.items.filter(i => Number(i.id) !== Number(id));
    this.save(); this.render();
  },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  render() {
    const wrap = $('#cartItems');
    const count = $('#cartCount');
    if (!wrap) return;
    count.textContent = toFa(this.count());
    count.classList.toggle('active', this.count() > 0);
    $('#cartTotal').textContent = toFa(this.total()) + ' ' + CONFIG.currency;

    if (!this.items.length) {
      wrap.innerHTML = '<div class="cart-empty">سبد خرید خالی است</div>';
      return;
    }
    wrap.innerHTML = this.items.map(i => `
      <div class="cart-item">
        <img src="${imgPath(i.id)}" alt="${i.name}" onerror="this.style.display='none'">
        <div>
          <div class="cart-item-name">${i.name} × ${toFa(i.qty)}</div>
          <div class="cart-item-price">${toFa(i.price * i.qty)} ${CONFIG.currency}</div>
        </div>
        <button class="cart-item-remove" data-remove="${i.id}" aria-label="حذف">✕</button>
      </div>
    `).join('');
  }
};

const UI = {
  openCart() {
    $('#cartDrawer').classList.add('open');
    $('#overlay').classList.add('active');
    document.body.classList.add('locked');
  },
  closeCart() {
    $('#cartDrawer').classList.remove('open');
    $('#overlay').classList.remove('active');
    document.body.classList.remove('locked');
  },
  flashCount() {
    const c = $('#cartCount');
    c.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(1.5)' }, { transform: 'scale(1)' }],
      { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' }
    );
  }
};

function initCart() {
  $('#cartBtn')?.addEventListener('click', () => UI.openCart());
  $('#cartClose')?.addEventListener('click', () => UI.closeCart());
  $('#overlay')?.addEventListener('click', () => UI.closeCart());

  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) return Cart.add(add.dataset.add);
    const rm = e.target.closest('[data-remove]');
    if (rm) return Cart.remove(rm.dataset.remove);
  });

  $('#checkoutBtn')?.addEventListener('click', () => {
    if (!Cart.items.length) return alert('سبد خرید خالی است');
    const lines = Cart.items.map(i =>
      `• ${i.name} × ${i.qty} = ${i.price * i.qty} ${CONFIG.currency}`
    ).join('\n');
    const msg =
      `سلام 👋\nسفارش من از LUXORA:\n\n${lines}\n\n` +
      `جمع کل: ${Cart.total()} ${CONFIG.currency}\n\n` +
      `لطفاً برای تکمیل خرید راهنمایی کنید.`;
    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  });

  Cart.render();
}

/* ---------- 11. INIT ---------- */
document.addEventListener('DOMContentLoaded', async () => {
  Cart.init();
  await loadProducts();
  renderProducts();
  renderGallery();
  renderTestimonials();
  initReveal();
  initHeader();
  initNav();
  initParallax();
  initGallery();
  initCart();
});
