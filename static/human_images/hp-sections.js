document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.hp-icon-btn');
  var sections = document.querySelectorAll('.stakeholder-section');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var targetId = btn.dataset.target;

      sections.forEach(function (s) { s.classList.remove('is-open'); });
      buttons.forEach(function (b) { b.classList.remove('is-active'); });

      var target = document.getElementById(targetId);
      if (target) {
        target.classList.add('is-open');
        btn.classList.add('is-active');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
  var modal = document.getElementById('stk-modal');
  var modalContent = document.getElementById('stk-modal-content');
  var closeBtn = document.getElementById('stk-modal-close');

  document.querySelectorAll('.stk-readmore').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var card = btn.closest('.stk-card');
      var name = card.querySelector('h3') ? card.querySelector('h3').textContent : '';
      var full = card.querySelector('.stk-full');
      var fullHTML = full ? full.innerHTML : '<p>No details yet.</p>';

      modalContent.innerHTML = '<h3>' + name + '</h3>' + fullHTML;

      modal.classList.add('is-open');
      document.body.classList.add('modal-open');
    });
  });

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
});