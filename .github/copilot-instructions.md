# Copilot Instructions for nG-Portable-UI

> Status: Angular 20 standalone app + Tailwind v3 + Web Awesome input. Standardized wrappers (text, number, date, time, datetime) with theming hooks added. DsComponentsModule removed (standalone only). Underline-only filled input styling centralized via `computeUnderlineInputClass` util.

## Purpose
Provide concise, project-specific guidance so AI coding agents can act productively with minimal back-and-forth.

## Current State
- Angular 20 standalone app (scss) with Tailwind v3 (`tailwind.config.cjs`, `postcss.config.cjs`).
- Web Awesome installed (cherry‑picked imports in `src/main.ts`).
- `src/lib/wa-registry.ts` centralizes WA tag/event names.
- Implemented ds-* wrappers (form, feedback, navigation, layout) with unified API & styling hooks.
- Progress ring includes animation helper.


Project: NG Portable UI (Angular 20) using Web Awesome (wa-*) + AG Grid (AG Grid not added yet)
Goal: Build our own ds-* components mapping stable props → third-party libs. Single edit point for vendor changes.

## Tech guardrails

## Package names:

        Web Awesome: @awesome.me/webawesome (cherry-pick imports).
        Web Awesome

        AG Grid (Community): ag-grid-community.
        npm

        WA prefix: wa- (e.g., wa-input, wa-select, wa-button).
        Web Awesome
        +1

Angular must include CUSTOM_ELEMENTS_SCHEMA in components using custom elements.
Angular

## Folder structure (current key files)
                src/
                        main.ts                   # bootstrap + WA style & input import
                        styles.scss               # Tailwind entry (@tailwind directives)
                        lib/
                                wa-registry.ts          # WA tag/event constants
                                ds-text.component.ts    # wraps <wa-input>
                        app/
                                app.ts / app.html       # demo root using <ds-text>

Planned additions:
                ds-select.component.ts, ds-grid.component.ts, Tailwind tokens, AG Grid integration.

## Build / Run
Dev server: `ng serve --port 4300` (4200 may collide locally). Tailwind utilities appear once used in templates (warnings when none found are benign).
Add utilities by editing `app.html` or component templates; rebuild is automatic.

## Completed Steps
1. Scaffold + Tailwind + PostCSS configured.
2. Web Awesome base + component scripts imported as used.
3. Form wrappers: ds-text, ds-number, ds-date, ds-time, ds-datetime, ds-select, ds-switch, ds-radio-group, ds-textarea, ds-avatar, ds-avatar-group (underline style via shared util).
4. Feedback/status: ds-tooltip, ds-spinner (size map + semantic checked), ds-ta (tag), ds-badge (pulse/removable), ds-callout, ds-progress-ring (animateTo + autoAnimate).
5. Navigation/structure: ds-nav, ds-breadcrumb, ds-tab-group, ds-tree, ds-draw.
6. Utility/layout: ds-popup, ds-card, ds-details, ds-dialog, ds-divider, ds-split-panel, ds-button, ds-icon.
7. Unified API (value/valueChange + *Class hooks + cssVars) established; events re‑emitted as neutral Angular Outputs.
8. Central underline styling extracted to `src/lib/util/underline.util.ts` used by all text-like controls.
9. Registry file ensures single vendor mapping point.
10. Demo (`app.html`) exercises variants, sizes, disabled states, custom CSS variables.
11. Progress ring animation helper with easing + duration.

## Next Implementation Steps (priority)
1. Theming extraction: central token file `src/styles/_tokens.scss`; apply selected theme to `:root`.
2. AG Grid integration -> ds-grid wrapper (rowData, columnDefs, pagination?).
3. ds-number optional locale formatting.
4. Toast system (ds-toast + ds-toast-container service driven) with queue, variants, auto-dismiss, pause-on-hover.
5. Unit tests (attribute reflection, event emissions, progress ring animateTo timing, underline util application) + GitHub Actions CI.
6. Accessibility audit: aria-label roles for ring/spinner, focus management for dismissible chips/badges.
7. Documentation site generation (later) or Storybook-style docs.

## Wrapper Component Pattern
- No raw `<wa-*>` tags in app templates (always ds-* wrappers).
- Inputs: core (value, label, hint/help, disabled, placeholder) + specialized (min/max/step/precision, size variants, appearance/variant, animation settings, etc.).
- Outputs: valueChange, changeEvent, focusEvent, blurEvent, clearEvent, removeEvent, clickEvent, custom toggles.
- Styling: `*Class` hooks + `cssVars` object (direct custom property mapping). Consumers supply valid `--` names. Underline-only filled control style centralized in `computeUnderlineInputClass` util.
- Central vendor tag mapping in `wa-registry.ts`.
- CUSTOM_ELEMENTS_SCHEMA used on each wrapper component.
- Animation helpers where applicable (progress ring: animateTo/autoAnimate).

## Tailwind Conventions
- Utility-first defaults; override via the class hook Inputs.
- New folders require updating content globs in `tailwind.config.cjs`.
- CSS vars (future) will sit in `:root` and be consumed by utility-driven classes for consistent theming.

## Adding New Web Awesome Elements
1. Import component script in `main.ts`.
2. Add tag constant to `wa-registry.ts`.
3. Create ds-* wrapper replicating pattern (Inputs/Outputs/cssVars/class hooks). For text-like or select-like inputs re-use `computeUnderlineInputClass` for underline style consistency.
4. Expose vendor CSS vars via `cssVars` pass-through or typed convenience Inputs.
5. Add demo usage (variants + disabled + custom styling) in `app.html`.
6. Update this document (Completed Steps, Next Steps, patterns if new).

## AG Grid Plan (Not Yet Implemented)
- Install: `npm i ag-grid-community`.
- Import: `@ag-grid-community/styles/ag-grid.css` and theme (e.g., `ag-theme-quartz.css`) inside `styles.scss`.
- Wrapper `ds-grid`: internally manages grid div ref; Inputs: `rowData`, `columnDefs`, `pagination?`; Output(s) later as needed (selectionChange, cellEdit?).

## Testing Strategy (Planned)
- Attribute reflection tests.
- Event re-emission tests (change, remove, valueChange after animation).
- CSS variable application tests (presence/removal).
- Progress ring animation timing (fakeAsync).
- Accessibility snapshot (aria roles/labels present).

## Keep This File Updated
When adding a wrapper or vendor integration, append to: Completed Steps, Next Implementation Steps (move items as finished), and adjust patterns if the approach evolves.

## Coding standards

        Never reference wa-* tags directly in app pages—only inside ds-* components.

        All vendor names live in wa-registry.ts (single swap point).

        Tailwind for layout/spacing; theme via CSS variables in styles.scss.

        Inputs/outputs on ds-* use neutral names: value, valueChange, label, placeholder, etc.

        Grid columns passed as { field, headerName, width?, editable? }.

## Removed Aggregator Module
`DsComponentsModule` has been removed in favor of pure standalone component imports. Import needed ds-* components directly in consumers.

## Shared Underline Style
All underline-only filled styling logic is centralized in `src/lib/util/underline.util.ts` via `computeUnderlineInputClass`. New text/date/number/select/time/datetime/textarea style wrappers should call this util instead of duplicating regex logic.






## Expected Architecture (Assumptions Until Code Lands)
1. Angular workspace targeting a modular, portable component library plus a demo app.
2. Recommended structure once initialized:
   - `projects/ui-lib/` reusable Angular library (components, directives, pipes, services)
   - `src/app/` demo/host application showcasing library usage
   - `shared/` for cross-cutting primitives (tokens, models, utils) colocated within library
3. Emphasis on portability: avoid hard singletons; prefer injection tokens for environment/config.

## Initialization Workflow
When bootstrapping the project (one-time):
1. Run Angular CLI (v20+ recommended with standalone APIs):
   - `ng new nG-Portable-UI --create-application=true --style=scss --routing=true`
   - `ng generate library ui-lib`
2. Enable strict options in `tsconfig.json` (`strict`, `noImplicitOverride`, etc.).
3. Add ESLint + Prettier integration (`ng add @angular-eslint/schematics`).

## Conventions (Target State Once Code Exists)
- Standalone components preferred; group them by domain inside `projects/ui-lib/src/lib/<domain>/`.
- Public surface of the library re-exported via `projects/ui-lib/src/public-api.ts` only.
- UI components use `OnPush` change detection and explicit `trackBy` for structural directives.
- Styling: SCSS with BEM-ish block names matching component selectors; variables centralized in `styles/_tokens.scss`.
- Avoid direct window/document access; wrap in `PlatformAbstractionService` or use Angular CDK utilities.

## Testing & Quality (Adopt When Code Added)
- Unit tests colocated: `*.spec.ts` next to implementation.
- Library build verification: `ng build ui-lib` before publishing.
- Consider adding a Playwright e2e project for cross-browser visual sanity if complex UI emerges.

## Agent Guidance While Repo Is Empty
- Before generating features, create minimal Angular workspace & library as above.
- Always reflect real file paths after creation; update this doc with concrete examples.
- Do NOT assume unreconciled dependencies; check `package.json` once it exists.

## Updating This File
After adding real code, enrich sections:
- Architecture: describe actual module boundaries, key services, cross-cutting concerns.
- Data flow: outline state management approach (e.g., signals, RxJS, NGXS) if adopted.
- Build/test commands: list exact scripts from `package.json`.
- Any custom schematics or generators.

## Toast System (Planned Outline)
- Service managed queue using signals or RxJS Subject.
- `ds-toast-container` listens + renders stacked toasts with max visible.
- `ds-toast` Inputs: variant (info/success/warning/error/neutral), appearance (filled/soft/outlined/plain), icon, title, message, duration (ms), closable, action label.
- Outputs: dismissEvent, actionEvent.
- Features: auto-dismiss timer with pause on hover/focus, manual dismiss, optional progress bar (reuse progress ring logic simplified), theming via cssVars.

## Open Questions
- Theming depth (global tokens vs runtime theme service)?
- Locale & i18n (number/date formatting central service) timeline?
- Distribution target + versioning strategy?
- Accessibility patterns for error states & validation surfaces.

---
Revise this document as soon as initial Angular scaffold is committed. Provide specific examples replacing assumptions.
