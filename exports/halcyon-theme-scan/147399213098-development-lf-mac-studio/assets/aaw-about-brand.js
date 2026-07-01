(function () {
  function initTimeline(root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-timeline-target]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[data-timeline-panel]'));
    var progress = root.querySelector('.aaw-timeline-progress i');

    function activate(target, focusPanel) {
      var activeIndex = 0;

      buttons.forEach(function (button, index) {
        var isActive = button.getAttribute('data-timeline-target') === target;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) activeIndex = index;
      });

      panels.forEach(function (panel) {
        var isActive = panel.getAttribute('data-timeline-panel') === target;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
        if (isActive && focusPanel) panel.focus({ preventScroll: true });
      });

      if (progress && buttons.length > 1) {
        progress.style.width = ((activeIndex / (buttons.length - 1)) * 100) + '%';
      }
    }

    buttons.forEach(function (button, index) {
      button.addEventListener('click', function () {
        activate(button.getAttribute('data-timeline-target'), false);
      });

      button.addEventListener('keydown', function (event) {
        var nextIndex = index;
        if (event.key === 'ArrowRight') nextIndex = Math.min(buttons.length - 1, index + 1);
        if (event.key === 'ArrowLeft') nextIndex = Math.max(0, index - 1);
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = buttons.length - 1;
        if (nextIndex !== index) {
          event.preventDefault();
          buttons[nextIndex].focus();
          activate(buttons[nextIndex].getAttribute('data-timeline-target'), false);
        }
      });
    });

    activate(buttons[0] && buttons[0].getAttribute('data-timeline-target'), false);
  }

  function initReveal(shell) {
    var revealItems = shell.querySelectorAll('.aaw-about-section, .aaw-about-stat-strip, .aaw-about-final');
    if (!('IntersectionObserver' in window)) {
      revealItems.forEach(function (item) { item.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18 });

    revealItems.forEach(function (item) {
      item.classList.add('aaw-reveal');
      observer.observe(item);
    });
  }

  function init() {
    document.querySelectorAll('[data-aaw-timeline]').forEach(initTimeline);
    document.querySelectorAll('[data-aaw-about]').forEach(initReveal);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
