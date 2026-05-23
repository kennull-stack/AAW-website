(function () {
  function initTimeline(root) {
    var progress = root.querySelector('.aaw-timeline-rail i');
    var items = Array.prototype.slice.call(root.querySelectorAll('.aaw-timeline-item'));

    function updateProgress() {
      if (!progress) return;

      var rect = root.getBoundingClientRect();
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var start = viewport * 0.68;
      var end = viewport * 0.28;
      var travel = Math.max(1, rect.height - (start - end));
      var rawProgress = (start - rect.top) / travel;
      var clamped = Math.max(0, Math.min(1, rawProgress));

      progress.style.setProperty('--timeline-progress', (clamped * 100) + '%');
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      }, { threshold: 0.26, rootMargin: '0px 0px -8% 0px' });

      items.forEach(function (item) { observer.observe(item); });
    } else {
      items.forEach(function (item) { item.classList.add('is-visible'); });
    }

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
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
