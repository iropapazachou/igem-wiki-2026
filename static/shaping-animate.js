document.addEventListener('DOMContentLoaded', function () {
  var items = document.querySelectorAll('.shaping-item');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        // stagger: each icon appears slightly after the previous
        var index = Array.prototype.indexOf.call(items, entry.target);
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, index * 200);
        observer.unobserve(entry.target);  // animate once, don't repeat
      }
    });
  }, { threshold: 0.3 });

  items.forEach(function (item) { observer.observe(item); });
});