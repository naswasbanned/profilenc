# Graph Report - profile  (2026-10-16)

## Corpus Check
- 193 files · ~125,130 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 91 file(s) not represented in the graph (top: .css 84, (none) 6, .conf 1)

## Summary
- 931 nodes · 2152 edges · 37 communities (34 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ec7a07f`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/inbox.js
- lucide-react
- EditorSearchPalette.jsx
- package.json
- routes/stats.js
- apiFetch
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- LandingPage.jsx
- rateLimit.js
- ogImageService.js
- src/index.js
- scripts
- dependencies
- WinnerSection.jsx
- react
- React + Vite
- lib/inbox.js
- ThemePanel.jsx
- WinnerCelebration.jsx
- how-it-works.jsx
- validate.js
- images.js
- floatingPlayer.js
- ProfileCanvas.jsx
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- WinnerCertificate.jsx
- RevealHeading.jsx
- scripts
- useWinnerCelebration.js
- container-scroll-animation.jsx
- 3d-testimonials.jsx
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `lucide-react` - 56 edges
3. `framer-motion` - 39 edges
4. `apiFetch()` - 27 edges
5. `query()` - 25 edges
6. `useAuth()` - 25 edges
7. `safeUrl()` - 23 edges
8. `vitest` - 21 edges
9. `react-router-dom` - 19 edges
10. `express` - 14 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `withHandler()` --indirect_call--> `auth()`  [INFERRED]
  server/test/suggestUsers.check.js → server/src/middleware/auth.js
- `InboxSection()` --calls--> `apiFetch()`  [EXTRACTED]
  src/components/Dashboard/InboxSection.jsx → src/lib/api.js
- `UserSuggestInput()` --calls--> `apiFetch()`  [EXTRACTED]
  src/components/Dashboard/UserSuggestInput.jsx → src/lib/api.js
- `ProfileCanvas()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Profile/ProfileCanvas.jsx → src/contexts/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (37 total, 3 thin omitted)

### Community 0 - "routes/inbox.js"
Cohesion: 0.11
Nodes (21): ref_node_http, createSuggestHandler(), escapeLike(), normalizePrefix(), SUGGEST_LIMIT, SUGGEST_MAX_QUERY, SUGGEST_MIN, auth() (+13 more)

### Community 1 - "lucide-react"
Cohesion: 0.06
Nodes (53): framer-motion, lucide-react, react-dom, blockComponentMap, blockIconMap, blockVariants, BlockIdContext, CanvasPortal() (+45 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (21): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+13 more)

### Community 4 - "routes/stats.js"
Cohesion: 0.36
Nodes (7): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, statsLimiter, router

### Community 5 - "apiFetch"
Cohesion: 0.06
Nodes (61): react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage, RegisterPage (+53 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.12
Nodes (17): src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield, src_components_editor_fields_index_notefield, src_components_editor_fields_index_rangefield (+9 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.06
Nodes (17): cardsGrid, contact, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS (+9 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.25
Nodes (11): initialLandingConfig(), LANDING_DEFAULTS, loadLandingConfig(), mergeLandingConfig(), readCache(), writeCache(), isWithinSuggestionLimit(), MAX_SUGGESTION_IMAGE_BYTES (+3 more)

### Community 10 - "rateLimit.js"
Cohesion: 0.11
Nodes (22): ref_crypto, clientIp(), normalizeAddress(), req(), byClient(), dmPairLimiter, dmUserLimiter, imageUploadLimiter (+14 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.14
Nodes (29): absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H, CARD_W (+21 more)

### Community 12 - "src/index.js"
Cohesion: 0.14
Nodes (19): pg, pool, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES (+11 more)

### Community 13 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, migrate, seed:bootstrap, seed:templates, start, test

### Community 14 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.10
Nodes (14): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+6 more)

### Community 16 - "react"
Cohesion: 0.05
Nodes (35): react, SkillsBlock(), ChecklistField(), makeTaskId(), Field(), IconPickerField(), src_components_editor_fields_index_sortablerow, makeItemId() (+27 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "lib/inbox.js"
Cohesion: 0.12
Nodes (31): InboxCompose(), MAX_LENGTH, InboxMessageList(), InboxReader(), InboxSection(), readError(), EMPTY_TEXT, InboxSidebar() (+23 more)

### Community 19 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (26): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+18 more)

### Community 20 - "WinnerCelebration.jsx"
Cohesion: 0.21
Nodes (9): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS (+1 more)

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "validate.js"
Cohesion: 0.12
Nodes (16): ref_node_assert, ref_node_test, checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS (+8 more)

### Community 23 - "images.js"
Cohesion: 0.06
Nodes (32): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, suggestionLimiter (+24 more)

### Community 24 - "floatingPlayer.js"
Cohesion: 0.21
Nodes (16): musicPlayer, RangeField(), FLOAT_ALIGNS, FLOAT_DESIGN_SIZE, FLOAT_EDGES, FLOAT_SIZE_DEFAULT, FLOAT_SIZE_MAX, FLOAT_SIZE_MIN (+8 more)

### Community 25 - "ProfileCanvas.jsx"
Cohesion: 0.08
Nodes (39): html-to-image, vitest, BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, getEntryDateValue(), JournalBlock(), BlockEditorWorkbench() (+31 more)

### Community 26 - "server/package.json"
Cohesion: 0.11
Nodes (15): bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, name, private (+7 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.10
Nodes (46): FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor(), seedFreeSize(), stopPropagation() (+38 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 30 - "WinnerCertificate.jsx"
Cohesion: 0.20
Nodes (7): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate(), src_components_landing_winnerevent_winnerevent

### Community 31 - "RevealHeading.jsx"
Cohesion: 0.50
Nodes (3): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

## Knowledge Gaps
- **243 isolated node(s):** `name`, `version`, `private`, `type`, `start` (+238 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 324 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `useWinnerCelebration.js`, `apiFetch`, `3d-testimonials.jsx`, `container-scroll-animation.jsx`, `LandingPage.jsx`, `WinnerSection.jsx`, `lib/inbox.js`, `ThemePanel.jsx`, `WinnerCelebration.jsx`, `how-it-works.jsx`, `floatingPlayer.js`, `ProfileCanvas.jsx`, `imageEdit.js`, `WinnerCertificate.jsx`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `vitest` connect `ProfileCanvas.jsx` to `lucide-react`, `package.json`, `routes/stats.js`, `apiFetch`, `lib/patchNotes.js`, `rateLimit.js`, `ogImageService.js`, `lib/inbox.js`, `validate.js`, `images.js`, `floatingPlayer.js`, `server/package.json`, `imageEdit.js`?**
  _High betweenness centrality (0.265) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `3d-testimonials.jsx`, `apiFetch`, `LandingPage.jsx`, `WinnerSection.jsx`, `react`, `lib/inbox.js`, `ThemePanel.jsx`, `WinnerCelebration.jsx`, `how-it-works.jsx`, `ProfileCanvas.jsx`, `imageEdit.js`, `WinnerCertificate.jsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **What connects `name`, `version`, `private` to the rest of the system?**
  _243 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/inbox.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11396011396011396 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.06494269761974727 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._