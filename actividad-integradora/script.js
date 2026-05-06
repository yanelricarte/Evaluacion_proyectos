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

// Botón recalcular (también limpia y vuelve a empezar si querés)
document.getElementById('recompute').addEventListener('click', () => {
  if (confirm('¿Querés volver a calcular el puntaje? (Esto no borra tus respuestas)')) {
    updateScores();
    document.getElementById('resultado').scrollIntoView({ behavior:'smooth' });
  }
});
