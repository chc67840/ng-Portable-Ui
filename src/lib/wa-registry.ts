// Central registry for Web Awesome custom element tag & event names
// Single source of truth for vendor mapping to allow future swaps.

export const WA_TAGS = {
    input: 'wa-input',
    select: 'wa-select',
    option: 'wa-option',
    button: 'wa-button',
    dialog: 'wa-dialog',
    drawer: 'wa-drawer',
    popup: 'wa-popup'
    , card: 'wa-card'
    , details: 'wa-details'
    , icon: 'wa-icon'
    , spinner: 'wa-spinner'
    , divider: 'wa-divider'
    , splitPanel: 'wa-split-panel'
    , breadcrumb: 'wa-breadcrumb'
    , breadcrumbItem: 'wa-breadcrumb-item'
    , tabGroup: 'wa-tab-group'
    , tab: 'wa-tab'
    , tabPanel: 'wa-tab-panel'
    , tree: 'wa-tree'
    , treeItem: 'wa-tree-item'
    , checkbox: 'wa-checkbox'
    , avatar: 'wa-avatar'
    , avatarGroup: 'wa-avatar-group'
    , radioGroup: 'wa-radio-group'
    , radio: 'wa-radio'
    , switch: 'wa-switch'
    , textarea: 'wa-textarea'
    , tooltip: 'wa-tooltip'
    , tag: 'wa-tag'
    , badge: 'wa-badge'
    , callout: 'wa-callout'
    , progressRing: 'wa-progress-ring'
    , skeleton: 'wa-skeleton'
    , dropdown: 'wa-dropdown'
    , dropdownItem: 'wa-dropdown-item'
    , buttonGroup: 'wa-button-group'
    , popover: 'wa-popover'
} as const;

export const WA_EVENTS = {
    change: 'change', // using native events currently emitted
    input: 'input',
    blur: 'blur',
    focus: 'focus',
    clear: 'wa-clear', // custom
    invalid: 'invalid'
} as const;

export type WaTag = typeof WA_TAGS[keyof typeof WA_TAGS];
