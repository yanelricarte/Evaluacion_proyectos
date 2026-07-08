/* ============================================================
   Trabajo en clase · Benchmarking y uso crítico de IA (Unidad 2)
   Elección única con feedback + puntaje por sección. Persistencia en localStorage.
   Se corrige solo; no hay nada para entregar.
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

// ============================================================
//  EJEMPLO RESUELTO — bloqueado con código
// ============================================================
// SEGURIDAD: el código NO está guardado en este archivo. El ejemplo viaja CIFRADO
// usando el propio código como clave; lo de abajo es solo el texto cifrado (inútil
// sin el código). El alumno escribe el código —que se da en clase— y recién ahí se
// descifra. Así puede vivir en un repo público sin filtrar ni el código ni el ejemplo.
//
// Para crear/cambiar el cifrado (otro código u otro texto), usá el generador
// local, fuera del repo: _local/generador-codigo-actividad.html
const EJEMPLO_CIFRADO =
  'BA52bHUsD3UhICEmJSERQi42OTMlOl4MZCdyais8DwwpN3JcdSwPYT6G5XYsIlRXiOhsOywqWEJxeWM0d25SRYjkIiImbkVROSEtdiwgEVEpNyUkaTtfEDs3IzE7L1xRazUpJSgqXhAuK2w6KG5hc2shKTppIlBSJDctIiY8WF9leS4kd3JTQnVPcDR3fxgQGzcjOzk6DR8pe3A0O3A78uAELyI8jZAQKCohOWkrR1EnMC0yJjwRRIjsLzggLV4eawYjOD0rSUQkf2wGCm5VVSdlIDcrIUNRPyo+PyZiEUMuZTklKG5BUTkkbDMtJ0VROWUqOT0hQhAyZS00OydDEDs3IzE7L1xROGU8MzovVV84a2wHPCdUQiRlITMtJ0MQLilsIiArXEAkZSgzaS9BVTkxOSQoblVVazAidjk8Xlc5JCE3Z251USYgbCMnbkFCJDEjNSYiXhA5IDwkJipEUyInIDNpLV5eay0pJDsvXFkuKzg3Om5dWSk3KSVzbkBFiOxsOywqWEJnZS8jiu9fRCo2bDUmPENZLyQ/emk/RPPiZS85JypYUyIqIjM6blBeJDEtJGduf19rICA/Iy9CECckbAYKbkFfOWUhleR1EVQqKCl2LCIRXYjsODktIRFAKjctdiQrVVk5ZTU5Z250Xms1LSUmPRFePigpJCgqXkNlh/dqKzwPDCk3clx1LA8CYmUNIy0nRV85huE3aSpUECckbCQsPUFFLjY4N2mMmlMkNz6V4G5dUWs1PiMsLFAQPistdj8rS9LL447tdWFTDncnPmhDAlQQLSQgIihuUlE4LGwiJipeEDskPjdpPVRCayYjOC8nUFInIHZ2PCBQEDgqIDdpLV5COSwoN2kgXhAoKiIiOyFdUWsgIHYoNFBCa20kNzBuQEUuZT4zOStFWTllNXY5PF5dLiElNztnChAlKmwyIC1UEC4rbCc8jZgQKCoiMiAtWF8lID92OisRXSIhKXZhjI5TJCtsOT08XkNrNT45LjxQXSo2bDcrJ1RCPyo/aWVu8485IC8/iudfEDs3KTgtJ1VRdGx3dichEVEoKS0kKG5ZVTk3LTsgK19EKmUiP2k4VEI4LI/lJ3URSWsxIzsoblRcayuP7CQrQ19rJiM7Jm5SXyUmICM6J/KDJWU/PyduUl8mNS0kKDxdX2smIzhpIFBUKmtsAyduR1EnKj52KD3ynWsrI3Y6KxFAPiAoM2k8VEAuMSUkaSBYECgqISYoPFBCZXkuJHdyU0J1T3A0d30YEAYsbCY7IUVfKCogOWktXkI5ICs/LSENHyl7cDQ7cDvSy+dsBzyNmBAmLCg5c25FWS4oPDlpKlQQKjUpJD07Q1FrISk6aT5DXyw3LTsoYhFTJCtsNTshX/P4KCkiOyEdEC8gPzIsblRcayYgPypuWVE4MS12ODtUEDowKTIobkRDKicgM2dyU0J1T67W625yRYjkIiIoPRFGLiYpJXNuBBAoKj4kICpQQ3BlKDM6LVBCPypsOihuXPPqNmwkKDxQEDJlPCQmI1RUIipsMyVuQ1U4MSN4dSxDDkGnzPRpDV5eLywvPyYgVENxZSknPCdBX2s3KTUgjZheazcpPycnUlkqISN6aT1YXmsqOCQmPRFAOSorJCgjUENrJC4/LDxFXzhpbDMnLVlFLSQoOXJuUF4kMSN2LytSWCplNXY/K0NDIob/OGkqVFxrNT45LjxQXSprcDQ7cDvSy+dsFSYgRUIqZT0jiucRUyQoPDc7IQsQJyRsOT08UBAbBmw1KCBVWS8kODdpLV5eayAgdiQnQl0kZTwkJjpeUyQpI3ppNxFFJWUhleg2WF0kZS01LD5FUSkpKXYoLV5CLyQoOWlmQV85ZSk8LCNBXCRpbDcrPFhCayAidiQrX184ZSgzaX8BEDhsYg==';

function descifrar(b64, clave) {
  let bin;
  try { bin = atob(b64); } catch { return ''; }
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const key = new TextEncoder().encode(clave);
  if (!key.length) return '';
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ key[i % key.length];
  // fatal:true rechaza UTF-8 inválido: si la clave está mal, el descifrado da bytes
  // inválidos y devuelve '' → se trata como código incorrecto.
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
      modelFb.innerHTML = '<b>Código incorrecto.</b> Usá el código dado en clase (se da al final, cuando ya resolviste tu protocolo en la carpeta).';
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
