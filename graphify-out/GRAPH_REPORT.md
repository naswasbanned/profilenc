# Graph Report - profile  (2026-09-28)

## Corpus Check
- 134 files · ~92,111 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 88 file(s) not represented in the graph (top: .css 81, (none) 6, .conf 1)

## Summary
- 627 nodes · 1388 edges · 29 communities (26 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 29 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `eb8abedf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- BlockRenderer.jsx
- gearIconUtils.jsx
- package.json
- lucide-react
- ThemePanel.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- dependencies
- routes/auth.js
- TagsField.jsx
- src/index.js
- card.jsx
- server/package.json
- WinnerSection.jsx
- GitHubHeatmapBlock.jsx
- React + Vite
- TabManagerModal.jsx
- ContentPanel.jsx
- avatar.jsx
- LandingPage.jsx
- fields/index.js
- dependencies
- devDependencies
- react
- scripts
- RepeatableList.jsx
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 58 edges
2. `lucide-react` - 49 edges
3. `framer-motion` - 38 edges
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
- `LightboxBody()` --calls--> `useOverlayLock()`  [EXTRACTED]
  src/components/Landing/WinnerEvent/WinnerCertificate.jsx → src/components/Landing/WinnerEvent/useOverlayLock.js

## Import Cycles
- None detected.

## Communities (29 total, 3 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.08
Nodes (26): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, suggestionLimiter (+18 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.08
Nodes (39): blockComponentMap, blockIconMap, blockVariants, CardsGridBlock(), downloadIcsFile(), EventCardItem(), EventsBlock(), getGoogleCalendarUrl() (+31 more)

### Community 2 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (19): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+11 more)

### Community 4 - "lucide-react"
Cohesion: 0.06
Nodes (61): framer-motion, lucide-react, react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage (+53 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.07
Nodes (40): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS (+32 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.09
Nodes (21): ChoiceField(), ImageField(), ImageListField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield (+13 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.12
Nodes (20): express-rate-limit, vitest, checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp() (+12 more)

### Community 12 - "src/index.js"
Cohesion: 0.12
Nodes (23): express, pg, pool, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates() (+15 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "server/package.json"
Cohesion: 0.13
Nodes (14): bcrypt, cors, helmet, jsonwebtoken, name, private, scripts, dev (+6 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.06
Nodes (31): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS (+23 more)

### Community 16 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 20 - "TabManagerModal.jsx"
Cohesion: 0.20
Nodes (11): IconPickerField(), src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_sortablerow, src_components_editor_fields_index_textfield, TextField(), makeTabId(), renderTabIcon(), TabManagerModal() (+3 more)

### Community 22 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 24 - "LandingPage.jsx"
Cohesion: 0.07
Nodes (30): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), ThreeDProfiles() (+22 more)

### Community 25 - "fields/index.js"
Cohesion: 0.37
Nodes (3): ChecklistField(), makeTaskId(), Field()

### Community 28 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+6 more)

### Community 29 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+3 more)

### Community 31 - "react"
Cohesion: 0.36
Nodes (7): react, SkillsBlock(), TechIconField(), POPULAR_TECH_PRESETS, resolveTechIcon(), TECH_ALIAS_MAP, TechIcon()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 35 - "RepeatableList.jsx"
Cohesion: 0.60
Nodes (3): makeItemId(), RepeatableList(), SortableRow()

## Knowledge Gaps
- **167 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+162 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 224 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `package.json`, `lucide-react`, `ThemePanel.jsx`, `RepeatableList.jsx`, `TagsField.jsx`, `card.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `TabManagerModal.jsx`, `ContentPanel.jsx`, `avatar.jsx`, `LandingPage.jsx`, `fields/index.js`?**
  _High betweenness centrality (0.285) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `BlockRenderer.jsx`, `gearIconUtils.jsx`, `package.json`, `RepeatableList.jsx`, `ThemePanel.jsx`, `SchemaBlockForm.jsx`, `TagsField.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `TabManagerModal.jsx`, `ContentPanel.jsx`, `LandingPage.jsx`, `fields/index.js`, `react`?**
  _High betweenness centrality (0.224) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `lucide-react` to `BlockRenderer.jsx`, `package.json`, `RepeatableList.jsx`, `ThemePanel.jsx`, `WinnerSection.jsx`, `GitHubHeatmapBlock.jsx`, `TabManagerModal.jsx`, `LandingPage.jsx`?**
  _High betweenness centrality (0.106) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _167 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `images.js` be split into smaller, more focused modules?**
  _Cohesion score 0.08235294117647059 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08306010928961749 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.11428571428571428 - nodes in this community are weakly interconnected._