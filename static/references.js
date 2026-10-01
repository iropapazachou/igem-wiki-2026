(function () {
 
  function bodyOf(el) {
    var item = el.closest ? el.closest('.acc-item') : null;
    return item ? item.querySelector('.acc-body') : null;
  }
 
  function headerOf(el) {
    var item = el.closest ? el.closest('.acc-item') : null;
    return item ? item.querySelector('.acc-header') : null;
  }
 
  function openContaining(target) {
    var body = bodyOf(target);
    if (!body) return false;
    var header = headerOf(target);
    var wasClosed = !body.classList.contains('is-open');
    if (wasClosed) {
      body.classList.add('is-open');
      if (header) {
        header.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    }
    return wasClosed;
  }
 
  function flash(el) {
    el.classList.remove('is-flash');
    // force reflow so the animation can replay
    void el.offsetWidth;
    el.classList.add('is-flash');
    window.setTimeout(function () { el.classList.remove('is-flash'); }, 1600);
  }
 
  function goTo(id) {
    var target = document.getElementById(id);
    if (!target) return;
    var opened = openContaining(target);
    // if we just expanded the panel, let layout settle before scrolling
    window.setTimeout(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      flash(target);
    }, opened ? 90 : 0);
  }
 
  document.addEventListener('DOMContentLoaded', function () {
 
    // citation links
    document.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a.cite') : null;
      if (!a) return;
      var id = (a.getAttribute('href') || '').replace('#', '');
      if (!id) return;
      e.preventDefault();
      history.replaceState(null, '', '#' + id);
      goTo(id);
    });
 
    // deep link on arrival
    if (window.location.hash.indexOf('#ref-') === 0) {
      goTo(window.location.hash.slice(1));
    }
 
    // keep aria-expanded honest if the user toggles the panel directly
    var hdr = document.getElementById('ref-toggle');
    if (hdr) {
      hdr.addEventListener('click', function () {
        window.setTimeout(function () {
          hdr.setAttribute('aria-expanded',
            hdr.classList.contains('is-open') ? 'true' : 'false');
        }, 30);
      });
    }
  });
 
})();
