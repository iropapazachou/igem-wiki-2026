document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.hp-icon-btn');
  var sections = document.querySelectorAll('.stakeholder-section');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.dataset.target;

      sections.forEach(function (s) { s.classList.remove('is-open'); });
      buttons.forEach(function (b) { b.classList.remove('is-active'); });

      var target = document.getElementById(targetId);
      if (target) {
        target.classList.add('is-open');
        btn.classList.add('is-active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});