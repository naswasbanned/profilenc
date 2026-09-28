# Graph Report - profile  (2026-09-28)

## Corpus Check
- 136 files · ~95,997 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 89 file(s) not represented in the graph (top: .css 82, (none) 6, .conf 1)

## Summary
- 644 nodes · 1417 edges · 30 communities (28 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `dab3817d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- lucide-react
- EditorSearchPalette.jsx
- package.json
- react
- ThemePanel.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- dependencies
- routes/auth.js
- how-it-works.jsx
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- WinnerCelebration.jsx
- React + Vite
- db.js
- WinnerCertificate.jsx
- ContentPanel.jsx
- avatar.jsx
- LandingPage
- GitHubHeatmapBlock.jsx
- LandingPage.jsx
- useWinnerCelebration.js
- dependencies
- devDependencies
- scripts
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 59 edges
2. `lucide-react` - 50 edges
3. `framer-motion` - 39 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `apiFetch()` - 21 edges
7. `query()` - 18 edges
8. `react-router-dom` - 16 edges
9. `useDoubleBackdropClose()` - 13 edges
10. `useUiTheme()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `EditorOverlay()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Editor/EditorOverlay.jsx → src/contexts/ThemeContext.jsx
- `renderTabIcon()` --calls--> `getIcon()`  [EXTRACTED]
  src/components/Editor/TabManagerModal.jsx → src/lib/icons.js
- `CelebrationOverlay()` --calls--> `useOverlayLock()`  [EXTRACTED]
  src/components/Landing/WinnerEvent/WinnerCelebration.jsx → src/components/Landing/WinnerEvent/useOverlayLock.js

## Import Cycles
- None detected.

## Communities (30 total, 2 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.09
Nodes (23): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, __dirname (+15 more)

### Community 1 - "lucide-react"
Cohesion: 0.08
Nodes (46): framer-motion, lucide-react, blockComponentMap, blockIconMap, blockVariants, CardsGridBlock(), downloadIcsFile(), EventCardItem() (+38 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+11 more)

### Community 4 - "react"
Cohesion: 0.06
Nodes (60): react, react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage (+52 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.07
Nodes (41): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS (+33 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.06
Nodes (45): SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField(), ImageListField() (+37 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.10
Nodes (23): vitest, checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp(), normalizeAddress() (+15 more)

### Community 11 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 12 - "src/index.js"
Cohesion: 0.17
Nodes (15): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+7 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.12
Nodes (15): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, name, private, scripts (+7 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.11
Nodes (13): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+5 more)

### Community 16 - "WinnerCelebration.jsx"
Cohesion: 0.23
Nodes (8): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "db.js"
Cohesion: 0.31
Nodes (7): pg, pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 19 - "WinnerCertificate.jsx"
Cohesion: 0.20
Nodes (7): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate(), src_components_landing_winnerevent_winnerevent

### Community 21 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 22 - "LandingPage"
Cohesion: 0.36
Nodes (8): initialLandingConfig(), LANDING_DEFAULTS, loadLandingConfig(), mergeLandingConfig(), readCache(), writeCache(), LandingPage(), wantsSmoothScroll()

### Community 23 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 24 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (9): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, WinnerSection(), ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, MAIN_SHOWCASE_PROFILE (+1 more)

### Community 25 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

### Community 28 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+6 more)

### Community 29 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+3 more)

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

## Knowledge Gaps
- **174 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+169 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 233 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `how-it-works.jsx`, `card.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `ContentPanel.jsx`, `avatar.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`, `useWinnerCelebration.js`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `react`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `how-it-works.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `ContentPanel.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `react`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `how-it-works.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _174 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.07867494824016563 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._