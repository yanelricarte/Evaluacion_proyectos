const slides = [...document.querySelectorAll('.slide')];
const STORAGE_KEY = 'clase6:slide';
let current = 0;

function update(){
  slides.forEach((s,i)=>s.classList.toggle('active',i===current));
  slides.forEach((s)=>{
    const bar=s.querySelector('.bar'); const num=s.querySelector('.num');
    if(bar) bar.style.width = ((current+1)/slides.length*100)+'%';
    if(num) num.textContent = String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
  });
  location.hash = 'slide-' + (current+1);
  try { localStorage.setItem(STORAGE_KEY, String(current)); } catch(_) {}
}

// ===== Actividad: requisitos para conversar =====
document.querySelectorAll('.req-row').forEach(row => {
  const correct = row.dataset.correct;
  const buttons = row.querySelectorAll('.req-options button');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.disabled = true);
      const chosen = btn.dataset.choice;
      const ok = chosen === correct;
      btn.classList.add(ok ? 'right' : 'wrong');
      if (!ok) {
        const right = row.querySelector(`.req-options button[data-choice="${correct}"]`);
        if (right) right.classList.add('right');
      }
      row.classList.add('answered', ok ? 'ok' : 'no');
    });
  });
});

// ===== Tarjetas V/F validadoras =====
document.querySelectorAll('.tf-card').forEach(card => {
  const correct = card.dataset.correct;
  const buttons = card.querySelectorAll('.vf button');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      buttons.forEach(b => b.disabled = true);
      const chosen = btn.dataset.choice;
      btn.classList.add('chosen');
      const ok = chosen === correct;
      btn.classList.add(ok ? 'right' : 'wrong');
      if (!ok) {
        const right = card.querySelector(`.vf button[data-choice="${correct}"]`);
        if (right) right.classList.add('right');
      }
      card.classList.add('answered', ok ? 'ok' : 'no');
    });
  });
});

function nextSlide(){ current = Math.min(slides.length-1,current+1); update(); }
function prevSlide(){ current = Math.max(0,current-1); update(); }

document.addEventListener('keydown',e=>{
  if(['ArrowRight','PageDown',' '].includes(e.key)){ e.preventDefault(); nextSlide(); }
  if(['ArrowLeft','PageUp','Backspace'].includes(e.key)){ e.preventDefault(); prevSlide(); }
  if(e.key.toLowerCase()==='f'){ e.preventDefault(); setFullscreen(!document.body.classList.contains('fullscreen-mode')); }
});

// ===== Modo pantalla completa =====
const viewToggle = document.getElementById('viewToggle');
function setFullscreen(on) {
  document.body.classList.toggle('fullscreen-mode', on);
  viewToggle.setAttribute('aria-pressed', String(on));
  const label = viewToggle.querySelector('.vt-label');
  if (label) label.textContent = on ? 'Salir de pantalla completa' : 'Pantalla completa';
  if (on) {
    document.documentElement.requestFullscreen?.().catch(() => {});
  } else if (document.fullscreenElement) {
    document.exitFullscreen?.().catch(() => {});
  }
}
if (viewToggle) {
  viewToggle.addEventListener('click', () => {
    setFullscreen(!document.body.classList.contains('fullscreen-mode'));
  });
}
document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && document.body.classList.contains('fullscreen-mode')) {
    setFullscreen(false);
  }
});

// ===== Restauración: hash > localStorage =====
const h = location.hash.match(/slide-(\d+)/);
if (h) {
  current = Math.max(0, Math.min(slides.length-1, parseInt(h[1])-1));
} else {
  try {
    const saved = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10);
    if (!Number.isNaN(saved) && saved >= 0 && saved < slides.length) current = saved;
  } catch(_) {}
}
update();
