document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.img-carousel').forEach(function (carousel) {
    var slides = carousel.querySelectorAll('.img-slide');
    var prev = carousel.querySelector('.img-prev');
    var next = carousel.querySelector('.img-next');
    var current = 0;

    function show(i) {
      slides.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
      current = i;
    }
    prev.addEventListener('click', function () {
      show((current - 1 + slides.length) % slides.length);  // loops
    });
    next.addEventListener('click', function () {
      show((current + 1) % slides.length);  // loops
    });
  });
});