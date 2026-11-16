/* ==========================================================================
   server.js  |  STARTS THE WEBSITE
   --------------------------------------------------------------------------
   1. Tells Express to build pages from .ejs templates (src/views)
   2. Serves css, js and images from the public folder
   3. Reads all text/links/events from src/data/site.js
   4. Decides on the server whether an upcoming event exists
   ========================================================================== */

const express = require('express');
const path = require('path');
const site = require('./src/data/site');

const app = express();
const PORT = process.env.PORT || 3000;

// Templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Static files (css, js, images). index:false means the home page is built
// from the template, never from a leftover public/index.html file.
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

// The first event that has not finished yet (or null when there is none)
function getUpcomingEvent() {
  const now = Date.now();
  const upcoming = site.upcoming.events
    .filter((event) => new Date(event.endsAt).getTime() > now)
    .sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));
  return upcoming[0] || null;
}

app.get('/', (req, res) => {
  res.render('pages/home', {
    site,
    upcomingEvent: getUpcomingEvent(),
  });
});

// Anything else
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(PORT, () => {
  console.log(`AfroNative site running at http://localhost:${PORT}`);
});
