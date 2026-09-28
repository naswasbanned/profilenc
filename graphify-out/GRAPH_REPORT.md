# Graph Report - profile  (2026-09-28)

## Corpus Check
- 133 files · ~90,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 87 file(s) not represented in the graph (top: .css 80, (none) 6, .conf 1)

## Summary
- 603 nodes · 1350 edges · 24 communities (23 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8bd55b81`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- BlockRenderer.jsx
- db.js
- package.json
- react
- ThemePanel.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- dependencies
- rateLimit.js
- clientIp
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- GitHubHeatmapBlock.jsx
- React + Vite
- scripts
- routes/auth.js
- gearIconUtils.jsx
- ContentPanel.jsx
- avatar.jsx
- how-it-works.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 57 edges
2. `lucide-react` - 49 edges
3. `framer-motion` - 38 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `apiFetch()` - 19 edges
7. `query()` - 18 edges
8. `react-router-dom` - 16 edges
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
- `EditorOverlay()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Editor/EditorOverlay.jsx → src/contexts/ThemeContext.jsx

## Import Cycles
- None detected.

## Communities (24 total, 1 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.10
Nodes (21): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, __dirname (+13 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.07
Nodes (49): blockComponentMap, blockIconMap, BlockRenderer(), blockVariants, renderBlockIcon(), src_components_blocks_blocks, CardsGridBlock(), downloadIcsFile() (+41 more)

### Community 2 - "db.js"
Cohesion: 0.36
Nodes (6): pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (46): dependencies, @fontsource/crimson-text, @fontsource/jetbrains-mono, @fontsource/orbitron, framer-motion, gsap, lenis, lucide-react (+38 more)

### Community 4 - "react"
Cohesion: 0.06
Nodes (63): framer-motion, lucide-react, react, react-dom, react-router-dom, App(), AccountSettingsModal(), AddBlockModal() (+55 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.07
Nodes (33): BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS (+25 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.06
Nodes (44): SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField(), ImageListField() (+36 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 10 - "rateLimit.js"
Cohesion: 0.31
Nodes (8): apiLimiter, byClient(), imageUploadLimiter, limiter(), loginAccountLimiter, loginIpLimiter, rejectionHandler(), suggestionLimiter

### Community 11 - "clientIp"
Cohesion: 0.38
Nodes (3): vitest, clientIp(), normalizeAddress()

### Community 12 - "src/index.js"
Cohesion: 0.13
Nodes (19): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+11 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.20
Nodes (9): cors, express-rate-limit, helmet, jsonwebtoken, pg, name, private, type (+1 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.06
Nodes (34): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), alreadyCelebrated(), markCelebrated(), useWinnerCelebration() (+26 more)

### Community 16 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, migrate, seed:bootstrap, seed:templates, start

### Community 19 - "routes/auth.js"
Cohesion: 0.21
Nodes (11): bcrypt, checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, passwordChangeLimiter, registerLimiter (+3 more)

### Community 20 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 22 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 23 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

## Knowledge Gaps
- **159 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+154 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 213 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `card.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `ContentPanel.jsx`, `avatar.jsx`, `how-it-works.jsx`?**
  _High betweenness centrality (0.283) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `BlockRenderer.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `gearIconUtils.jsx`, `ContentPanel.jsx`, `how-it-works.jsx`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `react` to `BlockRenderer.jsx`, `package.json`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `how-it-works.jsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _159 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.10052910052910052 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06773211567732115 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045068027210884355 - nodes in this community are weakly interconnected._