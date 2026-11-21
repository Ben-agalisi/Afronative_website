/* ==========================================================================
   server.js  |  STARTS THE WEBSITE
   --------------------------------------------------------------------------
   1. Tells Express to build pages from .ejs templates (src/views)
   2. Compresses everything it sends (smaller downloads on mobile data)
   3. Serves css, js and images from the public folder, with caching on the
      live site so returning visitors do not download them again
   4. Fetches live content from Django admin API (src/services/content.js),
      falling back to static src/data/site.js if Django is unavailable
   5. Decides on the server whether an upcoming event exists
   ========================================================================== */

const express = require('express');
const compression = require('compression');
const path = require('path');
const getContent = require('./src/services/content');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');

// Templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Smaller responses (gzip) for html, css, js, svg
app.use(compression());

// Static files (css, js, images). index:false means the home page is built
// from the template, never from a leftover public/index.html file.
// Caching is only switched on for the live site (NODE_ENV=production), so
// while you work you always see your latest edits.
//   images, fonts: remembered 7 days     css, js: remembered 1 hour
// TIP: if you replace an image and keep the same file name, visitors may
// keep the old one for up to 7 days. Give the new file a new name instead.
app.use(
  express.static(path.join(__dirname, 'public'), {
    index: false,
    setHeaders(res, filePath) {
      if (!isProduction) return;
      if (/\.(webp|png|jpe?g|svg|ico|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=604800');
      } else if (/\.(css|js)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      }
    },
  })
);

// The first event that has not finished yet (or null when there is none)
function getUpcomingEvent(siteData) {
  const now = Date.now();
  const events = siteData && siteData.upcoming && Array.isArray(siteData.upcoming.events)
    ? siteData.upcoming.events
    : [];
  const upcoming = events
    .filter((event) => new Date(event.endsAt).getTime() > now)
    .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
  return upcoming[0] || null;
}

// Home page — fetches live content from Django, falls back to static data
app.get('/', async (req, res) => {
  try {
    const siteData = await getContent();
    res.render('pages/home', {
      site: siteData,
      upcomingEvent: getUpcomingEvent(siteData),
    });
  } catch (err) {
    console.error('Failed to render home page:', err.message);
    res.status(500).send('Page temporarily unavailable');
  }
});

// Anything else
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`AfroNative site running at http://localhost:${PORT}`);
});
