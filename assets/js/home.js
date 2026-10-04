// Hero section code 

(function () {
  'use strict';

  var booksWrap  = document.getElementById('bk_hero_books');
  var booksStage = document.getElementById('bk_hero_books_stage');

  if (!booksWrap || !booksStage) return;

  var bookEls = Array.from(booksStage.querySelectorAll('.bk_hero_book'));
  if (!bookEls.length) return;

  var isFinePointer = window.matchMedia('(pointer: fine)').matches;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------
     Layout per breakpoint (px offsets and degrees)
     ------------------------------------------------------------ */
  function getLayout() {
    var w = window.innerWidth;

    if (w <= 420) {
      return [
        { x:  -68, y: 0,    rot: -6, z: 0,   hoverLift: -14, hoverZ: 40 },
        { x:  -30, y: -8,   rot: -2, z: 40,  hoverLift: -22, hoverZ: 80 },
        { x:    8, y: -5,   rot:  2, z: 80,  hoverLift: -18, hoverZ: 120 },
        { x:   52, y: 2,    rot:  7, z: 120, hoverLift: -12, hoverZ: 160 }
      ];
    }
    if (w <= 640) {
      return [
        { x:  -80, y: 0,    rot: -7, z: 0,   hoverLift: -18, hoverZ: 50 },
        { x:  -35, y: -10,  rot: -2, z: 50,  hoverLift: -28, hoverZ: 100 },
        { x:   10, y: -6,   rot:  3, z: 100, hoverLift: -24, hoverZ: 150 },
        { x:   60, y: 2,    rot:  8, z: 150, hoverLift: -16, hoverZ: 200 }
      ];
    }
    // Desktop
    return [
      { x: -140, y:   0, rot: -8, z: 0,   hoverLift: -24, hoverZ: 60 },
      { x:  -55, y: -14, rot: -3, z: 60,  hoverLift: -38, hoverZ: 120 },
      { x:   20, y:  -8, rot:  3, z: 120, hoverLift: -32, hoverZ: 180 },
      { x:   95, y:   4, rot:  9, z: 180, hoverLift: -20, hoverZ: 240 }
    ];
  }

  var layout = getLayout();

  /* ------------------------------------------------------------
     State per book — current + target values.
     JS owns every transform here. No CSS transitions on transform.
     ------------------------------------------------------------ */
  var books = bookEls.map(function (el, i) {
    return {
      el: el,
      base: layout[i],
      // Current interpolated values
      cx:    layout[i].x,
      cy:    layout[i].y,
      cz:    layout[i].z,
      cRot:  layout[i].rot,
      cLift: 0,
      cScale: 1,
      // Target values
      tx:    layout[i].x,
      ty:    layout[i].y,
      tz:    layout[i].z,
      tRot:  layout[i].rot,
      tLift: 0,
      tScale: 1,
      hovered: false,
      // entrance
      visible: false,
      entranceDelay: 0.5 + i * 0.12
    };
  });

  /* ------------------------------------------------------------
     Global tilt
     ------------------------------------------------------------ */
  var tiltTarget  = { x: 0, y: 0 };
  var tiltCurrent = { x: 0, y: 0 };
  var maxTilt = 4;   // degrees

  booksWrap.addEventListener('mouseenter', function () {
    // no-op, just so :hover doesn't fire twice
  });

  booksWrap.addEventListener('mousemove', function (e) {
    if (!isFinePointer || prefersReducedMotion) return;
    var rect = booksWrap.getBoundingClientRect();
    var relX = (e.clientX - rect.left) / rect.width - 0.5;
    var relY = (e.clientY - rect.top) / rect.height - 0.5;
    tiltTarget.x = relY * 2 * maxTilt;
    tiltTarget.y = relX * 2 * maxTilt;
  });

  booksWrap.addEventListener('mouseleave', function () {
    tiltTarget.x = 0;
    tiltTarget.y = 0;
    books.forEach(function (b) {
      b.hovered = false;
      b.tLift = 0;
      b.tScale = 1;
      b.tz = b.base.z;
      b.tRot = b.base.rot;
    });
  });

  /* ------------------------------------------------------------
     Per-book hover listeners
     ------------------------------------------------------------ */
  books.forEach(function (b) {
    b.el.addEventListener('mouseenter', function () {
      if (!isFinePointer || prefersReducedMotion) return;
      b.hovered = true;
      b.tLift = b.base.hoverLift;
      b.tScale = 1.06;
      b.tz = b.base.hoverZ;
      b.tRot = b.base.rot * 0.4;   // reduce rotation slightly on hover
      b.el.style.zIndex = 30;
    });

    b.el.addEventListener('mouseleave', function () {
      b.hovered = false;
      b.tLift = 0;
      b.tScale = 1;
      b.tz = b.base.z;
      b.tRot = b.base.rot;
      b.el.style.zIndex = 1 + Math.floor(b.base.z / 60);
    });

    // initial z-index from base z
    b.el.style.zIndex = 1 + Math.floor(b.base.z / 60);
  });

  /* ------------------------------------------------------------
     Single RAF loop — writes every transform every frame.
     ------------------------------------------------------------ */
  var ease = 0.14;
  var tiltEase = 0.08;
  var startTime = performance.now();
  var entranceDone = false;

  function frame(now) {
    var t = (now - startTime) / 1000;

    // Entrance
    if (!entranceDone) {
      books.forEach(function (b) {
        if (!b.visible && t > b.entranceDelay) {
          b.visible = true;
          b.el.classList.add('bk_book_visible');
          b.el.style.opacity = '1';
        }
      });
      if (t > books[books.length - 1].entranceDelay + 0.5) {
        entranceDone = true;
      }
    }

    // Ease stage tilt
    tiltCurrent.x += (tiltTarget.x - tiltCurrent.x) * tiltEase;
    tiltCurrent.y += (tiltTarget.y - tiltCurrent.y) * tiltEase;

    booksStage.style.transform =
      'rotateX(' + tiltCurrent.x.toFixed(3) + 'deg) ' +
      'rotateY(' + tiltCurrent.y.toFixed(3) + 'deg)';

    // Ease each book
    books.forEach(function (b, i) {
      b.cx    += (b.tx    - b.cx)    * ease;
      b.cy    += (b.ty    - b.cy)    * ease;
      b.cz    += (b.tz    - b.cz)    * ease;
      b.cRot  += (b.tRot  - b.cRot)  * ease;
      b.cLift += (b.tLift - b.cLift) * ease;
      b.cScale += (b.tScale - b.cScale) * ease;

      // Subtle idle float when not hovered
      var idleFloat = 0;
      if (!b.hovered && !prefersReducedMotion) {
        idleFloat = Math.sin(t * 0.9 + i * 0.9) * 3;
      }

      var finalY = b.cy + b.cLift + idleFloat;

      b.el.style.transform =
        'translate3d(' + b.cx.toFixed(2) + 'px, ' + finalY.toFixed(2) + 'px, ' + b.cz.toFixed(2) + 'px) ' +
        'rotateZ(' + b.cRot.toFixed(3) + 'deg) ' +
        'scale(' + b.cScale.toFixed(4) + ')';
    });

    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------
     Resize — recompute layout
     ------------------------------------------------------------ */
  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      layout = getLayout();
      books.forEach(function (b, i) {
        b.base = layout[i];
        b.tx = layout[i].x;
        b.ty = layout[i].y;
        b.tz = layout[i].z;
        b.tRot = layout[i].rot;
      });
    }, 150);
  });

  /* ------------------------------------------------------------
     Reduced motion — static placement, no RAF
     ------------------------------------------------------------ */
  if (prefersReducedMotion) {
    books.forEach(function (b) {
      b.el.style.opacity = '1';
      b.el.classList.add('bk_book_visible');
      b.el.style.transform =
        'translate3d(' + b.base.x + 'px, ' + b.base.y + 'px, ' + b.base.z + 'px) ' +
        'rotateZ(' + b.base.rot + 'deg)';
    });
    return;
  }

  requestAnimationFrame(frame);

})();


// feature book section 
(function () {
  'use strict';

  var chips = document.querySelectorAll('.bk_filter_chip');
  var cards = document.querySelectorAll('.bk_book_card');
  var emptyEl = document.getElementById('bk_book_empty');

  if (!chips.length || !cards.length) return;

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var filter = this.dataset.filter;

      chips.forEach(function (c) { c.classList.remove('bk_chip_active'); });
      this.classList.add('bk_chip_active');

      var visible = 0;

      cards.forEach(function (card) {
        var match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          card.style.display = '';
          void card.offsetWidth;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          visible++;
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(8px)';
          setTimeout(function () {
            if (card.dataset.category !== filter && filter !== 'all') {
              card.style.display = 'none';
            }
          }, 200);
        }
      });

      if (emptyEl) {
        emptyEl.hidden = visible > 0;
      }
    });
  });

})();