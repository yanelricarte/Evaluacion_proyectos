/* Revelado suave al leer para las páginas de la jornada.
   Los bloques arrancan en .reveal (transparentes) y pasan a
   .visible al entrar en la ventana. Con reduced-motion o sin
   IntersectionObserver, todo queda visible. */
(function () {
  'use strict';
  var reducir = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;

  var selector = 'section, .ficha, .mat, .rule-card, .sale, .check, ' +
    '.aviso, .campo, .table-wrap, .doc, table';
  var bloques = document.querySelectorAll(selector);
  if (!bloques.length) return;

  function visible(n) { n.classList.add('visible'); }

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < bloques.length; i++) visible(bloques[i]);
    return;
  }
  var io = new IntersectionObserver(function (entradas) {
    for (var j = 0; j < entradas.length; j++) {
      if (entradas[j].isIntersecting) {
        visible(entradas[j].target);
        io.unobserve(entradas[j].target);
      }
    }
  // threshold 0: un bloque mucho mas alto que la ventana nunca llega a
  // mostrar el 10 % de su area, y con 0.1 se quedaba en opacity 0.
  }, { threshold: 0, rootMargin: '0px 0px -6% 0px' });
  for (var k = 0; k < bloques.length; k++) {
    bloques[k].classList.add('reveal');
    io.observe(bloques[k]);
  }
})();
