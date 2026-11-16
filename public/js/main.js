/**
 * ==============================================================================
 * AFRONATIVE ENTERTAINMENT - MAIN JAVASCRIPT
 * ==============================================================================
 * What this file does (the rotating hero photos live in hero-slider.js):
 *
 * 1. Navbar     Adds the "scrolled" look after scrolling, and runs the phone
 *               menu (open / close, with Escape key and screen-reader state).
 * 2. Scroll spy Underlines the menu link of the section currently in view.
 *
 * Smooth scrolling to sections is NOT done here. The stylesheet already does
 * it (html { scroll-behavior: smooth; scroll-padding-top: var(--nav-height) }),
 * which also respects visitors who turned animations off.
 *
 * Classes used (styled in public/css/navbar.css):
 *   .scrolled  on .navbar        .open    on .nav-menu
 *   .active    on .menu-toggle   .active  on .nav-link
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollSpy();
});

/* Reads the navbar height from the CSS variable --nav-height (variables.css),
   so the number is never repeated here. */
function getNavHeight() {
  const value = getComputedStyle(document.documentElement).getPropertyValue('--nav-height');
  return parseInt(value, 10) || 84;
}

/* ==============================================================================
   1. NAVBAR AND PHONE MENU
   ============================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Navbar look after scrolling a little
  const updateScrolled = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  updateScrolled();
  window.addEventListener('scroll', updateScrolled, { passive: true });

  // Phone menu
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  if (!toggle || !menu) return;

  const setMenu = (open) => {
    menu.classList.toggle('open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => setMenu(!menu.classList.contains('open')));

  // Close the menu after choosing a link
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  // Close the menu with the Escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setMenu(false);
  });
}

/* ==============================================================================
   2. SCROLL SPY (underlines the link of the section you are reading)
   ============================================================================== */
function initScrollSpy() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
  if (!sections.length || !links.length) return;

  let waiting = false;

  const update = () => {
    waiting = false;

    // A "reading line" just under the navbar. The last section whose top has
    // passed this line is the current one.
    const readingLine = getNavHeight() + 40;
    let currentId = '';
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= readingLine) currentId = section.id;
    });

    // At the very bottom of the page, keep the last section highlighted
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) currentId = sections[sections.length - 1].id;

    links.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  // Run at most once per screen refresh, not on every tiny scroll event
  const onScroll = () => {
    if (!waiting) {
      waiting = true;
      window.requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update(); // also run once on page load
}
