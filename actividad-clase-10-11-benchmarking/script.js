/* ============================================================
   Trabajo en clase · Benchmarking y uso crítico de IA (Unidad 2)
   Elección única con feedback + puntaje por sección. Persistencia en localStorage.
   El protocolo final se adjunta en Classroom para su corrección.
   ============================================================ */

const STORAGE_KEY = 'bench-ia-eval:state';
const SECTIONS = ['parte-1', 'parte-2', 'parte-3'];

function loadState() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}
const state = loadState();

// ===== Items de diagnóstico (elección única) =====
document.querySelectorAll('.match-item').forEach((item) => {
  const section = item.closest('[data-section]')?.dataset.section || 'x';
  const idx = [...item.parentElement.children].filter(c => c.classList.contains('match-item')).indexOf(item);
  const key = `${section}_${idx}`;
  const correct = item.dataset.correct;
  const buttons = item.querySelectorAll('.choices button');

  const finalize = (chosen) => {
    buttons.forEach(b => {
      b.disabled = true;
      if (b.dataset.value === correct) b.classList.add('right');
      if (b.dataset.value === chosen && chosen !== correct) b.classList.add('wrong');
    });
    const ok = chosen === correct;
    item.classList.add('answered', ok ? 'ok' : 'no');
    state[key] = chosen;
    state[key + '_ok'] = ok;
    saveState(state);
    updateScores();
  };

  buttons.forEach(b => {
    b.addEventListener('click', () => {
      if (item.classList.contains('answered')) return;
      finalize(b.dataset.value);
    });
  });

  if (state[key]) finalize(state[key]);
});

// ===== Puntaje por sección =====
function sectionScore(section) {
  const wrap = document.querySelector(`[data-section="${section}"].match-list`);
  if (!wrap) return { ok: 0, total: 0 };
  const items = wrap.querySelectorAll('.match-item');
  let ok = 0;
  items.forEach((_, i) => { if (state[`${section}_${i}_ok`]) ok++; });
  return { ok, total: items.length };
}

function updateScores() {
  let totOk = 0, totN = 0;
  SECTIONS.forEach((section, i) => {
    const { ok, total } = sectionScore(section);
    totOk += ok; totN += total;
    const el = document.getElementById('score-' + (i + 1));
    if (el) el.textContent = `${ok} / ${total}`;
  });
  const t = document.getElementById('score-total');
  if (t) t.textContent = `${totOk} / ${totN}`;
}
updateScores();

// ===== Reiniciar (modal) =====
const resetModal = document.getElementById('resetModal');
document.getElementById('btnReset')?.addEventListener('click', () => { resetModal.hidden = false; });
document.getElementById('modalCancel')?.addEventListener('click', () => { resetModal.hidden = true; });
document.getElementById('modalConfirm')?.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !resetModal.hidden) resetModal.hidden = true;
});

// ===== Recalcular =====
function flashStatus(text) {
  const el = document.getElementById('exportStatus');
  if (!el) return;
  el.textContent = text;
  el.classList.add('show');
  clearTimeout(flashStatus._t);
  flashStatus._t = setTimeout(() => el.classList.remove('show'), 2400);
}
document.getElementById('recompute')?.addEventListener('click', () => {
  updateScores();
  flashStatus('Puntaje recalculado');
});

// ===== Arrastre: armar las partes de un prompt =====
(function () {
  const pool = document.getElementById('dndPool');
  if (!pool) return;
  const zones = [...document.querySelectorAll('#promptDnd .drop-zone')];
  const chips = [...document.querySelectorAll('#promptDnd .drag-chip')];
  const score = document.getElementById('dndScore');
  let selected = null;

  function place(target, chip) {
    target.appendChild(chip);
    chip.classList.remove('selected', 'placed-ok', 'placed-no');
    selected = null;
    chips.forEach(c => c.classList.remove('selected'));
    if (score) { score.className = 'dd-score'; score.textContent = ''; }
  }

  chips.forEach(chip => {
    chip.addEventListener('dragstart', e => { chip.classList.add('dragging'); e.dataTransfer.setData('text/plain', ''); });
    chip.addEventListener('dragend', () => chip.classList.remove('dragging'));
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      if (selected === chip) { chip.classList.remove('selected'); selected = null; return; }
      chips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected'); selected = chip;
    });
  });

  [pool, ...zones].forEach(z => {
    z.addEventListener('dragover', e => { e.preventDefault(); if (z.classList.contains('drop-zone')) z.classList.add('over'); });
    z.addEventListener('dragleave', () => z.classList.remove('over'));
    z.addEventListener('drop', e => {
      e.preventDefault(); z.classList.remove('over');
      const dragged = document.querySelector('#promptDnd .dragging');
      if (dragged) place(z, dragged);
    });
    z.addEventListener('click', () => { if (selected) place(z, selected); });
  });

  document.getElementById('dndCheck')?.addEventListener('click', () => {
    let ok = 0;
    chips.forEach(c => c.classList.remove('placed-ok', 'placed-no'));
    zones.forEach(z => {
      [...z.querySelectorAll('.drag-chip')].forEach(c => {
        if (c.dataset.cat === z.dataset.cat) { c.classList.add('placed-ok'); ok++; }
        else c.classList.add('placed-no');
      });
    });
    if (!score) return;
    score.className = 'dd-score ' + (ok === chips.length ? 'ok' : 'no');
    score.textContent = `${ok}/${chips.length} en su lugar.` +
      (ok === chips.length ? ' ¡Prompt bien armado!' : ' Revisá las marcadas en rojo.');
  });

  document.getElementById('dndReset')?.addEventListener('click', () => {
    chips.forEach(c => { c.classList.remove('placed-ok', 'placed-no', 'selected'); pool.appendChild(c); });
    selected = null;
    if (score) { score.className = 'dd-score'; score.textContent = ''; }
  });
})();
