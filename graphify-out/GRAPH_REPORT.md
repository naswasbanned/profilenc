# Graph Report - profile  (2026-10-16)

## Corpus Check
- 193 files · ~125,130 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 91 file(s) not represented in the graph (top: .css 84, (none) 6, .conf 1)

## Summary
- 932 nodes · 2197 edges · 41 communities (37 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fa2df5a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/inbox.js
- lucide-react
- EditorSearchPalette.jsx
- package.json
- routes/stats.js
- DashboardPage.jsx
- lib/patchNotes.js
- SchemaBlockForm.jsx
- blockSchemas/index.js
- LandingPage.jsx
- rateLimit.js
- ogImageService.js
- src/index.js
- card.jsx
- dependencies
- WinnerSection.jsx
- fields/index.js
- React + Vite
- lib/inbox.js
- ProfileCanvas.jsx
- WinnerCelebration.jsx
- how-it-works.jsx
- validateSubmission.js
- images.js
- floatingPlayer.js
- TabManagerModal.jsx
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- WinnerCertificate.jsx
- TechIconField.jsx
- scripts
- useWinnerCelebration.js
- container-scroll-animation.jsx
- 3d-testimonials.jsx
- vite.config.js
- RepeatableList.jsx
- react
- TagsField.jsx
- messages.js

## God Nodes (most connected - your core abstractions)
1. `react` - 71 edges
2. `lucide-react` - 56 edges
3. `framer-motion` - 39 edges
4. `apiFetch()` - 27 edges
5. `query()` - 25 edges
6. `useAuth()` - 25 edges
7. `safeUrl()` - 23 edges
8. `vitest` - 21 edges
9. `react-router-dom` - 19 edges
10. `express` - 14 edges

## Surprising Connections (you probably didn't know these)
- `usageFor()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/images.js → server/src/config/db.js
- `loadPublicProfile()` --calls--> `query()`  [EXTRACTED]
  server/src/routes/og.js → server/src/config/db.js
- `loadPatchNotes()` --calls--> `query()`  [EXTRACTED]
  server/src/services/patchNotesService.js → server/src/config/db.js
- `withHandler()` --indirect_call--> `auth()`  [INFERRED]
  server/test/suggestUsers.check.js → server/src/middleware/auth.js
- `byClient()` --calls--> `clientIp()`  [EXTRACTED]
  server/src/middleware/rateLimit.js → server/src/middleware/clientIp.js

## Import Cycles
- None detected.

## Communities (41 total, 4 thin omitted)

### Community 0 - "routes/inbox.js"
Cohesion: 0.13
Nodes (18): ref_node_http, createSuggestHandler(), escapeLike(), normalizePrefix(), SUGGEST_LIMIT, SUGGEST_MAX_QUERY, SUGGEST_MIN, auth() (+10 more)

### Community 1 - "lucide-react"
Cohesion: 0.06
Nodes (60): framer-motion, lucide-react, blockComponentMap, blockIconMap, blockVariants, BlockIdContext, CanvasPortal(), CardsGridBlock() (+52 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (20): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+12 more)

### Community 4 - "routes/stats.js"
Cohesion: 0.42
Nodes (6): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, router

### Community 5 - "DashboardPage.jsx"
Cohesion: 0.05
Nodes (69): react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage (+61 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.20
Nodes (18): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+10 more)

### Community 7 - "SchemaBlockForm.jsx"
Cohesion: 0.09
Nodes (21): ChoiceField(), ImageListField(), src_components_editor_fields_index_checklistfield, src_components_editor_fields_index_choicefield, src_components_editor_fields_index_imagefield, src_components_editor_fields_index_imagelistfield, src_components_editor_fields_index_linesfield, src_components_editor_fields_index_notefield (+13 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.08
Nodes (18): cardsGrid, contact, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS (+10 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.15
Nodes (16): LandingBottomNav(), SECTION_TABS, TAP, HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, WinnerSection(), initialLandingConfig() (+8 more)

### Community 10 - "rateLimit.js"
Cohesion: 0.11
Nodes (24): checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), SAFE_PROTOCOLS, apiLimiter, byClient(), dmPairLimiter (+16 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.10
Nodes (36): vitest, absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H (+28 more)

### Community 12 - "src/index.js"
Cohesion: 0.12
Nodes (23): express, pool, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES (+15 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "dependencies"
Cohesion: 0.10
Nodes (18): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+10 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.11
Nodes (13): BITS, CARD_TILTS, HOVER_SPRING, initialsOf(), LIST_VARIANTS, NOTE_TILTS, NOTE_TONES, NOTE_VARIANTS (+5 more)

### Community 16 - "fields/index.js"
Cohesion: 0.30
Nodes (5): ChecklistField(), makeTaskId(), Field(), ImageField(), ImageUploadPicker()

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "lib/inbox.js"
Cohesion: 0.17
Nodes (26): InboxCompose(), MAX_LENGTH, InboxMessageList(), InboxReader(), InboxSection(), readError(), EMPTY_TEXT, InboxSidebar() (+18 more)

### Community 19 - "ProfileCanvas.jsx"
Cohesion: 0.06
Nodes (45): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS (+37 more)

### Community 20 - "WinnerCelebration.jsx"
Cohesion: 0.19
Nodes (10): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS, WORD_VARIANTS (+2 more)

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "validateSubmission.js"
Cohesion: 0.18
Nodes (10): ref_node_assert, ref_node_test, LIMITS, DEFAULT_MAX, fail(), FIELD_TYPES, MODES, validateSubmission() (+2 more)

### Community 23 - "images.js"
Cohesion: 0.08
Nodes (26): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path, sharp, ref_url, uuid, __dirname, MAX_PUBLIC_UPLOAD_BYTES (+18 more)

### Community 24 - "floatingPlayer.js"
Cohesion: 0.23
Nodes (15): RangeField(), FLOAT_ALIGNS, FLOAT_DESIGN_SIZE, FLOAT_EDGES, FLOAT_SIZE_DEFAULT, FLOAT_SIZE_MAX, FLOAT_SIZE_MIN, FLOAT_SIZE_STEP (+7 more)

### Community 25 - "TabManagerModal.jsx"
Cohesion: 0.20
Nodes (11): IconPickerField(), src_components_editor_fields_index_iconpickerfield, src_components_editor_fields_index_sortablerow, src_components_editor_fields_index_textfield, TextField(), makeTabId(), renderTabIcon(), TabManagerModal() (+3 more)

### Community 26 - "server/package.json"
Cohesion: 0.12
Nodes (14): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, multer, pg, name (+6 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.08
Nodes (53): fast-check, react-easy-crop, FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor() (+45 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 30 - "WinnerCertificate.jsx"
Cohesion: 0.22
Nodes (6): useOverlayLock(), LightboxBody(), MEDAL_BURST, SIGNATURE_PATHS, TILT_SPRING, WinnerCertificate()

### Community 31 - "TechIconField.jsx"
Cohesion: 0.39
Nodes (6): SkillsBlock(), TechIconField(), POPULAR_TECH_PRESETS, resolveTechIcon(), TECH_ALIAS_MAP, TechIcon()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "useWinnerCelebration.js"
Cohesion: 0.48
Nodes (5): alreadyCelebrated(), markCelebrated(), useWinnerCelebration(), whenPageSettles(), WINNER_EVENT

### Community 39 - "RepeatableList.jsx"
Cohesion: 0.60
Nodes (3): makeItemId(), RepeatableList(), SortableRow()

### Community 40 - "react"
Cohesion: 0.18
Nodes (7): react, CONTENT_KEYS, ImageEditor, LazyImageEditor(), Avatar, AvatarFallback, AvatarImage

### Community 44 - "messages.js"
Cohesion: 0.23
Nodes (6): ref_crypto, clientIp(), normalizeAddress(), req(), messageLimiter, router

## Knowledge Gaps
- **219 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 294 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `EditorSearchPalette.jsx`, `package.json`, `DashboardPage.jsx`, `LandingPage.jsx`, `card.jsx`, `WinnerSection.jsx`, `fields/index.js`, `lib/inbox.js`, `ProfileCanvas.jsx`, `WinnerCelebration.jsx`, `how-it-works.jsx`, `floatingPlayer.js`, `TabManagerModal.jsx`, `imageEdit.js`, `WinnerCertificate.jsx`, `TechIconField.jsx`, `useWinnerCelebration.js`, `container-scroll-animation.jsx`, `3d-testimonials.jsx`, `RepeatableList.jsx`, `TagsField.jsx`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `vitest` connect `ogImageService.js` to `lucide-react`, `package.json`, `routes/stats.js`, `DashboardPage.jsx`, `lib/patchNotes.js`, `rateLimit.js`, `messages.js`, `lib/inbox.js`, `ProfileCanvas.jsx`, `images.js`, `floatingPlayer.js`, `server/package.json`, `imageEdit.js`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `EditorSearchPalette.jsx`, `package.json`, `DashboardPage.jsx`, `SchemaBlockForm.jsx`, `LandingPage.jsx`, `WinnerSection.jsx`, `fields/index.js`, `lib/inbox.js`, `ProfileCanvas.jsx`, `WinnerCelebration.jsx`, `how-it-works.jsx`, `TabManagerModal.jsx`, `imageEdit.js`, `WinnerCertificate.jsx`, `TechIconField.jsx`, `3d-testimonials.jsx`, `RepeatableList.jsx`, `react`, `TagsField.jsx`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/inbox.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.057195149851292613 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10822510822510822 - nodes in this community are weakly interconnected._