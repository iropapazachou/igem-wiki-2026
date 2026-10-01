document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.card-carousel').forEach(function (carousel) {
    var cards = carousel.querySelectorAll('.q-card');
    var prev = carousel.querySelector('.card-prev');
    var next = carousel.querySelector('.card-next');
    var current = 0;
    function show(i) {
      cards.forEach(function (c, idx) { c.classList.toggle('is-active', idx === i); });
      current = i;
    }
    prev.addEventListener('click', function () { show((current - 1 + cards.length) % cards.length); });
    next.addEventListener('click', function () { show((current + 1) % cards.length); });
  });
});