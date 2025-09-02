import { EventEmitter, Signal, TemplateRef } from "@angular/core";
import { FormGroup, ValidatorFn } from "@angular/forms";

// (Legacy TailwindConfig removed) – replaced by per-component class hooks & cssVars.

// Theming system
export interface DsThemeTokens {
    [key: string]: string | undefined;
}

export interface DsThemeSectionStyles {
    container?: string;
    header?: string;
    panelHeader?: string; // new: panel specific header background
    subtitle?: string; // new: section subtitle
    fieldset?: string;
    panel?: string;
    card?: string;
    footer?: string;
}

export interface DsThemeControlStyles {
    label?: string;
    input?: string;
    inputUnderlineFilled?: string; // new underline-only filled variant
    textarea?: string;
    dropdown?: string;
    multiselect?: string;
    checkbox?: string;
    slider?: string;
    rating?: string;
    fileupload?: string;
    password?: string;
    number?: string; // inputNumber specific wrapper
    calendar?: string; // datepicker specific wrapper
    colorpicker?: string;
    chips?: string;
    autocomplete?: string;
    toggleswitch?: string;
    inputmask?: string;
    radiobutton?: string;
    helpText?: string;
    required?: string;
    container?: string; // per control wrapper
}

export interface DsThemeLayoutStyles {
    container?: string; // outer form wrapper
    form?: string; // form element
    row?: string; // row container default
    column?: string; // column container default
    title?: string; // form-level title
    description?: string; // form-level description
    // New: background variants for container (e.g., solid, gradient, glass)
    containerVariants?: Record<string, string>;
    defaultContainerVariant?: string; // name of default variant
    containerBackground?: string; // base background for solid/default variant
}

export interface DsTheme {
    name: string;
    layout?: DsThemeLayoutStyles;
    section?: DsThemeSectionStyles;
    control?: DsThemeControlStyles;
    tokens?: DsThemeTokens; // arbitrary variables or token classes
    extra?: Record<string, string>; // extension hook
    // New: navigation bar styles
    nav?: DsThemeNavStyles;
}

// Navigation menu style contract
export interface DsThemeNavStyles {
    /** Full nav wrapper (positioning excluded; component adds fixed classes if enabled) */
    wrapper?: string;
    /** Brand container wrapper */
    brandContainer?: string;
    /** Brand text / link */
    brand?: string;
    /** Center items ul container */
    itemsContainer?: string;
    /** Base item link classes */
    item?: string;
    /** Active item state */
    itemActive?: string;
    /** Inactive / default item state */
    itemInactive?: string;
    /** Right content container (projected actions) */
    rightContainer?: string;
    /** Optional height utility (e.g. h-16) */
    height?: string;
    /** Optional background override just for nav (otherwise derived from layout.containerBackground) */
    background?: string;
    /** Border classes for bottom edge */
    border?: string;
    /** Shadow/elevation utility */
    shadow?: string;
}

// Enhanced responsive configuration
export interface ResponsiveConfig {
    xs?: number | string; // < 576px
    sm?: number | string; // ≥ 576px
    md?: number | string; // ≥ 768px
    lg?: number | string; // ≥ 992px
    xl?: number | string; // ≥ 1200px
    '2xl'?: number | string; // ≥ 1400px
}

// Enhanced column interface with Tailwind support
// (Legacy EnhancedColumn removed)

// Enhanced common controls with Tailwind support
// (Legacy EnhancedCommonControls removed)

// Enhanced control configuration
// (Legacy EnhancedControlConfig removed)

// Enhanced row configuration
// (Legacy EnhancedRowConfig removed)

// Enhanced section configuration
// (Legacy EnhancedSectionConfig removed; layout now handled by DsLayoutSchema)

// Enhanced panel configuration
// (Legacy EnhancedPanelConfig removed)

// Enhanced type configuration
// (Legacy EnhancedTypeConfig removed)

// Enhanced layout configuration
// (Legacy EnhancedLayoutConfig removed)

// Enhanced nested configuration
// (Legacy EnhancedNestedConfig removed)

// Enhanced control type definitions with Tailwind support
// (Legacy control detail interfaces removed below)

















// (All legacy granular control config interfaces removed)

export interface EnhancedButtonConfig {
    type?: string;
    label?: string;
    name?: string;
    loading?: boolean;
    disabled?: boolean;
    hidden?: boolean;
    arialabel?: string;
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast';
    icon?: string;
    iconPos?: 'left' | 'right' | 'top' | 'bottom';
    pTooltip?: string;
    tooltipPosition?: string;
    btype?: 'button' | 'submit' | 'reset';
    link?: boolean;
    clickFunctionName?: string;
    rounded?: boolean;
    text?: boolean;
    outlined?: boolean;
    raised?: boolean;
    size?: 'small' | 'large';
    action?: 'edit' | 'delete' | 'cancel' | 'save' | 'custom';
    disableFunction?: (row: any) => boolean;
    clickFunction?: () => void;
    visibleFunction?: () => boolean;
    visible?: (row: any, isEditable: any) => boolean;
    onClickEmitter?: EventEmitter<any>;
    onClickSignal?: Signal<(row: any, event?: any) => boolean | void>;
    customTemplate?: TemplateRef<any>;
}

// Utility class for Tailwind CSS management
// (Legacy TailwindUtils removed)

/* =============================================================
     DESIGN SYSTEM COMPONENT CONFIG INTERFACES (Phase 1 Extraction)
     Pattern: One lightweight *Config interface per ds-* wrapper capturing public @Input/@Output API (no methods).
     Events are expressed as optional callbacks; actual Angular Outputs remain on components.
     Subsequent phases will add remaining components (see TODO list below).
     ============================================================= */

// Shared base fragments
export interface DsBaseStyleConfig {
    class?: string;              // host or primary element class override
    cssVars?: Record<string, string | number | null>; // custom property passthrough
}

export interface DsLabelledControlConfig extends DsBaseStyleConfig {
    label?: string;
    hint?: string;
    help?: string; // alias
    disabled?: boolean;
    required?: boolean;
    readonly?: boolean;
    name?: string;
}

export interface DsEventHandlers<T = any> { // generic catch‑all for value-like controls
    onValueChange?: (value: T) => void;
    onFocus?: (ev: FocusEvent) => void;
    onBlur?: (ev: FocusEvent) => void;
    onChange?: (ev: Event) => void; // raw change
    onInput?: (ev: Event) => void;  // raw input
    onClear?: (ev: Event) => void;
    onInvalid?: (ev: Event) => void;
}

// ds-text ------------------------------------------------------
export interface DsTextConfig extends DsLabelledControlConfig, DsEventHandlers<string> {
    type?: 'text' | 'search' | 'email' | 'url' | 'password' | 'tel';
    size?: 'small' | 'medium' | 'large';
    appearance?: 'filled' | 'outlined';
    pill?: boolean;
    placeholder?: string;
    withClear?: boolean;
    passwordToggle?: boolean;
    passwordVisible?: boolean;
    pattern?: string;
    minlength?: number;
    maxlength?: number;
    inputmode?: string;
    enterkeyhint?: string;
    density?: 'comfortable' | 'compact' | string;
    autocapitalize?: string;
    autocorrect?: string;
    autocomplete?: string;
    autofocus?: boolean;
    form?: string;
    spellcheck?: boolean;
    withLabelSpace?: boolean;
    withHintSpace?: boolean;
    enforceMaxlength?: boolean;
    labelPosition?: 'block' | 'inline' | 'srOnly';
    // Style hooks
    wrapperClass?: string;
    labelClass?: string;
    inputClass?: string;
    hintClass?: string;
    // Value
    value?: string | null;
}

// ds-button ----------------------------------------------------
export interface DsButtonConfig extends DsBaseStyleConfig {
    variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
    appearance?: 'accent' | 'filled' | 'outlined' | 'plain';
    size?: 'small' | 'medium' | 'large';
    withCaret?: boolean;
    disabled?: boolean;
    loading?: boolean;
    pill?: boolean;
    type?: 'button' | 'submit' | 'reset';
    name?: string;
    valueAttr?: string;
    href?: string;
    target?: '_blank' | '_parent' | '_self' | '_top';
    rel?: string;
    download?: string;
    form?: string | null;
    formAction?: string;
    formEnctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    formMethod?: 'post' | 'get';
    formNoValidate?: boolean;
    formTarget?: '_self' | '_blank' | '_parent' | '_top' | string;
    buttonClass?: string;        // style hook
    ensureBaseStyles?: boolean;  // autoinject padding/radius etc
    // Events
    onFocus?: (ev: FocusEvent) => void;
    onBlur?: (ev: FocusEvent) => void;
    onInvalid?: (ev: Event) => void;
    onClick?: (ev: MouseEvent) => void; // wrapper consumer convenience (native listen still possible)
}

// ds-progress-ring --------------------------------------------
export interface DsProgressRingConfig extends DsBaseStyleConfig {
    value?: number;            // 0-100
    ariaLabel?: string | null;
    sizePx?: number;
    trackWidth?: number;
    trackColor?: string;
    indicatorWidth?: number;
    indicatorColor?: string;
    indicatorDuration?: string; // e.g. '0.6s'
    disabled?: boolean;
    showLabel?: boolean;
    labelFormatter?: (value: number) => string;
    autoAnimate?: boolean;
    animationDuration?: number;
    animationEasing?: (t: number) => number;
    ringClass?: string;
    labelClass?: string;
    wrapperClass?: string;
    onValueChange?: (v: number) => void;
    onClick?: (e: MouseEvent) => void;
}

// ds-dropdown --------------------------------------------------
export interface DsDropdownItemConfigModel { // mirror runtime config
    label?: string;
    value?: string;
    disabled?: boolean;
    divider?: boolean;
    danger?: boolean;
    checkbox?: boolean;
    checked?: boolean;
    details?: string;
    iconHtml?: string;
    submenu?: DsDropdownItemConfigModel[];
}
export interface DsDropdownConfig extends DsBaseStyleConfig {
    open?: boolean;
    size?: 'small' | 'medium' | 'large';
    placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end';
    distance?: number;
    skidding?: number;
    triggerLabel?: string;
    hasProjectedTrigger?: boolean;
    items?: DsDropdownItemConfigModel[] | null;
    onOpenChange?: (open: boolean) => void;
    onShow?: (e: Event) => void;
    onAfterShow?: (e: Event) => void;
    onHide?: (e: Event) => void;
    onAfterHide?: (e: Event) => void;
    onSelect?: (payload: { value: string | null; event: Event; item?: DsDropdownItemConfigModel }) => void;
}

// ds-nav -------------------------------------------------------
export interface DsNavItemModel { label: string; route?: string; href?: string; icon?: string; id?: string; }
export interface DsNavConfig extends DsBaseStyleConfig {
    items?: DsNavItemModel[];
    brand?: string;
    brandHref?: string;
    brandRouterLink?: boolean;
    activeMatchMode?: 'exact' | 'startsWith';
    fixed?: boolean;
    // Style hooks mapping to component inputs
    wrapperClass?: string;
    brandContainerClass?: string;
    brandClass?: string;
    centerContainerClass?: string;
    itemsContainerClass?: string;
    itemClass?: string;
    activeItemClass?: string;
    inactiveItemClass?: string;
    rightContent?: boolean;
    rightContentClass?: string;
    onItemSelect?: (item: DsNavItemModel) => void;
}

// ds-grid (high level) ----------------------------------------
export interface DsGridThemeVars { [k: string]: string | number | null; }
export interface DsGridConfig extends DsBaseStyleConfig {
    rowData?: any[];
    columnDefs?: any[];          // using any to avoid ag-grid peer type dependency escalation here
    defaultColDef?: any;
    gridOptions?: any;
    icons?: Record<string, string>;
    theme?: string;              // ag-theme-*
    themeMode?: 'legacy' | 'modern';
    gridThemeName?: string | null;
    autoBindTheme?: boolean;
    themeClasses?: string | string[] | null;
    pagination?: boolean;
    paginationPageSize?: number;
    sizeColumnsToFit?: boolean;
    autoSizeAll?: boolean;
    rowSelection?: 'single' | 'multiple';
    animateRows?: boolean;
    suppressFieldDotNotation?: boolean;
    loading?: boolean;
    noRowsMessage?: string;
    quickFilter?: string | null;
    domLayout?: 'normal' | 'autoHeight' | 'print';
    sideBar?: any;
    localeText?: Record<string, string>;
    columnState?: any[] | null;
    overlayNoRowsTemplate?: string;
    overlayLoadingTemplate?: string;
    height?: string | number;
    gridClass?: string;
    cssVars?: Record<string, string | number | null>;
    themeVars?: Record<string, string | number | null>;
    showOutline?: boolean;
    // Events (callbacks parallel to Outputs)
    onGridReady?: (api: { api: any }) => void;
    onRowClicked?: (e: any) => void;
    onCellClicked?: (e: any) => void;
    onSelectionChanged?: (rows: any[]) => void;
    onFirstDataRendered?: (e: any) => void;
    onDataUpdated?: (rows: any[]) => void;
    onFilterChanged?: () => void;
    onSortChanged?: () => void;
    onColumnStateChange?: (state: any[]) => void;
}

/* TODO (Phase 2):
     - Add interfaces for: ds-select, ds-number, ds-date, ds-time, ds-datetime, ds-switch, ds-radio-group, ds-textarea,
         ds-avatar(+group), ds-tooltip, ds-toast(+container), ds-badge, ds-callout, ds-spinner, ds-skeleton, ds-popup,
         ds-card, ds-details, ds-dialog, ds-divider, ds-split-panel, ds-breadcrumb, ds-tab-group, ds-tree (+item), ds-popover,
         ds-button-group, ds-icon, ds-ta (tag).
     - Unify control configs via a discriminated union for dynamic form/layout builder.
*/

// ============================================================
// Phase 2 Added Configs
// ============================================================

// ds-select ---------------------------------------------------
export interface DsSelectOptionConfig { label: string; value: string; disabled?: boolean; }
export interface DsSelectOptionGroupConfig { label: string; options: DsSelectOptionConfig[]; }
export type DsSelectOptionsConfig = Array<DsSelectOptionConfig | DsSelectOptionGroupConfig>;
export interface DsSelectConfig extends DsLabelledControlConfig, DsEventHandlers<string | string[] | null> {
    value?: string | string[] | null;
    options?: DsSelectOptionsConfig;
    placeholder?: string;
    withClear?: boolean;
    multiple?: boolean;
    appearance?: 'filled' | 'outlined';
    pill?: boolean;
    size?: 'small' | 'medium' | 'large';
    placement?: string; // passthrough
    hoist?: boolean;
    maxOptionsVisible?: number;
    helpText?: string;
    clearIcon?: string;
    checkIcon?: string;
    expandIcon?: string;
    loading?: boolean;
    loadingText?: string;
    noResultsText?: string;
    filterable?: boolean;
    clearOnSelect?: boolean;
    stayOpenOnSelect?: boolean;
    allowCreate?: boolean;
    createSeparator?: string;
    withLabelSpace?: boolean;
    withHintSpace?: boolean;
    labelPosition?: 'block' | 'inline' | 'srOnly';
    // style hooks
    wrapperClass?: string; labelClass?: string; inputClass?: string; hintClass?: string;
    cssVars?: Record<string, string | number | null>;
    // extra events
    onShow?: (e: Event) => void;
    onAfterShow?: (e: Event) => void;
    onHide?: (e: Event) => void;
    onAfterHide?: (e: Event) => void;
    onLazyLoad?: (e: CustomEvent) => void;
    onCreate?: (text: string) => void;
    lazyLoad?: () => Promise<DsSelectOptionConfig[]>; // optional loader
}

// ds-number ---------------------------------------------------
export interface DsNumberConfig extends DsLabelledControlConfig, DsEventHandlers<number | null> {
    value?: number | null;
    min?: number; max?: number; step?: number; precision?: number;
    withoutSpinButtons?: boolean;
    placeholder?: string; hint?: string; enforceOnInput?: boolean; form?: string; autocomplete?: string;
    wrapperClass?: string; labelClass?: string; inputClass?: string; hintClass?: string; labelPosition?: 'block' | 'inline' | 'srOnly';
    cssVars?: Record<string, string | number | null>; withLabelSpace?: boolean; withHintSpace?: boolean;
}

// ds-date -----------------------------------------------------
export interface DsDateConfig extends DsLabelledControlConfig, DsEventHandlers<string | null> {
    value?: string | null; placeholder?: string; min?: string; max?: string; step?: string; autocomplete?: string; form?: string;
    wrapperClass?: string; labelClass?: string; inputClass?: string; hintClass?: string; labelPosition?: 'block' | 'inline' | 'srOnly';
    cssVars?: Record<string, string | number | null>; withLabelSpace?: boolean; withHintSpace?: boolean; hint?: string;
}

// ds-time -----------------------------------------------------
export interface DsTimeConfig extends DsLabelledControlConfig, DsEventHandlers<string | null> {
    value?: string | null; placeholder?: string; step?: string; autocomplete?: string; form?: string; hint?: string;
    wrapperClass?: string; labelClass?: string; inputClass?: string; hintClass?: string; labelPosition?: 'block' | 'inline' | 'srOnly';
    cssVars?: Record<string, string | number | null>; withLabelSpace?: boolean; withHintSpace?: boolean;
}

// ds-datetime -------------------------------------------------
export interface DsDateTimeConfig extends DsLabelledControlConfig, DsEventHandlers<string | null> {
    value?: string | null; placeholder?: string; min?: string; max?: string; step?: string; autocomplete?: string; form?: string; hint?: string;
    wrapperClass?: string; labelClass?: string; inputClass?: string; hintClass?: string; labelPosition?: 'block' | 'inline' | 'srOnly';
    cssVars?: Record<string, string | number | null>; withLabelSpace?: boolean; withHintSpace?: boolean;
}

// ds-switch ---------------------------------------------------
export interface DsSwitchConfig extends DsBaseStyleConfig {
    name?: string; size?: 'small' | 'medium' | 'large'; disabled?: boolean; checked?: boolean; required?: boolean; hint?: string;
    onLabel?: string; offLabel?: string; label?: string; labelPosition?: 'inline' | 'block' | 'srOnly';
    wrapperClass?: string; switchClass?: string; labelClass?: string; hintClass?: string; validationMessage?: string | null; hintProjected?: boolean;
    cssVars?: Record<string, string | number | null>;
    onCheckedChange?: (checked: boolean) => void; onInput?: (e: Event) => void; onChange?: (e: Event) => void; onFocus?: (e: FocusEvent) => void; onBlur?: (e: FocusEvent) => void; onInvalid?: (e: Event) => void;
}

// ds-radio-group ----------------------------------------------
export interface DsRadioOptionConfig { label: string; value: string; disabled?: boolean; }
export interface DsRadioGroupConfig extends DsBaseStyleConfig {
    value?: string | null; options?: DsRadioOptionConfig[]; name?: string; label?: string; labelPosition?: 'block' | 'srOnly'; hint?: string; hintProjected?: boolean; orientation?: 'horizontal' | 'vertical'; size?: 'small' | 'medium' | 'large'; disabled?: boolean; required?: boolean; groupClass?: string; radioClass?: string; wrapperClass?: string; labelClass?: string; hintClass?: string; cssVars?: Record<string, string | number | null>; validationMessage?: string | null;
    onValueChange?: (v: string | null) => void; onChange?: (e: Event) => void; onInput?: (e: Event) => void; onFocus?: (e: FocusEvent) => void; onBlur?: (e: FocusEvent) => void; onInvalid?: (e: Event) => void;
}

// ds-textarea -------------------------------------------------
export interface DsTextareaConfig extends DsLabelledControlConfig, DsEventHandlers<string> {
    value?: string | null; rows?: number | null; maxRows?: number; placeholder?: string; appearance?: 'filled' | 'outlined'; size?: 'small' | 'medium' | 'large'; pill?: boolean; readonly?: boolean; minlength?: number; maxlength?: number; form?: string; autocomplete?: string; autocapitalize?: string; autocorrect?: string; spellcheck?: boolean; wrap?: string; resize?: 'vertical' | 'none'; expand?: boolean; help?: string; hintRich?: boolean; labelPosition?: 'block' | 'inline' | 'srOnly'; withLabelSpace?: boolean; withHintSpace?: boolean; wrapperClass?: string; labelClass?: string; textareaClass?: string; hintClass?: string; cssVars?: Record<string, string | number | null>; validationMessage?: string | null;
}

// ds-checkbox -------------------------------------------------
export interface DsCheckboxConfig extends DsBaseStyleConfig {
    name?: string; size?: 'small' | 'medium' | 'large'; disabled?: boolean; indeterminate?: boolean; checked?: boolean; required?: boolean; hint?: string; checkboxClass?: string; cssVars?: Record<string, string | number | null>; validationMessage?: string | null;
    onCheckedChange?: (checked: boolean) => void; onInput?: (e: Event) => void; onChange?: (e: Event) => void; onFocus?: (e: FocusEvent) => void; onBlur?: (e: FocusEvent) => void; onInvalid?: (e: Event) => void;
}

// ds-avatar ---------------------------------------------------
export interface DsAvatarConfig extends DsBaseStyleConfig {
    shape?: 'circle' | 'square' | 'rounded'; size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string; src?: string; alt?: string; label?: string; initials?: string; loading?: 'eager' | 'lazy'; fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; status?: 'online' | 'busy' | 'away' | 'offline' | string | null; color?: string | null; avatarClass?: string; cssVars?: Record<string, string | number | null>; onLoad?: (e: Event) => void; onError?: (e: Event) => void;
}

// ds-avatar-group ---------------------------------------------
export interface DsAvatarGroupConfig extends DsBaseStyleConfig { size?: string; overlap?: string; max?: number; shape?: 'circle' | 'square' | 'rounded'; groupClass?: string; cssVars?: Record<string, string | number | null>; }

// ds-button-group ---------------------------------------------
export interface DsButtonGroupItemConfig { label: string; value: string; disabled?: boolean; iconHtml?: string; variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'; size?: 'small' | 'medium' | 'large'; pill?: boolean; tooltip?: string; dropdownItems?: any[]; split?: boolean; onClick?: () => void; }
export interface DsButtonGroupConfig extends DsBaseStyleConfig { label?: string; orientation?: 'horizontal' | 'vertical'; size?: 'small' | 'medium' | 'large'; variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger'; items?: DsButtonGroupItemConfig[]; pill?: boolean; toolbar?: boolean; cssVars?: Record<string, string | number | null>; onButtonClick?: (payload: { item: DsButtonGroupItemConfig; index: number; event: Event }) => void; }

// ds-popover --------------------------------------------------
export interface DsPopoverConfig extends DsBaseStyleConfig { open?: boolean; placement?: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end'; distance?: number; skidding?: number; forId?: string | null; withoutArrow?: boolean; anchorEl?: HTMLElement | null; maxWidth?: string; arrowSize?: string; autoFocus?: boolean; openDelay?: number; closeDelay?: number; cssVars?: Record<string, string | number | null>; onOpenChange?: (open: boolean) => void; onShow?: (e: Event) => void; onAfterShow?: (e: Event) => void; onHide?: (e: Event) => void; onAfterHide?: (e: Event) => void; }

// ds-icon -----------------------------------------------------
export interface DsIconConfig extends DsBaseStyleConfig { name?: string; family?: string; variant?: string; fixedWidth?: boolean; src?: string; label?: string; library?: string; size?: string; color?: string; autoSrc?: boolean; iconClass?: string; cssVars?: Record<string, string | number | null>; onLoad?: (e: Event) => void; onError?: (e: Event) => void; }

// PLACEHOLDERS (Remaining Phase 3 components to add later)
// ds-tooltip, ds-toast (+container), ds-badge, ds-callout, ds-spinner, ds-skeleton, ds-popup,
// ds-card, ds-details, ds-dialog, ds-divider, ds-split-panel, ds-breadcrumb, ds-tab-group,
// ds-tree (+item), ds-ta (tag)

// ============================================================
// Phase 3 Component Config Interfaces (remaining set)
// ============================================================

// ds-tooltip --------------------------------------------------
export interface DsTooltipConfig extends DsBaseStyleConfig {
    content?: string; placement?: string; clickTrigger?: boolean; manualTrigger?: boolean; distance?: number; skidding?: number; open?: boolean; disabled?: boolean; arrow?: boolean; maxWidth?: string; interactive?: boolean; delay?: number | { show: number; hide: number }; size?: 'small' | 'medium' | 'large'; hint?: string; help?: string; tooltipClass?: string; cssVars?: Record<string, string | number | null>;
    onShow?: (e: Event) => void; onAfterShow?: (e: Event) => void; onHide?: (e: Event) => void; onAfterHide?: (e: Event) => void;
}

// ds-toast ----------------------------------------------------
export interface DsToastConfig extends DsBaseStyleConfig {
    id: string; title?: string; message?: string; variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral'; appearance?: 'filled' | 'soft' | 'outlined' | 'plain'; duration?: number; remaining?: number | null; closable?: boolean; actionLabel?: string; iconHtml?: string; showProgress?: boolean; hideIcon?: boolean; cssVars?: Record<string, string | number | null>; toastClass?: string; titleClass?: string; messageClass?: string; actionClass?: string; closeButtonClass?: string; progressClass?: string;
    onDismiss?: (id: string) => void; onAction?: (id: string) => void; onMouseEnter?: () => void; onMouseLeave?: () => void;
}

// ds-toast-container -----------------------------------------
export interface DsToastContainerConfig extends DsBaseStyleConfig { limit?: number; zIndex?: number; position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'; containerClass?: string; stackClass?: string; }

// ds-badge ----------------------------------------------------
export interface DsBadgeConfig extends DsBaseStyleConfig { appearance?: 'filled' | 'outlined' | 'soft'; variant?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral' | string | null; pill?: boolean; pulse?: boolean; removable?: boolean; disabled?: boolean; size?: 'small' | 'medium' | 'large'; value?: string | number; maxValue?: number; label?: string; hint?: string; help?: string; showHint?: boolean; wrapperClass?: string; badgeClass?: string; hintClass?: string; cssVars?: Record<string, string | number | null>; onRemove?: (e: Event) => void; onClick?: (e: MouseEvent) => void; }

// ds-callout --------------------------------------------------
export interface DsCalloutConfig extends DsBaseStyleConfig { appearance?: string; variant?: string | null; size?: 'small' | 'medium' | 'large'; hideIcon?: boolean; hint?: string; help?: string; showHint?: boolean; calloutClass?: string; iconClass?: string; hintClass?: string; cssVars?: Record<string, string | number | null>; onClick?: (e: MouseEvent) => void; }

// ds-spinner --------------------------------------------------
export interface DsSpinnerConfig extends DsBaseStyleConfig { size?: 'small' | 'medium' | 'large'; trackWidth?: string | number; trackColor?: string; indicatorColor?: string; speed?: string; ariaLabel?: string; disabled?: boolean; checked?: boolean; hint?: string; help?: string; showHint?: boolean; wrapperClass?: string; spinnerClass?: string; hintClass?: string; cssVars?: Record<string, string | number | null>; onShow?: () => void; onHide?: () => void; }

// ds-skeleton -------------------------------------------------
export interface DsSkeletonConfig extends DsBaseStyleConfig { effect?: 'none' | 'sheen' | 'pulse'; width?: number | string | null; height?: number | string | null; paragraphs?: number; paragraphHeight?: number; gap?: number; randomizeLast?: boolean; avatar?: boolean; avatarSize?: 'sm' | 'md' | 'lg'; circle?: boolean; rounded?: boolean; square?: boolean; skeletonClass?: string; wrapperClass?: string; lineBaseClass?: string; cssVars?: Record<string, string | number | null>; ariaLabel?: string; }

// ds-popup ----------------------------------------------------
export interface DsPopupConfig extends DsBaseStyleConfig { open?: boolean; anchor?: string | Element; placement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end'; boundary?: 'viewport' | 'scroll'; distance?: number; skidding?: number; arrow?: boolean; arrowPlacement?: 'start' | 'end' | 'center' | 'anchor'; arrowPadding?: number; flip?: boolean; flipFallbackPlacements?: string; flipFallbackStrategy?: 'best-fit' | 'initial'; flipBoundary?: string; flipPadding?: number; shift?: boolean; shiftBoundary?: string; shiftPadding?: number; autoSize?: 'horizontal' | 'vertical' | 'both'; sync?: 'width' | 'height' | 'both'; autoSizeBoundary?: string; autoSizePadding?: number; hoverBridge?: boolean; wrapperClass?: string; cssVars?: Record<string, string | number | null>; onOpenChange?: (open: boolean) => void; onReposition?: (e: Event) => void; }

// ds-card -----------------------------------------------------
export interface DsCardConfig extends DsBaseStyleConfig { appearance?: 'accent' | 'filled' | 'outlined' | 'plain'; withHeader?: boolean; withMedia?: boolean; withFooter?: boolean; hasHeader?: boolean; hasMedia?: boolean; hasFooter?: boolean; cardClass?: string; mediaClass?: string; headerClass?: string; bodyClass?: string; footerClass?: string; cssVars?: Record<string, string | number | null>; }

// ds-details --------------------------------------------------
export interface DsDetailsConfig extends DsBaseStyleConfig { open?: boolean; summary?: string; name?: string; disabled?: boolean; appearance?: 'filled' | 'outlined' | 'plain'; iconPosition?: 'start' | 'end'; wrapperClass?: string; cssVars?: Record<string, string | number | null>; onOpenChange?: (open: boolean) => void; onShow?: (e: Event) => void; onAfterShow?: (e: Event) => void; onHide?: (e: Event) => void; onAfterHide?: (e: Event) => void; }

// ds-dialog ---------------------------------------------------
export interface DsDialogConfig extends DsBaseStyleConfig { open?: boolean; label?: string; withoutHeader?: boolean; lightDismiss?: boolean; dialogClass?: string; cssVars?: Record<string, string | number | null>; onOpenChange?: (open: boolean) => void; onShow?: (e: Event) => void; onAfterShow?: (e: Event) => void; onHide?: (e: Event) => void; onAfterHide?: (e: Event) => void; }

// ds-divider --------------------------------------------------
export interface DsDividerConfig extends DsBaseStyleConfig { orientation?: 'horizontal' | 'vertical'; role?: string; dividerClass?: string; cssVars?: Record<string, string | number | null>; }

// ds-split-panel ----------------------------------------------
export interface DsSplitPanelConfig extends DsBaseStyleConfig { position?: number | null; orientation?: 'horizontal' | 'vertical'; disabled?: boolean; primary?: 'start' | 'end'; snap?: string; snapThreshold?: number; panelClass?: string; startClass?: string; endClass?: string; dividerClass?: string; cssVars?: Record<string, string | number | null>; onReposition?: (e: Event) => void; onPositionChange?: (pct: number) => void; }

// ds-breadcrumb -----------------------------------------------
export interface DsBreadcrumbItemConfig { label: string; href?: string; target?: '_blank' | '_parent' | '_self' | '_top'; rel?: string; separator?: string; startIcon?: string; endIcon?: string; }
export interface DsBreadcrumbConfig extends DsBaseStyleConfig { label?: string; items?: DsBreadcrumbItemConfig[]; disableLastLink?: boolean; wrapperClass?: string; breadcrumbClass?: string; itemClass?: string; labelClass?: string; separatorClass?: string; startClass?: string; endClass?: string; cssVars?: Record<string, string | number | null>; }

// ds-tab-group ------------------------------------------------
export interface DsDynamicTabConfig { name: string; label: string; content: string; icon?: string; disabled?: boolean; closable?: boolean; }
export interface DsTabGroupConfig extends DsBaseStyleConfig { active?: string; placement?: 'top' | 'bottom' | 'start' | 'end'; activation?: 'auto' | 'manual'; withoutScrollControls?: boolean; tabs?: DsDynamicTabConfig[]; groupClass?: string; cssVars?: Record<string, string | number | null>; onActiveChange?: (name: string) => void; onTabShow?: (e: CustomEvent<{ name: string }>) => void; onTabHide?: (e: CustomEvent<{ name: string }>) => void; }

// ds-tree & ds-tree-item --------------------------------------
export interface DsTreeNodeConfig { label: string; icon?: string; expanded?: boolean; selected?: boolean; indeterminate?: boolean; disabled?: boolean; lazy?: boolean; expandIcon?: string; collapseIcon?: string; children?: DsTreeNodeConfig[]; }
export interface DsTreeConfig extends DsBaseStyleConfig { selection?: 'single' | 'multiple' | 'leaf'; nodes?: DsTreeNodeConfig[]; showIndentGuide?: boolean; treeClass?: string; cssVars?: Record<string, string | number | null>; onSelectionChange?: (payload: { selection: any[] }) => void; onItemExpand?: (e: Event) => void; onItemCollapse?: (e: Event) => void; onItemLazyLoad?: (e: Event) => void; }
export interface DsTreeItemConfig extends DsBaseStyleConfig { expanded?: boolean; selected?: boolean; disabled?: boolean; lazy?: boolean; loading?: boolean; indeterminate?: boolean; onExpand?: (e: Event) => void; onExpandAfter?: (e: Event) => void; onCollapse?: (e: Event) => void; onCollapseAfter?: (e: Event) => void; onLazyChange?: (e: Event) => void; onLazyLoad?: (e: Event) => void; }

// ds-ta (tag) -------------------------------------------------
export interface DsTagConfig extends DsBaseStyleConfig { appearance?: 'filled' | 'outlined' | 'soft'; pill?: boolean; removable?: boolean; disabled?: boolean; size?: 'small' | 'medium' | 'large'; value?: string; hint?: string; help?: string; taClass?: string; cssVars?: Record<string, string | number | null>; variant?: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral'; onRemove?: (e: Event) => void; onClick?: (e: MouseEvent) => void; }

/* =============================================================
   LAYOUT SCHEMA (Step 1)
   Goal: Provide a hierarchical, declarative model to compose
         pages/forms (e.g., login form) out of containers → rows →
         columns → components using existing Ds* component configs.
   NOTE: Focused initial slice; extensible in later steps (actions,
         conditional logic, data-binding expressions, i18n, etc.).
   ============================================================= */

// 1. Enumerate all supported ds-* wrapper component types.
export type DsComponentType =
    | 'text'
    | 'number'
    | 'date'
    | 'time'
    | 'datetime'
    | 'select'
    | 'switch'
    | 'radio-group'
    | 'textarea'
    | 'checkbox'
    | 'avatar'
    | 'avatar-group'
    | 'button'
    | 'button-group'
    | 'dropdown'
    | 'popover'
    | 'icon'
    | 'progress-ring'
    | 'tooltip'
    | 'toast'
    | 'toast-container'
    | 'badge'
    | 'callout'
    | 'spinner'
    | 'skeleton'
    | 'popup'
    | 'card'
    | 'details'
    | 'dialog'
    | 'divider'
    | 'split-panel'
    | 'breadcrumb'
    | 'tab-group'
    | 'tree'
    | 'tag'
    | 'grid'
    | 'nav';

// 2. Union of every component config interface (kept separate so consumers can narrow on interface members).
export type DsComponentConfigType =
    | DsTextConfig
    | DsNumberConfig
    | DsDateConfig
    | DsTimeConfig
    | DsDateTimeConfig
    | DsSelectConfig
    | DsSwitchConfig
    | DsRadioGroupConfig
    | DsTextareaConfig
    | DsCheckboxConfig
    | DsAvatarConfig
    | DsAvatarGroupConfig
    | DsButtonConfig
    | DsButtonGroupConfig
    | DsDropdownConfig
    | DsPopoverConfig
    | DsIconConfig
    | DsProgressRingConfig
    | DsTooltipConfig
    | DsToastConfig
    | DsToastContainerConfig
    | DsBadgeConfig
    | DsCalloutConfig
    | DsSpinnerConfig
    | DsSkeletonConfig
    | DsPopupConfig
    | DsCardConfig
    | DsDetailsConfig
    | DsDialogConfig
    | DsDividerConfig
    | DsSplitPanelConfig
    | DsBreadcrumbConfig
    | DsTabGroupConfig
    | DsTreeConfig
    | DsTagConfig
    | DsGridConfig
    | DsNavConfig;

// 3. Base layout node meta shared across all node kinds.
export interface DsBaseConfig extends DsBaseStyleConfig {
    id?: string;                   // stable reference id for programmatic access
    label?: string;                // optional human label (builder UIs)
    visible?: boolean | ((ctx: any) => boolean); // dynamic visibility (ctx reserved for future form/model data)
    disabled?: boolean | ((ctx: any) => boolean);
    notes?: string;                // design-time annotation
    testId?: string;               // data-testid hook
    /** Arbitrary metadata for tooling */
    meta?: Record<string, any>;
    /** i18n meta: supply translation keys instead of raw strings (renderer resolves). */
    i18n?: DsLayoutI18nMeta;
}

// 4. Component leaf node wrapping a ds-* config.
export interface DsComponentConfig extends DsBaseConfig {
    kind: 'component';
    component: DsComponentType;
    /** Concrete config for the selected component; strongly typed via discriminated narrowing downstream. */
    config: DsComponentConfigType;
    /** Optional explicit width override in CSS units (otherwise driven by column). */
    width?: string | number;
    /** Optional named slot within a parent container (header/footer/start/end/custom). */
    slot?: string;
    /** Data bindings for dynamic population (keys map to config prop paths or well-known targets like 'value'). */
    /** @deprecated use 'bind' */
    bindings?: Record<string, DsLayoutBinding<any>>;
    /** Preferred alias replacing 'bindings' for brevity */
    bind?: Record<string, DsLayoutBinding<any>>;
    /** Conditional logic (alternative to visible/disabled primitives). */
    conditions?: DsConditionConfig;
    /** Event → action wiring (e.g., click -> submit). */
    actions?: DsLayoutActionTrigger[];
    /** Repeat (legacy object form) */
    /** @deprecated use rOf / rAs etc. */
    repeat?: DsLayoutRepeatConfig;
    /** Simplified repeat API */
    rOf?: DsLayoutExpression<any[]>;  // source collection expression
    rAs?: string;                     // item alias (default 'item')
    rIndex?: string;                  // index alias (default 'index')
    rKey?: DsLayoutExpression<string | number>; // key extractor
    rLimit?: number;                  // limit items rendered
    rEmpty?: DsComponentConfig;   // optional empty state component node
    // Future extensions: data bindings, validation scopes, security roles, i18n keys.
}

// 5. Column node: houses one or more components (or nested rows) with responsive sizing.
export interface DsColumnConfig extends DsBaseConfig {
    kind: 'column';
    /** Simple 12‑column span (default 12). */
    span?: number;
    /** Responsive override mapping: values correspond to span at breakpoint. */
    responsive?: Partial<ResponsiveConfig>; // e.g. { sm: 12, md: 6, lg: 4 }
    alignSelf?: 'auto' | 'start' | 'center' | 'end' | 'stretch';
    /** Content may be components or nested rows (allowing sub‑layouts inside a column). */
    content: Array<DsComponentConfig | DsRowConfig | DsContainerConfig>;
    slot?: string; // allow projecting a whole column (e.g., sidebar)
    /** @deprecated use 'bind' */
    bindings?: Record<string, DsLayoutBinding<any>>;
    bind?: Record<string, DsLayoutBinding<any>>;
    conditions?: DsConditionConfig;
    /** @deprecated use rOf / rAs etc. */
    repeat?: DsLayoutRepeatConfig;
    rOf?: DsLayoutExpression<any[]>; rAs?: string; rIndex?: string; rKey?: DsLayoutExpression<string | number>; rLimit?: number; rEmpty?: DsComponentConfig;
}

// 6. Row node: horizontal grouping of columns.
export interface DsRowConfig extends DsBaseConfig {
    kind: 'row';
    columns: DsColumnConfig[];
    gap?: number | string; // inter‑column gap (maps to Tailwind gap or inline style)
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    wrap?: boolean; // allow wrapping when spans exceed 12
    slot?: string;
    /** @deprecated use 'bind' */
    bindings?: Record<string, DsLayoutBinding<any>>;
    bind?: Record<string, DsLayoutBinding<any>>;
    conditions?: DsConditionConfig;
    /** @deprecated use rOf / rAs etc. */
    repeat?: DsLayoutRepeatConfig;
    rOf?: DsLayoutExpression<any[]>; rAs?: string; rIndex?: string; rKey?: DsLayoutExpression<string | number>; rLimit?: number; rEmpty?: DsComponentConfig;
}

// 7. Container types (high‑level structural wrappers).
export type DsContainerType =
    | 'section'      // generic group, may map to <section>
    | 'card'         // ds-card styled wrapper
    | 'panel'        // collapsible panel / details
    | 'fieldset'     // semantic fieldset/legend
    | 'dialog'       // modal dialog context
    | 'splitter'     // split panel layout
    | 'tabs'         // tab group container
    | 'form'         // top-level form wrapper
    | 'nav'          // navigation bar region
    | 'custom';      // reserved for custom renderer

// 8. Container node: encloses rows (and potentially other containers) and optional advanced section config.
export interface DsContainerConfig extends DsBaseConfig {
    kind: 'container';
    containerType: DsContainerType;
    /** Optional title displayed by the renderer (fallback to section?.title?.value). */
    title?: string;
    /** Advanced styling/behavior reuse: integrate existing enhanced section contract when needed. */
    // section? (legacy EnhancedSectionConfig removed)
    /** Primary content rows. */
    rows?: DsRowConfig[];
    /** Nested containers for complex nesting (rendered before or after rows depending on renderer rules). */
    children?: DsContainerConfig[];
    /** If true, treat rows as a grid (allow spanning beyond 12 or auto-fit). */
    freeform?: boolean;
    slot?: string;
    /** Layout-level bindings & conditions */
    /** @deprecated use 'bind' */
    bindings?: Record<string, DsLayoutBinding<any>>;
    bind?: Record<string, DsLayoutBinding<any>>;
    conditions?: DsConditionConfig;
    /** @deprecated use rOf / rAs etc. */
    repeat?: DsLayoutRepeatConfig;
    rOf?: DsLayoutExpression<any[]>; rAs?: string; rIndex?: string; rKey?: DsLayoutExpression<string | number>; rLimit?: number; rEmpty?: DsComponentConfig;
    /** Optional variant key mapping (e.g., card appearance) */
    variant?: string;
}

// 9. Discriminated union of all node variants.
export type DsLayoutConfigType =
    | DsContainerConfig
    | DsRowConfig
    | DsColumnConfig
    | DsComponentConfig;

// 10. Root schema describing an entire page/form layout.
export interface DsLayoutConfig {
    version?: string;             // schema versioning
    id?: string;                  // layout id
    theme?: string;               // key matching EnhancedTheme registry
    root: DsContainerConfig;  // root is always a container
    metadata?: Record<string, any>; // arbitrary consumer metadata
    /** Optional global data context seed (future: expressions). */
    contextDefaults?: Record<string, any>;
    /** Declarative action definitions referenced by nodes (actions[].action). */
    actions?: DsLayoutActionDefinition[];
}

// 11. Narrow helper type for component config retrieval by component discriminator.
export type DsComponentConfigMap = {
    text: DsTextConfig;
    number: DsNumberConfig;
    date: DsDateConfig;
    time: DsTimeConfig;
    datetime: DsDateTimeConfig;
    select: DsSelectConfig;
    switch: DsSwitchConfig;
    'radio-group': DsRadioGroupConfig;
    textarea: DsTextareaConfig;
    checkbox: DsCheckboxConfig;
    avatar: DsAvatarConfig;
    'avatar-group': DsAvatarGroupConfig;
    button: DsButtonConfig;
    'button-group': DsButtonGroupConfig;
    dropdown: DsDropdownConfig;
    popover: DsPopoverConfig;
    icon: DsIconConfig;
    'progress-ring': DsProgressRingConfig;
    tooltip: DsTooltipConfig;
    toast: DsToastConfig;
    'toast-container': DsToastContainerConfig;
    badge: DsBadgeConfig;
    callout: DsCalloutConfig;
    spinner: DsSpinnerConfig;
    skeleton: DsSkeletonConfig;
    popup: DsPopupConfig;
    card: DsCardConfig;
    details: DsDetailsConfig;
    dialog: DsDialogConfig;
    divider: DsDividerConfig;
    'split-panel': DsSplitPanelConfig;
    breadcrumb: DsBreadcrumbConfig;
    'tab-group': DsTabGroupConfig;
    tree: DsTreeConfig;
    tag: DsTagConfig;
    grid: DsGridConfig;
    nav: DsNavConfig;
};

// ========== Enhancements: Expressions, Bindings, Conditions, Actions, Repeaters ==========

/** Expression type: string (e.g. "user.email") or function for dynamic evaluation. */
export type DsLayoutExpression<T = any> = string | ((ctx: any) => T);

/** Binding describing how to pull a value from context (and optionally transform it). */
export interface DsLayoutBinding<T = any> {
    path: string;                       // dot path (ignored if transform exclusively used)
    transform?: (value: any, ctx: any) => T;
    default?: T;
    /** If true, treat missing path as undefined instead of default. */
    strict?: boolean;
}

/** Fine-grained conditional logic; renderer resolves precedence (if > visible). */
export interface DsConditionConfig {
    if?: DsLayoutExpression<boolean>;      // master condition
    visible?: DsLayoutExpression<boolean>; // overrides base visible prop if supplied
    disabled?: DsLayoutExpression<boolean>;
    readonly?: DsLayoutExpression<boolean>;
}

/** Action definition registry item. */
export interface DsLayoutActionDefinition {
    id: string;
    type: 'submit' | 'navigate' | 'emit' | 'custom';
    /** For navigate */
    navigateTo?: string;
    /** Alias properties supported by renderer (back-compat) */
    to?: string;           // alias for navigate target
    route?: string;        // alias for navigate target
    event?: string;        // emit event name
    name?: string;         // alternate emit event name
    /** Generic payload data */
    payload?: any;
    /** Custom handler fallback (last resort – discouraged for portability) */
    handler?: (ctx: any, params?: any) => void;
    /** Optional debounce ms when triggered repeatedly */
    debounceMs?: number;
}

/** Event → action trigger mapping present on nodes (primarily component nodes). */
export interface DsLayoutActionTrigger {
    event: string;                 // e.g. 'click', 'valueChange'
    action: string;                // id referencing DsLayoutActionDefinition
    params?: Record<string, any>;  // ad-hoc parameters merged into action payload
    preventDefault?: boolean;
    stopPropagation?: boolean;
    throttleMs?: number;           // optional rate limiting
    debounceMs?: number;           // optional per-trigger debounce (renderer supports)
}

/** Repeat config enabling dynamic list rendering. */
export interface DsLayoutRepeatConfig {
    items: DsLayoutExpression<any[]>; // array in context
    as: string;                       // item alias (e.g., 'user')
    indexAs?: string;                 // index alias (default 'index')
    key?: DsLayoutExpression<string | number>; // stable key extraction
    emptyStateComponent?: DsComponentConfig; // optional placeholder
    limit?: number;                   // slice size
}

// i18n meta definition
export interface DsLayoutI18nMeta {
    /** key for main label/title */
    labelKey?: string;
    /** key for descriptive/help text */
    descriptionKey?: string;
    /** key map for arbitrary sub labels (e.g., placeholders) */
    placeholders?: Record<string, string>;
    /** namespaced additional keys */
    extra?: Record<string, string>;
}

/* =============================================================
   EXAMPLE SCHEMAS (Generated for reference) - safe to remove
   Demonstrates: rOf/rAs repeat, bind alias, i18n meta, actions.
   ============================================================= */

// Basic login form inside a card
export const DS_EXAMPLE_LOGIN_LAYOUT: DsLayoutConfig = {
    version: '1.0',
    id: 'login-layout',
    theme: 'light',
    contextDefaults: { form: { email: '', password: '' } },
    actions: [
        { id: 'submitLogin', type: 'submit', payload: { endpoint: '/api/login' } }
    ],
    root: {
        kind: 'container',
        containerType: 'card',
        title: 'auth.login.title', // raw or translated by consumer
        i18n: { labelKey: 'auth.login.title', descriptionKey: 'auth.login.subtitle' },
        rows: [
            {
                kind: 'row',
                columns: [
                    {
                        kind: 'column', span: 12,
                        content: [
                            {
                                kind: 'component', component: 'text',
                                config: { label: 'Email', type: 'email', required: true, placeholder: 'auth.login.email.placeholder' },
                                i18n: { labelKey: 'auth.login.email.label', placeholders: { placeholder: 'auth.login.email.placeholder' } },
                                bind: { 'config.value': { path: 'form.email' } }
                            }
                        ]
                    },
                    {
                        kind: 'column', span: 12,
                        content: [
                            {
                                kind: 'component', component: 'text',
                                config: { label: 'Password', type: 'password', required: true, placeholder: 'auth.login.password.placeholder' },
                                i18n: { labelKey: 'auth.login.password.label', placeholders: { placeholder: 'auth.login.password.placeholder' } },
                                bind: { 'config.value': { path: 'form.password' } }
                            }
                        ]
                    },
                    {
                        kind: 'column', span: 12,
                        content: [
                            {
                                kind: 'component', component: 'button',
                                config: { variant: 'brand', appearance: 'filled', pill: true },
                                actions: [{ event: 'click', action: 'submitLogin' }],
                                i18n: { labelKey: 'auth.login.submit' }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// Repeating user cards with load more button
export const DS_EXAMPLE_USERS_LAYOUT: DsLayoutConfig = {
    version: '1.0',
    id: 'users-layout',
    contextDefaults: {
        users: { list: [], hasMore: true }
    },
    actions: [
        { id: 'loadMoreUsers', type: 'custom', handler: (ctx) => {/* load logic placeholder */ } }
    ],
    root: {
        kind: 'container',
        containerType: 'section',
        title: 'Users',
        rows: [
            {
                kind: 'row',
                columns: [
                    {
                        kind: 'column', span: 12,
                        // Each user rendered as a card containing avatar + name
                        content: [
                            {
                                kind: 'component', component: 'card',
                                config: { appearance: 'outlined' },
                                rOf: 'users.list', rAs: 'user', rKey: 'user.id',
                                // Inside the card we could have nested rows/columns but kept minimal
                                // Example child components could be introduced by renderer using user alias
                                meta: { hint: 'Per-user card' }
                            }
                        ]
                    }
                ]
            },
            {
                kind: 'row',
                columns: [
                    {
                        kind: 'column', span: 12,
                        content: [
                            {
                                kind: 'component', component: 'button',
                                config: { variant: 'brand', appearance: 'filled' },
                                conditions: { visible: 'users.hasMore' },
                                actions: [{ event: 'click', action: 'loadMoreUsers', throttleMs: 400 }],
                                i18n: { labelKey: 'users.loadMore' }
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

// 12. Example (login form) – illustrative only (NOT exported to avoid accidental runtime usage).
// const EXAMPLE_LOGIN_LAYOUT: DsLayoutSchema = {
//     version: '1.0',
//     theme: 'light',
//     root: {
//         kind: 'container',
//         containerType: 'card',
//         title: 'Login',
//         rows: [
//             {
//                 kind: 'row',
//                 columns: [
//                     {
//                         kind: 'column', span: 12, content: [
//                             { kind: 'component', component: 'text', config: { label: 'Email', required: true, type: 'email', placeholder: 'you@example.com' } }
//                         ]
//                     },
//                     {
//                         kind: 'column', span: 12, content: [
//                             { kind: 'component', component: 'text', config: { label: 'Password', required: true, type: 'password', placeholder: '••••••' } }
//                         ]
//                     },
//                     {
//                         kind: 'column', span: 12, content: [
//                             { kind: 'component', component: 'button', config: { variant: 'brand', appearance: 'filled', onClick: () => {}, } as DsButtonConfig }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     }
// };

/* NEXT STEPS (future patches):
   - Add expression language / binding placeholders (e.g., value: "{{ user.email }}").
   - Introduce action pipeline (submit, reset) & validation grouping.
   - Provide a factory service to materialize DsLayoutSchema into Angular views.
   - Optional: layout introspection utilities (collect all required fields, etc.).
*/



