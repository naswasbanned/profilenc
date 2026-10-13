# Graph Report - profile  (2026-10-13)

## Corpus Check
- 167 files · ~113,378 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 90 file(s) not represented in the graph (top: .css 83, (none) 6, .conf 1)

## Summary
- 818 nodes · 1908 edges · 38 communities (36 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 40 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1e2cfae4`
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
- EditorPage.jsx
- React + Vite
- TabManagerModal.jsx
- WinnerCelebration.jsx
- TagsField.jsx
- how-it-works.jsx
- WinnerCertificate.jsx
- images.js
- MusicPlayerBlock.jsx
- vitest
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- LandingPage
- RepeatableList.jsx
- scripts
- LandingPage.jsx
- react
- useWinnerCelebration.js
- vite.config.js
- scripts

## God Nodes (most connected - your core abstractions)
1. `react` - 64 edges
2. `lucide-react` - 51 edges
3. `framer-motion` - 39 edges
4. `safeUrl()` - 23 edges
5. `useAuth()` - 23 edges
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
- `MusicPlayerBlock()` --calls--> `safeUrl()`  [EXTRACTED]
  src/components/Blocks/MusicPlayerBlock.jsx → src/lib/safeUrl.js
- `ImageUploadPicker()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Editor/ImageUploadPicker.jsx → src/contexts/AuthContext.jsx
- `ImageUploadPicker()` --calls--> `apiFetch()`  [EXTRACTED]
  src/components/Editor/ImageUploadPicker.jsx → src/lib/api.js

## Import Cycles
- None detected.

## Communities (38 total, 2 thin omitted)

### Community 0 - "fields/index.js"
Cohesion: 0.30
Nodes (5): ChecklistField(), makeTaskId(), Field(), ImageField(), ImageUploadPicker()

### Community 1 - "lucide-react"
Cohesion: 0.06
Nodes (55): framer-motion, lucide-react, blockComponentMap, blockIconMap, blockVariants, BlockIdContext, CanvasPortal(), CardsGridBlock() (+47 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (20): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+12 more)

### Community 4 - "db.js"
Cohesion: 0.18
Nodes (14): pg, pool, isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, adminOnly() (+6 more)

### Community 5 - "ProfileCanvas.jsx"
Cohesion: 0.08
Nodes (32): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS (+24 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.19
Nodes (19): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+11 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.09
Nodes (21): ChoiceField(), ImageListField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield, src_components_editor_fields_index_notefield (+13 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (16): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+8 more)

### Community 9 - "TechIconField.jsx"
Cohesion: 0.39
Nodes (6): SkillsBlock(), TechIconField(), POPULAR_TECH_PRESETS, resolveTechIcon(), TECH_ALIAS_MAP, TechIcon()

### Community 10 - "routes/auth.js"
Cohesion: 0.13
Nodes (21): checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, clientIp(), normalizeAddress() (+13 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.13
Nodes (32): ref_crypto, absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H (+24 more)

### Community 12 - "src/index.js"
Cohesion: 0.17
Nodes (15): express, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app (+7 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.11
Nodes (13): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+5 more)

### Community 16 - "EditorPage.jsx"
Cohesion: 0.06
Nodes (70): react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage (+62 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "TabManagerModal.jsx"
Cohesion: 0.20
Nodes (11): IconPickerField(), src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_sortablerow, src_components_editor_fields_index_textfield, TextField(), makeTabId(), renderTabIcon(), TabManagerModal() (+3 more)

### Community 19 - "WinnerCelebration.jsx"
Cohesion: 0.23
Nodes (8): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "WinnerCertificate.jsx"
Cohesion: 0.20
Nodes (7): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate(), src_components_landing_winnerevent_winnerevent

### Community 23 - "images.js"
Cohesion: 0.08
Nodes (25): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, uuid, suggestionLimiter, __dirname (+17 more)

### Community 24 - "MusicPlayerBlock.jsx"
Cohesion: 0.14
Nodes (21): getTrackArtwork(), MusicPlayerBlock(), parseEmbedUrl(), PROVIDER_COLORS, PROVIDER_LABELS, musicPlayer, RangeField(), FLOAT_ALIGNS (+13 more)

### Community 25 - "vitest"
Cohesion: 0.18
Nodes (7): ref_url, vitest, cards, fixture, get(), users, clickTarget()

### Community 26 - "server/package.json"
Cohesion: 0.13
Nodes (13): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, name, private, type (+5 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.08
Nodes (53): fast-check, react-easy-crop, FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor() (+45 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 30 - "LandingPage"
Cohesion: 0.36
Nodes (8): initialLandingConfig(), LANDING_DEFAULTS, loadLandingConfig(), mergeLandingConfig(), readCache(), writeCache(), LandingPage(), wantsSmoothScroll()

### Community 31 - "RepeatableList.jsx"
Cohesion: 0.60
Nodes (3): makeItemId(), RepeatableList(), SortableRow()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (9): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, WinnerSection(), ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, MAIN_SHOWCASE_PROFILE (+1 more)

### Community 34 - "react"
Cohesion: 0.18
Nodes (7): react, CONTENT_KEYS, ImageEditor, LazyImageEditor(), Avatar, AvatarFallback, AvatarImage

### Community 35 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

### Community 37 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, migrate, seed:bootstrap, seed:templates, start

## Knowledge Gaps
- **196 isolated node(s):** `PROVIDER_LABELS`, `PROVIDER_COLORS`, `blockComponentMap`, `blockIconMap`, `blockVariants` (+191 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 262 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `fields/index.js`, `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `ProfileCanvas.jsx`, `TechIconField.jsx`, `card.jsx`, `WinnerSection.jsx`, `EditorPage.jsx`, `TabManagerModal.jsx`, `WinnerCelebration.jsx`, `TagsField.jsx`, `how-it-works.jsx`, `WinnerCertificate.jsx`, `MusicPlayerBlock.jsx`, `imageEdit.js`, `RepeatableList.jsx`, `LandingPage.jsx`, `useWinnerCelebration.js`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `lucide-react`, `package.json`, `db.js`, `ProfileCanvas.jsx`, `lib/patchNotes.js`, `routes/auth.js`, `ogImageService.js`, `MusicPlayerBlock.jsx`, `server/package.json`, `imageEdit.js`?**
  _High betweenness centrality (0.227) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `fields/index.js`, `LandingPage.jsx`, `EditorSearchPalette.jsx`, `package.json`, `react`, `ProfileCanvas.jsx`, `SchemaBlockForm.jsx`, `TechIconField.jsx`, `WinnerSection.jsx`, `EditorPage.jsx`, `TabManagerModal.jsx`, `WinnerCelebration.jsx`, `TagsField.jsx`, `how-it-works.jsx`, `WinnerCertificate.jsx`, `MusicPlayerBlock.jsx`, `imageEdit.js`, `RepeatableList.jsx`?**
  _High betweenness centrality (0.193) - this node is a cross-community bridge._
- **What connects `PROVIDER_LABELS`, `PROVIDER_COLORS`, `blockComponentMap` to the rest of the system?**
  _196 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.06470588235294118 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._
- **Should `ProfileCanvas.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07897793263646923 - nodes in this community are weakly interconnected._