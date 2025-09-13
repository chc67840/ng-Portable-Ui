## Theme System Overview

The new token engine separates raw semantic primitives (color scales, spacing, radii, typography, motion, elevation) from component-level styling. Themes register semantic tokens which are transformed into CSS variables under `:root[data-theme="<name>"]`.

Runtime selection simply updates the `data-theme` attribute; variables update reactively. Components consume variables through Tailwind utilities (using arbitrary values) or via small CSS classes (e.g. `.ds-surface`).

### Layers
1. Semantic Tokens – color scales, radii, spacing, typography, elevation, motion.
2. Component Tokens – ready-to-use roles for inputs, buttons, surfaces.
3. Utilities – Tailwind class composition and optional helper classes.

### Switching Themes
`ThemeEngineService#setTheme(name)` updates `<html data-theme="name">` and regenerates a style block (`#ds-theme-vars`). All ds-* wrappers remain static; only CSS variables change.

### Adding a New Theme
1. Create a new `SemanticTokens` object (derive from existing for convenience).
2. Build component tokens via `buildComponentTokens` or custom variant.
3. Register via `ThemeEngineService.registerTheme(themeDefinition)` before app bootstrap completes.
4. Invoke `setTheme('<name>')`.

### Design Principles
- Portable: No dependency on Web Awesome default visuals (reset layer applied).
- Predictable: Variables follow `--ds-color-<role>-<scale>` & `--ds-<category>-<token>` naming.
- Extensible: Component tokens are a minimal starting set; more can be layered without altering semantic base.
