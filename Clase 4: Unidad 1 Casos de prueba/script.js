  const slides = Array.from(document.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  const progressFill = document.getElementById('progressFill');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  let current = 0;

  function showSlide(index){
    slides[current].classList.remove('active');
    current = Math.max(0, Math.min(index, slides.length - 1));
    slides[current].classList.add('active');
    counter.textContent = `${current + 1} / ${slides.length}`;
    progressFill.style.width = `${((current + 1) / slides.length) * 100}%`;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  function next(){ showSlide(current + 1); }
  function prev(){ showSlide(current - 1); }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' '){ next(); }
    if(e.key === 'ArrowLeft' || e.key === 'PageUp'){ prev(); }
  });

  showSlide(0);
