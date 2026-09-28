/**
 * Code changelog: releases written alongside the work they describe.
 *
 * These entries are merged with the releases published from the admin
 * console (the patch_notes table) by server/src/lib/patchNotes.js. See that
 * file for the rules; in short:
 *
 *   - Order does not matter here. The timeline sorts itself by version.
 *   - The newest version is labelled LATEST UPDATE automatically, so leave
 *     `status` out unless a release needs a special label.
 *   - If the dashboard has a release with the same version, this entry wins
 *     and the dashboard copy is flagged in the admin console.
 *
 * To add a release: copy the first entry, bump the version, and keep each
 * change line under 120 characters in the form "Feature: what it does."
 * Change types: NEW, IMPROVED, FIXED (also SYSTEM, STUDIO, CRITICAL).
 *
 * This file lives under server/ because the backend image only copies
 * server/src. The frontend imports it too, for first paint and as a fallback
 * when the API is unreachable, so keep it plain data with no Node APIs.
 */
export const MANUAL_PATCH_NOTES = [
  {
    version: 'v1.9.0',
    date: 'September 28, 2026',
    codename: 'LIVING LOG',
    title: 'Animated Patch Notes & Two-Way Changelog',
    changes: [
      { type: 'NEW', text: 'Animated patch notes: release cards pin themselves to the board as you scroll, and the trail draws in.' },
      { type: 'NEW', text: 'Two-way changelog: releases written in code and releases published from the admin console appear together.' },
      { type: 'IMPROVED', text: 'Release order: the timeline sorts itself by version, and the newest release is always marked latest.' },
      { type: 'IMPROVED', text: 'Compact board: the landing page shows the latest releases first, with the full history one tap away.' },
      { type: 'IMPROVED', text: 'Winner section: the team board shows at most three polaroids per row, so larger teams stay tidy.' },
    ],
  },
  {
    version: 'v1.8.0',
    status: 'SECURITY PATCH',
    date: 'September 28, 2026',
    codename: 'FIRST PLACE',
    title: 'First Place Celebration & Security Hardening',
    changes: [
      { type: 'NEW', text: 'First place celebration: a landing section with certificate, team, and thanks, plus a once-per-session popup.' },
      { type: 'IMPROVED', text: 'Rate limiting: failed logins, sign-ups, password changes, uploads, and suggestions are now throttled.' },
      { type: 'FIXED', text: 'Link safety: profile links and buttons that use unsafe schemes like javascript: are no longer rendered as links.' },
      { type: 'IMPROVED', text: 'Image uploads: only JPEG, PNG, GIF, WebP, and AVIF are accepted, with a 200-image, 200 MB per-account limit.' },
      { type: 'FIXED', text: 'Admin access: admin rights are rechecked against the database on each request, so revoked access ends at once.' },
    ],
  },
  {
    version: 'v1.7.0',
    date: 'September 24, 2026',
    codename: 'THUMB REACH',
    title: 'Guided Block Editor, Phone Navigation & Footer Redesign',
    changes: [
      { type: 'NEW', text: 'Guided block editor: edit every block one section at a time with a live preview that matches your real profile.' },
      { type: 'NEW', text: 'Phone navigation: dashboard and admin get a bottom dock, with a settings sheet for appearance, links, and log out.' },
      { type: 'NEW', text: 'Landing tab bar: on phones, a bottom bar jumps between sections and opens an account sheet.' },
      { type: 'IMPROVED', text: 'Landing footer: a two-row layout with feedback and back-to-top buttons, section links, and account shortcuts.' },
      { type: 'NEW', text: 'Design presets: Aurora Soft and Press Mono join the preset list with their own pill, button, and icon styles.' },
    ],
  },
  {
    version: 'v1.6.0',
    status: 'MAJOR UPDATE',
    date: 'September 22, 2026',
    codename: 'FIELD NOTES',
    title: 'Field Notes Redesign, Light and Dark Mode & Design Presets',
    changes: [
      { type: 'NEW', text: 'Field Notes redesign: a warm editorial look across the landing page, sign-in, dashboard, admin, and editor.' },
      { type: 'NEW', text: "Light and dark mode: switch the site's appearance from any page, and your choice is remembered." },
      { type: 'NEW', text: 'Design presets: restyle your profile in one click with five looks, from Field Notes to Neo-Brutalist.' },
      { type: 'IMPROVED', text: 'Theme controls: fine-tune card shadows, borders, dividers, pills, buttons, icons, and heading weight.' },
      { type: 'IMPROVED', text: 'Dashboard: a new overview card with copy-link and visit buttons, plus visibility, preset, and block stats.' },
    ],
  },
  {
    version: 'v1.5.0',
    date: 'September 6, 2026',
    codename: 'GLASS POLISH',
    title: 'Mobile Hero Layout, Glass Cards & Profile Settings Shortcut',
    changes: [
      { type: 'IMPROVED', text: 'Hero block on phones: split layouts stack into a centered column and long social lists form a compact grid.' },
      { type: 'NEW', text: 'Settings shortcut: profile owners get a Settings button on their live page, next to Edit Profile.' },
      { type: 'IMPROVED', text: 'Glass effect: with a background image set, cards and panels blur it using your Glass Blur setting.' },
      { type: 'FIXED', text: 'Tag fields: commas and spaces typed into card and timeline tag inputs are no longer stripped as you type.' },
      { type: 'FIXED', text: 'Hero avatar: round avatars crop cleanly without a square backdrop and update when you change the image.' },
    ],
  },
  {
    version: 'v1.4.0',
    date: 'September 2, 2026',
    codename: 'NOW PLAYING',
    title: 'Music Player, GitHub Heatmap, Milestones & Custom Backgrounds',
    changes: [
      { type: 'NEW', text: 'Music Player block: a spinning vinyl player for Spotify, YouTube, SoundCloud, and Apple Music links.' },
      { type: 'NEW', text: 'GitHub Contributions block: show your last year of GitHub activity as a heatmap with streak and totals.' },
      { type: 'NEW', text: 'Milestones block: track goals with categories, sub-tasks, completion states, and a progress ring.' },
      { type: 'NEW', text: 'Custom background image: upload a page background and tune overlay darkness, overlay color, and blur.' },
      { type: 'IMPROVED', text: 'Journal covers: mark a cover image as a spoiler so it shows blurred behind a View Attachment label.' },
    ],
  },
  {
    version: 'v1.3.0',
    date: 'September 1, 2026',
    codename: 'SAFE HANDS',
    title: 'Account Deletion, Delete Confirmations & Item Reordering',
    changes: [
      { type: 'NEW', text: 'Delete account: permanently remove your account from Account Settings after retyping your username.' },
      { type: 'NEW', text: 'Block delete confirmation: removing a block now asks first and reminds you Ctrl+Z can bring it back.' },
      { type: 'IMPROVED', text: 'Item reordering: move cards, timeline entries, skills, services, reviews, and photos up or down.' },
      { type: 'IMPROVED', text: "Specs block: a larger gear icon library picks a matching icon from each item's category or name." },
      { type: 'IMPROVED', text: 'Account settings: shows unsaved changes, saves with Ctrl+S, and fits phone screens with compact tabs.' },
    ],
  },
  {
    version: 'v1.2.0',
    date: 'August 30, 2026',
    codename: 'VIDEO DESK',
    title: 'Video Blocks, Inline Journal Writing & Brand Tech Icons',
    changes: [
      { type: 'NEW', text: 'Featured Video block: showcase one YouTube, Vimeo, Streamable, Loom, or direct video with poster and buttons.' },
      { type: 'NEW', text: 'Video Gallery block: a multi-column video grid with tag filters and a full-screen player.' },
      { type: 'IMPROVED', text: 'Journal block: write entries in place with a markdown toolbar and preview, sort by date, and pin up to three.' },
      { type: 'IMPROVED', text: 'Skills block: type a technology name and its official brand icon and color fill in automatically.' },
      { type: 'IMPROVED', text: "Admin users table: block counts are now accurate and a Recent Change column shows each user's last edit." },
    ],
  },
  {
    version: 'v1.1.0',
    date: 'August 28, 2026',
    codename: 'SAFETY NET',
    title: 'Undo and Redo, Unsaved Change Guards & Account Settings',
    changes: [
      { type: 'NEW', text: 'Undo and redo: step back or forward through block and tab edits with the toolbar, Ctrl+Z, or Ctrl+Y.' },
      { type: 'NEW', text: 'Account settings: change your avatar, display name, username, bio, visibility, and password, or sign out.' },
      { type: 'IMPROVED', text: 'Save safety: the Save button shows when edits are pending, and leaving unsaved work asks to save or discard.' },
      { type: 'IMPROVED', text: 'Profile tab bar: long tab rows scroll with arrows or the mouse wheel, and colors are editable in Theme.' },
      { type: 'IMPROVED', text: 'Mobile editor: a bottom dock puts Add Block, Tabs, Theme, and Profile within thumb reach on phones.' },
    ],
  },
  {
    version: 'v1.0.0',
    date: 'August 28, 2026',
    codename: 'RELEASE 1.0',
    title: 'Photo Gallery, Events Calendar & Smooth Scroll',
    changes: [
      { type: 'NEW', text: 'Photo Gallery Block: Display images in clean grid layouts with full-screen lightbox zoom.' },
      { type: 'NEW', text: 'Events & Calendar Block: Share your schedule with 1-click Google Calendar & Apple .ICS sync.' },
      { type: 'IMPROVED', text: 'Smooth Scroll Showcase: Ultra-smooth scrolling experience powered by GSAP and Lenis.' },
      { type: 'IMPROVED', text: 'Independent Card Colors: Customize text colors inside cards without affecting headlines.' },
    ],
  },
  {
    version: 'v0.9.0',
    date: 'August 27, 2026',
    codename: 'BLOCK EXPANSION',
    title: 'Services & Rates, Hero Alignments & Multi-Image Uploads',
    changes: [
      { type: 'NEW', text: 'Services & Commissions Block: Create pricing tiers with deliverables checklist and booking buttons.' },
      { type: 'NEW', text: 'Hero Layout Options: Choose between center, left-aligned, or split-side layouts for your header.' },
      { type: 'NEW', text: 'Journal Cover Photos: Add card cover images and format articles with a visual markdown editor.' },
      { type: 'NEW', text: 'Multi-Image Gallery: Attach multiple project images to your career and timeline milestones.' },
    ],
  },
  {
    version: 'v0.8.0',
    date: 'August 26, 2026',
    codename: 'THEME ENGINE',
    title: 'Custom Theme Colors & Dynamic Page Backgrounds',
    changes: [
      { type: 'IMPROVED', text: 'Color Customization: Set custom theme colors, button styles, and border radius.' },
      { type: 'NEW', text: 'Page Backgrounds: Choose unique background styles dynamically for each tab.' },
    ],
  },
  {
    version: 'v0.5.0',
    status: 'INITIAL LAUNCH',
    date: 'August 20, 2026',
    codename: 'BETA RELEASE',
    title: 'Visual Live Editor & Custom Profile URLs',
    changes: [
      { type: 'NEW', text: 'Custom Profile URLs: Get your unique profile link at profilenc.my.id/@yourname.' },
      { type: 'NEW', text: 'Visual Live Editor: Edit your profile blocks and see changes instantly in real-time.' },
    ],
  },
];
