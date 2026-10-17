# Graph Report - profile  (2026-10-17)

## Corpus Check
- 200 files · ~128,223 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 91 file(s) not represented in the graph (top: .css 84, (none) 6, .conf 1)

## Summary
- 971 nodes · 2308 edges · 41 communities (39 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 48 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e8d92964`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- routes/inbox.js
- JournalBlock.jsx
- EditorSearchPalette.jsx
- package.json
- routes/stats.js
- ContentPanel.jsx
- BlockRenderer.jsx
- react
- blockSchemas/index.js
- LandingPage.jsx
- rateLimit.js
- ogImageService.js
- src/index.js
- safeUrl
- dependencies
- WinnerSection.jsx
- SchemaBlockForm.jsx
- React + Vite
- lib/inbox.js
- ThemePanel.jsx
- lucide-react
- how-it-works.jsx
- validateSubmission.js
- images.js
- floatingPlayer.js
- messages.js
- server/package.json
- imageEdit.js
- dependencies
- devDependencies
- scripts
- db.js
- scripts
- framer-motion
- vitest
- MusicPlayerBlock.jsx
- vite.config.js
- card.jsx
- gearIconUtils.jsx
- avatar.jsx
- EventsBlock.jsx

## God Nodes (most connected - your core abstractions)
1. `react` - 72 edges
2. `lucide-react` - 56 edges
3. `framer-motion` - 39 edges
4. `apiFetch()` - 27 edges
5. `query()` - 25 edges
6. `useAuth()` - 25 edges
7. `vitest` - 23 edges
8. `safeUrl()` - 23 edges
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

## Communities (41 total, 2 thin omitted)

### Community 0 - "routes/inbox.js"
Cohesion: 0.13
Nodes (18): ref_node_http, createSuggestHandler(), escapeLike(), normalizePrefix(), SUGGEST_LIMIT, SUGGEST_MAX_QUERY, SUGGEST_MIN, auth() (+10 more)

### Community 1 - "JournalBlock.jsx"
Cohesion: 0.20
Nodes (16): renderBlockIcon(), getEntryDateValue(), JournalBlock(), MOOD_OPTIONS, parseInlineMarkdown(), renderJournalMarkdown(), ProfileTabsNav(), renderTabIcon() (+8 more)

### Community 2 - "EditorSearchPalette.jsx"
Cohesion: 0.18
Nodes (14): EditorSearchPalette(), getRecent(), ICON_MAP, pushRecent(), ACCOUNT_ENTRIES, ACTION_ENTRIES, BLOCK_TYPE_ENTRIES, buildSearchEntries() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.10
Nodes (21): name, private, type, version, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh (+13 more)

### Community 4 - "routes/stats.js"
Cohesion: 0.42
Nodes (6): isBotUserAgent(), MAX_TARGET_LENGTH, parseDays(), parseStatEvent(), STAT_KINDS, router

### Community 6 - "BlockRenderer.jsx"
Cohesion: 0.13
Nodes (14): blockComponentMap, blockIconMap, BlockRenderer(), blockVariants, src_components_blocks_blocks, CATEGORY_COLORS, CATEGORY_ICONS, MilestonesBlock() (+6 more)

### Community 7 - "react"
Cohesion: 0.05
Nodes (79): react, react-dom, react-router-dom, AdminDashboardPage, App(), DashboardPage, EditorPage, LoginPage (+71 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.08
Nodes (18): cardsGrid, contact, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS (+10 more)

### Community 9 - "LandingPage.jsx"
Cohesion: 0.07
Nodes (39): MANUAL_PATCH_NOTES, CHANGE_TYPES, compareNewestFirst(), dateValue(), DEFAULT_STATUS, findManualNote(), LATEST_STATUS, mergePatchNotes() (+31 more)

### Community 10 - "rateLimit.js"
Cohesion: 0.11
Nodes (23): checkLength(), firstLengthError(), isOwnUploadUrl(), isSafeUrl(), SAFE_PROTOCOLS, apiLimiter, byClient(), dmPairLimiter (+15 more)

### Community 11 - "ogImageService.js"
Cohesion: 0.13
Nodes (31): absoluteImage(), escapeHtml(), findJournalEntry(), renderOgHtml(), summarize(), AVATAR_BOX, CARD_H, CARD_W (+23 more)

### Community 12 - "src/index.js"
Cohesion: 0.18
Nodes (15): query(), runMigrations(), DEFAULT_LANDING_SETTINGS, seedBootstrap(), seedTemplates(), TEMPLATES, app, __dirname (+7 more)

### Community 13 - "safeUrl"
Cohesion: 0.24
Nodes (11): FeaturedVideoBlock(), HeroBlock(), socialIcons, MediaReviewsBlock(), ServicesBlock(), VideoGalleryBlock(), OptimizedImage(), isSafeUrl() (+3 more)

### Community 14 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, multer (+3 more)

### Community 15 - "WinnerSection.jsx"
Cohesion: 0.06
Nodes (31): createConfetti(), FALLBACK_COLORS, readConfettiPalette(), TrophyArt(), useOverlayLock(), CelebrationOverlay(), fadeUp(), HEADLINE_VARIANTS (+23 more)

### Community 16 - "SchemaBlockForm.jsx"
Cohesion: 0.06
Nodes (46): SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField(), ImageListField() (+38 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "lib/inbox.js"
Cohesion: 0.13
Nodes (32): InboxAvatar(), InboxCompose(), MAX_LENGTH, InboxMessageList(), InboxReader(), InboxSection(), readError(), EMPTY_TEXT (+24 more)

### Community 19 - "ThemePanel.jsx"
Cohesion: 0.06
Nodes (56): ColorInput(), groupTitle, muted, NavigationSection(), BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS (+48 more)

### Community 20 - "lucide-react"
Cohesion: 0.31
Nodes (8): lucide-react, BlockIdContext, CanvasPortal(), CardsGridBlock(), GalleryBlock(), TimelineBlock(), useDoubleBackdropClose(), getCanvasStyleAttributes()

### Community 21 - "how-it-works.jsx"
Cohesion: 0.16
Nodes (11): CARD_VARIANTS, CHANGE_VARIANTS, CHANGES_VARIANTS, EASE_OUT, HowItWorks(), layoutCards(), PatchBoard(), PIN_VARIANTS (+3 more)

### Community 22 - "validateSubmission.js"
Cohesion: 0.18
Nodes (10): ref_node_assert, ref_node_test, LIMITS, DEFAULT_MAX, fail(), FIELD_TYPES, MODES, validateSubmission() (+2 more)

### Community 23 - "images.js"
Cohesion: 0.07
Nodes (28): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., ref_fs, multer, ref_path, sharp, ref_url, uuid, suggestionLimiter (+20 more)

### Community 24 - "floatingPlayer.js"
Cohesion: 0.23
Nodes (15): RangeField(), FLOAT_ALIGNS, FLOAT_DESIGN_SIZE, FLOAT_EDGES, FLOAT_SIZE_DEFAULT, FLOAT_SIZE_MAX, FLOAT_SIZE_MIN, FLOAT_SIZE_STEP (+7 more)

### Community 25 - "messages.js"
Cohesion: 0.23
Nodes (6): ref_crypto, clientIp(), normalizeAddress(), req(), messageLimiter, router

### Community 26 - "server/package.json"
Cohesion: 0.11
Nodes (15): bcrypt, cors, express, express-rate-limit, helmet, jsonwebtoken, name, private (+7 more)

### Community 27 - "imageEdit.js"
Cohesion: 0.08
Nodes (52): react-easy-crop, FreeCropHandles(), HANDLES, ADJUSTMENT_FIELDS, computeFreeBounds(), FOCUSABLE_SELECTOR, ImageEditor(), seedFreeSize() (+44 more)

### Community 28 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/dm-mono, @fontsource/dm-sans, @fontsource/jetbrains-mono, @fontsource/orbitron, @fontsource-variable/fraunces, framer-motion (+8 more)

### Community 29 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, fast-check, globals, @types/react (+4 more)

### Community 30 - "scripts"
Cohesion: 0.29
Nodes (7): scripts, dev, migrate, seed:bootstrap, seed:templates, start, test

### Community 31 - "db.js"
Cohesion: 0.33
Nodes (6): pg, pool, adminOnly(), optionalAuth(), ownerOnly(), router

### Community 32 - "scripts"
Cohesion: 0.33
Nodes (6): scripts, build, dev, lint, preview, test

### Community 33 - "framer-motion"
Cohesion: 0.25
Nodes (7): framer-motion, computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock(), DEFAULT_SECTIONS

### Community 34 - "vitest"
Cohesion: 0.22
Nodes (5): vitest, cards, fixture, get(), users

### Community 35 - "MusicPlayerBlock.jsx"
Cohesion: 0.32
Nodes (5): getTrackArtwork(), MusicPlayerBlock(), parseEmbedUrl(), PROVIDER_COLORS, PROVIDER_LABELS

### Community 37 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 38 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 39 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

### Community 40 - "EventsBlock.jsx"
Cohesion: 0.60
Nodes (5): downloadIcsFile(), EventCardItem(), EventsBlock(), getGoogleCalendarUrl(), parseEventDate()

## Knowledge Gaps
- **227 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+222 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 302 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `JournalBlock.jsx`, `package.json`, `routes/stats.js`, `BlockRenderer.jsx`, `react`, `LandingPage.jsx`, `rateLimit.js`, `ogImageService.js`, `safeUrl`, `lib/inbox.js`, `ThemePanel.jsx`, `images.js`, `floatingPlayer.js`, `messages.js`, `server/package.json`, `imageEdit.js`?**
  _High betweenness centrality (0.267) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `JournalBlock.jsx`, `EditorSearchPalette.jsx`, `package.json`, `ContentPanel.jsx`, `BlockRenderer.jsx`, `LandingPage.jsx`, `safeUrl`, `WinnerSection.jsx`, `SchemaBlockForm.jsx`, `lib/inbox.js`, `ThemePanel.jsx`, `lucide-react`, `how-it-works.jsx`, `floatingPlayer.js`, `imageEdit.js`, `framer-motion`, `MusicPlayerBlock.jsx`, `card.jsx`, `avatar.jsx`, `EventsBlock.jsx`?**
  _High betweenness centrality (0.254) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `framer-motion`, `JournalBlock.jsx`, `package.json`, `MusicPlayerBlock.jsx`, `EditorSearchPalette.jsx`, `BlockRenderer.jsx`, `react`, `EventsBlock.jsx`, `ContentPanel.jsx`, `LandingPage.jsx`, `gearIconUtils.jsx`, `safeUrl`, `WinnerSection.jsx`, `SchemaBlockForm.jsx`, `lib/inbox.js`, `ThemePanel.jsx`, `how-it-works.jsx`, `imageEdit.js`?**
  _High betweenness centrality (0.186) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _227 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `routes/inbox.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12987012987012986 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10276679841897234 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._