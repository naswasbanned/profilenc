# Graph Report - profile  (2026-09-23)

## Corpus Check
- 112 files · ~76,224 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 83 file(s) not represented in the graph (top: .css 76, (none) 6, .conf 1)

## Summary
- 472 nodes · 1055 edges · 16 communities (15 shown, 1 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `1ec615b5`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- src/index.js
- BlockRenderer.jsx
- MusicPlayerBlock.jsx
- package.json
- EditorPage.jsx
- ThemePanel.jsx
- container-scroll-animation.jsx
- react
- blockSchemas/index.js
- dependencies
- gearIconUtils.jsx
- ProfileCanvas.jsx
- card.jsx
- React + Vite
- how-it-works.jsx
- lucide-react

## God Nodes (most connected - your core abstractions)
1. `react` - 51 edges
2. `lucide-react` - 45 edges
3. `framer-motion` - 33 edges
4. `useAuth()` - 23 edges
5. `apiFetch()` - 19 edges
6. `react-router-dom` - 15 edges
7. `query()` - 15 edges
8. `useDoubleBackdropClose()` - 13 edges
9. `useUiTheme()` - 13 edges
10. `Field()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `AccountSettingsModal()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Editor/AccountSettingsModal.jsx → src/contexts/AuthContext.jsx
- `EditorOverlay()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Editor/EditorOverlay.jsx → src/contexts/ThemeContext.jsx
- `renderTabIcon()` --calls--> `getIcon()`  [EXTRACTED]
  src/components/Editor/TabManagerModal.jsx → src/lib/icons.js
- `ThemePanel()` --calls--> `useTheme()`  [EXTRACTED]
  src/components/Editor/panels/ThemePanel.jsx → src/contexts/ThemeContext.jsx
- `ProfileCanvas()` --calls--> `useAuth()`  [EXTRACTED]
  src/components/Profile/ProfileCanvas.jsx → src/contexts/AuthContext.jsx

## Import Cycles
- None detected.

## Communities (16 total, 1 thin omitted)

### Community 0 - "src/index.js"
Cohesion: 0.05
Nodes (59): IMPORTANT: keep the reminder string free of backticks and $(...) constructs., bcrypt, cors, express, ref_fs, helmet, jsonwebtoken, multer (+51 more)

### Community 1 - "BlockRenderer.jsx"
Cohesion: 0.08
Nodes (37): framer-motion, blockComponentMap, blockIconMap, blockVariants, CardsGridBlock(), downloadIcsFile(), EventCardItem(), EventsBlock() (+29 more)

### Community 2 - "MusicPlayerBlock.jsx"
Cohesion: 0.38
Nodes (5): getTrackArtwork(), MusicPlayerBlock(), parseEmbedUrl(), PROVIDER_COLORS, PROVIDER_LABELS

### Community 3 - "package.json"
Cohesion: 0.05
Nodes (44): dependencies, @fontsource/crimson-text, @fontsource/jetbrains-mono, @fontsource/orbitron, framer-motion, gsap, lenis, lucide-react (+36 more)

### Community 4 - "EditorPage.jsx"
Cohesion: 0.08
Nodes (45): react-dom, react-router-dom, App(), EditorOverlay(), ImageUploadPicker(), LandingBottomNav(), SECTION_TABS, TAP (+37 more)

### Community 5 - "ThemePanel.jsx"
Cohesion: 0.08
Nodes (26): BODY_FONT_GROUPS, BORDER_STYLE_OPTIONS, BUTTON_STYLE_OPTIONS, CURATED_PAIRINGS, CURATED_PALETTES, DESIGN_PRESETS, DIVIDER_STYLE_OPTIONS, HEADING_FONT_GROUPS (+18 more)

### Community 7 - "react"
Cohesion: 0.06
Nodes (47): react, SkillsBlock(), ChecklistField(), makeTaskId(), ChoiceField(), Field(), IconPickerField(), ImageField() (+39 more)

### Community 8 - "blockSchemas/index.js"
Cohesion: 0.09
Nodes (17): cardsGrid, events, featuredVideo, gallery, githubHeatmap, hero, SCHEMAS, journal (+9 more)

### Community 9 - "dependencies"
Cohesion: 0.20
Nodes (10): dependencies, bcrypt, cors, express, helmet, jsonwebtoken, multer, pg (+2 more)

### Community 10 - "gearIconUtils.jsx"
Cohesion: 0.38
Nodes (5): SpecsGridBlock(), GEAR_ICON_CATEGORIES, GEAR_ICON_COMPONENTS, GearIcon(), guessGearIcon()

### Community 11 - "ProfileCanvas.jsx"
Cohesion: 0.18
Nodes (18): BlockRenderer(), renderBlockIcon(), src_components_blocks_blocks, BlockEditorWorkbench(), prefersPreviewOpen(), SchemaBlockForm(), pageVariants, ProfileCanvas() (+10 more)

### Community 13 - "card.jsx"
Cohesion: 0.29
Nodes (6): Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle

### Community 17 - "React + Vite"
Cohesion: 0.50
Nodes (3): Expanding the ESLint configuration, React Compiler, React + Vite

### Community 18 - "how-it-works.jsx"
Cohesion: 0.33
Nodes (3): DEFAULT_PROFILENC_PATCHES, HowItWorks(), THEME_CYCLE

### Community 21 - "lucide-react"
Cohesion: 0.16
Nodes (11): lucide-react, AccountSettingsModal(), AddBlockModal(), BLOCK_PRESETS, BlockEditorModal(), getBlockSchema(), DeleteBlockModal(), src_components_editor_editor (+3 more)

## Knowledge Gaps
- **127 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+122 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 166 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `BlockRenderer.jsx`, `MusicPlayerBlock.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `container-scroll-animation.jsx`, `ProfileCanvas.jsx`, `card.jsx`, `how-it-works.jsx`, `lucide-react`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Why does `lucide-react` connect `lucide-react` to `BlockRenderer.jsx`, `MusicPlayerBlock.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `react`, `gearIconUtils.jsx`, `ProfileCanvas.jsx`?**
  _High betweenness centrality (0.157) - this node is a cross-community bridge._
- **Why does `framer-motion` connect `BlockRenderer.jsx` to `MusicPlayerBlock.jsx`, `package.json`, `EditorPage.jsx`, `ThemePanel.jsx`, `container-scroll-animation.jsx`, `react`, `ProfileCanvas.jsx`, `how-it-works.jsx`, `lucide-react`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _127 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `src/index.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Should `BlockRenderer.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.08145363408521303 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.04717853839037928 - nodes in this community are weakly interconnected._