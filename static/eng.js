document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.dbtl').forEach(function (wheel) {
    var segs = wheel.querySelectorAll('.dbtl-seg');
    var contents = wheel.querySelectorAll('.dbtl-content');
    var hint = wheel.querySelector('.dbtl-hint');

    segs.forEach(function (seg) {
      seg.addEventListener('click', function () {
        var stage = seg.dataset.stage;
        segs.forEach(function (s) { s.classList.remove('is-active'); });
        contents.forEach(function (c) { c.classList.remove('is-active'); });
        seg.classList.add('is-active');
        var target = wheel.querySelector('.dbtl-content[data-stage="' + stage + '"]');
        if (target) target.classList.add('is-active');
        if (hint) hint.style.display = 'none';
      });
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  // Wet / Dry toggle
  var labBtns = document.querySelectorAll('.eng-lab-btn');
  var labGroups = document.querySelectorAll('.eng-lab-group');
  labBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var lab = btn.dataset.lab;
      labGroups.forEach(function (g) { g.classList.remove('is-open'); });
      var target = document.getElementById('eng-' + lab);
      if (target) {
        target.classList.add('is-open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Iteration buttons
  document.querySelectorAll('.eng-iter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.dataset.target;
      var group = btn.closest('.eng-lab-group');
      group.querySelectorAll('.eng-iteration').forEach(function (it) { it.classList.remove('is-open'); });
      var target = document.getElementById(id);
      if (target) {
        target.classList.add('is-open');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});