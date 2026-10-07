(function () {
  'use strict';

  /* ============================================================
     FILTER STATE
     ============================================================ */
  var state = {
    categories: ['all'],
    formats: [],
    rating: 0,
    priceMin: null,
    priceMax: null,
    sort: 'popular'
  };

  var cards = Array.from(document.querySelectorAll('.bk_shop_card'));
  var categoryButtons = document.querySelectorAll('[data-filter="category"]');
  var formatButtons = document.querySelectorAll('[data-filter="format"]');
  var ratingButtons = document.querySelectorAll('.bk_rating_filter');
  var sortSelect = document.getElementById('bk_sort');
  var grid = document.getElementById('bk_shop_grid');
  var emptyEl = document.getElementById('bk_shop_empty');
  var countVisible = document.getElementById('bk_shop_visible_count');
  var toolbarLabel = document.getElementById('bk_toolbar_label');
  var activeFiltersWrap = document.getElementById('bk_active_filters');
  var priceMinInput = document.getElementById('bk_price_min');
  var priceMaxInput = document.getElementById('bk_price_max');

  /* ============================================================
     APPLY FILTERS
     ============================================================ */
  function applyFilters() {
    var visible = 0;

    cards.forEach(function (card) {
      var cat = card.dataset.category;
      var rating = parseFloat(card.dataset.rating);
      var price = parseFloat(card.dataset.price);
      var format = card.dataset.format;

      // Category match
      var catMatch = state.categories.indexOf('all') !== -1 ||
                     state.categories.indexOf(cat) !== -1;

      // Format match
      var formatMatch = state.formats.length === 0 ||
                        state.formats.indexOf(format) !== -1;

      // Rating match
      var ratingMatch = state.rating === 0 || rating >= state.rating;

      // Price match
      var priceMatch = true;
      if (state.priceMin !== null && price < state.priceMin) priceMatch = false;
      if (state.priceMax !== null && price > state.priceMax) priceMatch = false;

      var match = catMatch && formatMatch && ratingMatch && priceMatch;

      if (match) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });

    // Empty state
    if (emptyEl) {
      emptyEl.classList.toggle('bk_visible', visible === 0);
    }
    if (grid) {
      grid.style.display = visible === 0 ? 'none' : '';
    }

    // Count + toolbar
    if (countVisible) countVisible.textContent = visible;
    if (toolbarLabel) {
      toolbarLabel.textContent = visible === cards.length
        ? 'Showing all ' + visible + ' titles'
        : 'Showing ' + visible + ' of ' + cards.length + ' titles';
    }

    renderActiveChips();
  }

  /* ============================================================
     SORT
     ============================================================ */
  function applySort() {
    var sorted = cards.slice();

    sorted.sort(function (a, b) {
      var aData = a.dataset;
      var bData = b.dataset;

      switch (state.sort) {
        case 'newest':
          return parseInt(bData.id || 0) - parseInt(aData.id || 0);
        case 'rating':
          return parseFloat(bData.rating) - parseFloat(aData.rating);
        case 'price_low':
          return parseFloat(aData.price) - parseFloat(bData.price);
        case 'price_high':
          return parseFloat(bData.price) - parseFloat(aData.price);
        case 'title':
          var aTitle = a.querySelector('.bk_shop_name');
          var bTitle = b.querySelector('.bk_shop_name');
          return aTitle.textContent.localeCompare(bTitle.textContent);
        case 'popular':
        default:
          return parseFloat(bData.rating) - parseFloat(aData.rating);
      }
    });

    if (grid) {
      sorted.forEach(function (card) {
        grid.appendChild(card);
      });
    }
  }

  /* ============================================================
     ACTIVE FILTER CHIPS
     ============================================================ */
  function renderActiveChips() {
    if (!activeFiltersWrap) return;
    activeFiltersWrap.innerHTML = '';

    // Category chips (skip 'all')
    state.categories.forEach(function (cat) {
      if (cat === 'all') return;
      activeFiltersWrap.appendChild(buildChip(cat, function () {
        state.categories = state.categories.filter(function (c) { return c !== cat; });
        if (state.categories.length === 0) state.categories = ['all'];
        syncCategoryButtons();
        applyFilters();
      }));
    });

    // Format chips
    state.formats.forEach(function (fmt) {
      activeFiltersWrap.appendChild(buildChip(fmt, function () {
        state.formats = state.formats.filter(function (f) { return f !== fmt; });
        syncFormatButtons();
        applyFilters();
      }));
    });

    // Rating chip
    if (state.rating > 0) {
      activeFiltersWrap.appendChild(buildChip(state.rating + '+ stars', function () {
        state.rating = 0;
        ratingButtons.forEach(function (b) { b.classList.remove('bk_filter_active'); });
        applyFilters();
      }));
    }

    // Price chip
    if (state.priceMin !== null || state.priceMax !== null) {
      var label = '$' + (state.priceMin || 0) + ' – $' + (state.priceMax || '∞');
      activeFiltersWrap.appendChild(buildChip(label, function () {
        state.priceMin = null;
        state.priceMax = null;
        if (priceMinInput) priceMinInput.value = '';
        if (priceMaxInput) priceMaxInput.value = '';
        applyFilters();
      }));
    }
  }

  function buildChip(label, onRemove) {
    var chip = document.createElement('span');
    chip.className = 'bk_active_filter_chip';
    chip.innerHTML = '<span>' + label + '</span>';

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Remove filter ' + label);
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    btn.addEventListener('click', onRemove);
    chip.appendChild(btn);

    return chip;
  }

  /* ============================================================
     SYNC BUTTON STATES
     ============================================================ */
  function syncCategoryButtons() {
    categoryButtons.forEach(function (btn) {
      var val = btn.dataset.value;
      var isActive = state.categories.indexOf(val) !== -1;
      btn.classList.toggle('bk_filter_active', isActive);
    });
  }

  function syncFormatButtons() {
    formatButtons.forEach(function (btn) {
      var val = btn.dataset.value;
      var isActive = state.formats.indexOf(val) !== -1;
      btn.classList.toggle('bk_filter_active', isActive);
    });
  }

  /* ============================================================
     EVENT LISTENERS — CATEGORY
     ============================================================ */
  categoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = this.dataset.value;

      if (val === 'all') {
        state.categories = ['all'];
      } else {
        // Remove 'all' when picking a specific category
        state.categories = state.categories.filter(function (c) { return c !== 'all'; });

        if (state.categories.indexOf(val) !== -1) {
          state.categories = state.categories.filter(function (c) { return c !== val; });
        } else {
          state.categories.push(val);
        }

        if (state.categories.length === 0) state.categories = ['all'];
      }

      syncCategoryButtons();
      applyFilters();
    });
  });

  /* ============================================================
     EVENT LISTENERS — FORMAT
     ============================================================ */
  formatButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = this.dataset.value;

      if (state.formats.indexOf(val) !== -1) {
        state.formats = state.formats.filter(function (f) { return f !== val; });
      } else {
        state.formats.push(val);
      }

      syncFormatButtons();
      applyFilters();
    });
  });

  /* ============================================================
     EVENT LISTENERS — RATING
     ============================================================ */
  ratingButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var val = parseInt(this.dataset.rating, 10);

      if (state.rating === val) {
        state.rating = 0;
        this.classList.remove('bk_filter_active');
      } else {
        state.rating = val;
        ratingButtons.forEach(function (b) { b.classList.remove('bk_filter_active'); });
        this.classList.add('bk_filter_active');
      }

      applyFilters();
    });
  });

  /* ============================================================
     EVENT LISTENERS — PRICE
     ============================================================ */
  function handlePriceChange() {
    var min = priceMinInput && priceMinInput.value !== '' ? parseFloat(priceMinInput.value) : null;
    var max = priceMaxInput && priceMaxInput.value !== '' ? parseFloat(priceMaxInput.value) : null;

    state.priceMin = isNaN(min) ? null : min;
    state.priceMax = isNaN(max) ? null : max;

    applyFilters();
  }

  if (priceMinInput) priceMinInput.addEventListener('input', handlePriceChange);
  if (priceMaxInput) priceMaxInput.addEventListener('input', handlePriceChange);

  /* ============================================================
     EVENT LISTENERS — SORT
     ============================================================ */
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      state.sort = this.value;
      applySort();
    });
  }

  /* ============================================================
     WISHLIST TOGGLE
     ============================================================ */
  document.querySelectorAll('.bk_shop_wishlist').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.toggle('bk_active');

      var icon = this.querySelector('i');
      if (this.classList.contains('bk_active')) {
        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');
      } else {
        icon.classList.remove('fa-solid');
        icon.classList.add('fa-regular');
      }
    });
  });

  /* ============================================================
     MOBILE FILTER DRAWER
     ============================================================ */
  var mobileFilterBtn = document.getElementById('bk_open_filters');
  var mobileFilterDrawer = document.getElementById('bk_mobile_filter_drawer');
  var mobileFilterOverlay = document.getElementById('bk_mobile_filter_overlay');
  var mobileFilterClose = document.getElementById('bk_mobile_filter_close');
  var mobileFilterApply = document.getElementById('bk_mobile_filter_apply');

  function openDrawer() {
    if (!mobileFilterDrawer) return;
    mobileFilterDrawer.classList.add('bk_open');
    mobileFilterDrawer.setAttribute('aria-hidden', 'false');
    if (mobileFilterOverlay) mobileFilterOverlay.classList.add('bk_open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileFilterDrawer) return;
    mobileFilterDrawer.classList.remove('bk_open');
    mobileFilterDrawer.setAttribute('aria-hidden', 'true');
    if (mobileFilterOverlay) mobileFilterOverlay.classList.remove('bk_open');
    document.body.style.overflow = '';
  }

  if (mobileFilterBtn) mobileFilterBtn.addEventListener('click', openDrawer);
  if (mobileFilterClose) mobileFilterClose.addEventListener('click', closeDrawer);
  if (mobileFilterOverlay) mobileFilterOverlay.addEventListener('click', closeDrawer);
  if (mobileFilterApply) mobileFilterApply.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ============================================================
     INITIAL
     ============================================================ */
  applyFilters();

})();