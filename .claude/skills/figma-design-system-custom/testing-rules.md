# Figma Design System — Testing Rules

Run as a validation pass after all phases, or per-phase at each checkpoint.

---

## Mid-Build Gates (blocking — run during construction)

After creating each molecule or organism:

1. **Screenshot check** — `get_screenshot` immediately. Compare against live site or live code.
   If proportions, text size, or spacing looks wrong — fix now. Do not proceed with known errors.

2. **Metadata check** — `get_metadata` on every new frame. Verify:
   - No child frame has manual x/y coordinates (Auto Layout only)
   - All fill colors show variable references, not raw hex
   - All spacing/padding shows variable references, not raw numbers
   - Frame width/height matches the value extracted from live code

3. **Font check** — for components imitating third-party UI (LinkedIn card, Twitter embed, system dialog):
   Check live code or design intent — these may intentionally use a different font family. Match exactly.

---

## Phase Validation

- Variable count meets minimum: Phase 1 → 45+ variables
- Every token has values in BOTH Light and Dark modes — flag gaps
- Zero hardcoded hex values in the file
- Zero hardcoded pixel values for spacing or radius
- Naming follows slash notation with 100% consistency

---

## Component Integrity

- Every atom has minimum 3 states: Default, Hover, Disabled
- Every component set has at least one Variant property defined
- No detached instances — all reference a main component
- All text layers use a Text Style (no raw font overrides)
- All color fills reference a Variable (no local styles, no hardcoded colors)

---

## Auto Layout Audit

- No frame contains manually x/y positioned children
- All page-level frames have vertical Auto Layout enabled
- All padding values reference spacing tokens — not hardcoded numbers
- Nested Auto Layout directions are intentional and documented

---

## Breakpoint Coverage

- Each page has exactly 3 frames: `/desktop`, `/tablet`, `/mobile`
- Frame widths match spec: 1280px, 768px, 375px
- Responsive behavior passes: text wraps, columns collapse, no overflow
- No clipping or content cutoff at any breakpoint

---

## Layer Hygiene

- Zero unnamed layers ("Frame 234", "Rectangle 12", "Group 7")
- No hidden layers remaining in final components (move to Page 14: Scratch)
- Layer depth does not exceed 8 levels without documented reason
- All group layers converted to named frames

---

## Documentation Coverage

- Every component page has a usage note frame
- Every organism has breakpoint annotation labels
- Project template has blue annotations on all placeholder sections
- Cover page version and date are current

---

## Pre-Handoff Checklist

Mark file as Final only after all items pass:

- [ ] Library published — components available workspace-wide
- [ ] All 14 pages labeled with correct emoji prefix
- [ ] Cover page status updated: WIP → Review → Final
- [ ] No placeholder text ([FILL IN], Lorem ipsum) in final page frames
- [ ] Export settings defined on all image placeholder frames
- [ ] All organisms confirmed at all 3 breakpoints
- [ ] Component count documented on cover page
- [ ] Figma file shared with correct access level
