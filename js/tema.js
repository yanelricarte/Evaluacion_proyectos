/* Tema claro u oscuro elegido por quien lee. La preferencia se guarda
   por navegador y, si no eligió nada, manda la del sistema. */
(function () {
  "use strict";
  var K = "ep-tema";
  var raiz = document.documentElement;
  var guardado = null;
  try { guardado = localStorage.getItem(K); } catch (e) {}
  if (guardado === "oscuro" || guardado === "claro") raiz.classList.add(guardado);

  function oscuroAhora() {
    if (raiz.classList.contains("oscuro")) return true;
    if (raiz.classList.contains("claro")) return false;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  function montar() {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "btn-tema";
    function rotular() { b.textContent = oscuroAhora() ? "Tema claro" : "Tema oscuro"; }
    rotular();
    b.addEventListener("click", function () {
      var aOscuro = !oscuroAhora();
      raiz.classList.remove("oscuro", "claro");
      raiz.classList.add(aOscuro ? "oscuro" : "claro");
      try { localStorage.setItem(K, aOscuro ? "oscuro" : "claro"); } catch (e) {}
      rotular();
    });
    document.body.appendChild(b);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", montar);
  else montar();
})();
