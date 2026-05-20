/* ============================================================
   Actividad integradora · lógica
   Cinco pasos con feedback. Persistencia en localStorage.
   ============================================================ */

const STORAGE_KEY = 'integradora:state';

// ===== Persistencia =====
function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}
function saveState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}
const state = loadState();

// ===== Paso 1: problemas (tipo + atributo) =====
document.querySelectorAll('.problem').forEach((problem, idx) => {
  const correctTipo = problem.dataset.tipo;
  const correctAtr = problem.dataset.atributo;
  const key1 = `p1_${idx}`;
  const sel = state[key1] || {};

  const restore = () => {
    ['tipo','atributo'].forEach(field => {
      if (!sel[field]) return;
      const btn = problem.querySelector(`.choices[data-field="${field}"] button[data-value="${sel[field]}"]`);
      if (btn) btn.classList.add('selected');
    });
    if (sel.tipo && sel.atributo) finalize();
  };

  const finalize = () => {
    const tipoOK = sel.tipo === correctTipo;
    const atrOK = sel.atributo === correctAtr;

    ['tipo','atributo'].forEach(field => {
      const correct = field === 'tipo' ? correctTipo : correctAtr;
      const chosen = sel[field];
      const group = problem.querySelector(`.choices[data-field="${field}"]`);
      group.querySelectorAll('button').forEach(b => {
        b.disabled = true;
        b.classList.remove('selected');
        if (b.dataset.value === correct) b.classList.add('right');
        if (b.dataset.value === chosen && chosen !== correct) b.classList.add('wrong');
      });
    });

    let cls = 'no';
    if (tipoOK && atrOK) cls = 'ok';
    else if (tipoOK || atrOK) cls = 'partial';
    problem.classList.add('answered', cls);
    sel.score = (tipoOK ? 1 : 0) + (atrOK ? 1 : 0); // máx 2 por problema
    state[key1] = sel;
    saveState(state);
    updateScores();
  };

  problem.querySelectorAll('.choices').forEach(group => {
    const field = group.dataset.field;
    group.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        if (problem.classList.contains('answered')) return;
        group.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        sel[field] = btn.dataset.value;
        state[key1] = sel;
        saveState(state);
        if (sel.tipo && sel.atributo) finalize();
      });
    });
  });

  restore();
});

// ===== Paso 2: pasos de prueba =====
document.querySelectorAll('.test-step').forEach((step, idx) => {
  const key = `p2_${idx}`;
  const isMulti = step.classList.contains('multi');
  const correct = step.dataset.correct;

  if (isMulti) {
    const correctSet = new Set(correct.split(','));
    const buttons = step.querySelectorAll('.multi-choices button');
    const checkBtn = step.querySelector('.check-btn');
    const sel = new Set(state[key] || []);

    const refreshSelected = () => {
      buttons.forEach(b => b.classList.toggle('selected', sel.has(b.dataset.value)));
    };
    const finalize = () => {
      buttons.forEach(b => {
        b.disabled = true;
        b.classList.remove('selected');
        const isCorrect = correctSet.has(b.dataset.value);
        const isChosen = sel.has(b.dataset.value);
        if (isCorrect) b.classList.add('right');
        if (isChosen && !isCorrect) b.classList.add('wrong');
      });
      checkBtn.disabled = true;
      const exact = sel.size === correctSet.size && [...sel].every(v => correctSet.has(v));
      step.classList.add('answered', exact ? 'ok' : 'no');
      state[key + '_done'] = true;
      state[key + '_score'] = exact ? 1 : 0;
      saveState(state);
      updateScores();
    };

    buttons.forEach(b => {
      b.addEventListener('click', () => {
        if (step.classList.contains('answered')) return;
        if (sel.has(b.dataset.value)) sel.delete(b.dataset.value);
        else sel.add(b.dataset.value);
        state[key] = [...sel];
        saveState(state);
        refreshSelected();
      });
    });
    checkBtn.addEventListener('click', finalize);
    refreshSelected();
    if (state[key + '_done']) finalize();

  } else {
    const buttons = step.querySelectorAll('.choices button');
    const finalize = (chosen) => {
      buttons.forEach(b => {
        b.disabled = true;
        if (b.dataset.value === correct) b.classList.add('right');
        if (b.dataset.value === chosen && chosen !== correct) b.classList.add('wrong');
      });
      const ok = chosen === correct;
      step.classList.add('answered', ok ? 'ok' : 'no');
      state[key] = chosen;
      state[key + '_score'] = ok ? 1 : 0;
      saveState(state);
      updateScores();
    };
    buttons.forEach(b => {
      b.addEventListener('click', () => {
        if (step.classList.contains('answered')) return;
        finalize(b.dataset.value);
      });
    });
    if (state[key]) finalize(state[key]);
  }
});

// ===== Paso 3: matching de instrumentos =====
document.querySelectorAll('.match-item').forEach((item, idx) => {
  const correct = item.dataset.correct;
  const key = `p3_${idx}`;
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
    state[key + '_score'] = ok ? 1 : 0;
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

// ===== Paso 4: producción guiada (feedback heurístico) =====
const VAGUE_WORDS = /\b(buena?|bonit[oa]|lind[oa]|f[áa]cil|r[áa]pid[oa]|c[óo]modo|agradable|sencill[oa]|amigable|funciona\s+bien|anda\s+bien)\b/gi;
const ACTION_VERBS = /\b(muestra|impide|registra|permite|bloquea|confirma|solicita|valida|genera|emite|rechaza|env[íi]a|guarda|elimina|edita|cancela|verifica|notifica|carga|filtra|ordena|exporta|imprime|comprueba|contabiliza)\b/gi;

document.querySelectorAll('.prod-check').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const fb = document.getElementById(target + '-feedback');
    if (target === 'prod1') fbProd1(fb);
    else if (target === 'prod2') fbProd2(fb);
    else if (target === 'prod3') fbProd3(fb);
  });
});

function fbProd1(fb) {
  const text = (document.getElementById('prod1').value || '').trim();
  fb.classList.add('shown');
  fb.classList.remove('ok','partial','no');
  if (!text) {
    fb.classList.add('no');
    fb.innerHTML = '<b>No escribiste todavía.</b> Probá con un verbo concreto: <i>"el sistema impide…"</i> o <i>"el sistema muestra…"</i>.';
    return;
  }
  const vague = text.match(VAGUE_WORDS) || [];
  const verbs = text.match(ACTION_VERBS) || [];
  const checks = [];
  if (verbs.length) checks.push(`<li>✔ Usa un verbo observable (<b>${[...new Set(verbs.map(v => v.toLowerCase()))].join(', ')}</b>).</li>`);
  else checks.push('<li>✘ No detecté un verbo claramente observable. Probá con: <i>muestra, impide, registra, permite, bloquea, confirma…</i></li>');

  if (!vague.length) checks.push('<li>✔ No usa adjetivos vagos ("bueno", "fácil", "rápido").</li>');
  else checks.push(`<li>✘ Hay palabras vagas (<b>${[...new Set(vague.map(v => v.toLowerCase()))].join(', ')}</b>). Para una lista de cotejo eso no se chequea, se valora — eso va en una <b>escala</b>.</li>`);

  if (text.length < 20) checks.push('<li>✘ Es muy corto. Un requisito de cotejo debería describir <b>qué hace</b> y <b>en qué condición</b>.</li>');
  else checks.push('<li>✔ Tiene la extensión adecuada para describir la condición.</li>');

  const score = (verbs.length ? 1 : 0) + (!vague.length ? 1 : 0) + (text.length >= 20 ? 1 : 0);
  fb.classList.add(score === 3 ? 'ok' : score >= 2 ? 'partial' : 'no');
  fb.innerHTML = `<b>Devolución automática.</b> Esto es un primer filtro — la decisión final la hace el grupo en la puesta en común.<ul>${checks.join('')}</ul>`;
}

function fbProd2(fb) {
  const data = (document.getElementById('prod2-data').value || '').trim();
  const tech = document.getElementById('prod2-tech').value;
  const result = (document.getElementById('prod2-result').value || '').trim();
  fb.classList.add('shown');
  fb.classList.remove('ok','partial','no');

  const techLabels = {
    EV:'Equivalencia válida', EI:'Equivalencia inválida',
    LV:'Valor límite válido', LI:'Valor límite inválido',
    C:'Conjetura de error'
  };

  const items = [];
  let score = 0;
  if (data.length >= 3) { items.push('<li>✔ Hay un dato de entrada concreto.</li>'); score++; }
  else items.push('<li>✘ Falta el dato de entrada o es muy general. Algo como <i>"edad = 11"</i> o <i>"campo vacío"</i>.</li>');

  if (tech) { items.push(`<li>✔ Técnica seleccionada: <b>${techLabels[tech]}</b>.</li>`); score++; }
  else items.push('<li>✘ No elegiste una técnica. Pensá: ¿es un valor representante (equivalencia), un borde (límite) o un caso no previsto (conjetura)?</li>');

  if (result.length >= 10) {
    items.push('<li>✔ Tenés un resultado esperado.</li>');
    score++;
    if (/(rechaza|acepta|muestra|bloquea|impide|permite|env[íi]a|registra|genera|valida)/i.test(result)) {
      items.push('<li>✔ El resultado describe una <b>acción observable</b> del sistema.</li>');
      score++;
    } else {
      items.push('<li>⚠ El resultado podría ser más concreto: ¿qué hace el sistema? (rechaza / acepta / muestra mensaje…)</li>');
    }
  } else {
    items.push('<li>✘ Falta el resultado esperado o es muy corto. Sin resultado esperado no hay forma de saber si el caso pasa o falla.</li>');
  }

  // Coherencia técnica + dato (heurística simple)
  if (tech && data) {
    const isLimit = /\b(11|12|17|18|19|20|0|1|9|10)\b/.test(data);
    if ((tech === 'LV' || tech === 'LI') && !isLimit) {
      items.push('<li>⚠ Marcaste "valor límite" pero el dato no parece estar en el borde. Revisá: los límites del rango eran 12 y 18.</li>');
    }
    if ((tech === 'C') && /\b\d+\b/.test(data) && !/(vac[íi]o|null|nada|""|texto|letras|s[íi]mbolo)/i.test(data)) {
      items.push('<li>⚠ Marcaste "conjetura" pero usaste un número. La conjetura suele explorar lo no documentado: vacíos, formatos raros, tipos incorrectos.</li>');
    }
  }

  fb.classList.add(score >= 4 ? 'ok' : score >= 2 ? 'partial' : 'no');
  fb.innerHTML = `<b>Devolución automática.</b><ul>${items.join('')}</ul>`;
}

function fbProd3(fb) {
  const text = (document.getElementById('prod3').value || '').trim();
  fb.classList.add('shown');
  fb.classList.remove('ok','partial','no');
  if (!text) {
    fb.classList.add('no');
    fb.innerHTML = '<b>No escribiste todavía.</b> Empezá nombrando el instrumento elegido y por qué.';
    return;
  }
  const items = [];
  let score = 0;
  if (/(cotejo|escala|r[úu]brica|matriz)/i.test(text)) { items.push('<li>✔ Mencionás un instrumento concreto.</li>'); score++; }
  else items.push('<li>✘ No identifiqué el instrumento elegido. Nombralo explícitamente: <i>lista de cotejo, escala, rúbrica o matriz</i>.</li>');

  if (/(funcionalidad|usabilidad|rendimiento|fiabilidad|seguridad|mantenibilidad|accesibilidad)/i.test(text)) { items.push('<li>✔ Mencionás un atributo de calidad.</li>'); score++; }
  else items.push('<li>✘ Falta mencionar al menos un atributo de calidad (funcionalidad, usabilidad, rendimiento, fiabilidad…).</li>');

  if (/(evidencia|tiempo|cantidad|cumple|registra|mide|observa|errores|reporte|prueba|caso)/i.test(text)) { items.push('<li>✔ Mencionás algún tipo de evidencia.</li>'); score++; }
  else items.push('<li>✘ La justificación gana fuerza si nombrás <b>una evidencia concreta</b>: tiempo de respuesta, cantidad de errores, número de reservas duplicadas…</li>');

  if (text.length < 60) items.push('<li>⚠ La justificación es corta. En la puesta en común conviene desarrollar más el porqué.</li>');

  fb.classList.add(score === 3 ? 'ok' : score >= 1 ? 'partial' : 'no');
  fb.innerHTML = `<b>Devolución automática.</b> Esta no califica el contenido — solo verifica si están los componentes que pedimos.<ul>${items.join('')}</ul>`;
}

// ===== Cálculo de puntajes =====
function updateScores() {
  // Paso 1: 5 problemas × 2 puntos = 10
  let s1 = 0;
  for (let i = 0; i < 5; i++) s1 += (state[`p1_${i}`]?.score || 0);
  // Paso 2: 3 pasos × 1 punto = 3
  let s2 = 0;
  for (let i = 0; i < 3; i++) s2 += (state[`p2_${i}_score`] || 0);
  // Paso 3: 4 matches × 1 punto = 4
  let s3 = 0;
  for (let i = 0; i < 4; i++) s3 += (state[`p3_${i}_score`] || 0);

  document.getElementById('score-1').textContent = `${s1} / 10`;
  document.getElementById('score-2').textContent = `${s2} / 3`;
  document.getElementById('score-3').textContent = `${s3} / 4`;
  document.getElementById('score-total').textContent = `${s1 + s2 + s3} / 17`;
}
updateScores();

// ===== Autosave de los textareas/inputs del Paso 4 =====
const PROD_FIELDS = ['prod1', 'prod2-data', 'prod2-tech', 'prod2-result', 'prod3'];
PROD_FIELDS.forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const key = 'prod_' + id;
  if (state[key]) el.value = state[key];
  el.addEventListener('input', () => {
    state[key] = el.value;
    saveState(state);
  });
});

// ===== Exportación de respuestas =====
const TIPO_LABELS = { omision:'Omisión', excedente:'Excedente', incorrecto:'Incorrecto' };
const ATR_LABELS = { funcionalidad:'Funcionalidad', usabilidad:'Usabilidad', rendimiento:'Rendimiento', fiabilidad:'Fiabilidad' };
const TECH_LABELS = { EV:'Equivalencia válida', EI:'Equivalencia inválida', LV:'Valor límite válido', LI:'Valor límite inválido', C:'Conjetura de error' };
const INSTR_LABELS = { cotejo:'Lista de cotejo', escala:'Escala de valoración', rubrica:'Rúbrica analítica', matriz:'Matriz de comparación' };

function buildExportText() {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yyyy = now.getFullYear();
  const hh = String(now.getHours()).padStart(2, '0');
  const mi = String(now.getMinutes()).padStart(2, '0');

  let out = '';
  out += '═══════════════════════════════════════════════════\n';
  out += '  ACTIVIDAD INTEGRADORA — Evaluación de Proyectos\n';
  out += '  App de Reservas de Canchas del Polideportivo\n';
  out += `  Fecha: ${dd}/${mm}/${yyyy} ${hh}:${mi}\n`;
  out += '═══════════════════════════════════════════════════\n\n';

  // Paso 1: Problemas
  out += '── PASO 1 · DETECCIÓN DE PROBLEMAS ──\n\n';
  document.querySelectorAll('.problem').forEach((problem, idx) => {
    const text = problem.querySelector('.problem-text')?.textContent.trim() || '';
    const correctTipo = problem.dataset.tipo;
    const correctAtr = problem.dataset.atributo;
    const ans = state[`p1_${idx}`] || {};
    out += `${idx + 1}. ${text}\n`;
    if (ans.tipo) {
      const tipoOK = ans.tipo === correctTipo;
      out += `   Tipo elegido: ${TIPO_LABELS[ans.tipo] || ans.tipo}  ${tipoOK ? '✓' : '✗ (correcta: ' + TIPO_LABELS[correctTipo] + ')'}\n`;
    } else {
      out += '   Tipo: (sin responder)\n';
    }
    if (ans.atributo) {
      const atrOK = ans.atributo === correctAtr;
      out += `   Atributo elegido: ${ATR_LABELS[ans.atributo] || ans.atributo}  ${atrOK ? '✓' : '✗ (correcto: ' + ATR_LABELS[correctAtr] + ')'}\n`;
    } else {
      out += '   Atributo: (sin responder)\n';
    }
    out += '\n';
  });

  // Paso 2: Casos de prueba
  out += '── PASO 2 · DISEÑO DE CASOS DE PRUEBA ──\n\n';
  const p2Questions = [
    '2.1 Clases de equivalencia (¿cuántas clases?)',
    '2.2 Valores límite (cuáles probar)',
    '2.3 Conjetura de errores (cuál es)'
  ];
  document.querySelectorAll('.test-step').forEach((step, idx) => {
    out += `${p2Questions[idx]}\n`;
    const ans = state[`p2_${idx}`];
    const ok = state[`p2_${idx}_score`];
    if (ans !== undefined && ans !== null) {
      const display = Array.isArray(ans) ? ans.join(', ') : ans;
      out += `   Tu respuesta: ${display}  ${ok ? '✓' : '✗'}\n`;
      if (!ok) out += `   Correcta: ${step.dataset.correct}\n`;
    } else {
      out += '   (sin responder)\n';
    }
    out += '\n';
  });

  // Paso 3: Matching de instrumentos
  out += '── PASO 3 · ELECCIÓN DE INSTRUMENTOS ──\n\n';
  document.querySelectorAll('.match-item').forEach((item, idx) => {
    const text = item.querySelector('.match-text')?.textContent.trim() || '';
    const correct = item.dataset.correct;
    const ans = state[`p3_${idx}`];
    const ok = state[`p3_${idx}_score`];
    out += `${idx + 1}. ${text}\n`;
    if (ans) {
      out += `   Tu elección: ${INSTR_LABELS[ans] || ans}  ${ok ? '✓' : '✗ (correcto: ' + (INSTR_LABELS[correct] || correct) + ')'}\n`;
    } else {
      out += '   (sin responder)\n';
    }
    out += '\n';
  });

  // Paso 4: Producción guiada
  out += '── PASO 4 · PRODUCCIÓN GUIADA ──\n\n';
  out += '4.1 Requisito para lista de cotejo:\n';
  out += `   ${(document.getElementById('prod1')?.value || '(sin responder)').trim()}\n\n`;
  out += '4.2 Caso de prueba diseñado:\n';
  out += `   Dato de entrada:     ${(document.getElementById('prod2-data')?.value || '(sin completar)').trim()}\n`;
  const techVal = document.getElementById('prod2-tech')?.value;
  out += `   Técnica aplicada:    ${techVal ? (TECH_LABELS[techVal] || techVal) : '(sin completar)'}\n`;
  out += `   Resultado esperado:  ${(document.getElementById('prod2-result')?.value || '(sin completar)').trim()}\n\n`;
  out += '4.3 Justificación del instrumento:\n';
  out += `   ${(document.getElementById('prod3')?.value || '(sin responder)').trim()}\n\n`;

  // Puntaje
  const s1 = document.getElementById('score-1').textContent;
  const s2 = document.getElementById('score-2').textContent;
  const s3 = document.getElementById('score-3').textContent;
  const st = document.getElementById('score-total').textContent;
  out += '── PUNTAJE ──\n\n';
  out += `Detección de problemas:  ${s1}\n`;
  out += `Casos de prueba:         ${s2}\n`;
  out += `Instrumentos:            ${s3}\n`;
  out += `Total:                   ${st}\n\n`;

  out += '═══════════════════════════════════════════════════\n';
  out += 'Guardalo en Drive, mandátelo por mail o pegalo donde\n';
  out += 'lo puedas recuperar. Si cambiás de navegador o PC,\n';
  out += 'las respuestas guardadas localmente se pierden.\n';
  out += '═══════════════════════════════════════════════════\n';
  return out;
}

function flashStatus(text) {
  const el = document.getElementById('exportStatus');
  if (!el) return;
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
  a.download = `actividad-integradora_${stamp}.txt`;
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

// Botón recalcular (sin confirm modal: feedback inline)
document.getElementById('recompute')?.addEventListener('click', () => {
  updateScores();
  flashStatus('Puntaje recalculado');
});
