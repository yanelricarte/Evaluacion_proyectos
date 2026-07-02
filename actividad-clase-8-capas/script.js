/* ============================================================
   Trabajo en clase · Diagnóstico por capas (Unidad 2)
   Elección única con feedback + puntaje. Persistencia en localStorage.
   Se corrige solo; no hay nada para entregar.
   ============================================================ */

const STORAGE_KEY = 'perito-capas:state';

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
  const wrap = document.querySelector(`[data-section="${section}"]`);
  if (!wrap) return { ok: 0, total: 0 };
  const items = wrap.querySelectorAll('.match-item');
  let ok = 0;
  items.forEach((_, i) => { if (state[`${section}_${i}_ok`]) ok++; });
  return { ok, total: items.length };
}

function updateScores() {
  const s1 = sectionScore('parte-1');
  const s2 = sectionScore('parte-2');
  document.getElementById('score-1').textContent = `${s1.ok} / ${s1.total}`;
  document.getElementById('score-2').textContent = `${s2.ok} / ${s2.total}`;
  document.getElementById('score-total').textContent = `${s1.ok + s2.ok} / ${s1.total + s2.total}`;
}
updateScores();

// ============================================================
//  EJEMPLO RESUELTO — bloqueado con código
// ============================================================
// SEGURIDAD: el código NO está guardado en este archivo. El ejemplo viaja CIFRADO
// usando el propio código como clave; lo de abajo es solo el texto cifrado (inútil
// sin el código). El alumno escribe el código —que se da en clase— y recién ahí se
// descifra. Así puede vivir en un repo público sin filtrar ni el código ni el ejemplo.
//
// El código de cada clase NO se escribe acá: lo elegís al generar el cifrado y lo decís
// en clase. Para crear/cambiar el cifrado (otro código u otro texto), usá el generador
// local, fuera del repo: _local/generador-codigo-actividad.html
const EJEMPLO_CIFRADO =
  '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';

function descifrar(b64, clave) {
  let bin;
  try { bin = atob(b64); } catch { return ''; }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const key = new TextEncoder().encode(clave);
  if (!key.length) return '';
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ key[i % key.length];
  // fatal:true rechaza UTF-8 inválido. El sentinel OK:: solo valida los primeros
  // bytes de la clave, así que un código con typo que comparta el prefijo lo pasaría
  // y mostraría basura; el descifrado con clave errónea produce bytes UTF-8 inválidos,
  // que acá tiran y devuelven '' → se trata como código incorrecto.
  try { return new TextDecoder('utf-8', { fatal: true }).decode(out); }
  catch { return ''; }
}

const revealBtn = document.getElementById('revealBtn');
const codeInput = document.getElementById('codeInput');
const modelFb = document.getElementById('modelFeedback');

function intentarDesbloquear(codigo) {
  const txt = descifrar(EJEMPLO_CIFRADO, (codigo || '').trim());
  if (txt.startsWith('OK::')) {
    modelFb.innerHTML = txt.slice(4);
    modelFb.classList.remove('no');
    modelFb.classList.add('shown', 'revealed');
    if (codeInput) { codeInput.disabled = true; codeInput.value = '✔ desbloqueado'; }
    if (revealBtn) revealBtn.disabled = true;
    state.code = (codigo || '').trim();   // el código solo queda en ESTE navegador (no en el repo)
    saveState(state);
    return true;
  }
  return false;
}

if (revealBtn && modelFb) {
  revealBtn.addEventListener('click', () => {
    if (!intentarDesbloquear(codeInput ? codeInput.value : '')) {
      modelFb.classList.remove('ok');
      modelFb.classList.add('shown', 'no');
      modelFb.innerHTML = '<b>Código incorrecto.</b> Usá el código dado en clase (se da al final, cuando ya resolviste el diagnóstico en tu carpeta).';
    }
  });
  if (codeInput) {
    codeInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') revealBtn.click(); });
  }
  // Restaurar si ya se desbloqueó en este navegador
  if (state.code) intentarDesbloquear(state.code);
}

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
