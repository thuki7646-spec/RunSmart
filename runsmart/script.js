// ===== Данные каталога =====
const DESC = 'Для первых шагов в тренировках, основанных на сердечном ритме';
const PHOTO = 'images/product.png';
const PHOTO_FB = 'https://www.figma.com/api/mcp/asset/bd4c1d40-c686-4f7b-a7bf-041bc62fd37e.png';
const FEATURES = [
  'Вы услышите звуковое оповещение о нужном пульсе во время тренировки;',
  'Вы увидите информативный графический индикатор целевых тренировочных зон пульса;',
  'Также Вы увидите информацию о расходе калорий за тренировку;',
  'Вы сможете посмотреть данные по 10 тренировкам.'
];
const BASE = [
  { name: 'Пульсометр Polar FT1',  old: '4 750 руб.', price: '4 500 руб.' },
  { name: 'Пульсометр Suunto M2',  old: '6 690 руб.', price: '6 641 руб.' },
  { name: 'Пульсометр Polar FT7',  old: '7 390 руб.', price: '7 021 руб.' },
  { name: 'Пульсометр Polar FT1',  old: '4 750 руб.', price: '4 500 руб.' },
  { name: 'Пульсометр Suunto M2',  old: '6 690 руб.', price: '6 641 руб.' },
  { name: 'Пульсометр Polar FT4',  old: '6 690 руб.', price: '6 641 руб.' }
];
// Пока в макете один набор товаров — для вкладок меняем только порядок
const CATALOG = {
  fitness:   BASE,
  run:       [...BASE].reverse(),
  triathlon: [BASE[2], BASE[5], BASE[1], BASE[0], BASE[4], BASE[3]]
};

// ===== Рендер каталога =====
const cardsEl = document.getElementById('cards');

function renderCards(cat) {
  cardsEl.innerHTML = CATALOG[cat].map(p => `
    <div class="card">
      <div class="card__top">
        <div class="card__front">
          <img class="card__photo" src="${PHOTO}" data-fallback="${PHOTO_FB}" onerror="this.onerror=null;this.src=this.dataset.fallback" alt="${p.name}">
          <div class="card__title">${p.name}</div>
          <p class="card__desc">${DESC}</p>
          <button class="card__more" data-flip>ПОДРОБНЕЕ</button>
        </div>
        <div class="card__back">
          <ul>${FEATURES.map(f => `<li>${f}</li>`).join('')}</ul>
          <button class="card__more" data-flip>НАЗАД</button>
        </div>
      </div>
      <div class="card__foot">
        <div><span class="price__old">${p.old}</span><span class="price__new">${p.price}</span></div>
        <button class="btn" data-buy="${p.name}">Купить</button>
      </div>
    </div>`).join('');
}

document.getElementById('tabs').addEventListener('click', e => {
  const tab = e.target.closest('.tab');
  if (!tab) return;
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
  renderCards(tab.dataset.cat);
});

cardsEl.addEventListener('click', e => {
  const flip = e.target.closest('[data-flip]');
  if (flip) flip.closest('.card').classList.toggle('flipped');
  const buy = e.target.closest('[data-buy]');
  if (buy) {
    document.getElementById('orderName').textContent = buy.dataset.buy;
    openModal('modal-order');
  }
});

renderCards('fitness');

// ===== Карусель =====
const SLIDE = 'images/slide-3.png';
const SLIDE_FB = 'https://www.figma.com/api/mcp/asset/3320f9b1-b007-464a-a077-c79f311eec26.png';
// Слайды 1 и 2 лежат в папке images/
const slides = ['images/slide-1.png', 'images/slide-2.png', SLIDE];
let current = 0;
const track = document.getElementById('track');
const dots = document.getElementById('dots');
track.innerHTML = slides.map((s, i) => `<img src="${s}" ${s === SLIDE ? `data-fallback="${SLIDE_FB}" onerror="this.onerror=null;this.src=this.dataset.fallback"` : ''} alt="Слайд ${i + 1}">`).join('');
dots.innerHTML = slides.map(() => '<i></i>').join('');
function showSlide(i) {
  current = (i + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  [...dots.children].forEach((d, k) => d.classList.toggle('active', k === current));
}
document.querySelector('.carousel__arrow--prev').addEventListener('click', () => showSlide(current - 1));
document.querySelector('.carousel__arrow--next').addEventListener('click', () => showSlide(current + 1));
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') showSlide(current - 1);
  if (e.key === 'ArrowRight') showSlide(current + 1);
});
showSlide(0);

// ===== Модальные окна =====
const overlay = document.getElementById('overlay');

function openModal(id) {
  overlay.hidden = false;
  overlay.querySelectorAll('.modal').forEach(m => m.hidden = m.id !== id);
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  overlay.hidden = true;
  document.body.style.overflow = '';
}

document.addEventListener('click', e => {
  const opener = e.target.closest('[data-open]');
  if (opener) openModal(opener.dataset.open);
  if (e.target.closest('[data-close]') || e.target === overlay) closeModal();
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ===== Формы =====
document.querySelectorAll('[data-lead]').forEach(form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    // Здесь можно отправить данные на сервер:
    // fetch('/api/lead', { method: 'POST', body: new FormData(form) });
    form.reset();
    openModal('modal-thanks');
  });
});
