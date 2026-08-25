# Profile Project – Agent Rules

## ⚠️ Framer Motion Data-Gating Rule (CRITICAL)

When any page component uses `containerVariants` with `staggerChildren`, **ALL data
props that produce `<motion.*>` children must be present before the animated container mounts**.

### Why
Framer Motion's `staggerChildren` animation fires **once** when the parent mounts.
If a child `<motion.section>` is conditionally rendered (`{data && <motion.section>}`)
and `data` is still `null` at mount time, that section doesn't exist in the DOM.
When the data arrives later the parent animation has already finished → child stays
at `opacity: 0` and never appears. Toggling away and back forces a remount, which is
why it "works the second time".

### Fix Pattern
```jsx
// ✅ CORRECT – gate on ALL data dependencies
const isReady = profile && skills && projects && experience;
if (!isReady) {
  return <div className="page-shell">/* bg effects only */</div>;
}
return (
  <motion.div variants={containerVariants} initial="hidden" animate="visible">
    {/* all sections render unconditionally because isReady guarantees data */}
  </motion.div>
);
```

```jsx
// ❌ WRONG – only gating on profile; other data may still be null
if (!profile) { return <shell /> }
// skills, projects, experience sections use {data && ...} → miss stagger
```

### Affected Files
- `src/components/ProgrammerSide/ProgrammerSide.jsx` — gate: `profile && skills && projects && experience`
- `src/components/HobbiesSide/HobbiesSide.jsx` — gate: `profile && specs && setup && storyGames && currentlyPlaying && backlog && philosophy`
- `src/components/DiarySide/DiarySide.jsx` — gate: `profile && entries`

### When Adding New Sections
If you add a new data-fetched section to either side:
1. Add the new data prop to the component signature.
2. Add it to the `isReady` guard.
3. Never wrap `<motion.*>` children in `{data && ...}` — rely on `isReady` instead.
