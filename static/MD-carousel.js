(function () {
  function initCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('.md-slide'));
    if (!slides.length) return;
 
    var prev    = root.querySelector('.md-prev');
    var next    = root.querySelector('.md-next');
    var counter = root.querySelector('.md-counter');
    var dotWrap = root.querySelector('.md-dots');
    var index   = 0;
    var dots    = [];
 
    // build dots if a container was provided
    if (dotWrap) {
      slides.forEach(function (_, i) {
        var d = document.createElement('button');
        d.className = 'md-dot';
        d.type = 'button';
        d.setAttribute('aria-label', 'Go to figure ' + (i + 1));
        d.addEventListener('click', function () { go(i); });
        dotWrap.appendChild(d);
        dots.push(d);
      });
    }
 
    function render() {
      slides.forEach(function (s, i) {
        var active = i === index;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-hidden', active ? 'false' : 'true');
        // pause any video on a slide we are leaving, so audio/motion
        // never continues behind another slide
        if (!active) {
          Array.prototype.forEach.call(s.querySelectorAll('video'), function (v) {
            if (!v.paused) v.pause();
          });
        }
      });
      if (counter) counter.textContent = (index + 1) + ' / ' + slides.length;
      if (prev) prev.disabled = index === 0;
      if (next) next.disabled = index === slides.length - 1;
      dots.forEach(function (d, i) {
        d.classList.toggle('is-active', i === index);
      });
    }
 
    function go(i) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render();
    }
 
    if (prev) prev.addEventListener('click', function () { go(index - 1); });
    if (next) next.addEventListener('click', function () { go(index + 1); });
 
    // keyboard support when the carousel has focus
    root.setAttribute('tabindex', '0');
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft')  { go(index - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { go(index + 1); e.preventDefault(); }
    });
 
    render();
  }
 
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-carousel]'),
      initCarousel
    );
  });
})();
