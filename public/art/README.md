# Art assets

Hand-crafted flat-illustrated SVGs produced inside this repo. See
`docs/PLAN.md` §3 for the overall strategy.

## Layout

```
characters/   Character portraits. File name: <role>-<expression>.svg
backgrounds/  Scene backdrops. File name: <scene>.svg
ui/           UI overlays and cursors. File name: <function>.svg
```

## Style rules

- **Palette:** the CSS variables in `src/app/globals.css`. Do not
  introduce colours outside that set.
- **No gradients beyond two stops.** Flat is the whole point.
- **Every SVG has a `<title>` and `<desc>`.** Accessibility + audit trail.
- **Geometry on integer coordinates where possible.** Crisper at small sizes.
- **Characters face the viewer** (front-on, no three-quarter angles).
- **Backgrounds are front-on or isometric, never mix in one scene.**

## Expression convention for characters

Each character has at least `neutral`. Others drawn as needed:

| Expression | Visual cue                                     |
|-----------|-------------------------------------------------|
| neutral   | straight mouth, normal eyes                    |
| alarmed   | wider eyes (filled circles), small open mouth  |
| pleased   | slight smile curve (quadratic)                 |
| concerned | downturned mouth, slightly raised brows        |
| smug      | one-sided raised mouth, narrowed eye (slit)    |

## Placeholder vs. final

Phase 1 ships placeholder art just good enough to verify the
visual-layer plumbing. Phase 2 replaces the shipped placeholders
with final art; the file names stay the same so the components do
not need to change.

Files marked placeholder in their `<desc>` element will be replaced
in Phase 2.
