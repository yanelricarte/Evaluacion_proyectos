/* ============================================================
   Clase 7 · Cierre de Unidad 1
   Navegación + Pantalla completa + V/F validadoras
   Auto-test + Metacognición con persistencia en localStorage
   ============================================================ */

const slides = [...document.querySelectorAll('.slide')];
const STORAGE_KEY = 'clase7:slide';
const META_KEY = 'clase7:meta';
const QUIZ_KEY = 'clase7:quiz';
let current = 0;

function update(){
  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  // Al cambiar de slide, llevar la página al tope
  window.scrollTo(0, 0);
  // Sincronizar los puntos de navegación (escritorio)
  if (typeof dotsWrap !== 'undefined' && dotsWrap) {
    [...dotsWrap.children].forEach((d, i) => d.classList.toggle('active', i === current));
  }
  slides.forEach((s) => {
    const bar = s.querySelector('.bar');
    const num = s.querySelector('.num');
    if (bar) bar.style.width = ((current + 1) / slides.length * 100) + '%';
    if (num) num.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
  });
  location.hash = 'slide-' + (current + 1);
  try { localStorage.setItem(STORAGE_KEY, String(current)); } catch (_) {}
}

function nextSlide(){ current = Math.min(slides.length - 1, current + 1); update(); }
function prevSlide(){ current = Math.max(0, current - 1); update(); }

document.addEventListener('keydown', e => {
  // No navegar con flechas si está escribiendo en textarea
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

// ===== Tarjetas V/F validadoras =====
document.querySelectorAll('.tf-card').forEach(card => {
  const correct = card.dataset.correct;
  const buttons = card.querySelectorAll('.vf button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      buttons.forEach(b => b.disabled = true);
      const chosen = btn.dataset.choice;
      btn.classList.add('chosen');
      const ok = chosen === correct;
      btn.classList.add(ok ? 'right' : 'wrong');
      if (!ok) {
        const right = card.querySelector(`.vf button[data-choice="${correct}"]`);
        if (right) right.classList.add('right');
      }
      card.classList.add('answered', ok ? 'ok' : 'no');
    });
  });
});

// ===== Auto-test integrador =====
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
    quizSummary.classList.remove('shown');
    return;
  }
  const ok = Object.entries(quizState).filter(([k, v]) => k.endsWith('_ok') && v === true).length;
  quizScoreEl.textContent = `${ok} / ${total}`;
  if (answered === total) quizSummary.classList.add('shown');
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

// ===== Metacognición con autosave =====
const metaState = (() => {
  try { return JSON.parse(localStorage.getItem(META_KEY) || '{}'); } catch { return {}; }
})();
const metaStatus = document.getElementById('metaStatus');
let metaSaveTimer = null;

document.querySelectorAll('.meta-card textarea').forEach(ta => {
  if (metaState[ta.id]) ta.value = metaState[ta.id];
  ta.addEventListener('input', () => {
    metaState[ta.id] = ta.value;
    clearTimeout(metaSaveTimer);
    metaStatus.textContent = 'Guardando…';
    metaSaveTimer = setTimeout(() => {
      try { localStorage.setItem(META_KEY, JSON.stringify(metaState)); } catch {}
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      metaStatus.textContent = `Guardado a las ${hh}:${mm}. Tus respuestas quedan solo en tu navegador.`;
    }, 400);
  });
});

// ===== Exportación de respuestas (descargar / copiar) =====
function buildExportText() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');

  let out = '';
  out += '═══════════════════════════════════════════════\n';
  out += '  CIERRE DE UNIDAD 1 — Evaluación de Proyectos\n';
  out += `  Fecha: ${dd}/${mm}/${yyyy} ${hh}:${mi}\n`;
  out += '═══════════════════════════════════════════════\n\n';

  // Auto-test
  out += '── AUTO-TEST INTEGRADOR ──\n\n';
  const quizQs = document.querySelectorAll('.quiz-q');
  let okCount = 0;
  quizQs.forEach((q, idx) => {
    const key = `q${idx}`;
    const chosen = quizState[key];
    const correct = q.dataset.correct;
    const questionText = q.querySelector('p').textContent.trim();
    const ok = quizState[key + '_ok'];
    if (ok) okCount++;
    out += `${questionText}\n`;
    if (chosen) {
      const chosenBtn = q.querySelector(`.quiz-options button[data-value="${chosen}"]`);
      out += `  Tu respuesta: ${chosenBtn ? chosenBtn.textContent.trim() : chosen}  ${ok ? '✓' : '✗'}\n`;
      if (!ok) {
        const correctBtn = q.querySelector(`.quiz-options button[data-value="${correct}"]`);
        out += `  Correcta: ${correctBtn ? correctBtn.textContent.trim() : correct}\n`;
      }
    } else {
      out += '  (sin responder)\n';
    }
    out += '\n';
  });
  out += `Puntaje: ${okCount} / ${quizQs.length}\n\n`;

  // Metacognición
  out += '── METACOGNICIÓN ──\n\n';
  const metaQuestions = [
    ['meta1', '¿Qué concepto te quedó más claro de la unidad?'],
    ['meta2', '¿Qué tema te cuesta más y querés repasar antes de la evaluación?'],
    ['meta3', '¿Qué ejemplo concreto recordás que te ayudó a entender?'],
    ['meta4', '¿Qué duda querés traer a la puesta en común?']
  ];
  metaQuestions.forEach(([id, label]) => {
    const value = (document.getElementById(id)?.value || '').trim();
    out += `${label}\n`;
    out += `  ${value || '(sin responder)'}\n\n`;
  });

  out += '═══════════════════════════════════════════════\n';
  out += 'Guardalo en Drive, mandátelo por mail o pegalo donde\n';
  out += 'lo puedas recuperar. Si cambiás de navegador o PC,\n';
  out += 'las respuestas guardadas localmente se pierden.\n';
  out += '═══════════════════════════════════════════════\n';
  return out;
}

function flashStatus(text) {
  const el = document.getElementById('exportStatus');
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(flashStatus._t);
  flashStatus._t = setTimeout(() => el.classList.remove('show'), 2400);
}

document.getElementById('btnDownload')?.addEventListener('click', () => {
  const text = buildExportText();
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}`;
  const a = document.createElement('a');
  a.href = url;
  a.download = `cierre-unidad-1_${stamp}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  flashStatus('Descargado');
});

document.getElementById('btnCopy')?.addEventListener('click', async () => {
  const text = buildExportText();
  try {
    await navigator.clipboard.writeText(text);
    flashStatus('Copiado al portapapeles');
  } catch {
    // Fallback: select+copy via textarea
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); flashStatus('Copiado al portapapeles'); }
    catch { flashStatus('No se pudo copiar'); }
    document.body.removeChild(ta);
  }
});

// ===== Navegación por puntos (escritorio) =====
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
