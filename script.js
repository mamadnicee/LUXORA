/* ============================================================
   LUXORA — SCRIPT
   محصولات، گالری، نظرات، سبد خرید، واتساپ
   ============================================================ */

/* ---------- CONFIG — فقط اینجا رو تنظیم کن ---------- */
const CONFIG = {
  whatsapp: '989120000000',                 // شماره واتساپ فروشگاه
  currency: 'تومان',
  // تعداد محصولات و تصاویر: کافیه شماره‌ها رو ادامه بدی
  products: [
    { id: 1, name: 'رویال کلاسیک',   desc: 'بدنه استیل، موتور اتوماتیک',   price: 12500000, tag: 'ویژه' },
    { id: 2, name: 'نوکتورن بلک',    desc: 'ضدآب، طراحی مینیمال',          price: 9800000,  tag: '' },
    { id: 3, name: 'آستریا گلد',     desc: 'روکش طلایی، صفحه مروارید',     price: 18900000, tag: 'جدید' },
    { id: 4, name: 'کرونو اسپرت',    desc: 'کرنوگراف، استیل مات',          price: 11200000, tag: '' },
    { id: 5, name: 'لونا رزگلد',     desc: 'بند چرم، طراحی زنانه',         price: 8400000,  tag: 'محبوب' },
    { id: 6, name: 'اورست تیتانیوم', desc: 'بدنه تیتانیوم، ضدنخش',         price: 24500000, tag: 'ویژه' },
    { id: 7, name: 'مینیمال وایت',   desc: 'صفحه سفید، بند سیلیکون',       price: 6900000,  tag: '' },
    { id: 8, name: 'هریتیج براون',   desc: 'طرح کلاسیک، بند چرم قهوه‌ای',  price: 13900000, tag: 'جدید' }
  ],
  gallery: [
    { label: 'جزئیات موتور' },
    { label: 'بند چرم' },
    { label: 'صفحه مروارید' },
    { label: 'طراحی بدنه' },
    { label: 'بازل استیل' },
    { label: 'بسته‌بندی لوکس' }
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
const toFa = n => n.toLocaleString('fa-IR');
const imgPath = n => `assets/images/${n}.jpg`;

/* ---------- 1. RENDER PRODUCTS ---------- */
function renderProducts() {
  const grid = $('#productsGrid');
  if (!grid) return;
  grid.innerHTML = CONFIG.products.map((p, i) => `
    <article class="product-card reveal" style="transition-delay:${i * 60}ms">
      <div class="product-media">
        ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
        <img src="${imgPath(p.id)}" alt="${p.name}" loading="lazy"
             onerror="this.style.background='linear-gradient(135deg,#e9e4d8,#d6cfbf)';this.removeAttribute('src')">
      </div>
      <div class="product-body">
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-foot">
          <span class="product-price">${toFa(p.price)}<small>${CONFIG.currency}</small></span>
          <button class="add-btn" data-add="${p.id}" aria-label="افزودن به سبد">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `).join('');
}

/* ---------- 2. RENDER GALLERY ---------- */
function renderGallery() {
  const track = $('#galleryTrack');
  if (!track) return;
  const items = [...CONFIG.gallery, ...CONFIG.gallery]; // دوباره برای اسکرول پیوسته
  track.innerHTML = items.map((g, i) => `
    <div class="gallery-item reveal" data-label="${g.label}" style="transition-delay:${i * 80}ms">
      <img src="${imgPath('g' + ((i % CONFIG.gallery.length) + 1))}" alt="${g.label}" loading="lazy"
           onerror="this.style.background='linear-gradient(135deg,#1c3b5a,#0d0f12)';this.removeAttribute('src')">
    </div>
  `).join('');
}

/* ---------- 3. RENDER TESTIMONIALS ---------- */
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
    track.style.transform = `translateX(${i * 100}%)`; // RTL: به راست حرکت
    $$('#testiDots button').forEach((b, k) => b.classList.toggle('active', k === i));
  };
  dots.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    go(+b.dataset.dot);
  });
  setInterval(() => go((idx + 1) % CONFIG.testimonials.length), 5500);
}

/* ---------- 4. SCROLL REVEAL ---------- */
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

/* ---------- 5. HEADER SCROLL ---------- */
function initHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- 6. MOBILE NAV ---------- */
function initNav() {
  const burger = $('#burger'), nav = $('#nav');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });
  nav?.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      burger.classList.remove('open');
      nav.classList.remove('open');
    }
  });
}

/* ---------- 7. HERO PARALLAX ---------- */
function initParallax() {
  const img = $('.hero-bg img');
  if (!img) return;
  let raf;
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const y = Math.min(window.scrollY, window.innerHeight);
      img.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(1.05)`;
    });
  }, { passive: true });
}

/* ---------- 8. GALLERY DRAG (اختیاری، برای دسکتاپ) ---------- */
function initGalleryDrag() {
  const track = $('#galleryTrack');
  if (!track) return;
  let isDown = false, startX = 0, scroll = 0;
  const wrap = track.parentElement;
  track.addEventListener('mousedown', e => {
    isDown = true; startX = e.pageX; scroll = track.scrollLeft;
    track.style.cursor = 'grabbing';
  });
  window.addEventListener('mouseup', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    track.scrollLeft = scroll - (e.pageX - startX);
  });
  track.style.cursor = 'grab';
  // اسکرول خودکار نرم
  let auto = 0;
  setInterval(() => {
    if (isDown) return;
    auto += 0.6;
    if (auto >= track.scrollWidth / 2) auto = 0;
    track.scrollLeft = auto;
  }, 30);
}

/* ---------- 9. CART ---------- */
const Cart = {
  key: 'luxora_cart',
  items: JSON.parse(localStorage.getItem('luxora_cart') || '[]'),
  save() { localStorage.setItem(this.key, JSON.stringify(this.items)); },
  add(id) {
    const p = CONFIG.products.find(x => x.id === id);
    if (!p) return;
    const ex = this.items.find(i => i.id === id);
    if (ex) ex.qty++;
    else this.items.push({ id, name: p.name, price: p.price, qty: 1 });
    this.save(); this.render();
    UI.flashCount();
  },
  remove(id) {
    this.items = this.items.filter(i => i.id !== id);
    this.save(); this.render();
  },
  total() { return this.items.reduce((s, i) => s + i.price * i.qty, 0); },
  count() { return this.items.reduce((s, i) => s + i.qty, 0); },
  render() {
    const wrap = $('#cartItems');
    const count = $('#cartCount');
    count.textContent = toFa(this.count());
    count.classList.toggle('active', this.count() > 0);
    $('#cartTotal').textContent = toFa(this.total()) + ' ' + CONFIG.currency;

    if (!this.items.length) {
      wrap.innerHTML = '<div class="cart-empty">سبد خرید خالی است</div>';
      return;
    }
    wrap.innerHTML = this.items.map(i => `
      <div class="cart-item">
        <img src="${imgPath(i.id)}" alt="${i.name}"
             onerror="this.style.background='linear-gradient(135deg,#e9e4d8,#d6cfbf)';this.removeAttribute('src')">
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
    if (add) return Cart.add(+add.dataset.add);
    const rm = e.target.closest('[data-remove]');
    if (rm) return Cart.remove(+rm.dataset.remove);
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

/* ---------- 10. INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderGallery();
  renderTestimonials();
  initReveal();
  initHeader();
  initNav();
  initParallax();
  initGalleryDrag();
  initCart();
});
