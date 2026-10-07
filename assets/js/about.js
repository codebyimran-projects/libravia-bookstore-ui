/* ============================================================
   LIBRAVIA — ABOUT PAGE
   Subtle interactions: story image fallback, quiet polish
   ============================================================ */

(function () {
  'use strict';

  /* ------------------------------------------------------------
     STORY IMAGE FALLBACK
     If the story photo fails to load, show an inline book icon
     behind the gradient instead of a broken image.
     ------------------------------------------------------------ */
  var storyImg = document.querySelector('.bk_about_story_photo img');

  if (storyImg) {
    storyImg.addEventListener('error', function () {
      this.style.display = 'none';
      if (this.parentElement) {
        this.parentElement.classList.add('bk_about_photo_fallback');
      }
    });
  }

  /* ------------------------------------------------------------
     SMOOTH SCROLL TO CTA
     When "See Categories" is clicked, scroll to the values grid
     instead of jumping. Graceful enhancement only.
     ------------------------------------------------------------ */
  var categoriesBtn = document.querySelector('.bk_about_cta_btn_ghost');

  if (categoriesBtn) {
    categoriesBtn.addEventListener('click', function (e) {
      var target = document.querySelector('.bk_about_values');

      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      // Otherwise let the default navigation happen (goes to categories.html)
    });
  }

})();