document.addEventListener('DOMContentLoaded', function () {
  var levels = {
    1: { title: "Reflecting on design decisions", badge: "HIGH",
         desc: "Iterative, targeted dialogues with stakeholders, documented in a detailed and transparent way, led to a strategic pivot that dynamically reshaped our project design." },
    2: { title: "Exploring & reflecting on context beyond the lab", badge: "HIGH",
         desc: "Rigorous primary research and contextual analysis directly guided our project development while revealing critical policy gaps." },
    3: { title: "Incorporating diverse perspectives", badge: "MID-HIGH / HIGH",
         desc: "Structured feedback channels allowed us to synthesize diverse perspectives and directly translate critical expert opinions into actionable design updates." },
    4: { title: "Anticipating positive and negative impacts", badge: "HIGH",
         desc: "Proactively established sufficient technical countermeasures to mitigate potential harm." },
    5: { title: "Responding to human practices work — Co-evolution", badge: "HIGH",
         desc: "The team's scientific, technical, safety and outreach trajectory continuously evolved alongside our Human Practices insights." },
    6: { title: "Approaching limitations with integrity", badge: "HIGH",
         desc: "Transparently documenting and evaluating project limitations allowed us to adapt and create a structured, actionable roadmap for future optimization." }
  };

  var panel = document.getElementById('maturity-panel');
  var buttons = document.querySelectorAll('.lvl-btn');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var n = btn.dataset.level;
      var d = levels[n];
      if (!d) return;

      panel.innerHTML =
        '<div class="mp-level-num">Level ' + n + '</div>' +
        '<div class="mp-level-title">' + d.title + '</div>' +
        '<div class="mp-badge">' + d.badge + '</div>' +
        '<p class="mp-desc">' + d.desc + '</p>';

      buttons.forEach(function (b) { b.classList.remove('is-selected'); });
      btn.classList.add('is-selected');
    });
  });
});