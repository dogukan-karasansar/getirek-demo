/* Getirek demo — tek bir ortak state; müşteri, işletme paneli ve kurye aynı siparişi görür. */

const LOGO = `<img src="img/logo-mark.png" alt="Getirek">`;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '₺' + Number(n).toLocaleString('tr-TR', { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });
const hhmm = (d = new Date()) => d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
const img = k => `img/${k}.jpg`;
const ic = (n, cls = '') => `<i data-lucide="${n}" class="${cls}"></i>`;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---------------- veri ---------------- */
const STORES = [
  { id: 'burger', name: 'Burger House', type: 'restoran', cat: 'Burger · Fast Food', img: 'burger', rating: 4.8, rc: '1.245', eta: '30-45', min: 150, promo: '%20 indirim', addr: 'Barbaros Blv. No:45, Beşiktaş',
    menu: [
      { id: 'cb', name: 'Cheeseburger', desc: '%100 dana eti, cheddar peyniri, marul, domates, özel sos', price: 180, img: 'burger', cat: 'Burgerler' },
      { id: 'db', name: 'Double Burger', desc: 'İki kat dana eti, çift cheddar, karamelize soğan', price: 230, img: 'burger', cat: 'Burgerler' },
      { id: 'pt', name: 'Patates Kızartması', desc: 'Çıtır, deniz tuzlu, büyük boy', price: 70, img: 'fries', cat: 'Yanlar' },
      { id: 'ay', name: 'Ayran (30 cl)', desc: 'Soğuk, köpüklü', price: 30, img: 'ayran', cat: 'İçecekler' },
    ] },
  { id: 'pizza', name: 'Paus Pizza', type: 'restoran', cat: 'Pizza · İtalyan', img: 'pizza', rating: 4.6, rc: '980', eta: '35-50', min: 200, promo: '%15 indirim', addr: 'Ihlamurdere Cd. No:12, Beşiktaş',
    menu: [
      { id: 'pp', name: 'Pepperoni Pizza', desc: 'Mozzarella, pepperoni, mantar — orta boy', price: 290, img: 'pizza', cat: 'Pizzalar' },
      { id: 'mp', name: 'Margherita', desc: 'Domates sos, mozzarella, fesleğen', price: 240, img: 'pizza', cat: 'Pizzalar' },
      { id: 'ay', name: 'Ayran (30 cl)', desc: 'Soğuk, köpüklü', price: 30, img: 'ayran', cat: 'İçecekler' },
    ] },
  { id: 'durum', name: 'Dürümcü Ali Usta', type: 'restoran', cat: 'Kebap · Türk Mutfağı', img: 'doner', rating: 4.7, rc: '763', eta: '25-40', min: 120, addr: 'Şair Nedim Cd. No:8, Beşiktaş',
    menu: [
      { id: 'td', name: 'Tavuk Dürüm', desc: 'Lavaşta tavuk döner, turşu, patates', price: 165, img: 'doner', cat: 'Dürümler' },
      { id: 'ed', name: 'Et Dürüm', desc: 'Lavaşta et döner, soğan, domates', price: 220, img: 'doner', cat: 'Dürümler' },
      { id: 'ay', name: 'Ayran (30 cl)', desc: 'Soğuk, köpüklü', price: 30, img: 'ayran', cat: 'İçecekler' },
    ] },
  { id: 'kofte', name: 'Köfteci Yusuf', type: 'restoran', cat: 'Köfte · Izgara', img: 'kofte', rating: 4.8, rc: '1.980', eta: '30-50', min: 150, addr: 'Yıldız Posta Cd. No:3, Beşiktaş',
    menu: [
      { id: 'kp', name: 'Izgara Köfte Porsiyon', desc: '200 gr köfte, pilav, közlenmiş biber', price: 260, img: 'kofte', cat: 'Izgaralar' },
      { id: 'ay', name: 'Ayran (30 cl)', desc: 'Soğuk, köpüklü', price: 30, img: 'ayran', cat: 'İçecekler' },
    ] },
  { id: 'market', name: 'Mahalle Market', type: 'market', cat: 'Market · Manav', img: 'market', rating: 4.9, rc: '2.310', eta: '15-25', min: 100, promo: 'Ücretsiz teslimat', addr: 'Fulya Mah. Ortaklar Cd. No:5',
    menu: [
      { id: 'su', name: 'Süt 1 L', desc: 'Tam yağlı, pastörize', price: 42, img: 'market', cat: 'Kahvaltılık' },
      { id: 'ek', name: 'Ekmek', desc: 'Günlük taze, 250 gr', price: 15, img: 'market', cat: 'Fırın' },
      { id: 'yu', name: 'Yumurta 10\'lu', desc: 'Gezen tavuk, L boy', price: 95, img: 'market', cat: 'Kahvaltılık' },
      { id: 'do', name: 'Domates (1 kg)', desc: 'Yerli, salkım', price: 38, img: 'market', cat: 'Manav' },
    ] },
  { id: 'parca', name: 'Oto Parça Merkezi', type: 'parca', cat: 'Yedek Parça · Aynı gün', img: 'parts', rating: 4.7, rc: '412', eta: '45-70', min: 0, promo: 'Aynı gün teslim', addr: 'Dikilitaş Mah. Sanayi Sk. No:21',
    menu: [
      { id: 'fb', name: 'Fren Balatası (Ön)', desc: 'Renault Clio IV / Megane IV uyumlu · OEM 410608481R', price: 1450, img: 'parts', cat: 'Fren' },
      { id: 'yf', name: 'Yağ Filtresi', desc: 'Fiat Egea 1.3 / 1.6 Multijet uyumlu', price: 320, img: 'parts', cat: 'Filtre' },
      { id: 'bj', name: 'Buji Takımı (4\'lü)', desc: 'Iridyum, VW / Skoda TSI', price: 880, img: 'parts', cat: 'Ateşleme' },
      { id: 'my', name: 'Motor Yağı 5W-30 (4 L)', desc: 'Tam sentetik, LL-04', price: 1650, img: 'parts', cat: 'Yağ' },
    ] },
];
const storeById = id => STORES.find(s => s.id === id);
const TYPE_LABEL = { restoran: 'Restoran', market: 'Market', parca: 'Yedek Parça' };

const CUSTOMER = { name: 'Ayşe Yılmaz', short: 'Ayşe Y.', phone: '+90 5** *** ** 47', addr: 'Fulya Mah. Ortaklar Cd. No:12 D:7', district: 'Beşiktaş, İstanbul', note: 'Zili çalmayın, bebek uyuyor 🙏', floor: '3. kat, daire 7' };
const COURIER = { name: 'Mehmet Kaya', short: 'Mehmet K.', plate: '34 GTR 217', rating: 4.9, vehicle: 'Motosiklet' };

/* harita: viewBox 0 0 360 260 */
const P = { K0: [40, 222], R: [120, 80], C: [300, 190] };
const ROUTE1 = [[40, 222], [40, 140], [120, 140], [120, 80]];
const ROUTE2 = [[120, 80], [220, 80], [220, 190], [300, 190]];
const TRAVEL1 = 8000, TRAVEL2 = 14000;

const STATUS = {
  placed: { t: 'Onay bekliyor', b: 'warn', c: 'Siparişin alındı', d: 'İşletmenin onayı bekleniyor' },
  preparing: { t: 'Hazırlanıyor', b: 'info', c: 'Siparişin hazırlanıyor', d: 'Restoran siparişini hazırlıyor' },
  ready: { t: 'Kurye bekleniyor', b: 'or', c: 'Siparişin hazır', d: 'Kurye paketi almak üzere' },
  onway: { t: 'Yolda', b: 'or', c: 'Kurye yolda!', d: 'Siparişin sana doğru geliyor' },
  delivered: { t: 'Teslim edildi', b: 'ok', c: 'Afiyet olsun! 🎉', d: 'Siparişin teslim edildi' },
  rejected: { t: 'Reddedildi', b: 'bad', c: 'Sipariş iptal edildi', d: 'Ücret iadesi başlatıldı' },
};

let SEQ = 10482;
function seedOrders() {
  const names = ['Can D.', 'Elif K.', 'Burak T.', 'Zeynep A.', 'Emre S.', 'Selin Ö.', 'Mert Y.', 'Deniz B.'];
  const out = [];
  STORES.forEach((s, si) => {
    for (let i = 0; i < 7; i++) {
      const items = s.menu.slice(0, 1 + ((i + si) % Math.min(3, s.menu.length))).map((m, j) => ({ ...m, qty: 1 + ((i + j) % 2) }));
      const sub = items.reduce((a, x) => a + x.price * x.qty, 0);
      const t = new Date(Date.now() - (i + 1) * 37 * 60000 - si * 7 * 60000);
      out.push({ id: 'GTR-' + (10470 - out.length), store: s.id, customer: names[(i + si) % names.length], items, subtotal: sub, delivery: 19.9, tip: [0, 10, 20][i % 3], total: sub + 19.9 + [0, 10, 20][i % 3],
        pay: i % 3 === 2 ? 'Kapıda nakit' : 'Kart', status: i === 0 && si === 0 ? 'onway' : 'delivered', courier: ['Mehmet K.', 'Ali R.', 'Hasan Ç.', 'Oğuz E.'][(i + si) % 4], time: hhmm(t), seed: true, timeline: [] });
    }
  });
  return out;
}
function seedEarnings() {
  return [
    { id: 'GTR-10461', store: 'Paus Pizza', time: '12:10', km: 2.4, base: 45, kmFee: 19.2, tip: 0, bonus: 0 },
    { id: 'GTR-10464', store: 'Mahalle Market', time: '12:52', km: 1.1, base: 45, kmFee: 8.8, tip: 10, bonus: 0 },
    { id: 'GTR-10467', store: 'Köfteci Yusuf', time: '13:35', km: 3.6, base: 45, kmFee: 28.8, tip: 0, bonus: 15 },
    { id: 'GTR-10470', store: 'Burger House', time: '14:20', km: 2.0, base: 45, kmFee: 16, tip: 20, bonus: 15 },
    { id: 'GTR-10474', store: 'Oto Parça Merkezi', time: '15:05', km: 4.2, base: 45, kmFee: 33.6, tip: 0, bonus: 0 },
    { id: 'GTR-10478', store: 'Dürümcü Ali Usta', time: '15:48', km: 1.7, base: 45, kmFee: 13.6, tip: 5, bonus: 0 },
  ];
}
const WEEK = [{ d: 'Pzt', v: 1180 }, { d: 'Sal', v: 1420 }, { d: 'Çar', v: 960 }, { d: 'Per', v: 1610 }, { d: 'Cum', v: 1890 }, { d: 'Cmt', v: 0, today: true }, { d: 'Paz', v: 0 }];

/* ---------------- state ---------------- */
let S;
function fresh() {
  SEQ = 10482;
  return {
    mode: S?.mode || 'sunum',
    c: { screen: 'home', tab: 'home', store: null, cart: [], cartStore: null, tip: 10, pay: 'card', filter: 'all', q: '', call: false, rated: false, stars: 5 },
    k: { screen: 'home', tab: 'home', online: true, call: false, codeErr: false },
    p: { page: 'dashboard', merchant: 'burger', open: true, filter: 'all', detail: null, accept: null, prep: 15, products: {} },
    order: null,
    orders: seedOrders(),
    chat: [], typing: null, unread: { c: 0, k: 0 },
    earnings: seedEarnings(),
    pos: [...P.K0], leg: null, legStart: 0, legDur: 0, arrived: false,
  };
}
S = fresh();

/* ---------------- render altyapısı ---------------- */
let raf = 0;
function update() { if (!raf) raf = requestAnimationFrame(() => { raf = 0; renderAll(); }); }
const lastScreen = {};
function paint(el, key, screenKey, html) {
  const a = document.activeElement;
  let keep = null;
  if (a && el.contains(a) && a.id) keep = { id: a.id, v: a.value, s: a.selectionStart };
  const sc = el.querySelector('.scr');
  const top = sc && lastScreen[key] === screenKey ? sc.scrollTop : 0;
  el.innerHTML = html;
  const sc2 = el.querySelector('.scr');
  if (sc2) sc2.scrollTop = top;
  lastScreen[key] = screenKey;
  const ch = el.querySelector('.chat');
  if (ch) ch.scrollTop = ch.scrollHeight;
  if (keep) { const n = document.getElementById(keep.id); if (n) { n.value = keep.v; n.focus(); try { n.setSelectionRange(keep.s, keep.s); } catch (e) {} } }
}
function renderAll() {
  paint($('#cust'), 'c', S.c.screen + S.c.store, renderCustomer());
  paint($('#cour'), 'k', S.k.screen, renderCourier());
  paint($('#panel'), 'p', S.p.page, renderPanel());
  window.lucide && lucide.createIcons();
  $$('[data-logo]').forEach(n => (n.innerHTML = LOGO));
  moveMarkers();
}

/* toasts */
function toast(where, title, text, icon = 'bell') {
  const box = where === 'p' ? $('#panel .ptoast') : $(`#${where === 'c' ? 'cust' : 'cour'} .toastbox`);
  if (!box) return;
  const n = document.createElement('div');
  n.className = 'toast';
  n.innerHTML = `<div class="ti">${ic(icon)}</div><div><b>${title}</b><span>${text}</span></div>`;
  box.appendChild(n);
  window.lucide && lucide.createIcons();
  setTimeout(() => { n.style.transition = '.3s'; n.style.opacity = 0; n.style.transform = 'translateY(-10px)'; }, 3600);
  setTimeout(() => n.remove(), 4000);
}
let actx;
function beep() {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    [0, 0.18, 0.36].forEach((t, i) => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.frequency.value = [880, 1175, 1568][i]; o.type = 'sine';
      g.gain.setValueAtTime(0.0001, actx.currentTime + t);
      g.gain.exponentialRampToValueAtTime(0.18, actx.currentTime + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + t + 0.16);
      o.connect(g).connect(actx.destination); o.start(actx.currentTime + t); o.stop(actx.currentTime + t + 0.2);
    });
  } catch (e) {}
}

const sbar = (dark = false) => `<div class="sbar ${dark ? 'dark' : ''}"><span>9:41</span><span class="ic">${ic('signal')}${ic('wifi')}${ic('battery-full')}</span></div>`;

/* ---------------- harita ---------------- */
function mapSVG({ route = null, others = false, h = 260 } = {}) {
  // zemin viewBox'ın dışına taşar; "meet" ile işaretler hiç kırpılmaz, boşluk da sokakla dolar
  const RX = [-40, 40, 120, 220, 300, 380], RY = [-30, 80, 140, 190, 290];
  const roads = RY.map(y => `<line x1="-200" y1="${y}" x2="560" y2="${y}"/>`).join('') + RX.map(x => `<line x1="${x}" y1="-200" x2="${x}" y2="460"/>`).join('');
  const blocks = [];
  const xs = [-200, ...RX, 560], ys = [-200, ...RY, 460];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    if (xs[i] === 220 && ys[j] === 80) continue;
    const x = xs[i] + 9, y = ys[j] + 9, w = xs[i + 1] - xs[i] - 18, hh = ys[j + 1] - ys[j] - 18;
    if (w > 4 && hh > 4) blocks.push(`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="5"/>`);
  }
  const path = r => r.map(p => p.join(',')).join(' ');
  let rt = '';
  if (route) rt = `<polyline points="${path(route)}" fill="none" stroke="#FF6B00" stroke-opacity=".25" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${path(route)}" fill="none" stroke="#FF6B00" stroke-width="4" stroke-dasharray="1 8" stroke-linecap="round" stroke-linejoin="round"/>`;
  const oth = others ? [[300, 60, 'Ali R.'], [40, 60, 'Hasan Ç.'], [220, 240, 'Oğuz E.']].map(([x, y]) => `<g class="mk-other" transform="translate(${x},${y})"><circle r="9" fill="#2563EB" stroke="#fff" stroke-width="3"/></g>`).join('') : '';
  return `<svg viewBox="0 0 360 260" preserveAspectRatio="xMidYMid meet" style="height:${h}px">
    <rect x="-200" y="-200" width="760" height="660" fill="#E8ECF1"/>
    <g fill="#DDE3EA">${blocks.join('')}</g>
    <rect x="229" y="89" width="62" height="92" rx="8" fill="#CDE8C9"/><text x="260" y="140" font-size="9" fill="#6c9a68" text-anchor="middle" font-family="Inter">Yıldız Parkı</text>
    <g stroke="#fff" stroke-width="11" stroke-linecap="round">${roads}</g>
    <path d="M236 -200 L236 -46 Q300 30 560 6 L560 -200Z" fill="#BFD9F2"/>
    <text x="70" y="137" font-size="7" fill="#9aa3ae" font-family="Inter">Barbaros Blv.</text>
    ${rt}${oth}
    <g transform="translate(${P.R[0]},${P.R[1]})"><circle r="15" fill="#16161A"/><text y="5" font-size="14" text-anchor="middle">🍔</text></g>
    <g transform="translate(${P.C[0]},${P.C[1]})"><circle r="15" fill="#fff" stroke="#16161A" stroke-width="3"/><text y="5" font-size="13" text-anchor="middle">🏠</text></g>
    <g class="mk-c" transform="translate(${S.pos[0]},${S.pos[1]})"><circle r="20" fill="#FF6B00" opacity=".18"><animate attributeName="r" values="12;22;12" dur="2s" repeatCount="indefinite"/></circle><circle r="13" fill="#FF6B00" stroke="#fff" stroke-width="3"/><text y="4.5" font-size="12" text-anchor="middle">🛵</text></g>
  </svg>`;
}
function along(pts, t) {
  const seg = []; let L = 0;
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); L += d; }
  let x = Math.min(1, Math.max(0, t)) * L;
  for (let i = 0; i < seg.length; i++) {
    if (x <= seg[i]) { const f = x / seg[i]; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f]; }
    x -= seg[i];
  }
  return [...pts[pts.length - 1]];
}
function moveMarkers() { $$('.mk-c').forEach(g => g.setAttribute('transform', `translate(${S.pos[0].toFixed(1)},${S.pos[1].toFixed(1)})`)); }
function etaMin() {
  if (!S.leg) return S.order?.status === 'delivered' ? 0 : 25;
  const left = Math.max(0, 1 - (Date.now() - S.legStart) / S.legDur);
  return S.leg === 2 ? Math.max(1, Math.ceil(left * 12)) : 12 + Math.ceil(left * 6);
}
function startLeg(n) { S.leg = n; S.legStart = Date.now(); S.legDur = n === 1 ? TRAVEL1 : TRAVEL2; S.arrived = false; }
setInterval(() => {
  if (!S.leg) return;
  const t = (Date.now() - S.legStart) / S.legDur;
  S.pos = along(S.leg === 1 ? ROUTE1 : ROUTE2, t);
  moveMarkers();
  $$('.eta-v').forEach(n => (n.textContent = etaMin() + ' dk'));
  if (t >= 1 && !S.arrived) {
    S.arrived = true;
    const leg = S.leg; S.leg = null;
    if (leg === 1) { toast('k', 'Restorana vardın', 'Paketi teslim almayı onayla', 'map-pin'); }
    else { toast('k', 'Adrese vardın', 'Müşteriden teslimat kodunu iste', 'map-pin'); toast('c', 'Kuryen kapında!', `${COURIER.short} adresine ulaştı`, 'bike'); }
    update();
  }
}, 50);

/* =================== MÜŞTERİ =================== */
const cartCount = () => S.c.cart.reduce((a, x) => a + x.qty, 0);
const cartSub = () => S.c.cart.reduce((a, x) => a + x.qty * x.price, 0);
const deliveryFee = () => (S.c.cartStore === 'market' && cartSub() >= 100 ? 0 : 19.9);

function renderCustomer() {
  const c = S.c;
  let body = '';
  if (c.screen === 'store') body = cStore();
  else if (c.screen === 'cart') body = cCart();
  else if (c.screen === 'track') body = cTrack();
  else if (c.screen === 'chat') return `<div class="app">${sbar()}${chatView('c')}<div class="toastbox"></div>${c.call ? callView('c') : ''}</div>`;
  else if (c.screen === 'orders') body = cOrders();
  else if (c.screen === 'profile') body = cProfile();
  else body = cHome();
  const navShown = ['home', 'cart', 'orders', 'profile'].includes(c.screen);
  return `<div class="app">${c.screen === 'store' ? sbar(true) : sbar()}${body}${navShown ? cNav() : ''}<div class="toastbox"></div>${c.call ? callView('c') : ''}</div>`;
}
function cNav() {
  const t = S.c.screen, n = cartCount(), live = S.order && !['delivered', 'rejected'].includes(S.order.status);
  return `<nav class="nav">
    <button class="${t === 'home' ? 'on' : ''}" onclick="A.c.go('home')">${ic('house')}Ana Sayfa</button>
    <button class="${t === 'cart' ? 'on' : ''}" onclick="A.c.go('cart')">${ic('shopping-cart')}Sepetim${n ? `<span class="badge">${n}</span>` : ''}</button>
    <button class="${t === 'orders' ? 'on' : ''}" onclick="A.c.go('orders')">${ic('receipt-text')}Siparişler${live ? '<span class="badge">1</span>' : ''}</button>
    <button class="${t === 'profile' ? 'on' : ''}" onclick="A.c.go('profile')">${ic('user-round')}Hesabım</button>
  </nav>`;
}
function cHome() {
  const c = S.c;
  const cats = [['utensils', 'Restoran', 'restoran'], ['shopping-basket', 'Market', 'market'], ['wrench', 'Yedek Parça', 'parca'], ['coffee', 'Kafe', 'restoran'], ['pizza', 'Pizza', 'restoran'], ['cake-slice', 'Tatlı', 'restoran'], ['cup-soda', 'İçecek', 'market'], ['ellipsis', 'Daha Fazlası', 'all']];
  const list = STORES.filter(s => (c.filter === 'all' || s.type === c.filter) && (!c.q || (s.name + s.cat).toLocaleLowerCase('tr').includes(c.q.toLocaleLowerCase('tr'))));
  const live = S.order && !['delivered', 'rejected'].includes(S.order.status);
  return `<div class="scr"><div class="pad">
    <div class="between"><div class="loc">${ic('map-pin', 'or')}<div><small>Teslimat adresi</small>Ev · Beşiktaş ${ic('chevron-down')}</div></div><button class="iconbtn">${ic('bell')}</button></div>
    <label class="search">${ic('search')}<input id="cq" placeholder="Restoran, ürün veya kategori ara..." value="${esc(c.q)}" oninput="A.c.search(this.value)">${ic('sliders-horizontal')}</label>
    ${live ? `<button class="card fade" style="width:100%;display:flex;gap:10px;align-items:center;margin-bottom:12px;border-color:#ffd2b0;background:#fff8f2;text-align:left" onclick="A.c.go('track')"><div class="addr"><div class="pin">${ic('bike')}</div></div><div style="flex:1"><b>${STATUS[S.order.status].c}</b><div class="sm mut">${storeById(S.order.store).name} · Takip et</div></div>${ic('chevron-right')}</button>` : ''}
    <div class="banner"><img src="${img('burger')}" alt=""><div><b>En sevdiğin lezzetler kapında!</b><button onclick="A.c.open('burger')">Hemen Sipariş Ver</button></div></div>
    <div class="cats">${cats.map(([i, l, f]) => `<button class="cat ${c.filter === f && f !== 'all' ? 'on' : ''}" onclick="A.c.filter('${f}')">${ic(i)}${l}</button>`).join('')}</div>
    <div class="sec-t">${c.filter === 'all' ? 'Yakındaki İşletmeler' : TYPE_LABEL[c.filter] + ' işletmeleri'}${c.filter !== 'all' ? `<a href="#" onclick="A.c.filter('all');return false">Tümünü gör</a>` : '<a>Tümünü Gör</a>'}</div>
    ${list.map(s => `<button class="store" style="width:100%;text-align:left" onclick="A.c.open('${s.id}')"><img class="thumb" src="${img(s.img)}" alt=""><div class="meta"><b>${s.name}</b><div class="row">${s.cat}</div><div class="row"><span class="star">★</span><b style="font-size:11.5px;color:#111">${s.rating}</b>(${s.rc}) ${ic('clock')} ${s.eta} dk</div>${s.promo ? `<span class="tag" style="margin-top:5px">${s.promo}</span>` : ''}</div>${ic('chevron-right')}</button>`).join('') || '<p class="mut sm" style="padding:20px 0">Sonuç bulunamadı.</p>'}
    <div style="height:16px"></div>
  </div></div>`;
}
function cStore() {
  const s = storeById(S.c.store), n = S.c.cartStore === s.id ? cartCount() : 0;
  const cats = [...new Set(s.menu.map(m => m.cat))];
  return `<div class="scr">
    <div class="s-hero"><img src="${img(s.img)}" alt=""><div class="tb"><button class="iconbtn w" onclick="A.c.go('home')">${ic('arrow-left')}</button><button class="iconbtn w">${ic('heart')}</button></div></div>
    <div class="s-info"><h2>${s.name}</h2><div class="sm mut" style="margin:4px 0 8px">${s.cat}</div>
      <div class="h-row sm"><span class="star">★</span><b>${s.rating}</b><span class="mut">(${s.rc})</span><span class="mut">·</span>${ic('clock')}<span>${s.eta} dk</span><span class="mut">·</span><span>Min. ${money(s.min)}</span></div></div>
    <div class="s-tabs"><span class="on">Menü</span><span>Yorumlar</span><span>Hakkında</span></div>
    <div class="chips" style="padding:12px 16px 4px">${cats.map((x, i) => `<span class="chip ${i ? '' : 'on'}">${x}</span>`).join('')}</div>
    ${s.menu.map(m => { const q = S.c.cartStore === s.id ? S.c.cart.find(x => x.id === m.id)?.qty || 0 : 0; return `<div class="prod"><img class="thumb" src="${img(m.img)}" alt=""><div class="meta"><b>${m.name}</b><p>${m.desc}</p><b>${money(m.price)}</b></div>${q ? `<div class="qty"><button onclick="A.c.qty('${m.id}',-1)">${ic(q === 1 ? 'trash-2' : 'minus')}</button><b>${q}</b><button onclick="A.c.qty('${m.id}',1)">${ic('plus')}</button></div>` : `<button class="add" onclick="A.c.add('${s.id}','${m.id}')">${ic('plus')}</button>`}</div>`; }).join('')}
    <div style="height:90px"></div>
  </div>
  ${n ? `<div class="cartbar fade"><button class="btn" onclick="A.c.go('cart')"><span class="n">${n} ürün</span><span>Sepete Git</span><b>${money(cartSub())}</b></button></div>` : ''}`;
}
function cCart() {
  const c = S.c;
  if (!c.cart.length) return `<div class="abar">Sepetim</div><div class="scr pad" style="display:grid;place-items:center;text-align:center"><div><div style="font-size:54px">🛒</div><b>Sepetin boş</b><p class="mut sm" style="margin:6px 0 16px">Yakındaki işletmelerden sipariş ver.</p><button class="btn" onclick="A.c.go('home')">Keşfet</button></div></div>`;
  const s = storeById(c.cartStore), sub = cartSub(), del = deliveryFee(), tot = sub + del + c.tip;
  return `<div class="abar">${ic('arrow-left')}<span class="sp">Sepetim</span><button class="iconbtn" onclick="A.c.clear()">${ic('trash-2')}</button></div>
  <div class="scr pad">
    <div class="sm mut" style="margin-bottom:4px">${s.name}</div>
    ${c.cart.map(x => `<div class="line-item"><img src="${img(x.img)}" alt=""><div style="flex:1"><b class="sm">${x.name}</b><div class="qty" style="width:max-content;margin-top:6px"><button onclick="A.c.qty('${x.id}',-1)">${ic('minus')}</button><b>${x.qty}</b><button onclick="A.c.qty('${x.id}',1)">${ic('plus')}</button></div></div><b>${money(x.price * x.qty)}</b></div>`).join('')}
    <div class="sec-t" style="margin-top:16px;font-size:14px">Kurye bahşişi <span class="xs mut" style="font-weight:500">%100 kuryeye gider</span></div>
    <div class="opt">${[0, 10, 20, 30].map(v => `<button class="${c.tip === v ? 'on' : ''}" onclick="A.c.tip(${v})">${v ? money(v) : 'Yok'}</button>`).join('')}</div>
    <div class="sec-t" style="font-size:14px">Teslimat adresi</div>
    <div class="card addr"><div class="pin">${ic('map-pin')}</div><div style="flex:1"><b class="sm">Ev Adresim</b><div class="xs mut">${CUSTOMER.addr}, ${CUSTOMER.district}</div><div class="xs or" style="margin-top:3px">Not: ${CUSTOMER.note}</div></div>${ic('chevron-right')}</div>
    <div class="sec-t" style="font-size:14px">Ödeme yöntemi</div>
    <div class="pay"><button class="${c.pay === 'card' ? 'on' : ''}" onclick="A.c.payw('card')">${ic('credit-card', 'or')}<div>Kayıtlı kart<small>•••• 4242</small></div></button><button class="${c.pay === 'cash' ? 'on' : ''}" onclick="A.c.payw('cash')">${ic('banknote', 'or')}<div>Kapıda ödeme<small>Nakit / kart</small></div></button></div>
    <div class="sum"><div><span class="mut">Ara toplam</span><span>${money(sub)}</span></div><div><span class="mut">Teslimat ücreti</span><span>${del ? money(del) : '<b class="ok">Ücretsiz</b>'}</span></div><div><span class="mut">Kurye bahşişi</span><span>${money(c.tip)}</span></div><div class="tot"><span>Toplam Tutar</span><span>${money(tot)}</span></div></div>
    <div class="xs mut h-row" style="margin:12px 0">${ic('clock')} Tahmini teslimat ${s.eta} dk</div>
    <button class="btn" style="margin-bottom:18px" onclick="A.c.place()" ${S.order && !['delivered', 'rejected'].includes(S.order.status) ? 'disabled' : ''}>Siparişi Ver · ${money(tot)}</button>
  </div>`;
}
function cTrack() {
  const o = S.order;
  if (!o) return `<div class="abar">Sipariş takibi</div><div class="scr pad mut">Aktif sipariş yok.</div>`;
  const st = STATUS[o.status], s = storeById(o.store);
  const idx = { placed: 0, preparing: 1, ready: 1, onway: 2, delivered: 4, rejected: 0 }[o.status];
  const assigned = ['to_store', 'at_store', 'to_customer', 'at_customer', 'done'].includes(o.courier);
  if (o.status === 'delivered') return cRate();
  return `<div class="scr" style="margin-top:-44px">
    <div class="map" style="height:290px">${mapSVG({ route: o.status === "onway" ? ROUTE2 : o.courier === "to_store" ? ROUTE1 : null, h: 290 })}
      <div class="eta" style="top:54px">Tahmini varış<b class="eta-v">${etaMin()} dk</b></div>
      <button class="iconbtn w" style="position:absolute;top:54px;right:12px" onclick="A.c.go('home')">${ic('x')}</button></div>
    <div class="sheet"><div class="grab"></div>
      <div class="between"><div><b style="font-size:18px">${st.c}</b><div class="sm mut">${st.d}</div></div><span class="sm b or">#${o.id.slice(4)}</span></div>
      <div class="steps">${[0, 1, 2, 3].map(i => `<i class="${i < idx ? 'on' : i === idx ? 'cur' : ''}"></i>`).join('')}</div>
      <div class="step-l"><span>Alındı</span><span>Hazırlanıyor</span><span>Yolda</span><span>Teslim</span></div>
      ${assigned ? `<div class="card person fade" style="margin-top:14px"><div class="ava">MK</div><div style="flex:1"><b>${COURIER.name}</b><div class="xs mut">★ ${COURIER.rating} · ${COURIER.vehicle} · ${COURIER.plate}</div></div>
        <button class="iconbtn" onclick="A.call('c')">${ic('phone')}</button><button class="iconbtn" style="position:relative" onclick="A.c.go('chat')">${ic('message-circle')}${S.unread.c ? `<span class="badge" style="position:absolute;top:-5px;right:-5px">${S.unread.c}</span>` : ''}</button></div>`
      : `<div class="card h-row" style="margin-top:14px"><div class="addr"><div class="pin">${ic(o.status === 'placed' ? 'store' : 'search')}</div></div><div class="sm">${o.status === 'placed' ? `${s.name} siparişini onaylıyor…` : 'Sana en yakın kurye atanıyor…'}</div></div>`}
      <div class="card" style="margin-top:10px"><div class="between"><div><b class="sm">Teslimat kodu</b><div class="xs mut">Kuryeye teslimatta söyle</div></div><div class="code">${o.code.split('').map(d => `<span>${d}</span>`).join('')}</div></div></div>
      <div class="card" style="margin-top:10px"><b class="sm">${s.name}</b><div class="xs mut" style="margin:2px 0 8px">${o.items.map(x => `${x.qty}× ${x.name}`).join(', ')}</div><div class="between sm"><span class="mut">${o.pay === 'Kart' ? 'Kart ile ödendi' : 'Kapıda ödenecek'}</span><b>${money(o.total)}</b></div></div>
      <div class="card addr" style="margin-top:10px"><div class="pin">${ic('house')}</div><div><b class="sm">Ev Adresim</b><div class="xs mut">${CUSTOMER.addr}</div></div></div>
    </div></div>`;
}
function cRate() {
  const o = S.order, c = S.c;
  return `<div class="abar"><span class="sp">Sipariş teslim edildi</span><button class="iconbtn" onclick="A.c.go('home')">${ic('x')}</button></div>
  <div class="scr pad fade" style="text-align:center">
    <div style="font-size:64px;margin-top:6px">🎉</div><b style="font-size:20px">Afiyet olsun!</b>
    <p class="sm mut" style="margin:6px 0 18px">#${o.id.slice(4)} · ${hhmm()} teslim edildi</p>
    ${c.rated ? `<div class="card" style="background:#f0fdf4;border-color:#bbf7d0"><b class="ok">Teşekkürler!</b><div class="sm mut">Değerlendirmen ${storeById(o.store).name} ve kuryemizle paylaşıldı.</div></div><button class="btn" style="margin-top:16px" onclick="A.c.newOrder()">Yeni sipariş ver</button>` : `
    <div class="card" style="text-align:left"><div class="person"><div class="ava">MK</div><div><b>${COURIER.name}</b><div class="xs mut">Kuryeni puanla</div></div></div>
      <div style="font-size:30px;letter-spacing:6px;margin:10px 0;cursor:pointer">${[1, 2, 3, 4, 5].map(i => `<span onclick="A.c.star(${i})" style="color:${i <= c.stars ? '#F59E0B' : '#ddd'}">★</span>`).join('')}</div>
      <div class="chips" style="padding:0;flex-wrap:wrap">${['Hızlı', 'Kibar', 'Paket özenli', 'Sıcak geldi'].map((t, i) => `<span class="chip ${i < 2 ? 'on' : ''}">${t}</span>`).join('')}</div></div>
    <button class="btn" style="margin-top:16px" onclick="A.c.rate()">Değerlendir</button>`}
  </div>`;
}
function cOrders() {
  const mine = S.orders.filter(o => o.mine);
  return `<div class="abar">Siparişlerim</div><div class="scr pad">
    ${mine.length ? mine.map(o => `<button class="card" style="width:100%;text-align:left;margin-bottom:10px" onclick="A.c.go('track')"><div class="between"><b>${storeById(o.store).name}</b><span class="fb ${STATUS[o.status].b}">${STATUS[o.status].t}</span></div><div class="xs mut" style="margin:4px 0">${o.items.map(x => `${x.qty}× ${x.name}`).join(', ')}</div><div class="between sm"><span class="mut">${o.time} · #${o.id.slice(4)}</span><b>${money(o.total)}</b></div></button>`).join('') : '<p class="mut sm">Henüz siparişin yok.</p>'}
    <div class="sec-t">Geçmiş</div>
    ${['Köfteci Yusuf · 3 gün önce · ₺320', 'Mahalle Market · 1 hafta önce · ₺214', 'Oto Parça Merkezi · 2 hafta önce · ₺1.450'].map(t => `<div class="line-item sm">${ic('rotate-ccw', 'or')}<span style="flex:1">${t}</span><span class="or b xs">Tekrarla</span></div>`).join('')}
  </div>`;
}
function cProfile() {
  return `<div class="abar">Hesabım</div><div class="scr pad">
    <div class="card person"><div class="ava">AY</div><div><b>${CUSTOMER.name}</b><div class="xs mut">${CUSTOMER.phone}</div></div></div>
    ${[['map-pin', 'Adreslerim'], ['credit-card', 'Ödeme yöntemlerim'], ['ticket-percent', 'Kuponlarım'], ['heart', 'Favorilerim'], ['headphones', '7/24 Destek'], ['shield-check', 'Gizlilik']].map(([i, t]) => `<div class="line-item sm">${ic(i, 'or')}<span style="flex:1">${t}</span>${ic('chevron-right')}</div>`).join('')}
  </div>`;
}

/* ortak: chat & arama */
function chatView(who) {
  const other = who === 'c' ? { n: COURIER.name, s: 'Kuryen · ' + COURIER.plate, a: 'MK', cls: '' } : { n: CUSTOMER.name, s: 'Müşteri · #' + (S.order?.id.slice(4) || ''), a: 'AY', cls: 'b' };
  const quick = who === 'c' ? ['Zili çalmayın lütfen 🙏', 'Kapıya bırakabilirsiniz', 'Ne kadar kaldı?', 'Teşekkürler!'] : ['Yola çıktım 🛵', '5 dk içinde oradayım', 'Kapıdayım', 'Tamamdır 👍'];
  return `<div class="abar" style="padding-bottom:10px;border-bottom:1px solid var(--line)"><button onclick="A.${who}.go('${who === 'c' ? 'track' : 'home'}')">${ic('arrow-left')}</button><div class="ava s ${other.cls}">${other.a}</div><div class="sp"><div style="font-size:14px">${other.n}</div><div class="xs mut" style="font-weight:500">${other.s}</div></div><button class="iconbtn" onclick="A.call('${who}')">${ic('phone')}</button></div>
  <div class="chat"><div class="sys">${ic('lock', 'xs')} Mesajlar sipariş süresince saklanır · numaralar gizli</div>
    ${S.chat.map(m => m.from === 'sys' ? `<div class="sys">${m.text}</div>` : `<div class="msg ${m.from === who ? 'me' : ''}">${esc(m.text)}<small>${m.time}</small></div>`).join('')}
    ${S.typing && S.typing !== who ? '<div class="typing"><i></i><i></i><i></i></div>' : ''}
  </div>
  <div class="quick">${quick.map(q => `<button class="chip" onclick="A.send('${who}', '${q.replace(/'/g, "\\'")}')">${q}</button>`).join('')}</div>
  <form class="compose" onsubmit="event.preventDefault();A.sendInput('${who}')"><input id="msg-${who}" placeholder="Mesaj yaz..." autocomplete="off"><button>${ic('send')}</button></form>`;
}
function callView(who) {
  const o = who === 'c' ? { n: COURIER.name, a: 'MK', cls: '' } : { n: CUSTOMER.name, a: 'AY', cls: 'b' };
  return `<div class="call"><div class="ava ${o.cls}">${o.a}</div><b style="font-size:22px;margin-top:22px">${o.n}</b><span style="opacity:.7;margin-top:6px">Aranıyor…</span>
    <span class="xs" style="margin-top:18px;background:rgba(255,255,255,.1);padding:6px 12px;border-radius:99px;display:flex;gap:6px;align-items:center">${ic('shield-check')} Gizli numara ile güvenli arama</span>
    <button class="end" onclick="A.endCall('${who}')">${ic('phone-off')}</button></div>`;
}

/* =================== KURYE =================== */
function renderCourier() {
  const k = S.k;
  let body;
  if (k.screen === 'chat') return `<div class="app">${sbar()}${chatView('k')}<div class="toastbox"></div>${k.call ? callView('k') : ''}</div>`;
  if (k.tab === 'earn') body = kEarn();
  else if (k.tab === 'hist') body = kHist();
  else if (k.tab === 'prof') body = kProf();
  else body = kHome();
  const o = S.order;
  return `<div class="app">${sbar()}${body}${kNav()}<div class="toastbox"></div>${o && o.courier === 'offered' ? kOffer() : ''}${k.call ? callView('k') : ''}</div>`;
}
function kNav() {
  const t = S.k.tab, active = S.order && ['to_store', 'at_store', 'to_customer', 'at_customer'].includes(S.order.courier);
  return `<nav class="nav">
    <button class="${t === 'home' ? 'on' : ''}" onclick="A.k.tab('home')">${ic(active ? 'navigation' : 'map')}${active ? 'Aktif İş' : 'Harita'}${active ? '<span class="badge">1</span>' : ''}</button>
    <button class="${t === 'earn' ? 'on' : ''}" onclick="A.k.tab('earn')">${ic('wallet')}Hakediş</button>
    <button class="${t === 'hist' ? 'on' : ''}" onclick="A.k.tab('hist')">${ic('history')}Geçmiş</button>
    <button class="${t === 'prof' ? 'on' : ''}" onclick="A.k.tab('prof')">${ic('user-round')}Profil</button>
  </nav>`;
}
const todayTotal = () => S.earnings.reduce((a, e) => a + e.base + e.kmFee + e.tip + e.bonus, 0);
function kHome() {
  const o = S.order, k = S.k;
  const job = o && ['to_store', 'at_store', 'to_customer', 'at_customer', 'done'].includes(o.courier);
  const route = !job ? null : o.courier === 'to_store' ? ROUTE1 : o.courier === 'to_customer' ? ROUTE2 : null;
  return `<div class="scr" style="margin-top:-44px">
    <div class="map" style="height:270px">${mapSVG({ route, h: 270 })}</div>
    ${job ? `<div class="k-top" style="top:52px;justify-content:flex-end"><span class="fb or" style="background:#fff;box-shadow:0 4px 12px rgba(0,0,0,.15);padding:6px 10px;border-radius:99px">${ic('bike')} Görevde · #${o.id.slice(4)}</span></div>` : `<div class="k-top" style="top:52px"><div class="online"><div>${k.online ? 'Çevrimiçi' : 'Çevrimdışı'}<small>${k.online ? 'Sipariş teklifleri açık' : 'Teklif almıyorsun'}</small></div><button class="sw ${k.online ? 'on' : ''}" onclick="A.k.toggle()" aria-label="Çevrimiçi durumu"></button></div></div>`}
    <div class="sheet"><div class="grab"></div>${job ? kJob() : kIdle()}</div>
  </div>`;
}
function kIdle() {
  const n = S.earnings.length;
  return `<div class="kpis"><div class="kpi"><span>Bugün</span><b>${money(Math.round(todayTotal()))}</b></div><div class="kpi"><span>Teslimat</span><b>${n}</b></div><div class="kpi"><span>Çevrimiçi</span><b>5s 12dk</b></div></div>
    <div class="card" style="margin-top:12px;background:#fff8f2;border-color:#ffd8bb"><div class="h-row">${ic('flame', 'or')}<div><b class="sm">Yoğunluk bonusu aktif</b><div class="xs mut">18:00–21:00 arası her teslimata +₺15</div></div></div></div>
    <div class="card h-row" style="margin-top:10px">${ic(S.k.online ? 'radar' : 'moon', 'or')}<div class="sm">${S.k.online ? 'Yakındaki siparişler bekleniyor…<div class="xs mut">Beşiktaş bölgesi · 3 aktif işletme</div>' : 'Teklif almak için çevrimiçi ol.'}</div></div>
    <div class="sec-t" style="font-size:14px">Son teslimat</div>
    ${kDeliveryRow(S.earnings[S.earnings.length - 1])}`;
}
function kJob() {
  const o = S.order, s = storeById(o.store), arrived = S.arrived;
  const steps = { to_store: 1, at_store: 2, to_customer: 3, at_customer: 4, done: 5 }[o.courier];
  const head = `<div class="between"><span class="jobstep">Adım ${Math.min(steps, 4)}/4</span><span class="xs mut">#${o.id.slice(4)} · ${money(o.earn.total)} kazanç</span></div>
    <div class="steps">${[1, 2, 3, 4].map(i => `<i class="${i < steps ? 'on' : i === steps ? 'cur' : ''}"></i>`).join('')}</div>`;
  if (o.courier === 'to_store') return `${head}
    <b style="font-size:18px;display:block;margin-top:10px">Restorana git</b>
    <div class="card addr" style="margin-top:10px"><div class="pin">${ic('store')}</div><div style="flex:1"><b class="sm">${s.name}</b><div class="xs mut">${s.addr}</div></div><div style="text-align:right"><b class="or eta-v">${etaMin()} dk</b><div class="xs mut">1,2 km</div></div></div>
    <div class="h-row" style="margin:10px 0"><button class="btn line" style="padding:11px">${ic('navigation')}Navigasyon</button><button class="btn line" style="padding:11px">${ic('phone')}İşletme</button></div>
    <button class="btn" ${arrived ? '' : 'disabled'} onclick="A.k.atStore()">${arrived ? 'Restorana vardım' : 'Yoldasın…'}</button>`;
  if (o.courier === 'at_store') {
    const ready = o.status === 'ready';
    return `${head}<b style="font-size:18px;display:block;margin-top:10px">Siparişi teslim al</b>
    <div class="card" style="margin-top:10px"><div class="between"><b class="sm">${s.name}</b><span class="fb ${ready ? 'ok' : 'info'}">${ready ? 'Hazır' : 'Hazırlanıyor'}</span></div>
      ${o.items.map(x => `<div class="check">${ic(ready ? 'circle-check' : 'circle-dashed')}${x.qty}× ${x.name}</div>`).join('')}
      <div class="xs mut">Sipariş kodu: <b>${o.id}</b></div></div>
    ${ready ? '' : '<div class="xs mut h-row" style="margin:10px 0">⏳ İşletme hazır dediğinde bildirim alacaksın.</div>'}
    <button class="btn" style="margin-top:10px" ${ready ? '' : 'disabled'} onclick="A.k.pickup()">${ic('package-check')}Paketi teslim aldım</button>`;
  }
  if (o.courier === 'to_customer' || o.courier === 'at_customer') {
    const at = o.courier === 'at_customer';
    return `${head}<b style="font-size:18px;display:block;margin-top:10px">${at ? 'Teslim et' : 'Müşteriye git'}</b>
    <div class="card" style="margin-top:10px">
      <div class="person"><div class="ava b s">AY</div><div style="flex:1"><b class="sm">${CUSTOMER.name}</b><div class="xs mut">${CUSTOMER.phone}</div></div><button class="iconbtn" onclick="A.call('k')">${ic('phone')}</button><button class="iconbtn" style="position:relative" onclick="A.k.go('chat')">${ic('message-circle')}${S.unread.k ? `<span class="badge" style="position:absolute;top:-5px;right:-5px">${S.unread.k}</span>` : ''}</button></div>
      <div class="route" style="margin-bottom:0"><div class="dot d"></div><div><b class="sm">${CUSTOMER.addr}</b><p>${CUSTOMER.floor} · ${CUSTOMER.district}</p></div></div>
      <div class="card" style="background:#fff8f2;border-color:#ffd8bb;padding:9px 11px;margin-top:8px"><span class="xs"><b>Müşteri notu:</b> ${CUSTOMER.note}</span></div>
      <div class="between sm" style="margin-top:10px"><span class="mut">${o.pay === 'Kart' ? 'Online ödendi · tahsilat yok' : 'Kapıda tahsil et'}</span><b>${o.pay === 'Kart' ? '✓' : money(o.total)}</b></div>
    </div>
    ${at ? `<div style="margin-top:12px"><div class="sm b" style="margin-bottom:6px">Teslimat kodu</div><input id="kcode" class="codein" maxlength="4" inputmode="numeric" placeholder="••••" oninput="A.k.code(this.value)">${S.k.codeErr ? '<div class="xs" style="color:var(--bad);margin-top:6px">Kod hatalı, müşteriye tekrar sor.</div>' : ''}</div>
      <button class="btn green" style="margin-top:10px" onclick="A.k.deliver()">${ic('check-check')}Teslim et</button>`
    : `<div class="h-row" style="margin:10px 0"><button class="btn line" style="padding:11px">${ic('navigation')}Navigasyon</button><div style="text-align:right;flex:none;padding:0 6px"><b class="or eta-v">${etaMin()} dk</b><div class="xs mut">3,2 km</div></div></div>
      <button class="btn" ${arrived ? '' : 'disabled'} onclick="A.k.atCustomer()">${arrived ? 'Adrese vardım' : 'Yoldasın…'}</button>`}`;
  }
  /* done */
  const e = o.earn;
  return `<div class="fade" style="text-align:center"><div style="font-size:48px">✅</div><b style="font-size:19px">Teslimat tamamlandı</b><div class="sm mut">#${o.id.slice(4)} · ${hhmm()}</div></div>
    <div class="card" style="margin-top:12px"><div class="brk"><div><span class="mut">Taban ücret</span><span>${money(e.base)}</span></div><div><span class="mut">Mesafe (${e.km} km × ₺8)</span><span>${money(e.kmFee)}</span></div><div><span class="mut">Bahşiş</span><span class="ok">${money(e.tip)}</span></div><div><span class="mut">Yoğunluk bonusu</span><span>${money(e.bonus)}</span></div><div class="tot b" style="border-top:1px dashed var(--line);padding-top:8px"><span>Toplam hakediş</span><span class="or">${money(e.total)}</span></div></div></div>
    <div class="h-row" style="margin-top:12px"><button class="btn line" onclick="A.k.tab('earn')">Hakedişe git</button><button class="btn" onclick="A.k.finish()">Yeni teklif bekle</button></div>`;
}
function kOffer() {
  const o = S.order, s = storeById(o.store), left = Math.max(0, Math.ceil((o.offerUntil - Date.now()) / 1000)), frac = left / 25;
  return `<div class="ov"><div class="ov-card fade">
    <div class="between"><div><span class="jobstep">${ic('zap')} Yeni teklif</span><div style="font-size:30px;font-weight:800;margin-top:8px;letter-spacing:-1px">${money(o.earn.total)}</div><div class="xs mut">tahmini kazanç${o.tip ? ` · ${money(o.tip)} bahşiş dahil` : ''}</div></div>
      <div class="offer-ring"><svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="none" stroke="#f1f1f3" stroke-width="6"/><circle class="ring-p" cx="32" cy="32" r="28" fill="none" stroke="#FF6B00" stroke-width="6" stroke-linecap="round" stroke-dasharray="176" stroke-dashoffset="${176 * (1 - frac)}"/></svg><b class="ring-t">${left}</b></div></div>
    <div class="route"><div class="dot"></div><div><b class="sm">${s.name}</b><p>${s.addr} · 1,2 km</p></div><div class="vl"></div><div></div><div class="dot d"></div><div><b class="sm">Fulya Mah. Ortaklar Cd.</b><p>Beşiktaş · teslimat 3,2 km</p></div></div>
    <div class="kpis" style="margin-bottom:14px"><div class="kpi"><span>Toplam</span><b>4,4 km</b></div><div class="kpi"><span>Süre</span><b>~24 dk</b></div><div class="kpi"><span>Ödeme</span><b>${o.pay === 'Kart' ? 'Online' : 'Nakit'}</b></div></div>
    <div class="h-row"><button class="btn line" style="flex:1" onclick="A.k.decline()">Reddet</button><button class="btn" style="flex:2" onclick="A.k.accept()">Kabul et</button></div>
  </div></div>`;
}
function kDeliveryRow(e) {
  if (!e) return '';
  const t = e.base + e.kmFee + e.tip + e.bonus;
  return `<div class="dl ${e.fresh ? 'newflash' : ''}"><div class="between"><div><b class="sm">${e.store}</b><div class="xs mut">${e.time} · #${e.id.slice(4)} · ${e.km} km</div></div><b>${money(t)}</b></div>
    <div class="mini-chips"><span>Taban ${money(e.base)}</span><span>Km ${money(e.kmFee)}</span>${e.tip ? `<span class="t">Bahşiş ${money(e.tip)}</span>` : ''}${e.bonus ? `<span>Bonus ${money(e.bonus)}</span>` : ''}</div></div>`;
}
function kEarn() {
  const E = S.earnings, sum = f => E.reduce((a, e) => a + f(e), 0), tot = todayTotal();
  const week = WEEK.map(w => (w.today ? { ...w, v: tot } : w)), max = Math.max(...week.map(w => w.v)), wk = week.reduce((a, w) => a + w.v, 0);
  return `<div class="abar">Hakediş<span class="sp"></span><span class="chip">${ic('calendar')}Bu hafta</span></div>
  <div class="scr pad">
    <div class="earn-h"><span class="sm" style="opacity:.85">Bu haftaki kazanç</span><b>${money(Math.round(wk * 100) / 100)}</b><div class="xs" style="opacity:.9">Bugün ${money(Math.round(tot * 100) / 100)} · ${E.length} teslimat</div></div>
    <div class="card" style="margin-top:12px"><div class="bars">${week.map(w => `<div class="${w.today ? 'on' : ''}"><i style="height:${max ? Math.max(4, (w.v / max) * 92) : 4}px"></i><span>${w.d}</span></div>`).join('')}</div></div>
    <div class="sec-t" style="font-size:14px">Bugünün dökümü</div>
    <div class="card brk"><div><span class="mut">Taban ücretler</span><span>${money(sum(e => e.base))}</span></div><div><span class="mut">Mesafe ücretleri</span><span>${money(sum(e => e.kmFee))}</span></div><div><span class="mut">Bahşişler</span><span class="ok">${money(sum(e => e.tip))}</span></div><div><span class="mut">Bonuslar</span><span>${money(sum(e => e.bonus))}</span></div><div><span class="mut">Ekipman kesintisi</span><span>₺0</span></div></div>
    <div class="card addr" style="margin-top:10px"><div class="pin">${ic('landmark')}</div><div style="flex:1"><b class="sm">Sonraki ödeme: Pazartesi</b><div class="xs mut">Haftalık · IBAN TR** **** **** 4821</div></div><span class="fb ok">Otomatik</span></div>
    <div class="sec-t" style="font-size:14px">Teslimatlar</div>
    ${[...E].reverse().map(kDeliveryRow).join('')}
    <div style="height:10px"></div>
  </div>`;
}
function kHist() {
  return `<div class="abar">Geçmiş</div><div class="scr pad">${[...S.earnings].reverse().map(e => `<div class="line-item sm">${ic('package-check', 'or')}<div style="flex:1"><b>${e.store}</b><div class="xs mut">${e.time} · ${e.km} km</div></div><span class="fb ok">Teslim</span></div>`).join('')}</div>`;
}
function kProf() {
  return `<div class="abar">Profil</div><div class="scr pad">
    <div class="card person"><div class="ava">MK</div><div><b>${COURIER.name}</b><div class="xs mut">★ ${COURIER.rating} · ${COURIER.plate}</div></div></div>
    <div class="kpis" style="margin-top:10px"><div class="kpi"><span>Kabul oranı</span><b>%96</b></div><div class="kpi"><span>Zamanında</span><b>%98</b></div><div class="kpi"><span>Toplam</span><b>1.284</b></div></div>
    ${[['file-check', 'Belgelerim (ehliyet, ruhsat)'], ['landmark', 'Banka bilgileri'], ['calendar-clock', 'Vardiya planı'], ['headphones', 'Kurye destek hattı']].map(([i, t]) => `<div class="line-item sm">${ic(i, 'or')}<span style="flex:1">${t}</span>${ic('chevron-right')}</div>`).join('')}
  </div>`;
}

/* =================== İŞLETME PANELİ =================== */
function merchOrders() { return S.orders.filter(o => o.store === S.p.merchant); }
function renderPanel() {
  const p = S.p, m = storeById(p.merchant), mine = merchOrders(), nNew = mine.filter(o => o.status === 'placed').length;
  const nav = [['Genel', [['dashboard', 'layout-dashboard', 'Kontrol Paneli']]], ['Siparişler', [['orders', 'shopping-bag', 'Siparişler', nNew], ['live', 'map', 'Canlı Takip']]], ['Katalog', [['products', 'package', m.type === 'parca' ? 'Parçalar' : 'Ürünler']]], ['Finans', [['payouts', 'wallet', 'Hakediş & Ödemeler']]], ['Ayarlar', [['settings', 'settings', 'İşletme Ayarları']]]];
  const page = { dashboard: pDash, orders: pOrders, live: pLive, products: pProducts, payouts: pPayouts, settings: pSettings }[p.page]();
  return `<aside class="p-side">
      <div class="p-logo"><img class="appicon" src="img/app-icon.png" alt="Getirek"><b>Get<span>irek</span> <small style="font-weight:600;color:#9CA3AF;font-size:11px">İşletme</small></b></div>
      <div class="p-merch"><img src="${img(m.img)}" alt=""><div style="flex:1;min-width:0"><select onchange="A.p.merchant(this.value)" aria-label="İşletme seç">${STORES.map(s => `<option value="${s.id}" ${s.id === m.id ? 'selected' : ''}>${s.name}</option>`).join('')}</select><small>${TYPE_LABEL[m.type]} · Beşiktaş</small></div></div>
      ${nav.map(([g, items]) => `<div class="p-group">${g}</div>${items.map(([id, i, l, b]) => `<button class="p-nav ${p.page === id ? 'on' : ''}" onclick="A.p.go('${id}')" title="${l}">${ic(i)}<span>${l}</span>${b ? `<span class="badge">${b}</span>` : ''}</button>`).join('')}`).join('')}
    </aside>
    <div class="p-main">
      <div class="p-top"><div class="p-search">${ic('search')}<span>Sipariş, ürün ara…</span></div><div class="sp"></div>
        <div class="p-open"><span>${p.open ? 'Siparişe açık' : 'Kapalı'}</span><button class="sw ${p.open ? 'on' : ''}" onclick="A.p.toggleOpen()" aria-label="Açık/kapalı"></button></div>
        <button class="p-bell" onclick="A.p.go('orders')">${ic('bell')}${nNew ? `<span class="badge">${nNew}</span>` : ''}</button><div class="p-user">BH</div></div>
      <div class="p-body">${page}</div>
    </div>
    ${p.detail ? pDetail() : ''}${p.accept ? pAcceptModal() : ''}
    <div class="ptoast"></div>`;
}
function badge(o) { const s = STATUS[o.status]; return `<span class="fb ${s.b} ${o.status === 'placed' ? 'pulse' : ''}">${s.t}</span>`; }
function orderActions(o) {
  if (o.status === 'placed') return `<button class="fbtn red sm" onclick="event.stopPropagation();A.p.reject('${o.id}')">Reddet</button><button class="fbtn green sm" onclick="event.stopPropagation();A.p.askAccept('${o.id}')">${ic('check')}Kabul et</button>`;
  if (o.status === 'preparing') return `<button class="fbtn sm" onclick="event.stopPropagation();A.p.ready('${o.id}')">${ic('package-check')}Hazır</button>`;
  return `<button class="fbtn gray sm" onclick="event.stopPropagation();A.p.detail('${o.id}')">Görüntüle</button>`;
}
function courierCell(o) {
  if (o.seed) return o.courier;
  return { none: '<span class="fb gray">—</span>', searching: '<span class="fb gray">Aranıyor…</span>', offered: '<span class="fb warn">Teklif gönderildi</span>', to_store: `${COURIER.short} <span class="xs mut">· geliyor</span>`, at_store: `${COURIER.short} <span class="xs mut">· işletmede</span>`, to_customer: COURIER.short, at_customer: COURIER.short, done: COURIER.short }[o.courier] || '—';
}
function orderTable(list, compact) {
  if (!list.length) return `<div class="fcard-b" style="text-align:center;color:#9CA3AF;padding:36px">${ic('inbox')}<div style="margin-top:6px">Kayıt yok</div></div>`;
  return `<div style="overflow-x:auto"><table class="ft"><thead><tr><th>Sipariş</th>${compact ? '' : '<th>Müşteri</th>'}<th>Ürünler</th><th>Tutar</th>${compact ? '' : '<th class="hide-sm">Ödeme</th>'}<th>Durum</th><th class="hide-sm">Kurye</th><th></th></tr></thead><tbody>
    ${list.map(o => `<tr onclick="A.p.detail('${o.id}')" class="${o.flash ? 'newflash' : ''}"><td><b>#${o.id.slice(4)}</b><div style="font-size:11.5px;color:#9CA3AF">${o.time}</div></td>${compact ? '' : `<td>${o.customer}</td>`}<td style="max-width:220px;color:#4B5563">${o.items.map(x => `${x.qty}× ${x.name}`).join(', ')}</td><td><b>${money(o.total)}</b></td>${compact ? '' : `<td class="hide-sm">${o.pay}</td>`}<td>${badge(o)}</td><td class="hide-sm">${courierCell(o)}</td><td><div class="acts">${orderActions(o)}</div></td></tr>`).join('')}
  </tbody></table></div>`;
}
function pDash() {
  const m = storeById(S.p.merchant), mine = merchOrders(), active = mine.filter(o => !['delivered', 'rejected'].includes(o.status));
  const done = mine.filter(o => o.status === 'delivered' && !o.seed);
  const base = { burger: [37, 9840], pizza: [24, 7410], durum: [41, 7820], kofte: [33, 8960], market: [58, 6230], parca: [9, 14320] }[m.id];
  const cnt = base[0] + done.length, rev = base[1] + done.reduce((a, o) => a + o.subtotal, 0);
  const hours = [['10', 4], ['11', 7], ['12', 15], ['13', 18], ['14', 11], ['15', 8], ['16', 9], ['17', 13], ['18', 6]];
  const mx = 18;
  return `<div class="p-head"><div><small>Hoş geldin 👋</small><h1>${m.name}</h1></div><div class="h-row"><button class="fbtn gray">${ic('calendar')}Bugün</button><button class="fbtn" onclick="A.p.go('orders')">${ic('shopping-bag')}Siparişler</button></div></div>
    <div class="stats">
      <div class="stat"><span>${ic('shopping-bag')}Bugünkü sipariş</span><b>${cnt}</b><small>${ic('trending-up')}%12 düne göre</small></div>
      <div class="stat"><span>${ic('banknote')}Bugünkü ciro</span><b>${money(Math.round(rev))}</b><small>${ic('trending-up')}%8 düne göre</small></div>
      <div class="stat"><span>${ic('timer')}Ort. hazırlık</span><b>14 dk</b><small>${ic('trending-down')}2 dk daha hızlı</small></div>
      <div class="stat"><span>${ic('star')}İşletme puanı</span><b>${m.rating}</b><small>${ic('message-square')}${m.rc} değerlendirme</small></div>
    </div>
    <div class="fcard"><div class="fcard-h"><span class="h-row">${ic('activity', 'or')}Aktif siparişler <span class="fb gray">${active.length}</span></span><button class="fbtn gray sm" onclick="A.p.go('orders')">Tümü</button></div>${orderTable(active, true)}</div>
    <div class="grid2">
      <div class="fcard"><div class="fcard-h">Saatlik sipariş<span class="fb or">Bugün</span></div><div class="fcard-b"><div class="chart">${hours.map(([h, v], i) => `<div class="${i === hours.length - 1 ? 'now' : ''}"><i style="height:${(v / mx) * 120}px"></i><span>${h}:00</span></div>`).join('')}</div></div></div>
      <div class="fcard"><div class="fcard-h">Son yorumlar</div><div class="fcard-b" style="padding-top:4px">
        ${[['Elif K.', 5, 'Sıcacık geldi, kurye çok kibardı.'], ['Burak T.', 4, 'Lezzetli ama sos azdı.'], ['Can D.', 5, 'Her zamanki gibi harika 👌']].map(([n, s, t]) => `<div class="rev"><div class="between"><b>${n}</b><span class="star">${'★'.repeat(s)}<span style="color:#E5E7EB">${'★'.repeat(5 - s)}</span></span></div><div style="color:#4B5563;margin-top:3px">${t}</div></div>`).join('')}
      </div></div>
    </div>`;
}
function pOrders() {
  const all = merchOrders(), f = S.p.filter;
  const tabs = [['all', 'Tümü'], ['placed', 'Yeni'], ['preparing', 'Hazırlanıyor'], ['ready', 'Kurye bekleniyor'], ['onway', 'Yolda'], ['delivered', 'Teslim edildi']];
  const list = f === 'all' ? all : all.filter(o => o.status === f);
  return `<div class="p-head"><div><small>Siparişler</small><h1>Sipariş Yönetimi</h1></div><button class="fbtn gray">${ic('download')}Dışa aktar</button></div>
    <div class="fcard"><div class="ftabs">${tabs.map(([k, l]) => `<button class="${f === k ? 'on' : ''}" onclick="A.p.filter('${k}')">${l}<span class="cnt">${k === 'all' ? all.length : all.filter(o => o.status === k).length}</span></button>`).join('')}</div>${orderTable(list)}</div>`;
}
function pLive() {
  const o = S.order && S.order.store === S.p.merchant ? S.order : null;
  const route = o ? (o.courier === 'to_store' ? ROUTE1 : o.status === 'onway' ? ROUTE2 : null) : null;
  return `<div class="p-head"><div><small>Canlı Takip</small><h1>Kurye Haritası</h1></div><span class="fb ok">${ic('radio')}Canlı</span></div>
    <div class="grid2"><div class="fcard"><div class="map" style="height:380px">${mapSVG({ route, others: true, h: 380 })}</div></div>
      <div class="fcard"><div class="fcard-h">Bölgedeki kuryeler</div><div class="fcard-b live-list">
        <div class="it"><div class="ava s">MK</div><div style="flex:1"><b>${COURIER.name}</b><div style="font-size:12px;color:#6B7280">${o ? courierCell(o).replace(/<[^>]+>/g, '') : 'Müsait'}</div></div><span class="fb ${o && !['none', 'searching', 'offered', 'done'].includes(o.courier) ? 'or' : 'ok'}">${o && !['none', 'searching', 'offered', 'done'].includes(o.courier) ? 'Görevde' : 'Müsait'}</span></div>
        ${[['AR', 'Ali R.', 'Teslimatta · 6 dk'], ['HÇ', 'Hasan Ç.', 'Müsait · 900 m'], ['OE', 'Oğuz E.', 'Teslimatta · 11 dk']].map(([a, n, t]) => `<div class="it"><div class="ava s b">${a}</div><div style="flex:1"><b>${n}</b><div style="font-size:12px;color:#6B7280">${t}</div></div><span class="fb ${t.startsWith('Müsait') ? 'ok' : 'info'}">${t.split(' ·')[0]}</span></div>`).join('')}
      </div></div></div>`;
}
function pProducts() {
  const m = storeById(S.p.merchant);
  return `<div class="p-head"><div><small>Katalog</small><h1>${m.type === 'parca' ? 'Parçalar' : 'Ürünler'}</h1></div><button class="fbtn" onclick="A.p.toast('Yeni ürün formu','Filament create sayfası açılır')">${ic('plus')}Yeni ${m.type === 'parca' ? 'parça' : 'ürün'}</button></div>
    <div class="fcard"><div style="overflow-x:auto"><table class="ft"><thead><tr><th></th><th>Ad</th><th>Kategori</th><th>Fiyat</th><th>${m.type === 'restoran' ? 'Satışta' : 'Stok'}</th><th></th></tr></thead><tbody>
    ${m.menu.map((x, i) => { const off = S.p.products[m.id + x.id]; return `<tr style="cursor:default"><td><img class="pimg" src="${img(x.img)}" alt=""></td><td><b>${x.name}</b><div style="font-size:12px;color:#9CA3AF;max-width:280px">${x.desc}</div></td><td><span class="fb gray">${x.cat}</span></td><td><b>${money(x.price)}</b></td><td>${m.type === 'restoran' ? '' : `<span style="font-size:12px;color:#6B7280;margin-right:8px">${[42, 120, 8, 26][i % 4]} adet</span>`}<button class="sw ${off ? '' : 'on'}" style="width:38px;height:22px;vertical-align:middle" onclick="A.p.stock('${m.id + x.id}')" aria-label="Satış durumu"></button></td><td><button class="fbtn gray sm" onclick="A.p.toast('Düzenle','${x.name}')">${ic('pencil')}</button></td></tr>`; }).join('')}
    </tbody></table></div></div>`;
}
function pPayouts() {
  const mine = merchOrders().filter(o => o.status === 'delivered'), gross = mine.reduce((a, o) => a + o.subtotal, 0);
  const com = gross * 0.12, net = gross - com;
  const rows = [['20–26 Eki', 48210], ['13–19 Eki', 51340], ['6–12 Eki', 46980], ['29 Eyl–5 Eki', 44120]];
  return `<div class="p-head"><div><small>Finans</small><h1>Hakediş & Ödemeler</h1></div><button class="fbtn gray">${ic('file-text')}Fatura / Ekstre</button></div>
    <div class="stats">
      <div class="stat"><span>${ic('banknote')}Bugün brüt satış</span><b>${money(Math.round(gross))}</b><small>${mine.length} teslim edilen sipariş</small></div>
      <div class="stat"><span>${ic('percent')}Komisyon (%12)</span><b>${money(Math.round(com))}</b><small style="color:#6B7280">Sektör ort. %25–35</small></div>
      <div class="stat"><span>${ic('wallet')}Net hakediş</span><b style="color:#15803D">${money(Math.round(net))}</b><small>${ic('check')}Ödemeye hazır</small></div>
      <div class="stat"><span>${ic('calendar-clock')}Sonraki ödeme</span><b>Pzt</b><small style="color:#6B7280">Haftalık · otomatik EFT</small></div>
    </div>
    <div class="fcard"><div class="fcard-h">Ödeme geçmişi</div><table class="ft"><thead><tr><th>Dönem</th><th>Brüt</th><th>Komisyon</th><th>Net</th><th>Durum</th></tr></thead><tbody>
      ${rows.map(([d, g], i) => `<tr style="cursor:default"><td>${d}</td><td>${money(g)}</td><td>−${money(Math.round(g * 0.12))}</td><td><b>${money(Math.round(g * 0.88))}</b></td><td><span class="fb ${i ? 'ok' : 'warn'}">${i ? 'Ödendi' : 'İşleniyor'}</span></td></tr>`).join('')}
    </tbody></table></div>`;
}
function pSettings() {
  const m = storeById(S.p.merchant);
  return `<div class="p-head"><div><small>Ayarlar</small><h1>İşletme Ayarları</h1></div><button class="fbtn" onclick="A.p.toast('Kaydedildi','Ayarlar güncellendi')">${ic('save')}Kaydet</button></div>
    <div class="fcard"><div class="fcard-h">Genel bilgiler</div><div class="fcard-b"><div class="fform">
      <label>İşletme adı<input value="${m.name}"></label>
      <label>İşletme türü<select>${Object.entries(TYPE_LABEL).map(([k, v]) => `<option ${k === m.type ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label class="full">Adres<input value="${m.addr}"></label>
      <label>Minimum sepet (₺)<input value="${m.min}"></label>
      <label>Varsayılan hazırlık süresi<select><option>10 dk</option><option selected>15 dk</option><option>20 dk</option><option>30 dk</option></select></label>
      <label>Teslimat yarıçapı<select><option>2 km</option><option selected>4 km</option><option>6 km</option></select></label>
      <label>Çalışma saatleri<input value="10:00 – 23:30"></label>
    </div></div></div>
    <div class="fcard"><div class="fcard-h">Bildirimler</div><div class="fcard-b" style="display:grid;gap:12px">
      ${['Yeni siparişte sesli uyarı', 'Siparişi otomatik kabul et', 'Stok azaldığında e-posta'].map((t, i) => `<div class="between"><span>${t}</span><button class="sw ${i !== 1 ? 'on' : ''}" style="width:38px;height:22px" onclick="this.classList.toggle('on')"></button></div>`).join('')}
    </div></div>`;
}
function pDetail() {
  const o = S.orders.find(x => x.id === S.p.detail);
  if (!o) return '';
  const tl = o.timeline.length ? o.timeline : [{ t: o.time, l: 'Sipariş alındı' }, { t: '', l: 'Teslim edildi' }];
  return `<div class="slide" onclick="A.p.detail(null)"><div class="slide-in" onclick="event.stopPropagation()">
    <div class="fcard-h" style="position:sticky;top:0;background:#fff;z-index:1"><span>Sipariş #${o.id.slice(4)}</span><button onclick="A.p.detail(null)">${ic('x')}</button></div>
    <div class="fcard-b">
      <div class="between" style="margin-bottom:14px">${badge(o)}<div class="acts" style="display:flex;gap:6px">${orderActions(o)}</div></div>
      <dl class="kv"><dt>Müşteri</dt><dd>${o.mine ? CUSTOMER.name : o.customer}</dd><dt>Telefon</dt><dd>${CUSTOMER.phone} <span class="fb gray">maskeli</span></dd><dt>Adres</dt><dd>${o.mine ? CUSTOMER.addr : 'Beşiktaş'}</dd>${o.mine ? `<dt>Not</dt><dd>${CUSTOMER.note}</dd>` : ''}<dt>Ödeme</dt><dd>${o.pay}</dd><dt>Kurye</dt><dd>${courierCell(o)}</dd></dl>
      <div style="margin:18px 0 8px;font-weight:600">Ürünler</div>
      ${o.items.map(x => `<div class="between" style="padding:6px 0;border-bottom:1px solid #F3F4F6"><span>${x.qty}× ${x.name}</span><span>${money(x.price * x.qty)}</span></div>`).join('')}
      <div class="between" style="padding:6px 0;color:#6B7280"><span>Teslimat + bahşiş</span><span>${money(o.delivery + o.tip)}</span></div>
      <div class="between" style="padding:6px 0;font-weight:700"><span>Toplam</span><span>${money(o.total)}</span></div>
      <div class="between" style="padding:6px 0;color:#15803D;font-weight:600"><span>İşletme net (%12 komisyon sonrası)</span><span>${money(Math.round(o.subtotal * 0.88 * 100) / 100)}</span></div>
      <div style="margin:18px 0 10px;font-weight:600">Zaman çizelgesi</div>
      <div class="tl">${tl.map(x => `<div><b style="font-weight:600">${x.l}</b><div style="font-size:12px;color:#9CA3AF">${x.t}</div></div>`).join('')}</div>
    </div></div></div>`;
}
function pAcceptModal() {
  const o = S.orders.find(x => x.id === S.p.accept);
  return `<div class="modal"><div class="modal-in fade"><div class="mic">${ic('chef-hat')}</div><h3>Siparişi kabul et</h3><div style="color:#6B7280">#${o.id.slice(4)} · ${o.items.map(x => `${x.qty}× ${x.name}`).join(', ')}</div>
    <div style="margin-top:14px;font-weight:600;font-size:13px">Hazırlık süresi</div>
    <div class="prep">${[10, 15, 20, 30].map(v => `<button class="${S.p.prep === v ? 'on' : ''}" onclick="A.p.prep(${v})">${v} dk</button>`).join('')}</div>
    <div class="h-row" style="justify-content:flex-end"><button class="fbtn gray" onclick="A.p.cancelAccept()">Vazgeç</button><button class="fbtn green" onclick="A.p.accept()">${ic('check')}Kabul et</button></div></div></div>`;
}

/* =================== AKSİYONLAR =================== */
function addTL(o, l) { o.timeline.push({ t: hhmm(), l }); }
function setOrder(fn) { fn(S.order); update(); }
let typingT;

const A = {
  mode(m) {
    S.mode = m;
    document.body.className = 'mode-' + m;
    $$('.tabs button').forEach(b => b.classList.toggle('on', b.dataset.mode === m));
    window.scrollTo({ top: 0 });
  },
  focus(id) { setTimeout(() => $('#dev-' + id)?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' }), 50); hot(id); },
  reset() { stopPlay(); const m = S.mode; S = fresh(); S.mode = m; clearTimeout(offerT); caption(); hot(); update(); },
  call(who) { S[who].call = true; update(); setTimeout(() => { if (S[who].call) A.endCall(who); }, 4200); },
  endCall(who) { S[who].call = false; update(); },
  send(from, text) {
    if (!text.trim()) return;
    S.chat.push({ from, text, time: hhmm() });
    const to = from === 'c' ? 'k' : 'c';
    if (S[to].screen !== 'chat') { S.unread[to]++; toast(to, from === 'c' ? CUSTOMER.short : COURIER.short, text, 'message-circle'); }
    update();
  },
  sendInput(who) { const i = $('#msg-' + who); if (!i) return; const v = i.value; i.value = ''; A.send(who, v); },

  c: {
    go(s) { S.c.screen = s; if (s === 'chat') S.unread.c = 0; if (s === 'track' && !S.order) S.c.screen = 'orders'; if (s === 'track' && S.order?.status === 'delivered' && S.c.rated) S.c.screen = 'track'; update(); },
    open(id) { S.c.store = id; S.c.screen = 'store'; update(); },
    filter(f) { S.c.filter = f; update(); },
    search(q) { S.c.q = q; update(); },
    add(sid, mid) {
      if (S.c.cartStore && S.c.cartStore !== sid) S.c.cart = [];
      S.c.cartStore = sid;
      const m = storeById(sid).menu.find(x => x.id === mid);
      const ex = S.c.cart.find(x => x.id === mid);
      ex ? ex.qty++ : S.c.cart.push({ ...m, qty: 1 });
      update();
    },
    qty(id, d) { const x = S.c.cart.find(y => y.id === id); if (!x) return; x.qty += d; if (x.qty <= 0) S.c.cart = S.c.cart.filter(y => y !== x); if (!S.c.cart.length) S.c.cartStore = null; update(); },
    clear() { S.c.cart = []; S.c.cartStore = null; update(); },
    tip(v) { S.c.tip = v; update(); },
    payw(v) { S.c.pay = v; update(); },
    place() {
      if (!S.c.cart.length) return;
      const s = storeById(S.c.cartStore), sub = cartSub(), del = deliveryFee();
      const tip = S.c.tip, km = 3.2, kmFee = Math.round(km * 8 * 100) / 100, bonus = 15;
      const o = { id: 'GTR-' + SEQ++, store: s.id, customer: CUSTOMER.short, items: S.c.cart.map(x => ({ ...x })), subtotal: sub, delivery: del, tip, total: Math.round((sub + del + tip) * 100) / 100,
        pay: S.c.pay === 'card' ? 'Kart' : 'Kapıda nakit', status: 'placed', courier: 'none', code: String(1000 + Math.floor(Math.random() * 9000)), time: hhmm(), mine: true, flash: true, timeline: [],
        earn: { base: 45, km, kmFee, tip, bonus, total: Math.round((45 + kmFee + tip + bonus) * 100) / 100 } };
      addTL(o, 'Sipariş alındı · ödeme ' + (o.pay === 'Kart' ? 'onaylandı' : 'kapıda'));
      S.order = o; S.orders.unshift(o); S.chat = []; S.unread = { c: 0, k: 0 }; S.c.rated = false; S.c.stars = 5;
      S.c.cart = []; S.c.cartStore = null; S.c.screen = 'track';
      S.pos = [...P.K0]; S.leg = null; S.arrived = false;
      S.p.merchant = s.id;
      update();
      setTimeout(() => { beep(); toast('p', 'Yeni sipariş!', `#${o.id.slice(4)} · ${money(o.total)}`, 'bell-ring'); setTimeout(() => (o.flash = false), 3500); }, 120);
    },
    star(i) { S.c.stars = i; update(); },
    rate() { S.c.rated = true; addTL(S.order, `Müşteri puanı: ${'★'.repeat(S.c.stars)}`); toast('k', 'Yeni değerlendirme', `${CUSTOMER.short} sana ${S.c.stars} yıldız verdi`, 'star'); update(); },
    newOrder() { S.c.screen = 'home'; update(); },
  },

  k: {
    tab(t) { S.k.tab = t; S.k.screen = 'home'; update(); },
    go(s) { S.k.screen = s; if (s === 'chat') S.unread.k = 0; if (s === 'home') S.k.tab = 'home'; update(); },
    toggle() { S.k.online = !S.k.online; if (S.k.online && S.order?.courier === 'searching') offer(); update(); },
    accept() {
      clearTimeout(offerT);
      setOrder(o => { o.courier = 'to_store'; addTL(o, `Kurye atandı · ${COURIER.name}`); });
      S.k.tab = 'home'; S.k.screen = 'home'; startLeg(1);
      toast('c', 'Kuryen atandı', `${COURIER.short} siparişini almaya gidiyor`, 'bike');
      toast('p', 'Kurye atandı', `${COURIER.name} · ~6 dk içinde işletmede`, 'bike');
      S.chat.push({ from: 'sys', text: `${COURIER.short} siparişe atandı`, time: hhmm() });
      update();
    },
    decline() {
      clearTimeout(offerT);
      setOrder(o => (o.courier = 'searching'));
      toast('k', 'Teklif reddedildi', 'Sipariş başka kuryeye yönlendirildi', 'x');
      setTimeout(() => { if (S.order?.courier === 'searching' && S.k.online) offer(); }, 5000);
    },
    atStore() { setOrder(o => { o.courier = 'at_store'; addTL(o, 'Kurye işletmeye ulaştı'); }); toast('p', 'Kurye kapıda', `${COURIER.name} paketi bekliyor`, 'bike'); },
    pickup() {
      setOrder(o => { o.courier = 'to_customer'; o.status = 'onway'; addTL(o, 'Kurye paketi teslim aldı'); });
      startLeg(2);
      toast('c', 'Siparişin yolda! 🛵', 'Haritadan canlı takip edebilirsin', 'bike');
    },
    atCustomer() { setOrder(o => (o.courier = 'at_customer')); },
    code(v) { S.k.codeVal = v; if (S.k.codeErr) { S.k.codeErr = false; update(); } },
    deliver() {
      const o = S.order;
      if ((S.k.codeVal || $('#kcode')?.value) !== o.code) { S.k.codeErr = true; update(); return; }
      o.courier = 'done'; o.status = 'delivered'; addTL(o, 'Teslim edildi · kod doğrulandı');
      const e = o.earn;
      S.earnings.push({ id: o.id, store: storeById(o.store).name, time: hhmm(), km: e.km, base: e.base, kmFee: e.kmFee, tip: e.tip, bonus: e.bonus, fresh: true });
      S.k.codeVal = ''; S.c.screen = 'track';
      toast('k', `+${money(e.total)} hakediş`, 'Bakiyene eklendi', 'wallet');
      toast('p', 'Sipariş teslim edildi', `#${o.id.slice(4)} · net ${money(Math.round(o.subtotal * 0.88 * 100) / 100)}`, 'circle-check');
      update();
    },
    finish() { S.k.tab = 'home'; S.order.courier = 'closed'; S.pos = [...P.K0]; update(); },
  },

  p: {
    go(pg) { S.p.page = pg; S.p.detail = null; update(); },
    merchant(id) { S.p.merchant = id; update(); },
    filter(f) { S.p.filter = f; update(); },
    detail(id) { S.p.detail = id; update(); },
    toggleOpen() { S.p.open = !S.p.open; update(); },
    askAccept(id) { S.p.accept = id; S.p.detail = null; update(); },
    cancelAccept() { S.p.accept = null; update(); },
    prep(v) { S.p.prep = v; update(); },
    accept() {
      const o = S.orders.find(x => x.id === S.p.accept); S.p.accept = null;
      o.status = 'preparing'; o.prep = S.p.prep; addTL(o, `İşletme onayladı · hazırlık ${S.p.prep} dk`);
      if (o === S.order) {
        toast('c', 'Siparişin onaylandı', `${storeById(o.store).name} hazırlamaya başladı`, 'chef-hat');
        o.courier = 'searching';
        setTimeout(() => { if (S.order === o && o.courier === 'searching' && S.k.online) offer(); }, 1800);
      }
      update();
    },
    reject(id) {
      const o = S.orders.find(x => x.id === id); o.status = 'rejected'; addTL(o, 'İşletme reddetti');
      if (o === S.order) toast('c', 'Sipariş iptal edildi', 'Ücret iaden başlatıldı', 'circle-x');
      update();
    },
    ready(id) {
      const o = S.orders.find(x => x.id === id); o.status = 'ready'; addTL(o, 'Sipariş hazır');
      if (o === S.order) { toast('k', 'Paket hazır', `${storeById(o.store).name} siparişi hazırladı`, 'package-check'); toast('c', 'Siparişin hazır', 'Kurye teslim almak üzere', 'package-check'); }
      update();
    },
    stock(k) { S.p.products[k] = !S.p.products[k]; update(); },
    toast(t, x) { toast('p', t, x, 'info'); },
  },

  autoplay, stopPlay,
};
window.A = A;

let offerT;
function offer() {
  const o = S.order;
  o.courier = 'offered'; o.offerUntil = Date.now() + 25000;
  addTL(o, 'Kuryeye teklif gönderildi');
  beep();
  update();
  const tick = () => {
    if (S.order !== o || o.courier !== 'offered') return;
    const left = Math.max(0, Math.ceil((o.offerUntil - Date.now()) / 1000));
    $$('.ring-t').forEach(n => (n.textContent = left));
    $$('.ring-p').forEach(n => n.setAttribute('stroke-dashoffset', 176 * (1 - left / 25)));
    if (left <= 0) A.k.decline(); else offerT = setTimeout(tick, 250);
  };
  offerT = setTimeout(tick, 250);
}

/* =================== OTOMATİK SENARYO =================== */
let stopFlag = false, playing = false;
function hot(id) { $$('.dev').forEach(d => d.classList.toggle('hot', d.id === 'dev-' + id)); }
function caption(step, text) {
  const c = $('#caption');
  if (!text) { c.classList.remove('on'); return; }
  $('#capStep').textContent = step; $('#capText').textContent = text; c.classList.add('on');
}
async function wait(ms) { await sleep(ms); if (stopFlag) throw new Error('stop'); }
async function until(fn) { while (!fn()) { await wait(200); } }
async function say(step, who, text, ms = 2200) { hot(who); caption(step, text); await wait(ms); }
async function typeInto(who, text) {
  S.typing = who; update(); await wait(1300); S.typing = null; A.send(who, text); await wait(900);
}
async function autoplay() {
  if (playing) return stopPlay();
  stopFlag = false; playing = true;
  $('#playBtn').classList.add('on'); $('#playBtn span').textContent = 'Durdur';
  if (S.mode !== 'live') A.mode('live');
  const m = S.mode; S = fresh(); S.mode = m; update();
  try {
    await say('1/12', 'cust', 'Müşteri uygulamayı açıyor — restoran, market ve yedek parça tek yerde.', 2600);
    A.c.filter('parca'); await wait(1200); A.c.filter('market'); await wait(1200); A.c.filter('all'); await wait(600);
    await say('2/12', 'cust', 'Burger House\'u seçiyor ve sepetine ürün ekliyor.', 900);
    A.c.open('burger'); await wait(1000);
    A.c.add('burger', 'cb'); await wait(700); A.c.add('burger', 'pt'); await wait(700); A.c.add('burger', 'ay'); await wait(1100);
    await say('3/12', 'cust', 'Sepette kuryeye bahşiş ve ödeme yöntemini seçiyor.', 600);
    A.c.go('cart'); await wait(1100); A.c.tip(20); await wait(1500);
    await say('4/12', 'panel', 'Sipariş verildi → işletme paneline sesli bildirimle anında düşüyor (WebSocket).', 400);
    A.c.place(); await wait(2600);
    await say('5/12', 'panel', 'İşletme hazırlık süresini seçip siparişi kabul ediyor.', 900);
    A.p.askAccept(S.order.id); await wait(1400); A.p.prep(15); await wait(800); A.p.accept(); await wait(1200);
    await say('6/12', 'cour', 'Sistem en yakın uygun kuryeye teklif gönderiyor: mesafe, kazanç, geri sayım.', 0);
    await until(() => S.order.courier === 'offered'); await wait(2600);
    A.k.accept();
    await say('7/12', 'cust', 'Kurye atandı; müşteri kuryeyi haritada görüyor ve mesaj atıyor.', 1200);
    A.c.go('chat'); await wait(700);
    await typeInto('c', 'Merhaba, zili çalmayın lütfen bebek uyuyor 🙏');
    hot('cour'); A.k.go('chat'); await wait(800);
    await typeInto('k', 'Tamamdır, kapıya gelince mesaj atarım 👍');
    await wait(600); A.c.go('track'); A.k.go('home');
    await say('8/12', 'panel', 'Mutfak hazır olunca işletme "Hazır" işaretliyor; kuryeye bildirim gidiyor.', 500);
    A.p.ready(S.order.id); await wait(1200);
    await say('9/12', 'cour', 'Kurye işletmeye ulaşıyor ve paketi teslim alıyor.', 0);
    await until(() => S.arrived); await wait(700); A.k.atStore(); await wait(1400); A.k.pickup(); await wait(800);
    await say('10/12', 'cust', 'Müşteri kuryeyi canlı takip ediyor; tahmini varış anlık güncelleniyor.', 0);
    await until(() => S.arrived); await wait(600);
    await say('11/12', 'cour', 'Kurye adreste: açık adres ve not ekranda, müşteriden teslimat kodunu alıp teslim ediyor.', 300);
    A.k.atCustomer(); await wait(1200);
    const inp = $('#kcode'); for (const d of S.order.code) { if (inp) inp.value += d; await wait(280); }
    S.k.codeVal = S.order.code; await wait(500); A.k.deliver(); await wait(2200);
    await say('12/12', 'cour', 'Hakediş otomatik işlendi: taban + km + bahşiş + bonus. İşletme panelinde net tutar hazır.', 300);
    A.k.tab('earn'); A.p.go('payouts'); await wait(1500);
    A.c.star(5); await wait(600); A.c.rate(); await wait(3800);
    caption('✓', 'Senaryo tamamlandı — artık her ekranı kendin deneyebilirsin.'); hot();
    await wait(4000);
  } catch (e) { if (e.message !== 'stop') console.error(e); }
  finish();
}
function stopPlay() { stopFlag = true; finish(); }
function finish() { playing = false; caption(); hot(); $('#playBtn').classList.remove('on'); $('#playBtn span').textContent = 'Senaryoyu Oynat'; }

/* boot */
$$('[data-logo]').forEach(n => (n.innerHTML = LOGO));
A.mode(location.hash === '#live' ? 'live' : location.hash === '#panel' ? 'panel' : 'sunum');
renderAll();
