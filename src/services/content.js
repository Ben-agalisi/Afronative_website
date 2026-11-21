/* ==========================================================================
   content.js  |  FETCHES LIVE CONTENT FROM DJANGO ADMIN
   --------------------------------------------------------------------------
   This service replaces the static site.js data with live data from the
   Django admin API. It caches the response for 60 seconds so the server
   doesn't hit Django on every page load.

   If Django is down or slow, it falls back to the static site.js data,
   so the website NEVER breaks because the admin is unavailable.

   Environment variables (set in .env):
   - DJANGO_API_URL  The Django API base URL, e.g. http://127.0.0.1:8000
   - SITE_API_KEY    The secret key shared with Django (X-API-Key header)

   Usage in server.js:
     const getContent = require('./services/content');
     const site = await getContent();
   ========================================================================== */

const path = require('path');

// Load environment variables from .env file (development only)
// In production, set DJANGO_API_URL and SITE_API_KEY as server env vars
const envPath = path.join(__dirname, '..', '..', '.env');
try {
  require('dotenv').config({ path: envPath });
} catch (e) {
  // dotenv not installed — env vars must be set externally
}

// ---------------------------------------------------------------------------
// Configuration from environment variables
// ---------------------------------------------------------------------------

const DJANGO_API_URL = process.env.DJANGO_API_URL || '';
const SITE_API_KEY = process.env.SITE_API_KEY || '';

// Enable Django integration only if both env vars are set
const djangoEnabled = !!(DJANGO_API_URL && SITE_API_KEY);

// ---------------------------------------------------------------------------
// In-memory cache: stores the last successful Django response
// ---------------------------------------------------------------------------

let cachedContent = null;      // The last successful Django JSON response
let lastFetchTime = 0;         // Timestamp (ms) when the cache was refreshed
const CACHE_TTL = 5 * 1000;    // 5 seconds — refresh after this (shorter so admin changes appear quickly)

// ---------------------------------------------------------------------------
// Static fallback: the original site.js data (always available)
// ---------------------------------------------------------------------------

let staticSite = null;
let staticSiteError = null;

try {
  staticSite = require('../data/site');
} catch (err) {
  staticSiteError = err;
  console.error('Failed to load static site.js:', err.message);
}

// ---------------------------------------------------------------------------
// Fetch from Django API with timeout
// ---------------------------------------------------------------------------

/**
 * Fetches the site-content JSON from Django.
 * Uses AbortController for a 5-second timeout.
 * Returns the parsed JSON object or throws on failure.
 */
async function fetchFromDjango() {
  if (!djangoEnabled) {
    throw new Error('Django API not configured — set DJANGO_API_URL and SITE_API_KEY env vars');
  }

  const url = DJANGO_API_URL.endsWith('/')
    ? `${DJANGO_API_URL}api/v1/site-content/`
    : `${DJANGO_API_URL}/api/v1/site-content/`;

  // AbortController gives us a 5-second timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-API-Key': SITE_API_KEY,
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Django API returned ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error(`Django API timed out after 5 seconds (${url})`);
    }
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Merge Django data into the static site object
// ---------------------------------------------------------------------------

/**
 * Merges the Django API response into the static site.js object.
 * Only replaces the fields that come from Django:
 *   - upcoming.events
 *   - pastEvents.eventLine
 *   - pastEvents.photos
 *   - assets.heroSlides
 *
 * All other fields (navigation, hero text, about, socials, footer)
 * remain from the static site.js file.
 *
 * Returns a deep copy of the merged object.
 */
function mergeDjangoIntoStatic(djangoData) {
  // Start with a deep copy of the static site
  const merged = JSON.parse(JSON.stringify(staticSite));

  if (!merged) {
    // No static site to merge into — return null
    return null;
  }

  // --- Merge upcoming events ---
  if (djangoData.upcomingEvents && Array.isArray(djangoData.upcomingEvents)) {
    if (merged.upcoming && Array.isArray(merged.upcoming.events)) {
      // Replace static events with Django events
      merged.upcoming.events = djangoData.upcomingEvents;
    }
  }

  // --- Merge past event ---
  if (djangoData.pastEvent && typeof djangoData.pastEvent === 'object') {
    if (merged.pastEvents) {
      // Replace the event line and photos
      if (djangoData.pastEvent.eventLine) {
        merged.pastEvents.eventLine = djangoData.pastEvent.eventLine;
      }
      if (djangoData.pastEvent.photos && Array.isArray(djangoData.pastEvent.photos)) {
        merged.pastEvents.photos = djangoData.pastEvent.photos;
      }
    }
  }

  // --- Merge hero slides ---
  // Always replace with Django data, even if empty — this ensures deleted slides disappear
  if (djangoData.heroSlides !== undefined && Array.isArray(djangoData.heroSlides)) {
    if (merged.assets) {
      merged.assets.heroSlides = djangoData.heroSlides;
    }
  }

  return merged;
}

// ---------------------------------------------------------------------------
// Main export: getContent()
// ---------------------------------------------------------------------------

/**
 * Returns the merged site content.
 *
 * Algorithm:
 * 1. If cache is fresh (< 60 seconds old), return it immediately.
 * 2. If cache is stale, serve the cached copy immediately and refresh in
 *    the background (so the user never waits).
 * 3. If no cache yet (first request), fetch synchronously.
 * 4. If Django fails, fall back to the static site.js data.
 *
 * The website NEVER breaks because Django is down.
 */
async function getContent() {
  const now = Date.now();

  // --- Case 1: Cache is fresh — return it immediately ---
  if (cachedContent && (now - lastFetchTime) < CACHE_TTL) {
    return cachedContent;
  }

  // --- Case 2: Cache is stale — serve cached copy and refresh in background ---
  if (cachedContent) {
    // Return the stale cache immediately (user doesn't wait)
    const staleCopy = cachedContent;

    // Refresh in the background (don't await — user already got data)
    refreshCacheInBackground();

    return staleCopy;
  }

  // --- Case 3: No cache yet (first request) — fetch synchronously ---
  try {
    const djangoData = await fetchFromDjango();
    
    // Debug: log what Django actually sent (helps troubleshoot image issues)
    console.log('[content.js] Django API response:', JSON.stringify(djangoData, null, 2));
    
    const merged = mergeDjangoIntoStatic(djangoData);

    if (merged) {
      cachedContent = merged;
      lastFetchTime = Date.now();
      console.log('[content.js] Loaded live data from Django API');
      return merged;
    }
  } catch (err) {
    console.error('[content.js] Failed to fetch from Django:', err.message);
    console.error('[content.js] Falling back to static site.js data');
  }

  // --- Case 4: Fallback to static site.js ---
  if (staticSite) {
    return JSON.parse(JSON.stringify(staticSite));
  }

  // Last resort: throw if even static data is missing
  throw new Error('No content available — neither Django API nor static site.js could be loaded');
}

/**
 * Background refresh: fetches from Django and updates the cache.
 * Runs silently — errors are logged but don't affect the site.
 */
async function refreshCacheInBackground() {
  try {
    const djangoData = await fetchFromDjango();
    console.log('[content.js] Background refresh — Django response:', JSON.stringify(djangoData, null, 2));
    const merged = mergeDjangoIntoStatic(djangoData);

    if (merged) {
      cachedContent = merged;
      lastFetchTime = Date.now();
      console.log('[content.js] Background cache refreshed from Django');
    }
  } catch (err) {
    console.error('[content.js] Background refresh failed:', err.message);
    // Keep the old cache — it's still valid for display
  }
}

module.exports = getContent;
