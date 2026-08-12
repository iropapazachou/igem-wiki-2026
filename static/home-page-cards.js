// Build the 10x10 dot grids and enable tap-to-flip on mobile
document.querySelectorAll('.dot-grid').forEach(function (grid) {
  var filled = parseInt(grid.dataset.filled, 10) || 0;
  for (var i = 0; i < 100; i++) {
    var dot = document.createElement('span');
    if (i < filled) dot.className = 'on';
    grid.appendChild(dot);
  }
});

document.querySelectorAll('.flip-card').forEach(function (card) {
  card.addEventListener('click', function () {
    card.classList.toggle('is-flipped');
  });
});