(function () {
  'use strict';
  var CLAVE = 'taller-t5-documento';
  var campos = Array.prototype.slice.call(
    document.querySelectorAll('textarea[id], input[type=text][id], input[type=text][data-k], select[data-k]')
  );

  function clave(el) { return el.id || el.getAttribute('data-k'); }

  function guardar() {
    var datos = {};
    campos.forEach(function (el) { if (el.value) { datos[clave(el)] = el.value; } });
    try { localStorage.setItem(CLAVE, JSON.stringify(datos)); } catch (e) { /* sin storage */ }
  }

  function restaurar() {
    var datos;
    try { datos = JSON.parse(localStorage.getItem(CLAVE) || '{}'); } catch (e) { return; }
    campos.forEach(function (el) {
      var v = datos[clave(el)];
      if (typeof v === 'string') { el.value = v; }
    });
  }

  function texto() {
    var l = [];
    l.push('TALLER · DEL ENUNCIADO AL DOCUMENTO');
    l.push('');
    l.push('SITUACIÓN: ' + (document.getElementById('situacion').value || '(sin completar)'));
    l.push('INTEGRANTES: ' + (document.getElementById('integrantes').value || '(sin completar)'));
    l.push('');
    l.push('PROPÓSITO DE NUESTRA SOLUCIÓN');
    l.push(document.getElementById('proposito').value || '(sin completar)');
    l.push('');
    l.push('EL ÁRBOL DE NUESTRA SOLUCIÓN');
    for (var i = 1; i <= 6; i++) {
      var p = 'p' + i;
      var parte = valor(p + 'a');
      if (!parte) { continue; }
      l.push('- ' + parte);
      l.push('  Decisiones: ' + (valor(p + 'b') || '—'));
      l.push('  Se demuestra con: ' + (valor(p + 'c') || '—'));
      l.push('  Estado: ' + (valor(p + 'd') || '—') + ' · A cargo: ' + (valor(p + 'e') || '—'));
    }
    l.push('');
    l.push('EL DOCUMENTO, REPARTIDO');
    var apartados = document.querySelectorAll('#parte-3 tbody tr');
    Array.prototype.forEach.call(apartados, function (tr) {
      var nombre = tr.cells[0].textContent.trim();
      var quien = tr.querySelector('input[data-k$="q"]');
      var dia = tr.querySelector('input[data-k$="d"]');
      var q = quien ? quien.value.trim() : '';
      var f = dia ? dia.value.trim() : '';
      if (q || f) { l.push('- ' + nombre + ' → ' + (q || '—') + ' · ' + (f || '—')); }
    });
    l.push('');
    l.push('TRES DECISIONES');
    for (var j = 1; j <= 3; j++) {
      var d = 'dec' + j;
      if (!valor(d + 'a')) { continue; }
      l.push('- Decidimos: ' + valor(d + 'a'));
      l.push('  Otra opción: ' + (valor(d + 'b') || '—'));
      l.push('  Por qué esta: ' + (valor(d + 'c') || '—'));
      l.push('  Dato que lo sostiene: ' + (valor(d + 'd') || '—'));
    }
    l.push('');
    l.push('MATRIZ DE LA DECISIÓN PRINCIPAL');
    for (var k = 1; k <= 4; k++) {
      var c = valor('m' + k + 'a');
      if (!c) { continue; }
      l.push('- ' + c + ' · peso ' + (valor('m' + k + 'p') || '—') +
             ' · A ' + (valor('m' + k + 'A') || '—') + ' (' + (valor('m' + k + 'PA') || '—') + ')' +
             ' · B ' + (valor('m' + k + 'B') || '—') + ' (' + (valor('m' + k + 'PB') || '—') + ')' +
             ' · dato: ' + (valor('m' + k + 'd') || '—'));
    }
    l.push('  Totales: A ' + (valor('mTA') || '—') + ' · B ' + (valor('mTB') || '—'));
    l.push('');
    l.push('LA DECISIÓN ESCRITA');
    l.push(document.getElementById('decision').value || '(sin completar)');
    return l.join('\n');
  }

  function valor(k) {
    var el = document.querySelector('[data-k="' + k + '"]');
    return el ? el.value.trim() : '';
  }

  function avisar(msg) {
    document.getElementById('estado').textContent = msg;
  }

  campos.forEach(function (el) { el.addEventListener('input', guardar); });

  document.getElementById('btn-copiar').addEventListener('click', function () {
    var t = texto();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(t).then(
        function () { avisar('Copiado. Pegalo en el documento del equipo.'); },
        function () { avisar('No se pudo copiar; usá «Descargar como texto».'); }
      );
    } else {
      avisar('Este navegador no permite copiar; usá «Descargar como texto».');
    }
  });

  document.getElementById('btn-descargar').addEventListener('click', function () {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([texto()], { type: 'text/plain;charset=utf-8' }));
    a.download = 'taller-del-enunciado-al-documento.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    avisar('Archivo descargado.');
  });

  restaurar();
})();
