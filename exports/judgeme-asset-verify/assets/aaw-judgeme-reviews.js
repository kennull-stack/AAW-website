(function () {
  var WIDGET_SELECTOR = '.jdgm-review-widget';
  var REVIEW_SELECTOR = '.jdgm-rev';
  var REVIEWS_PARENT_SELECTOR = '.jdgm-rev-widg__reviews';
  var GALLERY_DATA_SELECTOR = '.jdgm-gallery-data[data-json]';
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
  var FIRST_PAGE_REVIEW_COUNT = 5;

  function normalizeText(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  function textFromHtml(html) {
    var holder = document.createElement('div');
    holder.innerHTML = html || '';
    return normalizeText(holder.textContent);
  }

  function sanitizeReviewHtml(html) {
    var holder = document.createElement('div');
    holder.innerHTML = html || '';
    holder.querySelectorAll('script, style, iframe, object, embed').forEach(function (node) {
      node.remove();
    });
    holder.querySelectorAll('*').forEach(function (node) {
      Array.prototype.slice.call(node.attributes).forEach(function (attribute) {
        if (/^on/i.test(attribute.name)) node.removeAttribute(attribute.name);
      });
    });
    return holder.innerHTML;
  }

  function hasReviewMedia(review) {
    var media = review.querySelector(PHOTO_SELECTOR);
    if (!media) return false;
    if (media.matches && media.matches('img,video')) return true;
    return !!media.querySelector('img,video,a');
  }

  function reviewLength(review) {
    var body = review.querySelector(BODY_SELECTOR) || review;
    return normalizeText(body.textContent).length;
  }

  function galleryReviewLength(review) {
    return [
      review.title,
      textFromHtml(review.body_html || review.body)
    ].join(' ').length;
  }

  function reviewId(review) {
    return review.getAttribute('data-review-id') || review.id || '';
  }

  function reviewKey(review) {
    return [
      hasReviewMedia(review) ? 1 : 0,
      reviewLength(review),
      reviewId(review)
    ].join(':');
  }

  function parseGalleryReviews(widget) {
    var dataNode = widget.querySelector(GALLERY_DATA_SELECTOR);
    if (!dataNode) return [];

    try {
      var reviews = JSON.parse(dataNode.getAttribute('data-json') || '[]');
      if (!Array.isArray(reviews)) return [];
      return reviews.filter(function (review) {
        return review && Array.isArray(review.pictures_urls) && review.pictures_urls.length;
      });
    } catch (error) {
      return [];
    }
  }

  function getReviewsParent(widget) {
    var parent = widget.querySelector(REVIEWS_PARENT_SELECTOR);
    if (parent) return parent;

    var firstReview = widget.querySelector(REVIEW_SELECTOR);
    return firstReview ? firstReview.parentNode : null;
  }

  function getActivePageNumber(widget) {
    var active = widget.querySelector([
      '.jdgm-paginate__page.jdgm-curt',
      '.jdgm-paginate__page.jdgm--current',
      '.jdgm-paginate__page.active',
      '.jdgm-paginate__page[aria-current="page"]'
    ].join(','));

    if (!active) return 1;
    var number = parseInt(normalizeText(active.textContent), 10);
    return Number.isFinite(number) ? number : 1;
  }

  function buildStars(rating) {
    var stars = document.createElement('div');
    stars.className = 'jdgm-rev__rating';
    stars.setAttribute('data-score', rating || 5);

    for (var index = 1; index <= 5; index += 1) {
      var star = document.createElement('span');
      star.className = 'jdgm-star ' + (index <= rating ? 'jdgm--on' : 'jdgm--off');
      star.setAttribute('role', 'img');
      star.setAttribute('aria-label', index <= rating ? 'star' : 'empty star');
      stars.appendChild(star);
    }

    return stars;
  }

  function buildReviewer(review) {
    var author = document.createElement('div');
    author.className = 'jdgm-rev__author-wrapper';

    var icon = document.createElement('span');
    icon.className = 'jdgm-rev__buyer-badge-wrapper';
    icon.innerHTML = '<span class="jdgm-rev__icon"></span>';
    author.appendChild(icon);

    var name = document.createElement('span');
    name.className = 'jdgm-rev__author';
    name.textContent = review.name || 'AAW Listener';
    author.appendChild(name);

    return author;
  }

  function buildGalleryImages(review) {
    var urls = review.pictures_urls || [];
    var thumbs = review.pictures_urls_compact || urls;
    var wrapper = document.createElement('div');
    wrapper.className = 'jdgm-rev__pics';

    urls.forEach(function (url, index) {
      if (!url) return;

      var link = document.createElement('a');
      link.className = 'jdgm-rev__pic-link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';

      var image = document.createElement('img');
      image.className = 'jdgm-rev__pic-img';
      image.src = thumbs[index] || url;
      image.alt = 'Customer review photo';
      image.loading = 'lazy';

      link.appendChild(image);
      wrapper.appendChild(link);
    });

    return wrapper;
  }

  function buildGalleryReview(review) {
    var article = document.createElement('div');
    article.className = 'jdgm-rev jdgm-divider-top aaw-curated-jdgm-rev';
    article.setAttribute('data-review-id', review.uuid || review.id || '');
    article.setAttribute('data-aaw-curated-review', 'true');

    article.appendChild(buildStars(Number(review.rating) || 5));
    article.appendChild(buildReviewer(review));

    if (review.title) {
      var title = document.createElement('b');
      title.className = 'jdgm-rev__title';
      title.textContent = review.title;
      article.appendChild(title);
    }

    var body = document.createElement('div');
    body.className = 'jdgm-rev__body';
    body.innerHTML = sanitizeReviewHtml(review.body_html || review.body || '');
    article.appendChild(body);

    article.appendChild(buildGalleryImages(review));
    return article;
  }

  function sortDomReviews(reviews) {
    return reviews.slice().sort(function (a, b) {
      var aPhoto = hasReviewMedia(a) ? 1 : 0;
      var bPhoto = hasReviewMedia(b) ? 1 : 0;
      if (aPhoto !== bPhoto) return bPhoto - aPhoto;
      return reviewLength(b) - reviewLength(a);
    });
  }

  function sortGalleryReviews(reviews) {
    return reviews.slice().sort(function (a, b) {
      return galleryReviewLength(b) - galleryReviewLength(a);
    });
  }

  function sortCurrentPage(widget) {
    var parent = getReviewsParent(widget);
    if (!parent) return;

    var reviews = Array.prototype.slice.call(parent.querySelectorAll(REVIEW_SELECTOR));
    if (reviews.length < 2) return;

    var current = reviews.map(reviewKey).join('|');
    var sorted = sortDomReviews(reviews);
    var next = sorted.map(reviewKey).join('|');
    if (current === next || parent.dataset.aawJudgeMeSort === next) return;

    var fragment = document.createDocumentFragment();
    sorted.forEach(function (review) {
      fragment.appendChild(review);
    });
    parent.appendChild(fragment);
    parent.dataset.aawJudgeMeSort = next;
  }

  function curateFirstPage(widget) {
    var parent = getReviewsParent(widget);
    if (!parent) return;

    if (getActivePageNumber(widget) !== 1) {
      sortCurrentPage(widget);
      return;
    }

    var galleryReviews = sortGalleryReviews(parseGalleryReviews(widget));
    if (!galleryReviews.length) {
      sortCurrentPage(widget);
      return;
    }

    var currentReviews = sortDomReviews(Array.prototype.slice.call(parent.querySelectorAll(REVIEW_SELECTOR)));
    var selectedIds = {};
    var selected = [];

    galleryReviews.forEach(function (review) {
      var id = review.uuid || review.id || '';
      if (!id || selectedIds[id]) return;
      selectedIds[id] = true;
      selected.push(buildGalleryReview(review));
    });

    currentReviews.forEach(function (review) {
      var id = reviewId(review);
      if (id && selectedIds[id]) return;
      if (id) selectedIds[id] = true;
      selected.push(review);
    });

    var limit = Math.max(FIRST_PAGE_REVIEW_COUNT, Math.min(currentReviews.length || FIRST_PAGE_REVIEW_COUNT, 10));
    selected = selected.slice(0, limit);
    var signature = selected.map(reviewId).join('|');
    var visibleSignature = Array.prototype.slice.call(parent.querySelectorAll(REVIEW_SELECTOR)).map(reviewId).join('|');
    if (parent.dataset.aawJudgeMeCurated === signature && visibleSignature === signature) return;

    parent.querySelectorAll(REVIEW_SELECTOR).forEach(function (review) {
      review.remove();
    });

    var fragment = document.createDocumentFragment();
    selected.forEach(function (review) {
      fragment.appendChild(review);
    });
    parent.appendChild(fragment);
    parent.dataset.aawJudgeMeCurated = signature;
  }

  function curateAllWidgets() {
    document.querySelectorAll(WIDGET_SELECTOR).forEach(curateFirstPage);
  }

  function debounceCurate() {
    window.clearTimeout(debounceCurate.timer);
    debounceCurate.timer = window.setTimeout(curateAllWidgets, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', curateAllWidgets);
  } else {
    curateAllWidgets();
  }

  window.addEventListener('load', curateAllWidgets);

  if ('MutationObserver' in window) {
    new MutationObserver(debounceCurate).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
