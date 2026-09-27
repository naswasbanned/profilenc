# Graph Report - profile  (2026-09-27)

## Corpus Check
- 128 files · ~86,739 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 86 file(s) not represented in the graph (top: .css 79, (none) 6, .conf 1)

## Summary
- 569 nodes · 1268 edges · 24 communities (23 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b6c9419b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- BlockRenderer.jsx
- db.js
- package.json
- EditorPage.jsx
- ThemePanel.jsx
- LandingPage.jsx
- react
- blockSchemas/index.js
- dependencies
- routes/auth.js
- lucide-react
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- WinnerCelebration.jsx
- React + Vite
- WinnerCertificate.jsx
- GitHubHeatmapBlock.jsx
- gearIconUtils.jsx
- scripts
- container-scroll-animation.jsx
- how-it-works.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 57 edges
2. `lucide-react` - 48 edges
3. `framer-motion` - 37 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `apiFetch()` - 19 edges
7. `react-router-dom` - 16 edges
8. `query()` - 16 edges
9. `useDoubleBackdropClose()` - 13 edges
10. `useUiTheme()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `AccountSettingsModal()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Editor/AccountSettingsModal.jsx → src/contexts/AuthContext.jsx
- `EditorOverlay()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Editor/EditorOverlay.jsx → src/contexts/ThemeContext.jsx
- `ImageUploadPicker()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Editor/ImageUploadPicker.jsx → src/contexts/AuthContext.jsx
- `ImageUploadPicker()` --calls--> `apiFetch()`  [EXTRACTED]
  src/components/Editor/ImageUploadPicker.jsx → src/lib/api.js

## Import Cycles
- None detected.

## Communities (24 total, 1 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.10
Nodes (23): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path, sharp, ref_url, uuid, suggestionLimiter, __dirname (+15 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.09
Nodes (40): framer-motion, blockComponentMap, blockIconMap, blockVariants, CardsGridBlock(), downloadIcsFile(), EventCardItem(), EventsBlock() (+32 more)

### Community 2 - "db.js"
Cohesion: 0.38
Nodes (6): pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (46): dependencies, @fontsource/crimson-text, @fontsource/jetbrains-mono, @fontsource/orbitron, framer-motion, gsap, lenis, lucide-react (+38 more)

### Community 4 - "EditorPage.jsx"
Cohesion: 0.09
Nodes (43): react-dom, react-router-dom, App(), EditorOverlay(), LandingBottomNav(), SECTION_TABS, TAP, MobileBrandBar() (+35 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (26): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+18 more)

### Community 6 - "LandingPage.jsx"
Cohesion: 0.22
Nodes (7): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), WINNER_EVENT, ThreeDProfiles(), ENGINE_PATCH_NOTES, MAIN_SHOWCASE_PROFILE

### Community 7 - "react"
Cohesion: 0.05
Nodes (44): react, SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), ImageField(), ImageListField() (+36 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.14
Nodes (18): vitest, checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp(), normalizeAddress() (+10 more)

### Community 11 - "lucide-react"
Cohesion: 0.10
Nodes (33): lucide-react, BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, AccountSettingsModal(), AddBlockModal(), BLOCK_PRESETS, BlockEditorModal() (+25 more)

### Community 12 - "src/index.js"
Cohesion: 0.12
Nodes (21): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, DEFAULT_PATCH_NOTES, seedBootstrap(), seedTemplates(), TEMPLATES (+13 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.17
Nodes (11): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, multer, pg, name (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.10
Nodes (14): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+6 more)

### Community 16 - "WinnerCelebration.jsx"
Cohesion: 0.21
Nodes (10): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WinnerCelebration() (+2 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "WinnerCertificate.jsx"
Cohesion: 0.22
Nodes (6): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate()

### Community 19 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 20 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 21 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, migrate, seed:bootstrap, seed:templates, start

### Community 23 - "how-it-works.jsx"
Cohesion: 0.33
Nodes (3): DEFAULT_PROFILENC_PATCHES, HowItWorks(), THEME_CYCLE

## Knowledge Gaps
- **152 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 204 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `routes/auth.js` to `BlockRenderer.jsx`, `package.json`?**
  _High betweenness centrality (0.334) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `BlockRenderer.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `LandingPage.jsx`, `lucide-react`, `card.jsx`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `GitHubHeatmapBlock.jsx`, `container-scroll-animation.jsx`, `how-it-works.jsx`?**
  _High betweenness centrality (0.329) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `BlockRenderer.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `LandingPage.jsx`, `react`, `WinnerSection.jsx`, `WinnerCelebration.jsx`, `WinnerCertificate.jsx`, `GitHubHeatmapBlock.jsx`, `gearIconUtils.jsx`?**
  _High betweenness centrality (0.241) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.0967741935483871 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08725542041248018 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045068027210884355 - nodes in this community are weakly interconnected._