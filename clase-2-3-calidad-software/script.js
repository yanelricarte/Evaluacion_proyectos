// ===== Modo de presentación: async (por defecto) vs presencial (?presencial) =====
// Link normal  → modo async: termina en la Autoevaluación, el TP2 no aparece.
// ?presencial  → modo presencial: se agregan las slides del TP2.
const PRESENCIAL = /presencial/i.test(location.search) || /presencial/i.test(location.hash);
document.body.dataset.modo = PRESENCIAL ? 'presencial' : 'async';
if (!PRESENCIAL) {
  document.querySelectorAll('.slide[data-track="presencial"]').forEach(s => s.remove());
}

const slides = document.getElementById('slides');
const slideEls = document.querySelectorAll('.slide');
const total = slideEls.length;
const STORAGE_KEY = 'clase2-3:slide:' + (PRESENCIAL ? 'p' : 'a');
let current = 0;

// Recalcular los contadores "n / total" según las slides visibles del modo actual.
slideEls.forEach((s, i) => {
  const counter = s.querySelector('.slide-count');
  if (counter) counter.textContent = `${i + 1} / ${total}`;
});

const dotsWrap = document.getElementById('dots');
for (let i = 0; i < total; i++) {
  const d = document.createElement('button');
  d.className = 'dot' + (i === 0 ? ' active' : '');
  d.setAttribute('aria-label', 'Ir a slide ' + (i + 1));
  d.addEventListener('click', () => goTo(i));
  dotsWrap.appendChild(d);
}
const dots = document.querySelectorAll('.dot');

// Región para anunciar el cambio de slide a lectores de pantalla
const liveRegion = document.createElement('div');
liveRegion.className = 'sr-only';
liveRegion.setAttribute('aria-live', 'polite');
document.body.appendChild(liveRegion);

function update(){
  slides.style.transform = `translateX(-${current * 100}vw)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
  // Las slides fuera de pantalla no deben ser focusables ni leídas
  slideEls.forEach((s, i) => {
    const off = i !== current;
    s.toggleAttribute('inert', off);
    s.setAttribute('aria-hidden', String(off));
  });
  const title = slideEls[current].querySelector('h1, h2');
  liveRegion.textContent = `Slide ${current + 1} de ${total}` + (title ? ': ' + title.textContent.trim() : '');
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
  const correct = parseInt(group.dataset.answer, 10);
  const explain = group.dataset.explain || '';
  const feedback = group.parentElement.querySelector('.feedback');
  const buttons = Array.from(group.querySelectorAll('.option-btn'));
  let wrongAttempts = 0;
  let solved = false;

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      if (solved) return;
      buttons.forEach(b => b.classList.remove('correct', 'wrong'));
      const why = btn.dataset.why || '';

      // Acierto
      if (index + 1 === correct) {
        solved = true;
        btn.classList.add('correct');
        buttons.forEach(b => { b.disabled = true; });
        feedback.className = 'feedback ok';
        feedback.innerHTML = '<b>¡Bien!</b> ' + explain;
        return;
      }

      // Error: explicar por qué esa opción no va; recién al 3.er intento se revela la correcta
      wrongAttempts++;
      btn.classList.add('wrong');
      feedback.className = 'feedback no';

      if (wrongAttempts >= 3) {
        solved = true;
        buttons[correct - 1].classList.add('correct');
        buttons.forEach(b => { b.disabled = true; });
        feedback.innerHTML = (why ? why + ' ' : '') + 'La correcta es la marcada: ' + explain;
      } else {
        feedback.innerHTML = why || 'Esa no encaja. Volvé a leer la pregunta y probá de nuevo.';
      }
    });
  });
});

// ===== Ejercicio de producción (feedback heurístico) =====
const VAGUE_WORDS = /\b(buena?|bonit[oa]|lind[oa]|f[áa]cil|r[áa]pid[oa]|c[óo]modo|agradable|sencill[oa]|amigable|funciona\s+bien|anda\s+bien)\b/gi;
const ACTION_VERBS = /\b(muestra|impide|registra|permite|bloquea|confirma|solicita|valida|genera|emite|rechaza|env[íi]a|guarda|elimina|edita|cancela|verifica|notifica|carga|filtra|ordena|exporta|imprime|comprueba|contabiliza|calcula|suma|resta|totaliza|devuelve|asigna)\b/gi;
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

// ===== Actividad: clasificar errores (drag & drop + tap) =====
(function () {
  const pool = document.getElementById('ddPool');
  if (!pool) return;

  const drops = Array.from(document.querySelectorAll('.dd-drop'));
  const cards = Array.from(document.querySelectorAll('.dd-card'));
  const checkBtn = document.getElementById('ddCheck');
  const resetBtn = document.getElementById('ddReset');
  const score = document.getElementById('ddScore');
  const zones = [...drops, pool];
  let selected = null;

  function clearSelection() {
    if (selected) { selected.classList.remove('selected'); selected.setAttribute('aria-pressed', 'false'); }
    selected = null;
    zones.forEach(z => z.classList.remove('target'));
  }

  function resetScore() {
    score.textContent = '';
    score.className = 'dd-score';
  }

  function place(zone, card) {
    zone.appendChild(card);
    card.classList.remove('correct', 'wrong');
    clearSelection();
    resetScore();
  }

  // --- Selección por tap/click/teclado (táctil, mouse y teclado) ---
  cards.forEach(card => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => {
      if (selected === card) { clearSelection(); return; }
      clearSelection();
      selected = card;
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      zones.forEach(z => z.classList.add('target'));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });

    // --- Arrastre nativo (mouse en escritorio) ---
    card.addEventListener('dragstart', (e) => {
      card.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', '');
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
  });

  zones.forEach(zone => {
    zone.setAttribute('tabindex', '0');
    zone.addEventListener('click', (e) => {
      if (selected && !e.target.closest('.dd-card')) place(zone, selected);
    });
    zone.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && selected && e.target === zone) { e.preventDefault(); place(zone, selected); }
    });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('over');
      const dragging = document.querySelector('.dd-card.dragging');
      if (dragging) place(zone, dragging);
    });
  });

  checkBtn.addEventListener('click', () => {
    let ok = 0, placed = 0;
    cards.forEach(card => {
      card.classList.remove('correct', 'wrong');
      const drop = card.closest('.dd-drop');
      if (!drop) return;
      placed++;
      if (drop.dataset.cat === card.dataset.cat) { card.classList.add('correct'); ok++; }
      else card.classList.add('wrong');
    });

    resetScore();
    if (placed < cards.length) {
      score.classList.add('partial');
      score.innerHTML = `Te faltan tarjetas por ubicar (${placed}/${cards.length}). Colocá las seis antes de verificar.`;
      return;
    }
    if (ok === cards.length) {
      score.classList.add('ok');
      score.innerHTML = `<b>¡Las seis bien! (${ok}/${cards.length})</b> Distinguís omisión, excedente e incorrecto.`;
    } else {
      score.classList.add('no');
      score.innerHTML = `<b>${ok}/${cards.length} correctas.</b> Las marcadas en rojo están en la columna equivocada. Pista: <i>omisión</i> = falta algo · <i>excedente</i> = sobra algo · <i>incorrecto</i> = está pero funciona mal.`;
    }
  });

  resetBtn.addEventListener('click', () => {
    cards.forEach(card => { card.classList.remove('correct', 'wrong'); pool.appendChild(card); });
    clearSelection();
    resetScore();
  });
})();

// ===== Autoevaluación de la unidad (se corrige sola, sin entrega) =====
(function () {
  const quiz = document.getElementById('aeQuiz');
  if (!quiz) return;

  const questions = Array.from(quiz.querySelectorAll('.ae-q'));
  const checkBtn = document.getElementById('aeCheck');
  const resetBtn = document.getElementById('aeReset');
  const score = document.getElementById('aeScore');

  function resetScore() { score.textContent = ''; score.className = 'dd-score'; }

  questions.forEach(q => {
    const opts = Array.from(q.querySelectorAll('.ae-opt'));
    opts.forEach(opt => {
      opt.addEventListener('click', () => {
        opts.forEach(o => o.classList.remove('chosen', 'correct', 'wrong'));
        opt.classList.add('chosen');
        q.dataset.chosen = String(opts.indexOf(opt) + 1);
        q.classList.remove('done');
        resetScore();
      });
    });
  });

  checkBtn.addEventListener('click', () => {
    let ok = 0, answered = 0;
    const notes = [];
    questions.forEach((q, i) => {
      const opts = Array.from(q.querySelectorAll('.ae-opt'));
      opts.forEach(o => o.classList.remove('correct', 'wrong'));
      const chosen = parseInt(q.dataset.chosen || '0', 10);
      const correct = parseInt(q.dataset.answer, 10);
      if (chosen) answered++;
      if (chosen === correct) { opts[correct - 1].classList.add('correct'); ok++; }
      else {
        if (chosen) opts[chosen - 1].classList.add('wrong');
        if (q.dataset.explain) notes.push(`<li><b>Pregunta ${i + 1}:</b> ${q.dataset.explain}</li>`);
      }
      q.classList.add('done');
    });

    resetScore();
    const notesHtml = notes.length ? `<ul>${notes.join('')}</ul>` : '';
    if (answered < questions.length) {
      score.classList.add('partial');
      score.innerHTML = `Respondiste ${answered}/${questions.length}. Completá las que faltan. Mientras, repasá esto:${notesHtml}`;
      return;
    }
    const cls = ok === questions.length ? 'ok' : ok >= Math.ceil(questions.length * 0.6) ? 'partial' : 'no';
    const msg = ok === questions.length
      ? 'Dominás la unidad. ¡Listo para el Trabajo Práctico!'
      : 'Releé el feedback de cada una y volvé a intentarlo:';
    score.classList.add(cls);
    score.innerHTML = `<b>${ok}/${questions.length} correctas.</b> ${msg}${notesHtml}`;
  });

  resetBtn.addEventListener('click', () => {
    questions.forEach(q => {
      q.classList.remove('done');
      delete q.dataset.chosen;
      q.querySelectorAll('.ae-opt').forEach(o => o.classList.remove('chosen', 'correct', 'wrong'));
    });
    resetScore();
  });
})();

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
