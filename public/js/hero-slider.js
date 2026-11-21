/* ==========================================================================
   hero-slider.js  |  ROTATING HERO BACKGROUND
   --------------------------------------------------------------------------
   Every few seconds, moves the class "is-active" from one background photo
   to the next one. The CSS (hero.css) turns that into a smooth cross-fade.

   Photos and timing come from src/data/site.js, through the data-interval
   attribute written by src/views/sections/hero.ejs.

   Speed:
   - Only the first photo loads with the page. The other photos carry their
     address in "data-src" and are loaded here once the page has finished
     loading, so they never slow down the first screen on a weak connection.
   - A photo is only shown once it has really finished loading.

   Safe behaviour:
   - If there is only one photo, nothing happens.
   - If the visitor has "reduce motion" turned on in their device, the first
     photo stays still (and the others are never downloaded).
   - The slideshow pauses while the browser tab is hidden (saves battery).
   ========================================================================== */

(function () {
  'use strict';

  var hero = document.querySelector('[data-hero-slider]');
  if (!hero) return;

  var slides = hero.querySelectorAll('.hero-bg-img');
  if (slides.length < 2) return;

  var prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  var interval = parseInt(hero.getAttribute('data-interval'), 10) || 6000;
  var current = 0;
  var timer = null;
  var started = false;

  // Give the waiting photos their real address so the browser downloads them
  function loadWaitingSlides() {
    for (var i = 0; i < slides.length; i++) {
      var address = slides[i].getAttribute('data-src');
      if (address) {
        slides[i].src = address;
        slides[i].removeAttribute('data-src');
      }
    }
  }

  function show(index) {
    slides[current].classList.remove('is-active');
    current = index;
    slides[current].classList.add('is-active');
  }

  function next() {
    var target = (current + 1) % slides.length;
    // If the next photo has not finished loading yet, wait for the next tick
    if (!slides[target].complete || !slides[target].naturalWidth) return;
    show(target);
  }

  function start() {
    if (!timer) timer = setInterval(next, interval);
  }

  function stop() {
    clearInterval(timer);
    timer = null;
  }

  function begin() {
    started = true;
    loadWaitingSlides();
    start();
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (started) start();
  });

  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin);
})();
