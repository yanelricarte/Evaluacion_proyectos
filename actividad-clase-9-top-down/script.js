/* ============================================================
   Trabajo en clase · Evaluar con top-down (Unidad 2)
   Elección única con feedback + puntaje. Persistencia en localStorage.
   Se corrige solo; no hay nada para entregar.
   ============================================================ */

const STORAGE_KEY = 'topdown-eval:state';

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
  'OyRKXlMVUHdaV1sEAx9EHRIdR1VeQhtPkuT7VzpdQB9SGxgeRBwYDEBVEloVTyAnTxMLXhBeVxYAAgUbGBxbXw4ZFlF6WAAbUDgQEgoYBk5YDUk+U0NdFkVPstNPMgISRF1SG09YFB0YHvGDQV8AAFlKU1gMDBB+V1Q/M0QcEk5HQ1MWBA4CBU8HHF1XQFcZDgJEFlcPUEJbRFQZERYGGB0SXlNAEQgRAAAFC0EQUxYYDlASCg1AEvKZcAEBEw0AGQ8SUltTGq3LRBweCVxZVF8XDlAVGhJOXF8SRRFPBBYOFQsSWFNVHQoeAABXC0FfHBZIBk40HRIJR15GV05TXw1RV6yNU0dbBAMVRAoECxJAQFkErMMXBgMBElhdT0tPkuL9VyBdChJXFh0VRBsYCl0QXlMaGx9KU1gCWw44FlRTHA1RSwwMYFNFG09CRK3ATn5fQRYWAx8VGhIdHAwdVEpPIwEfFhxdEEFZEhsHBR0SThpRQkYHT1tEHB4dRlVfV1QAAAEdFhpbRl0fVAsVRAMWTkJRQEIRTxanwgQHUVESHhwOAgAYFhxXEBkWEgYCCRgWHFcZHBYxA1AXABEaRVFAU1QKAxCs1k5TU0ZDFQMZHg4TARJJEloVTxwBAQMHRkVWFhUfERYKFAsSU11YVAwFBQMGG1tVQBYEHR8DHRYDUxwSWBtPEwsBVxtcXxJFGwMfRI3x/BJDXUUEChMMAFcKVxBeV1QfERYbEk5U859FHQwRSlNYAlsOOBZUUxwNUUsMDGBTRRtPQ0StwE53XBJVGwIACwESAEZVHApbDU5EPRIYW0NdFhgOUBQOBRpXEFT12RwZBw5NTl5REmQ1IlABHFccU0pdWBUNHAFDVx5XQl0WEQNQAAYEDV0QV0VUAhUHrNYAW1NdGlQZGQEFGE5LEFpXFwpQFhoeCl0QU1pUAxUBHVlOd1wSVQEKHAgAVwpXEFBZAAocCA5XC0FE8ZdUCh5EAxZOUVFCV1QLFURTFVBaUUBSAw4CAVNYDAwQGlMYTxQNHBQBGx4OGRgGTm5PV1JeWQwKFlEgBRwYTgYQ8IFUJh4QChAcU1Nb9ccBXlhAFVASZkdTGBkfRA5XAlMQQkQRCAUKGxZOW15bVR0OHF5PGw8SYHEWB6zdRBweHERVEkYVHRFEChtOXlFQWQYOBAsdHgEJEFxZVAcRHU8GG1cQUVcZDRkFHRsPHBAOVEo9FQcAGgtcVFNVHazDClVLQVAOEkQRCh0UAxYUU0ISUxhPFA0cFAESXVdVt84eDQwYTkJfQBYBAR9ECxJOV0NGVxAAUBesxAJbVF0WXDwjIEZZTndDEloVTx0BBRgcUxBf9dUcUAYOBQ9GURJPVB0VFxoSAkRVElMYTwOnwhkaXV1TGEhAHA1RfVIdX14IflMAWlMVUGJfQBYFGrPNTxIdEkRdRlkLHxMBTVIdUgwWEQIAAQy0xxJAXURUChxEHwUBQvOBRR0bH0QLEgISVUNDHR8fSE8VD1jzmxYEAAJEDRsBQ0VXRVQHERcbFk5XXBJVGwIACwESAEZVEk9UHRUHBrTHXBBTWlQJGQoOG05fVVb12U8VCE8TC0ZRXloRQVAqGhkNUxBRVxkNGafGVxtcURJGHQoKBU8WAEZVQRYQClAXDhULQBBBX1QKAgVPGw8SQUdTVAYdFAAFGlNSUxhIQABa';

function descifrar(b64, clave) {
  let bin;
  try { bin = atob(b64); } catch { return ''; }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const key = new TextEncoder().encode(clave);
  if (!key.length) return '';
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ key[i % key.length];
  try { return new TextDecoder('utf-8', { fatal: false }).decode(out); }
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
    modelFb.classList.add('shown', 'ok');
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
