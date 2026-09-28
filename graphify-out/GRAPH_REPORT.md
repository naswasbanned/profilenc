# Graph Report - profile  (2026-09-28)

## Corpus Check
- 134 files · ~92,331 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 88 file(s) not represented in the graph (top: .css 81, (none) 6, .conf 1)

## Summary
- 626 nodes · 1368 edges · 24 communities (23 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d2bfa2a4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- lucide-react
- gearIconUtils.jsx
- package.json
- EditorPage.jsx
- ThemePanel.jsx
- lib/patchNotes.js
- ProfileCanvas.jsx
- blockSchemas/index.js
- dependencies
- routes/auth.js
- how-it-works.jsx
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- db.js
- React + Vite
- LandingPage.jsx
- react
- dependencies
- devDependencies
- scripts
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 58 edges
2. `lucide-react` - 49 edges
3. `framer-motion` - 38 edges
4. `safeUrl()` - 23 edges
5. `useAuth()` - 23 edges
6. `apiFetch()` - 21 edges
7. `query()` - 18 edges
8. `react-router-dom` - 16 edges
9. `useUiTheme()` - 13 edges
10. `useDoubleBackdropClose()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `LandingBottomNav()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Landing/LandingBottomNav.jsx → src/contexts/AuthContext.jsx
- `LandingPage()` --calls--> `useUiTheme()`  [EXTRACTED]
  src/pages/LandingPage.jsx → src/hooks/useUiTheme.js
- `LandingPage()` --indirect_call--> `initialLandingConfig()`  [INFERRED]
  src/pages/LandingPage.jsx → src/lib/landingConfig.js
- `loadLandingConfig()` --calls--> `apiFetch()`  [EXTRACTED]
  src/lib/landingConfig.js → src/lib/api.js

## Import Cycles
- None detected.

## Communities (24 total, 1 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.09
Nodes (23): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, __dirname (+15 more)

### Community 1 - "lucide-react"
Cohesion: 0.07
Nodes (47): framer-motion, lucide-react, blockComponentMap, blockIconMap, blockVariants, CardsGridBlock(), downloadIcsFile(), EventCardItem() (+39 more)

### Community 2 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+11 more)

### Community 4 - "EditorPage.jsx"
Cohesion: 0.06
Nodes (65): react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage (+57 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.10
Nodes (15): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+7 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "ProfileCanvas.jsx"
Cohesion: 0.07
Nodes (39): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), IconPickerField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield (+31 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.11
Nodes (17): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+9 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.11
Nodes (22): vitest, checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp(), normalizeAddress() (+14 more)

### Community 11 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (10): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, layoutCards(), PatchBoard(), PIN_VARIANTS, ROW_VARIANTS (+2 more)

### Community 12 - "src/index.js"
Cohesion: 0.16
Nodes (16): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+8 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.22
Nodes (8): bcrypt, cors, express-rate-limit, helmet, name, private, type, version

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.06
Nodes (30): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS (+22 more)

### Community 16 - "db.js"
Cohesion: 0.27
Nodes (8): jsonwebtoken, pg, pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 24 - "LandingPage.jsx"
Cohesion: 0.09
Nodes (20): LandingBottomNav(), SECTION_TABS, TAP, HEADING_VARIANTS, WORD_VARIANTS, alreadyCelebrated(), markCelebrated(), useWinnerCelebration() (+12 more)

### Community 25 - "react"
Cohesion: 0.08
Nodes (20): react, SkillsBlock(), ChecklistField(), makeTaskId(), Field(), makeItemId(), RepeatableList(), SortableRow() (+12 more)

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
- **167 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 234 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `ProfileCanvas.jsx`, `how-it-works.jsx`, `card.jsx`, `WinnerSection.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.287) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `gearIconUtils.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `ProfileCanvas.jsx`, `how-it-works.jsx`, `WinnerSection.jsx`, `LandingPage.jsx`, `react`?**
  _High betweenness centrality (0.226) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `lucide-react` to `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `ProfileCanvas.jsx`, `how-it-works.jsx`, `WinnerSection.jsx`, `LandingPage.jsx`, `react`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.0745814307458143 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._