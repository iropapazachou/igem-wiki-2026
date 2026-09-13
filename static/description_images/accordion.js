document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.acc-header').forEach(function (header) {
    header.addEventListener('click', function () {
      var body = header.nextElementSibling;
      var open = body.classList.contains('is-open');
      body.classList.toggle('is-open', !open);
      header.classList.toggle('is-open', !open);
    });
  });
});