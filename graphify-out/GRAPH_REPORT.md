# Graph Report - profile  (2026-10-14)

## Corpus Check
- 167 files · ~113,360 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 90 file(s) not represented in the graph (top: .css 83, (none) 6, .conf 1)

## Summary
- 820 nodes · 1911 edges · 34 communities (31 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cb2499cf`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- fields/index.js
- lucide-react
- EditorSearchPalette.jsx
- package.json
- db.js
- ProfileCanvas.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- TechIconField.jsx
- routes/auth.js
- ogImageService.js
- src/index.js
- card.jsx
- dependencies
- WinnerSection.jsx
- LandingPage.jsx
- React + Vite
- TabManagerModal.jsx
- ThemePanel.jsx
- TagsField.jsx
- how-it-works.jsx
- eslint.config.js
- images.js
- floatingPlayer.js
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- RepeatableList.jsx
- scripts
- container-scroll-animation.jsx
- react
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 64 edges
2. `lucide-react` - 51 edges
3. `framer-motion` - 39 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `query()` - 21 edges
7. `apiFetch()` - 21 edges
8. `react-router-dom` - 17 edges
9. `vitest` - 16 edges
10. `Field()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `load()` --indirect_call--> `token()`  [INFERRED]
  src/pages/EditorPage.jsx → server/src/routes/stats.test.js
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPublicProfile()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/og.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `buildPreview()` --calls--> `localUploadPath()`  [EXTRACTED]
  server/src/routes/og.js → server/src/services/ogImageService.js

## Import Cycles
- None detected.

## Communities (34 total, 3 thin omitted)

### Community 0 - "fields/index.js"
Cohesion: 0.30
Nodes (5): ChecklistField(), makeTaskId(), Field(), ImageField(), ImageUploadPicker()

### Community 1 - "lucide-react"
Cohesion: 0.06
Nodes (55): framer-motion, lucide-react, react-dom, blockComponentMap, blockIconMap, blockVariants, BlockIdContext, CanvasPortal() (+47 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, type, version, fast-check, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans (+9 more)

### Community 4 - "db.js"
Cohesion: 0.18
Nodes (14): pg, pool, isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, adminOnly() (+6 more)

### Community 5 - "ProfileCanvas.jsx"
Cohesion: 0.10
Nodes (31): vitest, BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), pageVariants, ProfileCanvas() (+23 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.09
Nodes (21): ChoiceField(), ImageListField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield, src_components_editor_fields_index_notefield (+13 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "TechIconField.jsx"
Cohesion: 0.39
Nodes (6): SkillsBlock(), TechIconField(), POPULAR_TECH_PRESETS, resolveTechIcon(), TECH_ALIAS_MAP, TechIcon()

### Community 10 - "routes/auth.js"
Cohesion: 0.10
Nodes (24): checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp(), normalizeAddress() (+16 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.13
Nodes (31): ref_crypto, absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H (+23 more)

### Community 12 - "src/index.js"
Cohesion: 0.17
Nodes (15): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+7 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "dependencies"
Cohesion: 0.11
Nodes (17): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+9 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.05
Nodes (35): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), alreadyCelebrated(), markCelebrated(), useWinnerCelebration() (+27 more)

### Community 16 - "LandingPage.jsx"
Cohesion: 0.05
Nodes (68): react-router-dom, token(), AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage (+60 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "TabManagerModal.jsx"
Cohesion: 0.20
Nodes (11): IconPickerField(), src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_sortablerow, src_components_editor_fields_index_textfield, TextField(), makeTabId(), renderTabIcon(), TabManagerModal() (+3 more)

### Community 19 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (26): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+18 more)

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals

### Community 23 - "images.js"
Cohesion: 0.07
Nodes (28): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, __dirname (+20 more)

### Community 24 - "floatingPlayer.js"
Cohesion: 0.23
Nodes (15): RangeField(), FLOAT_ALIGNS, FLOAT_DESIGN_SIZE, FLOAT_EDGES, FLOAT_SIZE_DEFAULT, FLOAT_SIZE_MAX, FLOAT_SIZE_MIN, FLOAT_SIZE_STEP (+7 more)

### Community 26 - "server/package.json"
Cohesion: 0.14
Nodes (12): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, name, private, type (+4 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.09
Nodes (49): FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor(), seedFreeSize(), stopPropagation() (+41 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 31 - "RepeatableList.jsx"
Cohesion: 0.60
Nodes (3): makeItemId(), RepeatableList(), SortableRow()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 34 - "react"
Cohesion: 0.18
Nodes (7): react, CONTENT_KEYS, ImageEditor, LazyImageEditor(), Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **196 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 264 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `fields/index.js`, `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `container-scroll-animation.jsx`, `ProfileCanvas.jsx`, `TechIconField.jsx`, `card.jsx`, `WinnerSection.jsx`, `LandingPage.jsx`, `TabManagerModal.jsx`, `ThemePanel.jsx`, `TagsField.jsx`, `how-it-works.jsx`, `floatingPlayer.js`, `imageEdit.js`, `RepeatableList.jsx`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `vitest` connect `ProfileCanvas.jsx` to `lucide-react`, `package.json`, `db.js`, `lib/patchNotes.js`, `routes/auth.js`, `ogImageService.js`, `images.js`, `floatingPlayer.js`, `server/package.json`, `imageEdit.js`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `fields/index.js`, `EditorSearchPalette.jsx`, `package.json`, `react`, `ProfileCanvas.jsx`, `SchemaBlockForm.jsx`, `TechIconField.jsx`, `WinnerSection.jsx`, `LandingPage.jsx`, `TabManagerModal.jsx`, `ThemePanel.jsx`, `TagsField.jsx`, `how-it-works.jsx`, `imageEdit.js`, `RepeatableList.jsx`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.06238030095759234 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `ProfileCanvas.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10409745293466224 - nodes in this community are weakly interconnected._