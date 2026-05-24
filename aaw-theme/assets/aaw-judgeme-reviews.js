(function () {
  if (window.AAWJudgeMeReviewSorterLoaded) return;
  window.AAWJudgeMeReviewSorterLoaded = true;

  var WIDGET_SELECTOR = '.jdgm-review-widget';
  var REVIEW_SELECTOR = '.jdgm-rev';
  var REVIEWS_PARENT_SELECTOR = '.jdgm-rev-widg__reviews';
  var GALLERY_DATA_SELECTOR = '.jdgm-gallery-data[data-json]';
  var DEFAULT_SHOP_DOMAIN = 'advanced-acousticwerkes.myshopify.com';
  var DEFAULT_PLATFORM = 'shopify';
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
  var HOME_SCHEMA_ID = 'aaw-judgeme-home-review-schema';
  var HOME_JUDGEME_SELECTOR = [
    '.jdgm-carousel-wrapper',
    '.jdgm-carousel',
    '.jdgm-all-reviews-widget',
    '.jdgm-widget[data-average-rating][data-number-of-reviews]',
    '[class*="jdgm-carousel"]'
  ].join(',');

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

  function getNativeReviews(parent) {
    return Array.prototype.slice.call(parent.querySelectorAll(REVIEW_SELECTOR)).filter(function (review) {
      return !review.hasAttribute('data-aaw-curated-review');
    });
  }

  function hideNativeReviews(parent) {
    getNativeReviews(parent).forEach(function (review) {
      review.setAttribute('data-aaw-native-review-hidden', 'true');
      review.style.display = 'none';
    });
  }

  function revealNativeReviews(parent) {
    getNativeReviews(parent).forEach(function (review) {
      if (review.getAttribute('data-aaw-native-review-hidden') === 'true') {
        review.removeAttribute('data-aaw-native-review-hidden');
        review.style.display = '';
      }
    });
  }

  function removeCuratedReviews(parent) {
    parent.querySelectorAll('[data-aaw-curated-review="true"]').forEach(function (review) {
      review.remove();
    });
    revealNativeReviews(parent);
    delete parent.dataset.aawJudgeMeCurated;
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
    name.textContent = getReviewAuthor(review) || 'AAW Listener';
    author.appendChild(name);

    return author;
  }

  function getReviewAuthor(review) {
    var directKeys = [
      'name',
      'reviewer_name',
      'reviewerName',
      'author',
      'author_name',
      'authorName',
      'display_name',
      'displayName',
      'buyer_name',
      'buyerName',
      'customer_name',
      'customerName',
      'user_name',
      'userName'
    ];
    var nestedKeys = ['reviewer', 'author', 'buyer', 'customer', 'user'];

    for (var index = 0; index < directKeys.length; index += 1) {
      var value = review && review[directKeys[index]];
      if (typeof value === 'string' && normalizeText(value)) return normalizeText(value);
    }

    for (var nestedIndex = 0; nestedIndex < nestedKeys.length; nestedIndex += 1) {
      var nested = review && review[nestedKeys[nestedIndex]];
      if (nested && typeof nested === 'object') {
        var nestedName = getReviewAuthor(nested);
        if (nestedName) return nestedName;
      }
    }

    return '';
  }

  function buildGalleryImages(review) {
    var urls = review.pictures_urls || [];
    var thumbs = review.pictures_urls_compact || urls;
    var wrapper = document.createElement('div');
    wrapper.className = 'jdgm-rev__pics';

    urls.forEach(function (picture, index) {
      var url = extractPictureUrl(picture, ['original', 'large', 'url', 'src', 'normal', 'mfp_src']);
      var thumbUrl = extractPictureUrl(thumbs[index], ['compact', 'thumbnail', 'thumb', 'small', 'url', 'src']) || url;
      if (!url) return;

      var link = document.createElement('a');
      link.className = 'jdgm-rev__pic-link';
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener';

      var image = document.createElement('img');
      image.className = 'jdgm-rev__pic-img';
      image.src = thumbUrl;
      image.alt = 'Customer review photo';
      image.loading = 'lazy';

      link.appendChild(image);
      wrapper.appendChild(link);
    });

    return wrapper;
  }

  function extractPictureUrl(value, preferredKeys) {
    if (!value) return '';
    if (typeof value === 'string') return normalizeImageUrl(value);
    if (typeof value !== 'object') return '';

    var keys = preferredKeys || [];
    for (var index = 0; index < keys.length; index += 1) {
      var direct = extractPictureUrl(value[keys[index]]);
      if (direct) return direct;
    }

    var objectKeys = Object.keys(value);
    for (var keyIndex = 0; keyIndex < objectKeys.length; keyIndex += 1) {
      var nested = extractPictureUrl(value[objectKeys[keyIndex]]);
      if (nested) return nested;
    }

    return '';
  }

  function normalizeImageUrl(url) {
    var value = normalizeText(url);
    if (!value || value === '[object Object]') return '';
    if (value.indexOf('//') === 0) return 'https:' + value;
    if (/^https?:\/\//i.test(value)) return value;
    return '';
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
      title.textContent = textFromHtml(review.title);
      article.appendChild(title);
    }

    var body = document.createElement('div');
    body.className = 'jdgm-rev__body';
    body.innerHTML = sanitizeReviewHtml(review.body_html || review.body || '');
    article.appendChild(body);

    var images = buildGalleryImages(review);
    if (images.children.length) article.appendChild(images);
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
      var aPhoto = Array.isArray(a.pictures_urls) && a.pictures_urls.length ? 1 : 0;
      var bPhoto = Array.isArray(b.pictures_urls) && b.pictures_urls.length ? 1 : 0;
      if (aPhoto !== bPhoto) return bPhoto - aPhoto;
      return galleryReviewLength(b) - galleryReviewLength(a);
    });
  }

  function buildQuery(params) {
    return Object.keys(params).filter(function (key) {
      return params[key] !== null && params[key] !== undefined && params[key] !== '';
    }).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
  }

  function getShopDomain() {
    if (window.Shopify && window.Shopify.shop) return window.Shopify.shop;
    if (window.jdgmSettings && window.jdgmSettings.shop_domain) return window.jdgmSettings.shop_domain;
    return DEFAULT_SHOP_DOMAIN;
  }

  function getPlatform() {
    return (window.jdgmSettings && window.jdgmSettings.platform) || DEFAULT_PLATFORM;
  }

  function fetchManagedReviews(widget, callback) {
    var pager = widget.querySelector('.jdgm-paginate');
    var url = (pager && pager.getAttribute('data-url')) || 'https://api.judge.me/reviews/reviews_for_widget';
    var productId = widget.getAttribute('data-id');
    if (!url || !productId) return;

    var request = new XMLHttpRequest();
    request.open('GET', url + '?' + buildQuery({
      shop_domain: getShopDomain(),
      url: getShopDomain(),
      platform: getPlatform(),
      product_id: productId,
      page: 1,
      per_page: 100
    }), true);

    request.onreadystatechange = function () {
      if (request.readyState !== 4) return;
      if (request.status < 200 || request.status >= 300) return;

      try {
        var payload = JSON.parse(request.responseText);
        if (payload && Array.isArray(payload.reviews) && payload.reviews.length) {
          callback(payload);
        }
      } catch (error) {
        // Leave the static Judge.me markup in place if the API shape changes.
      }
    };

    request.send();
  }

  function setupManagedWidget(widget) {
    if (widget.dataset.aawJudgeMeManaged === 'true' || widget.dataset.aawJudgeMeLoading === 'true') return;
    if (!widget.querySelector('.jdgm-paginate')) return;

    widget.dataset.aawJudgeMeLoading = 'true';
    fetchManagedReviews(widget, function (payload) {
      widget.dataset.aawJudgeMeManaged = 'true';
      widget.dataset.aawJudgeMeUserPaging = 'true';
      widget.aawJudgeMeReviews = sortGalleryReviews(payload.reviews);
      renderManagedPage(widget, 1);
      delete widget.dataset.aawJudgeMeLoading;
    });
  }

  function renderManagedPage(widget, page) {
    var parent = getReviewsParent(widget);
    if (!parent || !Array.isArray(widget.aawJudgeMeReviews)) return;

    var perPage = parseInt((widget.querySelector('.jdgm-paginate') || {}).dataset && widget.querySelector('.jdgm-paginate').dataset.perPage, 10) || FIRST_PAGE_REVIEW_COUNT;
    var totalPages = Math.max(1, Math.ceil(widget.aawJudgeMeReviews.length / perPage));
    var currentPage = Math.max(1, Math.min(page || 1, totalPages));
    var start = (currentPage - 1) * perPage;
    var selected = widget.aawJudgeMeReviews.slice(start, start + perPage).map(buildGalleryReview);

    parent.querySelectorAll('[data-aaw-curated-review="true"]').forEach(function (review) {
      review.remove();
    });
    hideNativeReviews(parent);

    var fragment = document.createDocumentFragment();
    selected.forEach(function (review) {
      fragment.appendChild(review);
    });
    var firstNativeReview = getNativeReviews(parent)[0];
    parent.insertBefore(fragment, firstNativeReview || null);
    parent.dataset.aawJudgeMeCurated = selected.map(reviewId).join('|');

    renderManagedPager(widget, currentPage, totalPages);
  }

  function renderManagedPager(widget, currentPage, totalPages) {
    var pager = widget.querySelector('.jdgm-paginate');
    if (!pager) return;

    pager.innerHTML = '';
    pager.setAttribute('data-aaw-managed-pager', 'true');
    if (totalPages <= 1) {
      pager.style.display = 'none';
      return;
    }
    pager.style.display = '';

    if (currentPage > 1) {
      pager.appendChild(buildPageLink(1, '', 'jdgm-paginate__first-page'));
      pager.appendChild(buildPageLink(currentPage - 1, '', 'jdgm-paginate__prev-page'));
    }

    var start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    var end = Math.min(totalPages, start + 2);
    for (var page = start; page <= end; page += 1) {
      pager.appendChild(buildPageLink(page, String(page), page === currentPage ? 'jdgm-curt' : ''));
    }

    if (currentPage < totalPages) {
      pager.appendChild(buildPageLink(currentPage + 1, '', 'jdgm-paginate__next-page'));
      pager.appendChild(buildPageLink(totalPages, '', 'jdgm-paginate__last-page'));
    }
  }

  function buildPageLink(page, text, extraClass) {
    var link = document.createElement('a');
    link.className = 'jdgm-paginate__page ' + (extraClass || '');
    link.setAttribute('data-page', page);
    link.setAttribute('aria-label', 'Page ' + page);
    link.setAttribute('tabindex', '0');
    link.setAttribute('role', 'button');
    link.textContent = text;
    return link;
  }

  function sortCurrentPage(widget) {
    var parent = getReviewsParent(widget);
    if (!parent) return;

    var reviews = getNativeReviews(parent);
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
    if (widget.dataset.aawJudgeMeManaged === 'true') return;

    if (widget.dataset.aawJudgeMeUserPaging === 'true') {
      removeCuratedReviews(parent);
      sortCurrentPage(widget);
      return;
    }

    if (getActivePageNumber(widget) !== 1) {
      removeCuratedReviews(parent);
      sortCurrentPage(widget);
      return;
    }

    var galleryReviews = sortGalleryReviews(parseGalleryReviews(widget));
    if (!galleryReviews.length) {
      sortCurrentPage(widget);
      return;
    }

    var currentReviews = sortDomReviews(getNativeReviews(parent));
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
      var clone = review.cloneNode(true);
      clone.setAttribute('data-aaw-curated-review', 'true');
      clone.style.display = '';
      selected.push(clone);
    });

    var limit = Math.max(FIRST_PAGE_REVIEW_COUNT, Math.min(currentReviews.length || FIRST_PAGE_REVIEW_COUNT, 10));
    selected = selected.slice(0, limit);
    var signature = selected.map(reviewId).join('|');
    var visibleSignature = Array.prototype.slice.call(parent.querySelectorAll('[data-aaw-curated-review="true"]')).map(reviewId).join('|');
    if (parent.dataset.aawJudgeMeCurated === signature && visibleSignature === signature) return;

    parent.querySelectorAll('[data-aaw-curated-review="true"]').forEach(function (review) {
      review.remove();
    });
    hideNativeReviews(parent);

    var fragment = document.createDocumentFragment();
    selected.forEach(function (review) {
      fragment.appendChild(review);
    });
    var firstNativeReview = getNativeReviews(parent)[0];
    parent.insertBefore(fragment, firstNativeReview || null);
    parent.dataset.aawJudgeMeCurated = signature;
  }

  function curateAllWidgets() {
    document.querySelectorAll(WIDGET_SELECTOR).forEach(curateFirstPage);
    document.querySelectorAll(WIDGET_SELECTOR).forEach(setupManagedWidget);
  }

  function debounceCurate() {
    window.clearTimeout(debounceCurate.timer);
    debounceCurate.timer = window.setTimeout(function () {
      curateAllWidgets();
      injectHomeJudgeMeSchema();
    }, 120);
  }

  function currentHomeUrl() {
    return window.location.origin + '/';
  }

  function numericAttribute(node, names) {
    if (!node) return 0;
    for (var index = 0; index < names.length; index += 1) {
      var name = names[index];
      var value = node.getAttribute(name) || (node.dataset && node.dataset[name.replace(/^data-/, '').replace(/-([a-z])/g, function (_, letter) {
        return letter.toUpperCase();
      })]);
      var parsed = parseFloat(value);
      if (Number.isFinite(parsed) && parsed > 0) return parsed;
    }
    return 0;
  }

  function numericText(node, pattern) {
    if (!node) return 0;
    var text = normalizeText(node.textContent).replace(/,/g, '');
    var match = text.match(pattern);
    var parsed = match && parseFloat(match[1]);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

  function findJudgeMeRatingNode(root) {
    if (!root) return null;
    if (root.matches && root.matches('[data-average-rating][data-number-of-reviews]')) return root;
    return root.querySelector([
      '[data-average-rating][data-number-of-reviews]',
      '[data-average-rating][data-review-count]',
      '.jdgm-average-rating',
      '.jdgm-rating-text'
    ].join(','));
  }

  function extractJudgeMeAggregate(root) {
    var ratingNode = findJudgeMeRatingNode(root);
    var ratingValue = numericAttribute(ratingNode, ['data-average-rating']);
    var reviewCount = numericAttribute(ratingNode, ['data-number-of-reviews', 'data-review-count']);

    if (!ratingValue) {
      var ratingTextNode = root && root.querySelector('.jdgm-rating-text, .jdgm-average-rating');
      ratingValue = numericText(ratingTextNode, /([0-5](?:\.\d+)?)(?:\s*★|\s+out\s+of\s+5|\s*\/\s*5)?/i);
    }

    if (!reviewCount) {
      var countNode = root && root.querySelector('.jdgm-reviews-count, .jdgm-carousel-number-of-reviews, .jdgm-rating-text');
      reviewCount = numericText(countNode, /\((\d+)\)/) || numericText(countNode, /(\d+)\s+reviews?/i) || numericText(countNode, /^(\d+)$/);
    }

    if (!ratingValue || !reviewCount) return null;
    return {
      ratingValue: ratingValue,
      reviewCount: reviewCount
    };
  }

  function ratingFromReview(review) {
    var ratingNode = review.querySelector('[data-score], [data-rating], [aria-label*="star"], [aria-label*="Star"]');
    var score = numericAttribute(ratingNode, ['data-score', 'data-rating']);
    if (score) return score;

    var label = ratingNode && ratingNode.getAttribute('aria-label');
    var match = label && label.match(/([0-5](?:\.\d+)?)\s*(?:out of|\/)\s*5/i);
    if (match) return parseFloat(match[1]);

    var onStars = review.querySelectorAll('.jdgm--on, .jdgm-star.jdgm--on, [class*="star"][class*="on"]').length;
    return onStars > 0 && onStars <= 5 ? onStars : 0;
  }

  function extractJudgeMeReviews(root) {
    if (!root) return [];
    var reviewNodes = Array.prototype.slice.call(root.querySelectorAll([
      '.jdgm-rev',
      '.jdgm-carousel-item',
      '.jdgm-carousel-item__review',
      '[data-review-id]'
    ].join(',')));

    return reviewNodes.map(function (review) {
      var bodyNode = review.querySelector([
        BODY_SELECTOR,
        '.jdgm-carousel-item__review-body',
        '.jdgm-carousel-item__body',
        '[class*="review-body"]',
        '[class*="review_text"]'
      ].join(','));
      var body = normalizeText((bodyNode || review).textContent);
      if (!body || body.length < 24) return null;

      var authorNode = review.querySelector([
        '.jdgm-rev__author',
        '.jdgm-carousel-item__reviewer-name',
        '.jdgm-carousel-item__author',
        '[class*="reviewer-name"]',
        '[class*="author"]'
      ].join(','));
      var rating = ratingFromReview(review);
      var schema = {
        '@type': 'Review',
        itemReviewed: {
          '@id': currentHomeUrl() + '#judgeme-aaw-in-ear-monitors'
        },
        author: {
          '@type': 'Person',
          name: normalizeText(authorNode && authorNode.textContent) || 'Judge.me reviewer'
        },
        reviewBody: body.slice(0, 500)
      };

      if (rating) {
        schema.reviewRating = {
          '@type': 'Rating',
          ratingValue: String(Math.round(rating * 100) / 100),
          bestRating: '5',
          worstRating: '1'
        };
      }
      return schema;
    }).filter(Boolean).slice(0, 5);
  }

  function buildJudgeMeReviewSchema(root) {
    var aggregate = extractJudgeMeAggregate(root);
    if (!aggregate) return null;

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': currentHomeUrl() + '#judgeme-aaw-in-ear-monitors',
      name: 'AAW custom and universal in-ear monitors',
      url: currentHomeUrl(),
      brand: {
        '@type': 'Brand',
        '@id': currentHomeUrl() + '#brand',
        name: 'Advanced AcousticWerkes',
        alternateName: 'AAW'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(Math.round(aggregate.ratingValue * 100) / 100),
        bestRating: '5',
        worstRating: '1',
        reviewCount: String(Math.round(aggregate.reviewCount))
      }
    };
    var reviews = extractJudgeMeReviews(root);
    if (reviews.length) schema.review = reviews;
    return schema;
  }

  function injectHomeJudgeMeSchema() {
    if (window.location.pathname !== '/' && window.location.pathname !== '') return;
    var root = document.querySelector(HOME_JUDGEME_SELECTOR);
    var schema = buildJudgeMeReviewSchema(root);
    if (!schema) return;

    var script = document.getElementById(HOME_SCHEMA_ID);
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = HOME_SCHEMA_ID;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      curateAllWidgets();
      injectHomeJudgeMeSchema();
    });
  } else {
    curateAllWidgets();
    injectHomeJudgeMeSchema();
  }

  document.addEventListener('click', function (event) {
    var pager = event.target && event.target.closest && event.target.closest([
      '.jdgm-paginate',
      '.jdgm-paginate__page',
      '.jdgm-paginate__next-page',
      '.jdgm-paginate__last-page',
      '.jdgm-paginate__prev-page',
      '.jdgm-paginate__first-page'
    ].join(','));
    if (!pager) return;

    var widget = pager.closest(WIDGET_SELECTOR);
    if (widget && widget.dataset.aawJudgeMeManaged === 'true') {
      event.preventDefault();
      event.stopImmediatePropagation();
      var requestedPage = parseInt(pager.getAttribute('data-page'), 10);
      renderManagedPage(widget, requestedPage);
      return;
    }

    if (widget) {
      window.setTimeout(function () {
        var parent = getReviewsParent(widget);
        if (parent) removeCuratedReviews(parent);
        widget.dataset.aawJudgeMeUserPaging = 'true';
      }, 0);
    }
  }, true);

  window.addEventListener('load', function () {
    curateAllWidgets();
    injectHomeJudgeMeSchema();
  });

  if ('MutationObserver' in window) {
    new MutationObserver(debounceCurate).observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }
})();
