document.addEventListener('DOMContentLoaded', function () {
  // build a separate TOC for each category
  document.querySelectorAll('.edu-category').forEach(function (category) {
    var list = category.querySelector('.edu-toc-list');
    var progress = category.querySelector('.edu-toc-progress');
    var sections = category.querySelectorAll('.edu-section');
    if (!list || !sections.length) return;

    var links = [];
    sections.forEach(function (section, i) {
      var heading = section.querySelector('h3');
      if (!heading) return;
      var id = category.id + '-sec-' + i;
      section.id = id;

      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + id;
      a.textContent = heading.textContent;
      a.className = 'edu-toc-link';
      a.addEventListener('click', function (e) {
        e.preventDefault();
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      li.appendChild(a);
      list.appendChild(li);
      links.push({ section: section, link: a });
    });

    function onScroll() {
      var current = 0;
      links.forEach(function (item, i) {
        if (item.section.getBoundingClientRect().top - 150 <= 0) current = i;
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
});