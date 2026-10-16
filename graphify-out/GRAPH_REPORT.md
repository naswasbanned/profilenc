# Graph Report - profile  (2026-10-16)

## Corpus Check
- 194 files · ~125,164 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 91 file(s) not represented in the graph (top: .css 84, (none) 6, .conf 1)

## Summary
- 933 nodes · 2203 edges · 38 communities (37 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `74b5883d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/inbox.js
- BlockRenderer.jsx
- EditorSearchPalette.jsx
- package.json
- routes/stats.js
- react
- lib/patchNotes.js
- apiFetch
- blockSchemas/index.js
- LandingPage.jsx
- rateLimit.js
- ogImageService.js
- src/index.js
- App.jsx
- dependencies
- WinnerSection.jsx
- SchemaBlockForm.jsx
- React + Vite
- lib/inbox.js
- ProfileCanvas.jsx
- DashboardPage.jsx
- how-it-works.jsx
- site.js
- images.js
- MusicPlayerBlock.jsx
- useAuth
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- scripts
- ContactBlock.jsx
- scripts
- GitHubHeatmapBlock.jsx
- vite.config.js
- card.jsx
- eslint.config.js
- avatar.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 72 edges
2. `lucide-react` - 55 edges
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
- `CanvasPortal()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Blocks/CanvasPortal.jsx → src/contexts/ThemeContext.jsx

## Import Cycles
- None detected.

## Communities (38 total, 1 thin omitted)

### Community 0 - "routes/inbox.js"
Cohesion: 0.13
Nodes (18): ref_node_http, createSuggestHandler(), escapeLike(), normalizePrefix(), SUGGEST_LIMIT, SUGGEST_MAX_QUERY, SUGGEST_MIN, auth() (+10 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.07
Nodes (52): blockComponentMap, blockIconMap, blockVariants, renderBlockIcon(), BlockIdContext, CanvasPortal(), CardsGridBlock(), downloadIcsFile() (+44 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (17): name, private, type, version, fast-check, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans (+9 more)

### Community 4 - "routes/stats.js"
Cohesion: 0.42
Nodes (6): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, router

### Community 5 - "react"
Cohesion: 0.16
Nodes (16): framer-motion, lucide-react, react, AddBlockModal(), BLOCK_PRESETS, BlockEditorModal(), getBlockSchema(), DeleteBlockModal() (+8 more)

### Community 6 - "lib/patchNotes.js"
Cohesion: 0.20
Nodes (18): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+10 more)

### Community 7 - "apiFetch"
Cohesion: 0.22
Nodes (16): AuthContext, AuthProvider(), API_BASE, apiFetch(), apiUrl(), clearStoredToken(), getStoredToken(), storeToken() (+8 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, contact, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS (+9 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.12
Nodes (15): HEADING_VARIANTS, RevealHeading(), WORD_VARIANTS, ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, initialLandingConfig(), LANDING_DEFAULTS (+7 more)

### Community 10 - "rateLimit.js"
Cohesion: 0.10
Nodes (24): ref_crypto, clientIp(), normalizeAddress(), req(), apiLimiter, byClient(), dmPairLimiter, dmUserLimiter (+16 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.13
Nodes (31): absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H, CARD_W (+23 more)

### Community 12 - "src/index.js"
Cohesion: 0.11
Nodes (25): express, pool, query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES (+17 more)

### Community 13 - "App.jsx"
Cohesion: 0.14
Nodes (15): react-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage, ProfilePage, RegisterPage (+7 more)

### Community 14 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.05
Nodes (35): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), alreadyCelebrated(), markCelebrated(), useWinnerCelebration() (+27 more)

### Community 16 - "SchemaBlockForm.jsx"
Cohesion: 0.05
Nodes (47): SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField(), ImageListField() (+39 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "lib/inbox.js"
Cohesion: 0.13
Nodes (32): InboxAvatar(), InboxCompose(), MAX_LENGTH, InboxMessageList(), InboxReader(), InboxSection(), readError(), EMPTY_TEXT (+24 more)

### Community 19 - "ProfileCanvas.jsx"
Cohesion: 0.06
Nodes (44): vitest, BlockRenderer(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS (+36 more)

### Community 20 - "DashboardPage.jsx"
Cohesion: 0.22
Nodes (12): react-router-dom, MobileBrandBar(), MobileDock(), DASHBOARD_TABS, formatUnreadBadge(), nextTabId(), resolveDashboardTab(), AdminDashboardPage() (+4 more)

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "site.js"
Cohesion: 0.10
Nodes (18): ref_node_assert, ref_node_test, checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), LIMITS, SAFE_PROTOCOLS (+10 more)

### Community 23 - "images.js"
Cohesion: 0.08
Nodes (26): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, ref_path, sharp, ref_url, uuid, __dirname, MAX_PUBLIC_UPLOAD_BYTES (+18 more)

### Community 24 - "MusicPlayerBlock.jsx"
Cohesion: 0.14
Nodes (21): getTrackArtwork(), MusicPlayerBlock(), parseEmbedUrl(), PROVIDER_COLORS, PROVIDER_LABELS, musicPlayer, RangeField(), FLOAT_ALIGNS (+13 more)

### Community 25 - "useAuth"
Cohesion: 0.26
Nodes (8): AccountSettingsModal(), src_components_editor_editor, ImageUploadPicker(), LazyImageEditor(), LandingBottomNav(), SECTION_TABS, TAP, useAuth()

### Community 26 - "server/package.json"
Cohesion: 0.12
Nodes (14): bcrypt, cors, express-rate-limit, helmet, jsonwebtoken, multer, pg, name (+6 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.08
Nodes (52): FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor(), seedFreeSize(), stopPropagation() (+44 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 30 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, migrate, seed:bootstrap, seed:templates, start, test

### Community 31 - "ContactBlock.jsx"
Cohesion: 0.48
Nodes (4): ContactBlock(), DEFAULT_MAX, loadTurnstile(), contactPlaceholder()

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 37 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 38 - "eslint.config.js"
Cohesion: 0.33
Nodes (5): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals

### Community 39 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **219 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+214 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 293 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `EditorSearchPalette.jsx`, `package.json`, `apiFetch`, `LandingPage.jsx`, `App.jsx`, `WinnerSection.jsx`, `SchemaBlockForm.jsx`, `lib/inbox.js`, `ProfileCanvas.jsx`, `DashboardPage.jsx`, `how-it-works.jsx`, `MusicPlayerBlock.jsx`, `useAuth`, `imageEdit.js`, `ContactBlock.jsx`, `GitHubHeatmapBlock.jsx`, `card.jsx`, `avatar.jsx`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **Why does `vitest` connect `ProfileCanvas.jsx` to `BlockRenderer.jsx`, `package.json`, `routes/stats.js`, `lib/patchNotes.js`, `rateLimit.js`, `ogImageService.js`, `lib/inbox.js`, `DashboardPage.jsx`, `site.js`, `images.js`, `MusicPlayerBlock.jsx`, `server/package.json`, `imageEdit.js`, `ContactBlock.jsx`?**
  _High betweenness centrality (0.264) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `react` to `BlockRenderer.jsx`, `GitHubHeatmapBlock.jsx`, `package.json`, `EditorSearchPalette.jsx`, `LandingPage.jsx`, `App.jsx`, `WinnerSection.jsx`, `SchemaBlockForm.jsx`, `lib/inbox.js`, `ProfileCanvas.jsx`, `DashboardPage.jsx`, `how-it-works.jsx`, `MusicPlayerBlock.jsx`, `useAuth`, `imageEdit.js`, `ContactBlock.jsx`?**
  _High betweenness centrality (0.182) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _219 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/inbox.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06523855890944498 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._