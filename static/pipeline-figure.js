(function () {
 
  function initPipeline(pipe) {
    var stages = Array.prototype.slice.call(pipe.querySelectorAll('.pipe-stage'));
    var panel  = pipe.querySelector('.pipe-panel');
    if (!stages.length || !panel) return;
 
    var titleEl = panel.querySelector('.pipe-panel-title');
    var bodyEl  = panel.querySelector('.pipe-panel-body');
    var closeEl = panel.querySelector('.pipe-panel-close');
    var openId  = null;
 
    function close() {
      openId = null;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      stages.forEach(function (s) {
        s.classList.remove('is-active');
        s.setAttribute('aria-expanded', 'false');
      });
    }
 
    function open(stage) {
      var id  = stage.getAttribute('data-target');
      var src = document.getElementById(id);
      if (!src) return;
 
      openId = id;
      titleEl.textContent = src.getAttribute('data-title') || '';
      bodyEl.innerHTML    = src.innerHTML;
 
      panel.classList.add('is-open');
      panel.setAttribute('aria-hidden', 'false');
 
      stages.forEach(function (s) {
        var active = s === stage;
        s.classList.toggle('is-active', active);
        s.setAttribute('aria-expanded', active ? 'true' : 'false');
      });
    }
 
    stages.forEach(function (stage) {
      stage.addEventListener('click', function () {
        // same stage → collapse; different stage → swap content
        if (stage.getAttribute('data-target') === openId) close();
        else open(stage);
      });
    });
 
    if (closeEl) closeEl.addEventListener('click', close);
 
    close();   // start collapsed
  }
 
  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-pipeline]'),
      initPipeline
    );
  });
 
})();
