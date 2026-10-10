# Graph Report - profile  (2026-10-11)

## Corpus Check
- 151 files · ~101,245 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 89 file(s) not represented in the graph (top: .css 82, (none) 6, .conf 1)

## Summary
- 702 nodes · 1597 edges · 42 communities (39 shown, 3 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 34 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ab6e850`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- images.js
- BlockRenderer.jsx
- EditorSearchPalette.jsx
- package.json
- vitest
- ThemePanel.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- LandingPage.jsx
- routes/auth.js
- routes/og.js
- src/index.js
- card.jsx
- dependencies
- WinnerSection.jsx
- lucide-react
- React + Vite
- db.js
- fields/index.js
- react
- how-it-works.jsx
- GitHubHeatmapBlock.jsx
- WinnerCelebration.jsx
- JournalBlock.jsx
- WinnerCertificate.jsx
- server/package.json
- TabManagerModal.jsx
- dependencies
- devDependencies
- upload.js
- routes/stats.js
- scripts
- LandingPage
- useWinnerCelebration.js
- scripts
- vite.config.js
- ref_path
- RepeatableList.jsx
- avatar.jsx
- ChecklistField.jsx
- TagsField.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 60 edges
2. `lucide-react` - 50 edges
3. `framer-motion` - 39 edges
4. `useAuth()` - 23 edges
5. `safeUrl()` - 23 edges
6. `query()` - 21 edges
7. `apiFetch()` - 21 edges
8. `react-router-dom` - 17 edges
9. `useDoubleBackdropClose()` - 13 edges
10. `useUiTheme()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `load()` --indirect_call--> `token()`  [INFERRED]
  src/pages/EditorPage.jsx → server/src/routes/stats.test.js
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPublicProfile()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/og.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `codeOnlyPatchNotes()` --calls--> `mergePatchNotes()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/lib/patchNotes.js

## Import Cycles
- None detected.

## Communities (42 total, 3 thin omitted)

### Community 0 - "images.js"
Cohesion: 0.15
Nodes (14): sharp, ref_url, uuid, upload, __dirname, router, uploadsDir, usageFor() (+6 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.06
Nodes (56): blockComponentMap, blockIconMap, BlockRenderer(), blockVariants, renderBlockIcon(), src_components_blocks_blocks, BlockIdContext, CanvasPortal() (+48 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (20): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+12 more)

### Community 4 - "vitest"
Cohesion: 0.18
Nodes (8): jsonwebtoken, vitest, clientIp(), normalizeAddress(), calls, settle(), token(), track()

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.10
Nodes (15): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+7 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.20
Nodes (18): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+10 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.11
Nodes (18): ChoiceField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield, src_components_editor_fields_index_notefield, src_components_editor_fields_index_repeatablelist (+10 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (9): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, WinnerSection(), ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, MAIN_SHOWCASE_PROFILE (+1 more)

### Community 10 - "routes/auth.js"
Cohesion: 0.13
Nodes (21): checkLength(), firstLengthError(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS, apiLimiter, byClient(), imageUploadLimiter (+13 more)

### Community 11 - "routes/og.js"
Cohesion: 0.24
Nodes (12): absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), handle(), loadPublicProfile(), originOf() (+4 more)

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

### Community 16 - "lucide-react"
Cohesion: 0.08
Nodes (48): framer-motion, lucide-react, react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage (+40 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "db.js"
Cohesion: 0.36
Nodes (6): pool, adminOnly(), auth(), optionalAuth(), ownerOnly(), router

### Community 19 - "fields/index.js"
Cohesion: 0.31
Nodes (4): Field(), ImageField(), ImageListField(), ImageUploadPicker()

### Community 20 - "react"
Cohesion: 0.22
Nodes (8): react, SkillsBlock(), TechIconField(), CONTENT_KEYS, POPULAR_TECH_PRESETS, resolveTechIcon(), TECH_ALIAS_MAP, TechIcon()

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.20
Nodes (10): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock(), SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS (+2 more)

### Community 23 - "WinnerCelebration.jsx"
Cohesion: 0.23
Nodes (8): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS

### Community 24 - "JournalBlock.jsx"
Cohesion: 0.08
Nodes (36): getEntryDateValue(), JournalBlock(), MOOD_OPTIONS, parseInlineMarkdown(), renderJournalMarkdown(), AuthContext, AuthProvider(), applyCSSVars() (+28 more)

### Community 25 - "WinnerCertificate.jsx"
Cohesion: 0.20
Nodes (7): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate(), src_components_landing_winnerevent_winnerevent

### Community 26 - "server/package.json"
Cohesion: 0.20
Nodes (9): bcrypt, cors, express-rate-limit, helmet, pg, name, private, type (+1 more)

### Community 27 - "TabManagerModal.jsx"
Cohesion: 0.27
Nodes (9): IconPickerField(), src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_sortablerow, src_components_editor_fields_index_textfield, TextField(), makeTabId(), renderTabIcon(), TabManagerModal() (+1 more)

### Community 28 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+7 more)

### Community 29 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+3 more)

### Community 30 - "upload.js"
Cohesion: 0.22
Nodes (7): multer, __dirname, MAX_PUBLIC_UPLOAD_BYTES, MAX_UPLOAD_BYTES, publicUpload, storage, tempDir

### Community 31 - "routes/stats.js"
Cohesion: 0.42
Nodes (6): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, router

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "LandingPage"
Cohesion: 0.36
Nodes (8): initialLandingConfig(), LANDING_DEFAULTS, loadLandingConfig(), mergeLandingConfig(), readCache(), writeCache(), LandingPage(), wantsSmoothScroll()

### Community 34 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

### Community 35 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, dev, migrate, seed:bootstrap, seed:templates, start

### Community 37 - "ref_path"
Cohesion: 0.40
Nodes (3): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path

### Community 38 - "RepeatableList.jsx"
Cohesion: 0.60
Nodes (3): makeItemId(), RepeatableList(), SortableRow()

### Community 39 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **178 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+173 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 242 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `EditorSearchPalette.jsx`, `package.json`, `ThemePanel.jsx`, `LandingPage.jsx`, `card.jsx`, `WinnerSection.jsx`, `lucide-react`, `fields/index.js`, `how-it-works.jsx`, `GitHubHeatmapBlock.jsx`, `WinnerCelebration.jsx`, `JournalBlock.jsx`, `WinnerCertificate.jsx`, `TabManagerModal.jsx`, `useWinnerCelebration.js`, `RepeatableList.jsx`, `avatar.jsx`, `ChecklistField.jsx`, `TagsField.jsx`?**
  _High betweenness centrality (0.271) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `BlockRenderer.jsx`, `EditorSearchPalette.jsx`, `package.json`, `ThemePanel.jsx`, `RepeatableList.jsx`, `SchemaBlockForm.jsx`, `ChecklistField.jsx`, `TagsField.jsx`, `LandingPage.jsx`, `WinnerSection.jsx`, `fields/index.js`, `react`, `how-it-works.jsx`, `GitHubHeatmapBlock.jsx`, `WinnerCelebration.jsx`, `JournalBlock.jsx`, `WinnerCertificate.jsx`, `TabManagerModal.jsx`?**
  _High betweenness centrality (0.209) - this node is a cross-community bridge._
- **Why does `vitest` connect `vitest` to `BlockRenderer.jsx`, `package.json`, `lib/patchNotes.js`, `routes/og.js`, `JournalBlock.jsx`, `routes/stats.js`?**
  _High betweenness centrality (0.156) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _178 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06138841078600115 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._
- **Should `ThemePanel.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._