
(function () {
  'use strict';

  /* ============================================================
     TABS
     ============================================================ */
  var tabButtons = document.querySelectorAll('.bk_book_tab_btn');
  var tabPanels = document.querySelectorAll('.bk_book_tab_panel');

  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = this.dataset.tab;

      tabButtons.forEach(function (b) {
        b.classList.remove('bk_tab_active');
      });
      this.classList.add('bk_tab_active');

      tabPanels.forEach(function (panel) {
        panel.classList.remove('bk_tab_visible');
      });

      var activePanel = document.querySelector('[data-panel="' + target + '"]');
      if (activePanel) {
        // Force reflow so animation replays
        void activePanel.offsetWidth;
        activePanel.classList.add('bk_tab_visible');
      }
    });
  });

  /* ============================================================
     WISHLIST BUTTON
     ============================================================ */
  var wishlistBtn = document.getElementById('bk_wishlist');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function () {
      this.classList.toggle('bk_wishlist_active');
      var icon = this.querySelector('i');
      if (icon) {
        if (this.classList.contains('bk_wishlist_active')) {
          icon.classList.remove('fa-regular');
          icon.classList.add('fa-solid');
        } else {
          icon.classList.remove('fa-solid');
          icon.classList.add('fa-regular');
        }
      }
    });
  }

  /* ============================================================
     SHARE BUTTON
     ============================================================ */
  var shareBtn = document.getElementById('bk_share');
  if (shareBtn) {
    shareBtn.addEventListener('click', function () {
      var url = window.location.href;
      var title = document.title;

      if (navigator.share) {
        navigator.share({
          title: title,
          url: url
        }).catch(function () {
          // User cancelled — no action needed
        });
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          var icon = shareBtn.querySelector('i');
          if (icon) {
            var originalClass = icon.className;
            icon.className = 'fa-solid fa-check';
            setTimeout(function () {
              icon.className = originalClass;
            }, 1600);
          }
        });
      }
    });
  }

  /* ============================================================
     READ SAMPLE (scrolls to the description tab as a demo)
     ============================================================ */
  var readSampleBtn = document.getElementById('bk_read_sample');
  if (readSampleBtn) {
    readSampleBtn.addEventListener('click', function () {
      var descTab = document.querySelector('[data-tab="description"]');
      if (descTab) {
        descTab.click();
        var tabsSection = document.querySelector('.bk_book_tabs');
        if (tabsSection) {
          tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  /* ============================================================
     NAVBAR SCROLL STATE
     ============================================================ */
  var navbar = document.querySelector('.bk_navbar');
  if (navbar) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        navbar.style.background = 'rgba(249, 250, 245, 0.96)';
        navbar.style.boxShadow = '0 2px 12px rgba(31, 41, 55, 0.06)';
      } else {
        navbar.style.background = 'rgba(249, 250, 245, 0.9)';
        navbar.style.boxShadow = '0 1px 2px rgba(31, 41, 55, 0.03)';
      }
    }, { passive: true });
  }

})();