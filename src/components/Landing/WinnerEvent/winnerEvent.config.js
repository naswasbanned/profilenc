/**
 * Winner event — content for the first place celebration on the landing page.
 *
 * Everything the entry popup and the winner section display lives here, so
 * editing the event never means touching the components.
 *
 *   enabled   false removes both the popup and the section from the page.
 *   id        Part of the "already celebrated" storage key. The popup shows
 *             once per browser session; change the id to show it again to
 *             visitors who have already seen it.
 *
 * Images go in /public/images/event/ and are referenced from the site root,
 * for example '/images/event/certificate.webp'. A member photo left as null
 * shows their initials instead, and a null certificate image renders the
 * designed certificate card instead of a scan.
 *
 * Every value below marked "placeholder" still needs your real content.
 */
export const WINNER_EVENT = {
  enabled: true,
  id: 'first-place-2026',

  competition: {
    name: 'Infinitera2.0', // placeholder
    organizer: 'Universitas Negeri Sultan Agung', // placeholder
    category: 'Web development', // placeholder
    placementLabel: 'First place',
    placementShort: '1st',
    year: '2026',
  },

  // Entry popup
  celebration: {
    headline: 'The winner takes it all',
    message: 'Profilenc took first place. Thank you for being part of the journey.',
    delayMs: 600, // extra wait after the page has loaded and gone idle
    autoCloseMs: 6500,
  },

  // Section directly under the hero
  section: {
    eyebrow: '',
    titleTop: 'We took home',
    titleAccent: 'first place.',
    lead:
      'Profilenc won first place. None of it happens without the team that built it and the people who backed us along the way.',
    // Runs around the rotating trophy emblem. Keep it near 50 characters so
    // it wraps the circle once without crowding.
    emblemText: 'First place · Champion · The winner takes it all · ',
  },

  certificate: {
    image: null, // placeholder: '/images/event/certificate.webp'
    alt: 'First place certificate awarded to the Serius ga? team',
    title: 'Certificate of achievement',
    awardedTo: 'Team Profilenc', // placeholder
    signatories: [
      { name: 'Signatory name', role: 'Head of jury' }, // placeholder
      { name: 'Signatory name', role: 'Organizer' }, // placeholder
    ],
  },

  // placeholder: replace names, roles, photos and notes
  team: [
    {
      name: 'Naufal Aqil N.',
      role: 'Project lead',
      photo: '/images/team/aqil.webp',
      note: 'Leading the project till this day.',
    },
    {
      name: 'Ryan R.',
      role: 'Research & Innovation',
      photo: '/images/team/ryan.webp',
      note: 'Best to ever do it.',
    },
    {
      name: 'Ariza Bintang A.',
      role: 'Quality Assurance',
      photo: '/images/team/bintang.webp',
      note: 'Not miss a single thing on sight.',
    },
    {
      name: 'Darrell Rassya I.',
      role: 'Visual Designer',
      photo: '/images/team/darrell.webp',
      note: 'Dedication at its peak.',
    },
    {
      name: 'Raihan Fathan R.',
      role: 'UX Researcher',
      photo: '/images/team/raihan.webp',
      note: 'Just listen to this man.',
    },
    {
      name: 'Moch. Fadlan',
      role: 'Interaction Designer',
      photo: '/images/team/fadlan.webp',
      note: 'Idea block isnt a thing.',
    },
  ],

  // placeholder: replace with the people and groups you want to thank
  thanks: [
    { name: 'Kanye W.', role: 'GOAT', note: 'For the existing.' },
    { name: 'Panji DBP.', role: 'Early Tester', note: 'For the honest feedback.' },
    { name: 'Raditya DA.', role: 'Eatly Tester', note: 'For real user testing' },
    { name: 'Rakayida FH.', role: 'Early Tester', note: 'For testing every rough edge.' },
    { name: 'Khafidz FPW.', role: 'Demo Tester', note: 'For giving advice.' },
    { name: 'M. Dzamar R.', role: 'Demo Tester', note: 'For giving courage.' },
    { name: 'J. Calvin N.', role: 'Demo Tester', note: 'For supporting.' },
    { name: 'Zaki A.', role: 'Demo Tester', note: 'For being with us.' },
    { name: 'Rapid AS.', role: 'Demo Tester', note: 'For being there.' },
    { name: 'M. Irsyad F.', role: 'Demo Tester', note: 'For giving confidence.' },
  ],
};
