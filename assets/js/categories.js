/* ============================================================
   LIBRAVIA — CATEGORIES PAGE
   Sort · Card interactions
   ============================================================ */

(function () {
  'use strict';

  var grid = document.getElementById('bk_cat_grid');
  var sortSelect = document.getElementById('bk_cat_sort');
  var emptyEl = document.getElementById('bk_cat_empty');

  if (!grid || !sortSelect) return;

  var cards = Array.prototype.slice.call(
    grid.querySelectorAll('.bk_cat_card')
  );

  if (!cards.length) return;

  /* ------------------------------------------------------------
     SORT
     ------------------------------------------------------------ */
  function applySort() {
    var value = sortSelect.value;
    var sorted = cards.slice();

    sorted.sort(function (a, b) {
      var aName  = (a.dataset.name || '').toLowerCase();
      var bName  = (b.dataset.name || '').toLowerCase();
      var aCount = parseInt(a.dataset.count || 0, 10);
      var bCount = parseInt(b.dataset.count || 0, 10);
      var aPop   = parseInt(a.dataset.popularity || 0, 10);
      var bPop   = parseInt(b.dataset.popularity || 0, 10);

      switch (value) {
        case 'az':
          return aName.localeCompare(bName);

        case 'za':
          return bName.localeCompare(aName);

        case 'count':
          return bCount - aCount;

        case 'popular':
        default:
          return bPop - aPop;
      }
    });

    sorted.forEach(function (card) {
      grid.appendChild(card);
    });

    // reset empty state visibility (category grid always has items)
    if (emptyEl) emptyEl.classList.remove('bk_visible');
  }

  sortSelect.addEventListener('change', applySort);

  /* ------------------------------------------------------------
     INITIAL
     ------------------------------------------------------------ */
  applySort();

})();