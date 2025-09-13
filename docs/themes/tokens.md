## Token Reference

### Color Scales
Each semantic color exposes Tailwind-like numeric stops: 50–900.
Variables: `--ds-color-<scale>-<stop>` e.g. `--ds-color-primary-500`.

### Text Roles
`--ds-color-text-primary`, `--ds-color-text-secondary`, `--ds-color-text-inverse`.

### Background Roles
`--ds-bg-base`, `--ds-bg-subtle`, `--ds-bg-elevated`, `--ds-bg-overlay`.

### Border Roles
`--ds-border-subtle`, `--ds-border-strong`, `--ds-border-focus`.

### Radii
`--ds-radius-none|xs|sm|md|lg|xl|full`.

### Spacing
`--ds-space-xs|sm|md|lg|xl|2xl|3xl` (base unit 4px escalations).

### Typography
`--ds-font-family`, `--ds-font-size-xs…3xl`, `--ds-line-height`, `--ds-font-weight-regular|medium|semibold|bold`.

### Elevation / Shadows
`--ds-shadow-sm|md|lg|xl` implement layered box-shadows.

### Motion
Durations: `--ds-duration-fast|base|slow`.
Easing: `--ds-easing-standard|emphasized|decel`.

### Component Tokens (Conceptual)
Resolved inside `ThemeEngineService` for now – future work may emit dedicated CSS vars (e.g. `--ds-input-bg`).

### Future Extensions
- State layer tokens (selected, active, drag-over)
- Density scale (compact / cozy / spacious)
- High contrast theme variant
