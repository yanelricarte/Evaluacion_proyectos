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

// ===== Ejercicio de producción (feedback heurístico) =====
const VAGUE_WORDS = /\b(buena?|bonit[oa]|lind[oa]|f[áa]cil|r[áa]pid[oa]|c[óo]modo|agradable|sencill[oa]|amigable|funciona\s+bien|anda\s+bien)\b/gi;
const ACTION_VERBS = /\b(muestra|impide|registra|permite|bloquea|confirma|solicita|valida|genera|emite|rechaza|env[íi]a|guarda|elimina|edita|cancela|verifica|notifica|carga|filtra|ordena|exporta|imprime|comprueba|contabiliza)\b/gi;
const PROD_KEY = 'clase2-3:prod-login';

const prodInput = document.getElementById('prod-login');
const prodBtn = document.getElementById('prod-login-btn');
const prodFb = document.getElementById('prod-login-feedback');

if (prodInput && prodBtn && prodFb) {
  try {
    const saved = localStorage.getItem(PROD_KEY);
    if (saved) prodInput.value = saved;
  } catch (_) {}
  prodInput.addEventListener('input', () => {
    try { localStorage.setItem(PROD_KEY, prodInput.value); } catch (_) {}
  });

  prodBtn.addEventListener('click', () => {
    const text = (prodInput.value || '').trim();
    prodFb.classList.remove('ok', 'partial', 'no');
    if (!text) {
      prodFb.classList.add('no');
      prodFb.innerHTML = '<b>No escribiste todavía.</b> Probá con un verbo concreto: <i>"el sistema impide…"</i> o <i>"el sistema muestra…"</i>.';
      return;
    }
    const vague = text.match(VAGUE_WORDS) || [];
    const verbs = text.match(ACTION_VERBS) || [];
    const checks = [];

    if (verbs.length) checks.push(`<li>✔ Usa un verbo observable (<b>${[...new Set(verbs.map(v => v.toLowerCase()))].join(', ')}</b>).</li>`);
    else checks.push('<li>✘ No detecté un verbo observable. Probá con: <i>muestra, impide, registra, permite, bloquea, confirma…</i></li>');

    if (!vague.length) checks.push('<li>✔ No usa palabras vagas ("bueno", "fácil", "lindo").</li>');
    else checks.push(`<li>✘ Hay palabras vagas (<b>${[...new Set(vague.map(v => v.toLowerCase()))].join(', ')}</b>). No permiten verificar si el ítem se cumple o no.</li>`);

    if (text.length < 20) checks.push('<li>✘ Es muy corto. Describí <b>qué hace</b> el sistema y <b>en qué condición</b>.</li>');
    else checks.push('<li>✔ Describe qué hace y en qué condición.</li>');

    const score = (verbs.length ? 1 : 0) + (!vague.length ? 1 : 0) + (text.length >= 20 ? 1 : 0);
    prodFb.classList.add(score === 3 ? 'ok' : score >= 2 ? 'partial' : 'no');
    prodFb.innerHTML = `<b>Devolución automática.</b> Es un primer filtro — la versión final la decidimos entre todos.<ul>${checks.join('')}</ul>`;
  });
}

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
