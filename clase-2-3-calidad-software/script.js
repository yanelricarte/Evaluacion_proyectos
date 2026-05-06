const slides = document.getElementById('slides');
const slideEls = document.querySelectorAll('.slide');
const total = slideEls.length;
const STORAGE_KEY = 'clase2-3:slide';
let current = 0;

const dotsWrap = document.getElementById('dots');
for (let i = 0; i < total; i++) {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
}
const dots = document.querySelectorAll('.dot');

function update(){
  slides.style.transform = `translateX(-${current * 100}vw)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  try { localStorage.setItem(STORAGE_KEY, String(current)); } catch(_) {}
}

function goTo(i){
  current = Math.max(0, Math.min(total - 1, i));
  update();
}

document.getElementById('prevBtn').addEventListener('click', () => goTo(current - 1));
document.getElementById('nextBtn').addEventListener('click', () => goTo(current + 1));

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') goTo(current + 1);
  if (e.key === 'ArrowLeft'  || e.key === 'PageUp')   goTo(current - 1);
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); setFullscreen(!document.body.classList.contains('fullscreen-mode')); }
});

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
        feedback.textContent = 'Correcto. Esa opción representa mejor el concepto trabajado.';
      } else {
        btn.classList.add('wrong');
        buttons[correct - 1].classList.add('correct');
        feedback.textContent = 'Revisalo: la opción correcta quedó marcada para retomar la idea.';
      }
    });
  });
});

// ===== Modo pantalla completa =====
const viewToggle = document.getElementById('viewToggle');
function setFullscreen(on) {
  document.body.classList.toggle('fullscreen-mode', on);
  if (viewToggle) {
    viewToggle.setAttribute('aria-pressed', String(on));
    const label = viewToggle.querySelector('.vt-label');
    if (label) label.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  }
  if (on) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
  }
}
if (viewToggle) {
  viewToggle.addEventListener('click', () => {
    setFullscreen(!document.body.classList.contains('fullscreen-mode'));
  });
}
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && document.body.classList.contains('fullscreen-mode')) {
    setFullscreen(false);
  }
});

// ===== Restaurar última slide =====
try {
  const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
  if (!Number.isNaN(saved) && saved >= 0 && saved < total) current = saved;
} catch(_) {}
update();
