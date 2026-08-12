/* ============================================================
   Trabajo en clase · Auditar al agente (Unidad 2 · Parte 2)
   Elección única con feedback + puntaje por sección. Persistencia en localStorage.
   Se corrige solo; no hay nada para entregar. Cierra con registro en la carpeta.
   ============================================================ */

const STORAGE_KEY = 'auditar-agente:state';
const SECTIONS = ['parte-2', 'parte-3'];

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
