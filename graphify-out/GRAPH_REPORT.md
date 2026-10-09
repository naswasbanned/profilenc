# Graph Report - profile  (2026-10-10)

## Corpus Check
- 136 files · ~96,602 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 89 file(s) not represented in the graph (top: .css 82, (none) 6, .conf 1)

## Summary
- 648 nodes · 1429 edges · 27 communities (26 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a285e1e2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- lucide-react
- EditorSearchPalette.jsx
- package.json
- EditorOverlay.jsx
- ThemePanel.jsx
- lib/patchNotes.js
- react
- blockSchemas/index.js
- dependencies
- routes/auth.js
- clientIp
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- gearIconUtils.jsx
- React + Vite
- db.js
- eslint.config.js
- GitHubHeatmapBlock.jsx
- LandingPage.jsx
- site.js
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
8. `react-router-dom` - 17 edges
9. `useDoubleBackdropClose()` - 13 edges
10. `useUiTheme()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `byClient()` --calls--> `clientIp()`  [EXTRACTED]
  server/src/middleware/rateLimit.js → server/src/middleware/clientIp.js
- `rejectionHandler()` --calls--> `clientIp()`  [EXTRACTED]
  server/src/middleware/rateLimit.js → server/src/middleware/clientIp.js
- `ImageUploadPicker()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Editor/ImageUploadPicker.jsx → src/contexts/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (27 total, 1 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.10
Nodes (20): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path, sharp, ref_url, uuid, __dirname, MAX_PUBLIC_UPLOAD_BYTES (+12 more)

### Community 1 - "lucide-react"
Cohesion: 0.08
Nodes (48): framer-motion, lucide-react, blockComponentMap, blockIconMap, BlockRenderer(), blockVariants, renderBlockIcon(), CardsGridBlock() (+40 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.12
Nodes (16): name, private, type, version, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono (+8 more)

### Community 4 - "EditorOverlay.jsx"
Cohesion: 0.06
Nodes (64): react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage, RegisterPage (+56 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (26): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+18 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "react"
Cohesion: 0.05
Nodes (50): react, SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField() (+42 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.16
Nodes (17): checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, apiLimiter, byClient(), imageUploadLimiter (+9 more)

### Community 11 - "clientIp"
Cohesion: 0.38
Nodes (3): vitest, clientIp(), normalizeAddress()

### Community 12 - "src/index.js"
Cohesion: 0.17
Nodes (15): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+7 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.12
Nodes (15): bcrypt, cors, express-rate-limit, helmet, multer, name, private, scripts (+7 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.06
Nodes (31): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS (+23 more)

### Community 16 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "db.js"
Cohesion: 0.27
Nodes (8): jsonwebtoken, pg, pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 19 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals

### Community 22 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 24 - "LandingPage.jsx"
Cohesion: 0.06
Nodes (33): LandingBottomNav(), SECTION_TABS, TAP, HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, alreadyCelebrated(), markCelebrated() (+25 more)

### Community 26 - "site.js"
Cohesion: 0.29
Nodes (5): suggestionLimiter, publicUpload, router, ImageValidationError, processImage()

### Community 28 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+7 more)

### Community 29 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+3 more)

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

## Knowledge Gaps
- **176 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+171 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 236 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `EditorOverlay.jsx`, `ThemePanel.jsx`, `card.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.286) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `EditorOverlay.jsx`, `ThemePanel.jsx`, `react`, `WinnerSection.jsx`, `gearIconUtils.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `EditorOverlay.jsx`, `ThemePanel.jsx`, `react`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _176 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10153846153846154 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.07515734912995187 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._