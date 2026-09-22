# Graph Report - profile  (2026-09-22)

## Corpus Check
- 93 files · ~90,257 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 27 file(s) not represented in the graph (top: .css 20, (none) 6, .conf 1)

## Summary
- 451 nodes · 952 edges · 20 communities (19 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e33d0b57`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- index.js
- lucide-react
- AdminPage.jsx
- package.json
- react
- ThemePanel.jsx
- LandingPage.jsx
- ThemeContext.jsx
- dependencies
- dependencies
- scripts
- GitHubHeatmapBlock.jsx
- MusicPlayerBlock.jsx
- card.jsx
- EventsBlock.jsx
- TransitionOverlay.jsx
- DiarySide.jsx
- React + Vite
- ContentPanel.jsx
- avatar.jsx

## God Nodes (most connected - your core abstractions)
1. `lucide-react` - 55 edges
2. `react` - 54 edges
3. `framer-motion` - 36 edges
4. `useDoubleBackdropClose()` - 25 edges
5. `query()` - 21 edges
6. `useAuth()` - 21 edges
7. `react-router-dom` - 14 edges
8. `OptimizedImage()` - 14 edges
9. `ThemeProvider()` - 10 edges
10. `express` - 9 edges

## Surprising Connections (you probably didn't know these)
- `migrate()` --calls--> `query()`  [EXTRACTED]
  server/src/db/migrations/001_multi_user.js → server/src/config/db.js
- `DiarySide()` --calls--> `useDoubleBackdropClose()`  [EXTRACTED]
  src/components/DiarySide/DiarySide.jsx → src/hooks/useDoubleBackdropClose.js
- `AccountSettingsModal()` --calls--> `useDoubleBackdropClose()`  [EXTRACTED]
  src/components/Editor/AccountSettingsModal.jsx → src/hooks/useDoubleBackdropClose.js
- `EditorOverlay()` --calls--> `useDoubleBackdropClose()`  [EXTRACTED]
  src/components/Editor/EditorOverlay.jsx → src/hooks/useDoubleBackdropClose.js
- `ThemePanel()` --calls--> `getNestedValue()`  [EXTRACTED]
  src/components/Editor/panels/ThemePanel.jsx → src/contexts/ThemeContext.jsx

## Import Cycles
- None detected.

## Communities (20 total, 1 thin omitted)

### Community 0 - "index.js"
Cohesion: 0.05
Nodes (62): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., bcrypt, cors, express, ref_fs, helmet, jsonwebtoken, multer (+54 more)

### Community 1 - "lucide-react"
Cohesion: 0.06
Nodes (54): framer-motion, lucide-react, blockComponentMap, blockIconMap, BlockRenderer(), blockVariants, iconLibrary, renderBlockIcon() (+46 more)

### Community 2 - "AdminPage.jsx"
Cohesion: 0.08
Nodes (30): AdminLogin(), AdminPage(), fetchApi(), sectionContentKeys, sectionMeta, AdminSidebar(), sections, CATEGORY_OPTIONS (+22 more)

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (40): devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, @types/react, @types/react-dom (+32 more)

### Community 4 - "react"
Cohesion: 0.11
Nodes (35): react, react-dom, react-router-dom, App(), AccountSettingsModal(), src_components_editor_editor, EditorOverlay(), ImageUploadPicker() (+27 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.11
Nodes (14): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+6 more)

### Community 6 - "LandingPage.jsx"
Cohesion: 0.09
Nodes (10): gsap, lenis, ThreeDProfiles(), ContainerScroll(), ContainerScrollContext, DEFAULT_PROFILENC_PATCHES, HowItWorks(), THEME_CYCLE (+2 more)

### Community 7 - "ThemeContext.jsx"
Cohesion: 0.27
Nodes (11): applyCSSVars(), deepMerge(), DEFAULT_THEME, FIELD_NOTES_THEME, getNestedValue(), loadGoogleFont(), removeCSSVars(), setNestedValue() (+3 more)

### Community 8 - "dependencies"
Cohesion: 0.12
Nodes (16): dependencies, @fontsource/crimson-text, @fontsource/jetbrains-mono, @fontsource/orbitron, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-solid-svg-icons, @fortawesome/react-fontawesome (+8 more)

### Community 9 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcrypt, cors, express, helmet, jsonwebtoken, multer, pg (+2 more)

### Community 10 - "scripts"
Cohesion: 0.25
Nodes (8): scripts, dev, migrate, migrate:existing, migrate:multi-user, seed, seed:templates, start

### Community 11 - "GitHubHeatmapBlock.jsx"
Cohesion: 0.48
Nodes (5): computeStats(), fetchContributions(), formatDate(), getContributionLevel(), GitHubHeatmapBlock()

### Community 12 - "MusicPlayerBlock.jsx"
Cohesion: 0.38
Nodes (5): getTrackArtwork(), MusicPlayerBlock(), parseEmbedUrl(), PROVIDER_COLORS, PROVIDER_LABELS

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 14 - "EventsBlock.jsx"
Cohesion: 0.60
Nodes (5): downloadIcsFile(), EventCardItem(), EventsBlock(), getGoogleCalendarUrl(), parseEventDate()

### Community 15 - "TransitionOverlay.jsx"
Cohesion: 0.67
Nodes (3): getOverlayClass(), iconMap, TransitionOverlay()

### Community 16 - "DiarySide.jsx"
Cohesion: 0.27
Nodes (10): containerVariants, DiaryMediaAttachment(), DiarySide(), formatDate(), getUrlAspectRatio(), isVideoUrl(), itemVariants, moodMap (+2 more)

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 19 - "avatar.jsx"
Cohesion: 0.50
Nodes (3): Avatar, AvatarFallback, AvatarImage

## Knowledge Gaps
- **164 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+159 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 196 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `lucide-react`, `AdminPage.jsx`, `package.json`, `ThemePanel.jsx`, `LandingPage.jsx`, `ThemeContext.jsx`, `GitHubHeatmapBlock.jsx`, `MusicPlayerBlock.jsx`, `card.jsx`, `EventsBlock.jsx`, `DiarySide.jsx`, `ContentPanel.jsx`, `avatar.jsx`?**
  _High betweenness centrality (0.461) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `AdminPage.jsx`, `package.json`, `react`, `ThemePanel.jsx`, `LandingPage.jsx`, `GitHubHeatmapBlock.jsx`, `MusicPlayerBlock.jsx`, `EventsBlock.jsx`, `TransitionOverlay.jsx`, `DiarySide.jsx`, `ContentPanel.jsx`?**
  _High betweenness centrality (0.173) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `lucide-react` to `package.json`, `react`, `ThemePanel.jsx`, `LandingPage.jsx`, `GitHubHeatmapBlock.jsx`, `MusicPlayerBlock.jsx`, `EventsBlock.jsx`, `TransitionOverlay.jsx`, `DiarySide.jsx`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _164 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05249569707401033 - nodes in this community are weakly interconnected._
- **Should `lucide-react` be split into smaller, more focused modules?**
  _Cohesion score 0.05630252100840336 - nodes in this community are weakly interconnected._
- **Should `AdminPage.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08194905869324474 - nodes in this community are weakly interconnected._