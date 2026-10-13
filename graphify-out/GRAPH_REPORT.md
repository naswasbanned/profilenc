# Graph Report - profile  (2026-10-13)

## Corpus Check
- 155 files · ~104,129 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 89 file(s) not represented in the graph (top: .css 82, (none) 6, .conf 1)

## Summary
- 732 nodes · 1679 edges · 36 communities (35 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f9f9be6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- BlockRenderer.jsx
- EditorSearchPalette.jsx
- package.json
- site.js
- ThemePanel.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- LandingPage.jsx
- routes/auth.js
- ogImageService.js
- src/index.js
- card.jsx
- dependencies
- WinnerSection.jsx
- react
- React + Vite
- db.js
- WinnerCelebration.jsx
- WinnerCertificate.jsx
- how-it-works.jsx
- vitest
- upload.js
- routes/stats.js
- useWinnerCelebration.js
- server/package.json
- scripts
- dependencies
- devDependencies
- GitHubHeatmapBlock.jsx
- MilestonesBlock.jsx
- scripts
- LandingPage
- vite.config.js
- avatar.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `lucide-react` - 50 edges
3. `framer-motion` - 39 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `query()` - 21 edges
7. `apiFetch()` - 21 edges
8. `react-router-dom` - 17 edges
9. `vitest` - 13 edges
10. `useDoubleBackdropClose()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `load()` --indirect_call--> `token()`  [INFERRED]
  src/pages/EditorPage.jsx → server/src/routes/stats.test.js
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPublicProfile()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/og.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `mergePatchNotes()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/lib/patchNotes.js

## Import Cycles
- None detected.

## Communities (36 total, 1 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.14
Nodes (15): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path, sharp, uuid, __dirname, router, uploadsDir (+7 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.06
Nodes (55): blockComponentMap, blockIconMap, blockVariants, renderBlockIcon(), src_components_blocks_blocks, BlockIdContext, CanvasPortal(), CardsGridBlock() (+47 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (20): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+12 more)

### Community 4 - "site.js"
Cohesion: 0.21
Nodes (9): checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, suggestionLimiter, publicUpload (+1 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (25): BlockRenderer(), BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES (+17 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.21
Nodes (16): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+8 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.06
Nodes (46): SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField(), ImageListField() (+38 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (9): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, WinnerSection(), ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, MAIN_SHOWCASE_PROFILE (+1 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.23
Nodes (12): clientIp(), normalizeAddress(), byClient(), imageUploadLimiter, limiter(), loginAccountLimiter, loginIpLimiter, passwordChangeLimiter (+4 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.13
Nodes (32): ref_crypto, absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H (+24 more)

### Community 12 - "src/index.js"
Cohesion: 0.17
Nodes (15): query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app, __dirname (+7 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.11
Nodes (13): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+5 more)

### Community 16 - "react"
Cohesion: 0.05
Nodes (77): framer-motion, lucide-react, react, react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage (+69 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "db.js"
Cohesion: 0.18
Nodes (13): express, pg, pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), PATCH_LIMITS (+5 more)

### Community 19 - "WinnerCelebration.jsx"
Cohesion: 0.23
Nodes (8): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS

### Community 20 - "WinnerCertificate.jsx"
Cohesion: 0.20
Nodes (7): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate(), src_components_landing_winnerevent_winnerevent

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "vitest"
Cohesion: 0.15
Nodes (8): ref_url, vitest, req(), cards, fixture, get(), users, clickTarget()

### Community 23 - "upload.js"
Cohesion: 0.22
Nodes (7): multer, __dirname, MAX_PUBLIC_UPLOAD_BYTES, MAX_UPLOAD_BYTES, storage, tempDir, upload

### Community 24 - "routes/stats.js"
Cohesion: 0.42
Nodes (6): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, statsLimiter

### Community 25 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

### Community 26 - "server/package.json"
Cohesion: 0.13
Nodes (13): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, name, private, type (+5 more)

### Community 27 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, migrate, seed:bootstrap, seed:templates, start

### Community 28 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+7 more)

### Community 29 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+3 more)

### Community 30 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 31 - "MilestonesBlock.jsx"
Cohesion: 0.33
Nodes (3): CATEGORY_COLORS, CATEGORY_ICONS, MilestonesBlock()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "LandingPage"
Cohesion: 0.36
Nodes (8): initialLandingConfig(), LANDING_DEFAULTS, loadLandingConfig(), mergeLandingConfig(), readCache(), writeCache(), LandingPage(), wantsSmoothScroll()

### Community 39 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **183 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+178 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 247 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `EditorSearchPalette.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `avatar.jsx`, `LandingPage.jsx`, `card.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `how-it-works.jsx`, `useWinnerCelebration.js`, `GitHubHeatmapBlock.jsx`, `MilestonesBlock.jsx`?**
  _High betweenness centrality (0.266) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `BlockRenderer.jsx`, `package.json`, `site.js`, `ThemePanel.jsx`, `lib/patchNotes.js`, `ogImageService.js`, `routes/stats.js`, `server/package.json`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `BlockRenderer.jsx`, `EditorSearchPalette.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `LandingPage.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `how-it-works.jsx`, `GitHubHeatmapBlock.jsx`, `MilestonesBlock.jsx`?**
  _High betweenness centrality (0.205) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _183 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06419753086419754 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._