document.addEventListener('DOMContentLoaded', function () {
  var hero     = document.getElementById('gallery-hero');
  var title    = document.getElementById('gallery-title');
  var readmore = document.getElementById('gallery-readmore');
  var tiles    = document.querySelectorAll('.gallery-tile');

  // set the initial background to the first (active) tile
  var first = document.querySelector('.gallery-tile.is-active') || tiles[0];
  if (first) hero.style.backgroundImage = "url('" + first.dataset.bg + "')";

  tiles.forEach(function (tile) {
    tile.addEventListener('click', function () {
      hero.style.backgroundImage = "url('" + tile.dataset.bg + "')";
      title.textContent = tile.dataset.title;
      readmore.setAttribute('href', tile.dataset.link);

      tiles.forEach(function (t) { t.classList.remove('is-active'); });
      tile.classList.add('is-active');
    });
  });
});