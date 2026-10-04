// Navbar Section Code 
(function () {
  'use strict';

  var navbar      = document.getElementById('bk_navbar');
  var hamburger   = document.getElementById('bk_hamburger');
  var mobilePanel = document.getElementById('bk_mobile_panel');
  var searchBtn   = document.getElementById('bk_search_btn');
  var searchPanel = document.getElementById('bk_search_panel');
  var searchClose = document.getElementById('bk_search_close');
  var searchInput = searchPanel ? searchPanel.querySelector('.bk_search_input') : null;

  /* ---------- Entry animation ---------- */
  if (navbar) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        navbar.classList.add('bk_ready');
      });
    });
  }

  /* ---------- Scroll state ---------- */
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 20) {
      navbar.classList.add('bk_scrolled');
    } else {
      navbar.classList.remove('bk_scrolled');
    }
  }
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ---------- Mobile menu ---------- */
  function openMobile() {
    mobilePanel.classList.add('bk_open');
    hamburger.classList.add('bk_active');
    hamburger.setAttribute('aria-expanded', 'true');
    closeSearch();
  }

  function closeMobile() {
    mobilePanel.classList.remove('bk_open');
    hamburger.classList.remove('bk_active');
    hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger && mobilePanel) {
    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (mobilePanel.classList.contains('bk_open')) {
        closeMobile();
      } else {
        openMobile();
      }
    });

    mobilePanel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeMobile);
    });

    document.addEventListener('click', function (e) {
      var insidePanel = mobilePanel.contains(e.target);
      var onToggle = hamburger.contains(e.target);
      if (!insidePanel && !onToggle && mobilePanel.classList.contains('bk_open')) {
        closeMobile();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeMobile();
        closeSearch();
      }
    });
  }

  /* ---------- Search panel ---------- */
  function openSearch() {
    if (!searchPanel) return;
    searchPanel.classList.add('bk_open');
    closeMobile();
    setTimeout(function () {
      if (searchInput) searchInput.focus();
    }, 200);
  }

  function closeSearch() {
    if (!searchPanel) return;
    searchPanel.classList.remove('bk_open');
  }

  if (searchBtn && searchPanel) {
    searchBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (searchPanel.classList.contains('bk_open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }

  if (searchClose) {
    searchClose.addEventListener('click', closeSearch);
  }

  /* ---------- Active link detection ---------- */
  function setActive() {
    var page = window.location.pathname.split('/').pop() || 'index.php';
    document.querySelectorAll('.bk_nav_item').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      link.classList.toggle('bk_active', href === page);
    });
  }

  if (document.readyState !== 'loading') {
    setActive();
  } else {
    document.addEventListener('DOMContentLoaded', setActive);
  }

})();