const slides = Array.from(document.querySelectorAll('.slide'));
const counter = document.getElementById('counter');
const progressFill = document.getElementById('progressFill');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const viewToggle = document.getElementById('viewToggle');
const dotsWrap = document.getElementById('dots');
const STORAGE_KEY = 'clase4-5:slide';
let current = 0;

function showSlide(index){
  slides[current].classList.remove('active');
  current = Math.max(0, Math.min(index, slides.length - 1));
  slides[current].classList.add('active');
  window.scrollTo(0, 0);
  counter.textContent = `${current + 1} / ${slides.length}`;
  progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === slides.length - 1;
  if (dotsWrap) {
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
  }
  try { localStorage.setItem(STORAGE_KEY, String(current)); } catch(_) {}
}

// ===== Navegación por puntos (escritorio) =====
if (dotsWrap) {
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
    b.addEventListener('click', () => showSlide(i));
    dotsWrap.appendChild(b);
  });
}

function next(){ showSlide(current + 1); }
function prev(){ showSlide(current - 1); }

nextBtn.addEventListener('click', next);
prevBtn.addEventListener('click', prev);

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') next();
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp') prev();
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); setFullscreen(!document.body.classList.contains('fullscreen-mode')); }
});

// ===== Checkpoints (preguntas con feedback) =====
document.querySelectorAll('.options').forEach(group => {
  const correct = group.dataset.answer;
  const feedback = group.parentElement.querySelector('.feedback');
  const buttons = group.querySelectorAll('.option-btn');

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = true;
      });
      const chosen = String(index + 1);
      if (chosen === correct) {
        btn.classList.add('correct');
        feedback.textContent = 'Correcto. Esa opción aplica mejor la técnica trabajada.';
        feedback.className = 'feedback ok';
      } else {
        btn.classList.add('wrong');
        buttons[correct - 1].classList.add('correct');
        feedback.textContent = 'Revisalo: la opción correcta quedó marcada para retomar la idea.';
        feedback.className = 'feedback no';
      }
    });
  });
});

// ===== Clasificador interactivo (datos por técnica) =====
const techNames = {
  EV: 'Equivalencia válida',
  EI: 'Equivalencia inválida',
  LV: 'Límite válido',
  LI: 'Límite inválido',
  C:  'Conjetura de error'
};

document.querySelectorAll('.classifier-row').forEach(row => {
  const correct = row.dataset.correct;
  const result = row.querySelector('.cls-result');
  const buttons = row.querySelectorAll('.cls-options button');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.disabled = true);
      const chosen = btn.dataset.tech;
      if (chosen === correct) {
        btn.classList.add('correct');
        result.textContent = 'Correcto';
        result.className = 'cls-result ok';
      } else {
        btn.classList.add('wrong');
        const right = row.querySelector(`button[data-tech="${correct}"]`);
        if (right) right.classList.add('correct');
        result.textContent = 'Era: ' + techNames[correct];
        result.className = 'cls-result no';
      }
    });
  });
});

// ===== Modo pantalla completa =====
function setFullscreen(on) {
  document.body.classList.toggle('fullscreen-mode', on);
  viewToggle.setAttribute('aria-pressed', String(on));
  const label = viewToggle.querySelector('.vt-label');
  if (label) label.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  if (on) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
  }
}
viewToggle.addEventListener('click', () => {
  setFullscreen(!document.body.classList.contains('fullscreen-mode'));
});
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && document.body.classList.contains('fullscreen-mode')) {
    setFullscreen(false);
  }
});

// ===== Restaurar última slide =====
let initial = 0;
try {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
  if (!Number.isNaN(saved) && saved >= 0 && saved < slides.length) initial = saved;
} catch(_) {}

showSlide(initial);
