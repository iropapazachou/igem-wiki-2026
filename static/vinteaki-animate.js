document.addEventListener('DOMContentLoaded', function () {
  var section = document.querySelector('.vinteaki-section');
  if (!section) return;

  // Pause it immediately on load so it waits for us.
  // (click play once right away to toggle from playing -> paused)
  setTimeout(function () {
    var playBtn = document.getElementById('ad-play');
    if (playBtn) playBtn.click();   // pause it at the start
  }, 100);

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        section.classList.add('in-view');
        observer.unobserve(section);

        setTimeout(function () {
          // restart from the beginning, then it plays
          var restartBtn = document.getElementById('ad-restart');
          if (restartBtn) restartBtn.click();
        }, 1000);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(section);
});