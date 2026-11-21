/* ==========================================================================
   site.js  |  ALL THE WORDS, LINKS AND EVENTS OF THE WEBSITE
   --------------------------------------------------------------------------
   Change text, links, photos or events HERE. You never have to edit the
   templates for that. Later, the admin app will fill in this same shape
   of data (upcoming events, past photos), so nothing is wasted.

   Sections in this file:
   1. meta         page title, description, icon, stylesheet list
   2. assets       logo and hero photo
   3. navigation   top menu and the Follow Us button
   4. hero         first screen
   5. about        vision, mission, four pillars
   6. pastEvents   gallery of the last event
   7. upcoming     event list (the site shows the first unfinished one)
   8. socials      four social media accounts
   9. footer       small print
   ========================================================================== */

module.exports = {
  name: 'AfroNative Entertainment',
  location: 'Accra, Ghana',

  /* 1. META ---------------------------------------------------------- */
  meta: {
    title: 'AfroNative Entertainment | Elite Lifestyle & Events',
    description:
      'AfroNative Entertainment is a premier lifestyle and entertainment company creating unforgettable experiences through elite parties, premium events, and trips.',
    ogDescription:
      'Elite parties, premium events and unforgettable African lifestyle experiences.',
    themeColor: '#000000',
    favicon: '/images/logo_official.jpg',
    faviconType: 'image/jpeg',
  },

  // Stylesheets, loaded in this order (variables must stay first)
  styles: [
    'variables',
    'base',
    'navbar',
    'hero',
    'about',
    'past-events',
    'upcoming-event',
    'social',
    'footer',
  ],

  /* 2. ASSETS -------------------------------------------------------- */
  assets: {
    // Logo: big version for the hero, small version for navbar and footer
    logo: '/images/afronative-logo.webp',
    logoSize: { width: 880, height: 580 },
    logoSmall: '/images/afronative-logo-sm.webp',
    logoSmallSize: { width: 170, height: 112 },
    // Hero background photos. They fade into each other in this order.
    // Add or remove lines to change how many photos rotate (2 or more).
    // "focus" = the point of the photo to keep visible when a narrow phone
    // screen crops the sides (left% top%). Leave it out to use the centre.
    heroSlides: [
      { src: '/images/hero_bg.webp' },
      { src: '/images/hero_bg_2.webp', focus: '74% 50%' },
    ],
    heroSlideInterval: 6000, // milliseconds each photo stays (6000 = 6 seconds)
  },

  /* 3. NAVIGATION ---------------------------------------------------- */
  nav: [
    { label: 'About Us', href: '#about' },
    { label: 'Past Events', href: '#past-events' },
    { label: 'Upcoming Event', href: '#upcoming-event' },
    { label: 'Connect', href: '#socials' },
  ],
  navCta: { label: 'Follow Us', href: '#socials' },

  /* 4. HERO ---------------------------------------------------------- */
  hero: {
    badge: 'Elite Lifestyle & Entertainment Brand',
    subheadline:
      'A premier lifestyle and entertainment company. We bring people together through elite parties, premium events, exciting trips, and unforgettable African lifestyle experiences.',
    primaryButton: { label: 'View Upcoming Event', href: '#upcoming-event' },
    secondaryButton: { label: 'Explore Past Events', href: '#past-events' },
  },

  /* 5. ABOUT --------------------------------------------------------- */
  about: {
    tag: 'Who We Are',
    title: 'More Than Just An Event Company',
    description:
      'AfroNative is a creative lifestyle movement focused on culture, elite nightlife, travel, and premium experiences across Africa and beyond.',
    vision: {
      symbol: '✦',
      title: 'Our Vision',
      text:
        'To become a leading lifestyle and entertainment brand in Africa and beyond, recognized for creating unforgettable experiences that unite people through culture, creativity, entertainment, networking, and excellence.',
    },
    mission: {
      symbol: '❖',
      title: 'Our Mission',
      text:
        'AfroNative Entertainment exists to bring people together through elite parties, premium events, exciting trips, entertainment activities, and lifestyle experiences that inspire connection, fun, culture, and unforgettable memories. We are committed to building a strong community driven by creativity, unity, innovation, and excellence.',
    },
    // icon names are defined in src/views/partials/icon.ejs
    pillars: [
      {
        icon: 'music',
        title: 'Elite Parties & Galas',
        text:
          'Carefully curated nightlife and celebratory events characterized by vibrant energy, world-class DJs, and high-fashion aesthetics.',
      },
      {
        icon: 'plane',
        title: 'Exciting Trips & Getaways',
        text:
          'Exclusive lifestyle expeditions and group trips designed for exploration, bonding, luxury relaxation, and new horizons.',
      },
      {
        icon: 'globe',
        title: 'Cultural Expression',
        text:
          'Honoring African creativity, music, gourmet food, and fashion on contemporary international standards.',
      },
      {
        icon: 'people',
        title: 'Creative Networking',
        text:
          'Bringing together entrepreneurs, creatives, influencers, and young professionals in an empowering atmosphere.',
      },
    ],
  },

  /* 6. PAST EVENTS --------------------------------------------------- */
  pastEvents: {
    tag: 'Memories & Energy',
    title: 'Past AfroNative Experiences',
    description:
      'Take a look inside the electric atmosphere and premium moments from our most recent event.',
    eventLine: 'PÁRTI EISAGÓSIS • FIRST EDITION • 7 NOVEMBER 2026 • THE KOVE, ACCRA',
    photos: [
      { src: '/images/event_01_social.jpg', alt: 'AfroNative guests at the event', caption: 'Unmatched Social Connection' },
      { src: '/images/event_02_dj.webp', alt: 'High energy DJ booth', caption: 'Electrifying DJ Sets & Rhythms' },
      { src: '/images/event_03_crowd.webp', alt: 'Crowd energy', caption: 'Unrivaled Crowd Atmosphere' },
      { src: '/images/event_04_fashion.webp', alt: 'Guest fashion and style', caption: 'Elite Fashion & Lifestyle' },
      { src: '/images/event_05_vip.webp', alt: 'VIP hospitality', caption: 'Premium Table Hospitality' },
      { src: '/images/event_06_suya.webp', alt: 'Suya and gourmet grills', caption: 'Authentic Culinary Delights' },
      { src: '/images/event_07_access.webp', alt: 'VIP pass credentials', caption: 'VIP Access & Experiences' },
      { src: '/images/event_08_drinks.webp', alt: 'Bar and premium mixology', caption: 'Curated Drinks & Mixology' },
    ],
  },

  /* 7. UPCOMING EVENTS ----------------------------------------------- */
  upcoming: {
    tag: 'Mark Your Calendar',
    title: 'Upcoming Event',
    description:
      'Join us for the next AfroNative experience. Follow our socials to be first to hear about dates and tickets.',
    emptyMessage: 'Our next event is being planned. Follow us to be the first to know.',
    emptyButton: { label: 'See our socials', href: '#socials' },
    events: [
      {
        name: 'PÁRTI EISAGÓSIS',
        tagline: 'TODAY WE PARTI • FIRST EDITION',
        badge: 'Current Official Edition',
        endsAt: '2026-11-08T12:00:00Z',
        flyer: '/images/event_flyer.jpeg',
        flyerAlt: 'Flyer for Párti Eisagósis, first edition',
        specs: [
          { icon: 'calendar', label: 'Date', value: '07.11.2026' },
          { icon: 'clock', label: 'Time', value: '6:00 PM Onwards' },
          { icon: 'pin', label: 'Venue', value: '@THE KOVE, Off the Haatso Atomic Road' },
          { iconText: '18+', label: 'Admission', value: '18+ Adult Only' },
        ],
        booking: {
          text: 'DM us on Instagram or Snapchat for table bookings:',
          label: 'Message on Instagram',
          href: 'https://www.instagram.com/afronativeentertainment',
        },
      },
    ],
  },

  /* 8. SOCIALS ------------------------------------------------------- */
  socials: [
    {
      key: 'instagram',
      name: 'Instagram',
      handle: '@afronativeentertainment',
      url: 'https://www.instagram.com/afronativeentertainment',
      description: 'Daily event drops, photo galleries, styling spotlights, and recaps.',
      button: 'Follow on IG',
      ariaLabel: 'Follow AfroNative Entertainment on Instagram',
      cardIconSize: 30,
      footerIconSize: 18,
    },
    {
      key: 'x',
      name: 'X (Twitter)',
      handle: '@afronativeenter',
      url: 'https://x.com/afronativeenter',
      description: 'Live party tweets, sudden announcements, and cultural conversations.',
      button: 'Follow on X',
      ariaLabel: 'Follow AfroNative on X',
      cardIconSize: 26,
      footerIconSize: 16,
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      handle: '@fro.native.enter',
      url: 'https://www.tiktok.com/@fro.native.enter',
      description: 'High-energy party videos, crowd dance trends, and DJ reels.',
      button: 'Watch on TikTok',
      ariaLabel: 'Follow AfroNative on TikTok',
      cardIconSize: 28,
      footerIconSize: 16,
    },
    {
      key: 'snapchat',
      name: 'Snapchat',
      handle: '@afronativeenter',
      url: 'https://www.snapchat.com/add/afronativeenter',
      description: 'Exclusive live-night party stories and VIP backstage moments.',
      button: 'Add on Snap',
      ariaLabel: 'Add AfroNative on Snapchat',
      cardIconSize: 28,
      footerIconSize: 17,
    },
  ],
  socialsSection: {
    tag: 'Connect With Us',
    title: 'Follow AfroNative Everywhere',
    description:
      'Stay connected on all our official platforms for live party stories, announcements, ticket releases, and event recaps.',
  },

  /* 9. FOOTER -------------------------------------------------------- */
  footer: {
    tagline: 'Culturally rooted & bold.',
    options: [],
  },
};