document.addEventListener('DOMContentLoaded', function () {
  var sections = document.querySelectorAll('.content-section');
  var list = document.getElementById('toc-list');
  var progress = document.getElementById('toc-progress');
  if (!sections.length || !list) return;

  var links = [];
  var counter = 0;

  sections.forEach(function (section) {
    // grab every h2 and h3 inside this section, in order
    var headings = section.querySelectorAll('h2, h3');
    headings.forEach(function (heading) {
      var id = 'section-' + counter++;
      heading.id = id;                       // put the id on the heading itself

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = heading.textContent;
      a.className = 'toc-link ' + (heading.tagName === 'H2' ? 'toc-h2' : 'toc-h3');
      a.addEventListener('click', function (e) {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      list.appendChild(li);
      links.push({ target: heading, link: a });
    });
  });

  function onScroll() {
    var current = 0;
    var offset = 150;   // a bit more than the navbar height
    links.forEach(function (item, i) {
      var top = item.target.getBoundingClientRect().top;
      if (top - offset <= 0) current = i;
    });
    links.forEach(function (item, i) {
      item.link.classList.toggle('is-active', i === current);
    });
    var pct = links.length > 1 ? (current / (links.length - 1)) * 100 : 0;
    progress.style.height = pct + '%';
  }

  window.addEventListener('scroll', onScroll);
  onScroll();
});