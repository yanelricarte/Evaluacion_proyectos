/* ============================================================
   Clase 1 y 2 · Presentación e introducción al concepto de calidad
   Navegación + Pantalla completa + Quiz "¿Qué atributo falla?"
   ============================================================ */

const slides = [...document.querySelectorAll('.slide')];
const STORAGE_KEY = 'clase1:slide';
const QUIZ_KEY = 'clase1:quiz';
let current = 0;

const dotsWrap = document.getElementById('dots');
if (dotsWrap) {
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ir a la diapositiva ' + (i + 1));
    b.addEventListener('click', () => { current = i; update(); });
    dotsWrap.appendChild(b);
  });
}

function update(){
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  if (dotsWrap) {
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
  }
  slides.forEach((s) => {
    const bar = s.querySelector('.bar');
    const num = s.querySelector('.num');
    if (bar) bar.style.width = ((current + 1) / slides.length * 100) + '%';
    if (num) num.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  });
  // Reset scroll: que el título de la slide activa siempre quede a la vista.
  // El scroll lo maneja la página (cada slide es min-height:100vh).
  window.scrollTo(0, 0);
  location.hash = 'slide-' + (current + 1);
  try { localStorage.setItem(STORAGE_KEY, String(current)); } catch (_) {}
}

function nextSlide(){ current = Math.min(slides.length - 1, current + 1); update(); }
function prevSlide(){ current = Math.max(0, current - 1); update(); }

document.addEventListener('keydown', e => {
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
  if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); nextSlide(); }
  if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); prevSlide(); }
  if (e.key.toLowerCase() === 'f') { e.preventDefault(); setFullscreen(!document.body.classList.contains('fullscreen-mode')); }
});

// ===== Modo pantalla completa =====
const viewToggle = document.getElementById('viewToggle');
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

// ===== Quiz · ¿Qué atributo falla? =====
const quizState = (() => {
  try { return JSON.parse(localStorage.getItem(QUIZ_KEY) || '{}'); } catch { return {}; }
})();
const quizSummary = document.getElementById('quizSummary');
const quizScoreEl = document.getElementById('quizScore');
const quizQuestions = document.querySelectorAll('.quiz-q');

function refreshQuizSummary() {
  const total = quizQuestions.length;
  const answered = Object.keys(quizState).filter(k => k.endsWith('_ok')).length;
  if (answered === 0) {
    quizSummary?.classList.remove('shown');
    return;
  }
  const ok = Object.entries(quizState).filter(([k, v]) => k.endsWith('_ok') && v === true).length;
  if (quizScoreEl) quizScoreEl.textContent = `${ok} / ${total}`;
  if (answered === total) quizSummary?.classList.add('shown');
}

quizQuestions.forEach((q, idx) => {
  const correct = q.dataset.correct;
  const buttons = q.querySelectorAll('.quiz-options button');
  const key = `q${idx}`;

  const finalize = (chosen) => {
    buttons.forEach(b => {
      b.disabled = true;
      if (b.dataset.value === correct) b.classList.add('right');
      if (b.dataset.value === chosen && chosen !== correct) b.classList.add('wrong');
    });
    const ok = chosen === correct;
    q.classList.add('answered', ok ? 'ok' : 'no');
    quizState[key] = chosen;
    quizState[key + '_ok'] = ok;
    try { localStorage.setItem(QUIZ_KEY, JSON.stringify(quizState)); } catch {}
    refreshQuizSummary();
  };

  buttons.forEach(b => {
    b.addEventListener('click', () => {
      if (q.classList.contains('answered')) return;
      finalize(b.dataset.value);
    });
  });
  if (quizState[key]) finalize(quizState[key]);
});
refreshQuizSummary();

const quizResetBtn = document.getElementById('quizReset');
quizResetBtn?.addEventListener('click', () => {
  quizQuestions.forEach((q) => {
    q.classList.remove('answered', 'ok', 'no');
    q.querySelectorAll('.quiz-options button').forEach(b => {
      b.disabled = false;
      b.classList.remove('right', 'wrong');
    });
  });
  for (const k of Object.keys(quizState)) delete quizState[k];
  try { localStorage.removeItem(QUIZ_KEY); } catch {}
  if (quizScoreEl) quizScoreEl.textContent = '— / ' + quizQuestions.length;
  quizSummary?.classList.remove('shown');
});

// ===== Matriz de evaluación interactiva =====
const matrix = document.getElementById('matrix');
if (matrix) {
  const OPTION_NAMES = ['Google Classroom', 'Moodle', 'Sistema propio'];
  const rows = [...matrix.querySelectorAll('.matrix-row')];
  const pesosTotalEl = document.getElementById('mxPesosTotal');
  const pesosTotalCell = pesosTotalEl?.parentElement;
  const scoreTotalCells = [...matrix.querySelectorAll('.mx-score-total')];
  const warnEl = document.getElementById('mxWarn');
  const warnValEl = document.getElementById('mxWarnVal');
  const rankingEl = document.getElementById('mxRanking');
  const resetBtn = document.getElementById('mxReset');

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const num = (input, min, max) => {
    const n = parseInt(input.value, 10);
    return Number.isFinite(n) ? clamp(n, min, max) : min;
  };

  function recalculate() {
    const totals = [0, 0, 0];
    let pesosTotal = 0;
    rows.forEach(row => {
      const peso = num(row.querySelector('.mx-peso'), 0, 100);
      pesosTotal += peso;
      const scores = [...row.querySelectorAll('.mx-score')].map(i => num(i, 1, 5));
      scores.forEach((s, i) => { totals[i] += peso * s; });
    });

    const totalsNormalized = totals.map(t => pesosTotal > 0 ? t / pesosTotal : 0);

    if (pesosTotalEl) pesosTotalEl.textContent = pesosTotal;
    pesosTotalCell?.classList.toggle('invalid', pesosTotal !== 100);
    if (warnEl) {
      warnEl.classList.toggle('shown', pesosTotal !== 100);
      if (warnValEl) warnValEl.textContent = pesosTotal + '%';
    }

    const maxIdx = totalsNormalized.indexOf(Math.max(...totalsNormalized));
    scoreTotalCells.forEach((cell, i) => {
      cell.textContent = totalsNormalized[i].toFixed(2);
      cell.classList.toggle('winner', i === maxIdx && pesosTotal > 0);
    });

    const ranked = totalsNormalized
      .map((value, idx) => ({ value, idx, name: OPTION_NAMES[idx] }))
      .sort((a, b) => b.value - a.value);

    if (rankingEl) {
      rankingEl.innerHTML = ranked.map((r, pos) => {
        const widthPct = clamp((r.value / 5) * 100, 0, 100);
        return `
          <div class="mx-rank-bar ${pos === 0 ? 'first' : ''}">
            <div class="mx-rank-name"><span class="mx-rank-pos">${pos + 1}</span> ${r.name}</div>
            <div class="mx-rank-track"><div class="mx-rank-fill" style="width:${widthPct}%"></div></div>
            <div class="mx-rank-value">${r.value.toFixed(2)} / 5</div>
          </div>
        `;
      }).join('');
    }
  }

  matrix.addEventListener('input', e => {
    if (e.target.matches('.mx-peso, .mx-score')) recalculate();
  });

  resetBtn?.addEventListener('click', () => {
    rows.forEach(row => {
      const [peso, s0, s1, s2] = row.dataset.defaults.split(',').map(Number);
      row.querySelector('.mx-peso').value = peso;
      const scores = row.querySelectorAll('.mx-score');
      scores[0].value = s0;
      scores[1].value = s1;
      scores[2].value = s2;
    });
    recalculate();
  });

  recalculate();
}

// ===== Restauración: hash > localStorage =====
const h = location.hash.match(/slide-(\d+)/);
if (h) {
  current = Math.max(0, Math.min(slides.length - 1, parseInt(h[1]) - 1));
} else {
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    if (!Number.isNaN(saved) && saved >= 0 && saved < slides.length) current = saved;
  } catch (_) {}
}
update();
