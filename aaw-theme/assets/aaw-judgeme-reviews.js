(function () {
  var REVIEW_SELECTOR = '.jdgm-review-widget .jdgm-rev';
  var WIDGET_SELECTOR = '.jdgm-review-widget';
  var PHOTO_SELECTOR = [
    '.jdgm-rev__pics',
    '.jdgm-rev__pic',
    '.jdgm-rev__pic-link',
    '.jdgm-rev__media',
    '.jdgm-rev__media-grid',
    '.jdgm-rev__attachment',
    'img',
    'video'
  ].join(',');
  var BODY_SELECTOR = '.jdgm-rev__body, .jdgm-rev__content, .jdgm-rev__text';

  function hasReviewMedia(review) {
    var media = review.querySelector(PHOTO_SELECTOR);
    if (!media) return false;
    if (media.matches && media.matches('img,video')) return true;
    return !!media.querySelector('img,video,a');
  }

  function reviewLength(review) {
    var body = review.querySelector(BODY_SELECTOR) || review;
    return (body.textContent || '').replace(/\s+/g, ' ').trim().length;
  }

  function reviewKey(review) {
    return [
      hasReviewMedia(review) ? 1 : 0,
      reviewLength(review),
      review.getAttribute('data-review-id') || review.id || ''
    ].join(':');
  }

  function sortWidget(widget) {
    var reviews = Array.prototype.slice.call(widget.querySelectorAll(REVIEW_SELECTOR));
    if (reviews.length < 2) return;

    var parent = reviews[0].parentNode;
    if (!parent) return;

    var sortable = reviews.filter(function (review) {
      return review.parentNode === parent;
    });
    if (sortable.length < 2) return;

    var current = sortable.map(reviewKey).join('|');
    var sorted = sortable.slice().sort(function (a, b) {
      var aPhoto = hasReviewMedia(a) ? 1 : 0;
      var bPhoto = hasReviewMedia(b) ? 1 : 0;
      if (aPhoto !== bPhoto) return bPhoto - aPhoto;
      return reviewLength(b) - reviewLength(a);
    });
    var next = sorted.map(reviewKey).join('|');
    if (current === next || parent.dataset.aawJudgeMeSort === next) return;

    var fragment = document.createDocumentFragment();
    sorted.forEach(function (review) {
      fragment.appendChild(review);
    });
    parent.appendChild(fragment);
    parent.dataset.aawJudgeMeSort = next;
  }

  function sortAllWidgets() {
    document.querySelectorAll(WIDGET_SELECTOR).forEach(sortWidget);
  }

  function debounceSort() {
    window.clearTimeout(debounceSort.timer);
    debounceSort.timer = window.setTimeout(sortAllWidgets, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sortAllWidgets);
  } else {
    sortAllWidgets();
  }

  window.addEventListener('load', sortAllWidgets);

  if ('MutationObserver' in window) {
    new MutationObserver(debounceSort).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
