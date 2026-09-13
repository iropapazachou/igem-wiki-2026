document.addEventListener('DOMContentLoaded', function () {
  var carousel = document.getElementById('stat-carousel');
  if (!carousel) return;
  var slides = carousel.querySelectorAll('.stat-slide');
  var prev = document.getElementById('stat-prev');
  var next = document.getElementById('stat-next');
  var counter = document.getElementById('stat-counter');
  var current = 0;

  function show(i) {
    slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    counter.textContent = (i + 1) + ' / ' + slides.length;
    prev.disabled = (i === 0);
    next.disabled = (i === slides.length - 1);
    current = i;
  }
  prev.addEventListener('click', function () { if (current > 0) show(current - 1); });
  next.addEventListener('click', function () { if (current < slides.length - 1) show(current + 1); });
  show(0);
});