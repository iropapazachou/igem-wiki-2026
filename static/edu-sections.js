document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.edu-icon-grid .hp-icon-btn');
  var sections = document.querySelectorAll('.edu-category');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.dataset.target;
      sections.forEach(function (s) { s.classList.remove('is-open'); });
      var target = document.getElementById(targetId);
      if (target) {
        target.classList.add('is-open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});