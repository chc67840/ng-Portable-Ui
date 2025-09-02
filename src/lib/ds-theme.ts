import { DsTheme } from './ds.model';

// Grid Theming Interfaces & Definitions
export interface DsGridTheme {
    name: string;
    /** AG Grid theme class (legacy mode) e.g. ag-theme-quartz */
    agTheme: string;
    /** Theme mode for ds-grid (legacy uses css file themes) */
    mode: 'legacy' | 'modern';
    /** Additional utility / design-system classes applied to host */
    hostClasses?: string[] | string;
    /** Additional classes for inner grid container */
    gridClasses?: string[] | string;
    /** CSS custom properties applied (merged with component cssVars/themeVars) */
    cssVars?: Record<string, string>;
    /** AG Grid focused overrides using CSS vars (legacy still supports) */
    agVars?: Record<string, string>;
}

export const DS_GRID_THEMES: Record<string, DsGridTheme> = {
    light: {
        name: 'light',
        agTheme: 'ag-theme-quartz',
        mode: 'legacy',
        hostClasses: 'ds-grid-theme-light',
        cssVars: {
            '--ag-foreground-color': '#1e293b',
            '--ag-header-background-color': '#f8fafc',
            '--ag-row-hover-color': '#e2e8f0',
            '--ag-border-color': '#e2e8f0'
        }
    },
    dark: {
        name: 'dark',
        agTheme: 'ag-theme-quartz',
        mode: 'legacy',
        hostClasses: 'ds-grid-theme-dark',
        cssVars: {
            '--ag-foreground-color': '#f1f5f9',
            '--ag-header-background-color': '#1e293b',
            '--ag-row-hover-color': '#334155',
            '--ag-border-color': '#334155'
        }
    },
    ocean: {
        name: 'ocean',
        agTheme: 'ag-theme-quartz',
        mode: 'legacy',
        hostClasses: 'ds-grid-theme-ocean',
        cssVars: {
            '--ag-foreground-color': '#0f172a',
            '--ag-header-background-color': '#e0f2fe',
            '--ag-row-hover-color': '#bae6fd',
            '--ag-border-color': '#7dd3fc'
        }
    },
    primary: {
        name: 'primary',
        agTheme: 'ag-theme-quartz',
        mode: 'legacy',
        hostClasses: 'ds-grid-theme-primary',
        cssVars: {
            '--ag-foreground-color': '#111827',
            '--ag-header-background-color': '#eff6ff',
            '--ag-row-hover-color': '#dbeafe',
            '--ag-border-color': '#bfdbfe'
        }
    }
};

export const ENHANCED_FORM_THEMES: Record<string, DsTheme> = {
    light: {
        name: 'light',
        nav: {
            wrapper: 'w-full flex items-stretch backdrop-blur bg-white/80 relative',
            height: 'h-16',
            brandContainer: 'h-full flex items-center gap-3 px-5 shrink-0',
            brand: 'font-semibold tracking-tight select-none text-gray-900',
            itemsContainer: 'flex items-center gap-4',
            item: 'relative px-4 h-full flex items-center text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            itemActive: 'text-blue-600 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-blue-600',
            itemInactive: 'text-gray-600 hover:text-gray-900',
            rightContainer: 'flex items-center gap-2 pr-4 ml-auto',
            background: 'bg-white/80',
            border: 'border-b border-gray-200',
            shadow: 'shadow'
        },
        layout: {
            container: 'enhanced-form-container text-gray-900',
            form: 'grid gap-6',
            row: 'flex flex-wrap gap-4',
            column: 'flex flex-col',
            title: 'text-2xl font-bold text-gray-900',
            description: 'text-gray-600',
            containerBackground: 'bg-white',
            containerVariants: {
                solid: '',
                gradient: 'ef-bg-stack bg-white border border-gray-200/60 p-6 rounded-2xl ef-grad-light',
                soft: 'bg-white/70 backdrop-blur-sm border border-gray-200/60 p-4 rounded-xl'
            },
            defaultContainerVariant: 'solid'
        },
        section: {
            container: 'mb-6',
            header: 'text-lg font-semibold text-gray-800',
            subtitle: 'text-sm font-medium text-gray-600',
            panelHeader: 'bg-gray-100 rounded-t-xl px-4 py-2 border-b border-gray-200',
            fieldset: 'border border-gray-200 rounded-xl p-4 bg-white',
            panel: 'bg-white shadow-sm rounded-xl',
            card: 'bg-white shadow-sm rounded-xl p-4',
            footer: 'text-sm text-gray-600'
        },
        control: {
            label: 'block text-sm font-medium text-gray-700 mb-1',
            // Use !bg-* to override PrimeNG theme background set after Tailwind stylesheet is loaded
            input: 'w-full max-w-full box-border rounded-md border border-gray-300 !bg-white text-sm leading-tight text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            textarea: 'w-full max-w-full box-border rounded-md border border-gray-300 !bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            number: '[&_.p-inputnumber-input]:px-0 [&_.p-inputnumber-input]:py-0',
            calendar: '[&_.p-datepicker-input]:px-0 [&_.p-datepicker-input]:py-1',
            password: 'w-full [&_.p-password-input]:w-full [&_.p-password-input]:px-2 [&_.p-password-input]:py-1.5 [&_.p-password-input]:bg-transparent [&_.p-password-input]:outline-none',
            dropdown: 'w-full',
            multiselect: 'w-full',
            checkbox: 'align-middle',
            slider: 'w-full',
            rating: 'flex gap-1',
            fileupload: 'w-full',
            colorpicker: '',
            chips: 'w-full',
            autocomplete: 'w-full [&_.p-autocomplete-input]:w-full [&_.p-autocomplete-input]:px-2 [&_.p-autocomplete-input]:py-1.5 [&_.p-autocomplete-input]:bg-transparent [&_.p-autocomplete-input]:outline-none',
            toggleswitch: 'inline-flex items-center',
            inputmask: 'w-full [&_.p-inputmask-input]:w-full [&_.p-inputmask-input]:px-0 [&_.p-inputmask-input]:py-0 [&_.p-inputmask-input]:bg-transparent [&_.p-inputmask-input]:outline-none',
            radiobutton: 'w-full flex flex-wrap gap-4',
            required: 'text-red-500 ml-0.5',
            helpText: 'text-xs text-gray-500',
            container: 'w-full min-w-0'
        },
        tokens: {
            '--ef-border': 'border-gray-300'
        }
    },
    dark: {
        name: 'dark',
        nav: {
            wrapper: 'w-full flex items-stretch backdrop-blur bg-gray-900/85 relative',
            height: 'h-16',
            brandContainer: 'h-full flex items-center gap-3 px-5 shrink-0',
            brand: 'font-semibold tracking-tight select-none text-gray-100',
            itemsContainer: 'flex items-center gap-4',
            item: 'relative px-4 h-full flex items-center text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
            itemActive: 'text-blue-400 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-blue-400',
            itemInactive: 'text-gray-400 hover:text-gray-200',
            rightContainer: 'flex items-center gap-2 pr-4 ml-auto',
            background: 'bg-gray-900/85',
            border: 'border-b border-gray-800',
            shadow: 'shadow-lg shadow-black/30'
        },
        layout: {
            container: 'enhanced-form-container text-gray-100',
            form: 'grid gap-6',
            row: 'flex flex-wrap gap-4',
            column: 'flex flex-col',
            title: 'text-2xl font-bold text-gray-100',
            description: 'text-gray-400',
            containerBackground: 'bg-gray-900',
            containerVariants: {
                solid: '',
                gradient: 'ef-bg-stack bg-gray-900 border border-gray-800/70 p-6 rounded-2xl ef-grad-dark',
                soft: 'bg-gray-900/80 backdrop-blur border border-gray-800/60 p-4 rounded-xl'
            },
            defaultContainerVariant: 'solid'
        },
        section: {
            container: 'mb-6',
            header: 'text-lg font-semibold text-gray-100',
            subtitle: 'text-sm font-medium text-gray-400',
            panelHeader: 'bg-gray-800/80 rounded-t-xl px-4 py-2 border-b border-gray-700',
            fieldset: 'border border-gray-700 rounded-xl p-4 bg-gray-800',
            panel: 'bg-gray-800 shadow-sm rounded-xl',
            card: 'bg-gray-800 shadow-sm rounded-xl p-4',
            footer: 'text-sm text-gray-400'
        },
        control: {
            label: 'block text-sm font-medium text-gray-300 mb-1',
            input: 'w-full max-w-full box-border rounded-md border border-gray-600 !bg-gray-800 text-sm leading-tight text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            textarea: 'w-full max-w-full box-border rounded-md border border-gray-600 !bg-gray-800 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            number: '[&_.p-inputnumber-input]:px-2 [&_.p-inputnumber-input]:py-1.5',
            calendar: '[&_.p-datepicker-input]:px-2 [&_.p-datepicker-input]:py-1.5',
            password: 'w-full [&_.p-password-input]:w-full [&_.p-password-input]:px-2 [&_.p-password-input]:py-1.5 [&_.p-password-input]:bg-transparent [&_.p-password-input]:outline-none',
            dropdown: 'w-full',
            multiselect: 'w-full',
            checkbox: 'align-middle',
            slider: 'w-full',
            rating: 'flex gap-1',
            fileupload: 'w-full',
            colorpicker: '',
            chips: 'w-full',
            autocomplete: 'w-full [&_.p-autocomplete-input]:w-full [&_.p-autocomplete-input]:px-2 [&_.p-autocomplete-input]:py-1.5 [&_.p-autocomplete-input]:bg-transparent [&_.p-autocomplete-input]:outline-none',
            toggleswitch: 'inline-flex items-center',
            inputmask: 'w-full [&_.p-inputmask-input]:w-full [&_.p-inputmask-input]:px-2 [&_.p-inputmask-input]:py-1.5 [&_.p-inputmask-input]:bg-transparent [&_.p-inputmask-input]:outline-none',
            radiobutton: 'w-full flex flex-wrap gap-4',
            required: 'text-red-400 ml-0.5',
            helpText: 'text-xs text-gray-400',
            container: 'w-full min-w-0'
        },
        tokens: {
            '--ef-border': 'border-gray-600'
        }
    },
    ocean: {
        name: 'ocean',
        nav: {
            wrapper: 'w-full flex items-stretch backdrop-blur bg-sky-50/80 dark:bg-sky-900/70 relative',
            height: 'h-16',
            brandContainer: 'h-full flex items-center gap-3 px-5 shrink-0',
            brand: 'font-semibold tracking-tight select-none text-sky-800 dark:text-sky-200',
            itemsContainer: 'flex items-center gap-4',
            item: 'relative px-4 h-full flex items-center text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
            itemActive: 'text-sky-600 dark:text-sky-300 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-sky-500 dark:after:bg-sky-300',
            itemInactive: 'text-sky-700 dark:text-sky-300/70 hover:text-sky-900 dark:hover:text-sky-200',
            rightContainer: 'flex items-center gap-2 pr-4 ml-auto',
            background: 'bg-sky-50/80 dark:bg-sky-900/70',
            border: 'border-b border-sky-200 dark:border-sky-800',
            shadow: 'shadow'
        },
        layout: {
            container: 'enhanced-form-container text-sky-900 dark:text-sky-100',
            form: 'grid gap-6',
            row: 'flex flex-wrap gap-4',
            column: 'flex flex-col',
            title: 'text-2xl font-bold text-sky-900 dark:text-sky-100',
            description: 'text-sky-700 dark:text-sky-300',
            containerBackground: 'bg-sky-50 dark:bg-sky-900',
            containerVariants: {
                solid: '',
                gradient: 'ef-bg-stack bg-sky-50 dark:bg-sky-900 border border-sky-200/60 dark:border-sky-800/60 p-6 rounded-2xl ef-grad-sky',
                soft: 'bg-sky-50/70 dark:bg-sky-900/60 backdrop-blur border border-sky-200/50 dark:border-sky-800/50 p-4 rounded-xl'
            },
            defaultContainerVariant: 'solid'
        },
        section: {
            container: 'mb-6',
            header: 'text-lg font-semibold text-sky-800 dark:text-sky-200',
            subtitle: 'text-sm font-medium text-sky-700 dark:text-sky-300',
            panelHeader: 'bg-sky-100/70 dark:bg-sky-900/40 backdrop-blur rounded-t-xl px-4 py-2 border-b border-sky-300/60 dark:border-sky-700/60',
            fieldset: 'border border-sky-300 dark:border-sky-700 rounded-xl p-4 bg-white/80 dark:bg-sky-800/50 backdrop-blur',
            panel: 'bg-white/80 dark:bg-sky-800/50 backdrop-blur shadow-sm rounded-xl',
            card: 'bg-white/80 dark:bg-sky-800/50 backdrop-blur shadow-sm rounded-xl p-4',
            footer: 'text-sm text-sky-700 dark:text-sky-300'
        },
        control: {
            label: 'block text-sm font-medium text-sky-700 dark:text-sky-300 mb-1',
            input: 'w-full max-w-full box-border rounded-md border border-sky-300 dark:border-sky-600 !bg-white dark:!bg-sky-900/60 text-sm leading-tight text-sky-900 dark:text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition',
            textarea: 'w-full max-w-full box-border rounded-md border border-sky-300 dark:border-sky-600 !bg-white dark:!bg-sky-900/60 text-sm text-sky-900 dark:text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition',
            number: '[&_.p-inputnumber-input]:px-2 [&_.p-inputnumber-input]:py-1.5',
            calendar: '[&_.p-datepicker-input]:px-2 [&_.p-datepicker-input]:py-1.5',
            password: 'w-full [&_.p-password-input]:w-full [&_.p-password-input]:px-2 [&_.p-password-input]:py-1.5 [&_.p-password-input]:bg-transparent [&_.p-password-input]:outline-none',
            dropdown: 'w-full',
            multiselect: 'w-full',
            checkbox: 'align-middle',
            slider: 'w-full',
            rating: 'flex gap-1',
            fileupload: 'w-full',
            colorpicker: '',
            chips: 'w-full',
            autocomplete: 'w-full [&_.p-autocomplete-input]:w-full [&_.p-autocomplete-input]:px-2 [&_.p-autocomplete-input]:py-1.5 [&_.p-autocomplete-input]:bg-transparent [&_.p-autocomplete-input]:outline-none',
            toggleswitch: 'inline-flex items-center',
            inputmask: 'w-full [&_.p-inputmask-input]:w-full [&_.p-inputmask-input]:px-2 [&_.p-inputmask-input]:py-1.5 [&_.p-inputmask-input]:bg-transparent [&_.p-inputmask-input]:outline-none',
            radiobutton: 'w-full flex flex-wrap gap-4',
            required: 'text-rose-500 ml-0.5',
            helpText: 'text-xs text-sky-600 dark:text-sky-400',
            container: 'w-full min-w-0'
        },
        tokens: {
            '--ef-border': 'border-sky-400'
        }
    },
    // Base primary theme – will be customized at runtime via overrides
    primary: {
        name: 'primary',
        nav: {
            wrapper: 'w-full flex items-stretch backdrop-blur bg-neutral-50/80 dark:bg-neutral-900/70 relative',
            height: 'h-16',
            brandContainer: 'h-full flex items-center gap-3 px-5 shrink-0',
            brand: 'font-semibold tracking-tight select-none text-neutral-900 dark:text-neutral-100',
            itemsContainer: 'flex items-center gap-4',
            item: 'relative px-4 h-full flex items-center text-sm font-medium transition-colors select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
            itemActive: 'text-blue-600 dark:text-blue-400 after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400',
            itemInactive: 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200',
            rightContainer: 'flex items-center gap-2 pr-4 ml-auto',
            background: 'bg-neutral-50/80 dark:bg-neutral-900/70',
            border: 'border-b border-neutral-200 dark:border-neutral-800',
            shadow: 'shadow'
        },
        layout: {
            container: 'enhanced-form-container text-neutral-900 dark:text-neutral-100',
            form: 'grid gap-6',
            row: 'flex flex-wrap gap-4',
            column: 'flex flex-col',
            title: 'text-2xl font-bold text-neutral-900 dark:text-neutral-100',
            description: 'text-neutral-600 dark:text-neutral-400',
            containerBackground: 'bg-neutral-50 dark:bg-neutral-900',
            containerVariants: {
                solid: '',
                gradient: 'ef-bg-stack bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 p-6 rounded-2xl ef-grad-neutral',
                soft: 'bg-neutral-50/70 dark:bg-neutral-900/70 backdrop-blur border border-neutral-200/50 dark:border-neutral-800/50 p-4 rounded-xl'
            },
            defaultContainerVariant: 'solid'
        },
        section: {
            container: 'mb-6',
            header: 'text-lg font-semibold text-neutral-800 dark:text-neutral-200',
            subtitle: 'text-sm font-medium text-neutral-600 dark:text-neutral-400',
            panelHeader: 'bg-neutral-100 dark:bg-neutral-800/70 rounded-t-xl px-4 py-2 border-b border-neutral-200 dark:border-neutral-700',
            // defaults (will be replaced by overrides for chosen surface variant)
            fieldset: 'border border-neutral-300 dark:border-neutral-700 rounded-xl p-4 bg-white dark:bg-neutral-800',
            panel: 'bg-white dark:bg-neutral-800 shadow-sm rounded-xl',
            card: 'bg-white dark:bg-neutral-800 shadow-sm rounded-xl p-4',
            footer: 'text-sm text-neutral-600 dark:text-neutral-400'
        },
        control: {
            label: 'block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1',
            // input / textarea will be colorized via overrides; keep neutral fallback
            input: 'w-full max-w-full box-border rounded-md border border-neutral-300 dark:border-neutral-600 !bg-white dark:!bg-neutral-800 text-sm leading-tight text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            textarea: 'w-full max-w-full box-border rounded-md border border-neutral-300 dark:border-neutral-600 !bg-white dark:!bg-neutral-800 text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition',
            number: '[&_.p-inputnumber-input]:px-2 [&_.p-inputnumber-input]:py-1.5',
            calendar: '[&_.p-datepicker-input]:px-2 [&_.p-datepicker-input]:py-1.5',
            password: 'w-full [&_.p-password-input]:w-full [&_.p-password-input]:px-2 [&_.p-password-input]:py-1.5 [&_.p-password-input]:bg-transparent [&_.p-password-input]:outline-none',
            dropdown: 'w-full', multiselect: 'w-full', checkbox: 'align-middle', slider: 'w-full', rating: 'flex gap-1', fileupload: 'w-full', colorpicker: '', chips: 'w-full', autocomplete: 'w-full [&_.p-autocomplete-input]:w-full [&_.p-autocomplete-input]:px-2 [&_.p-autocomplete-input]:py-1.5 [&_.p-autocomplete-input]:bg-transparent [&_.p-autocomplete-input]:outline-none', toggleswitch: 'inline-flex items-center', inputmask: 'w-full [&_.p-inputmask-input]:w-full [&_.p-inputmask-input]:px-2 [&_.p-inputmask-input]:py-1.5 [&_.p-inputmask-input]:bg-transparent [&_.p-inputmask-input]:outline-none', radiobutton: 'w-full flex flex-wrap gap-4',
            required: 'text-red-500 ml-0.5',
            helpText: 'text-xs text-neutral-500 dark:text-neutral-400',
            container: 'w-full min-w-0'
        },
        tokens: {
            '--ef-primary': 'blue',
            '--ef-surface': 'flat'
        }
    }
};

export function mergeThemes(base: DsTheme, overrides?: Partial<DsTheme>): DsTheme {
    if (!overrides) return base;
    return {
        ...base,
        ...overrides,
        layout: { ...base.layout, ...overrides.layout },
        section: { ...base.section, ...overrides.section },
        control: { ...base.control, ...overrides.control },
        tokens: { ...base.tokens, ...overrides.tokens },
        extra: { ...base.extra, ...overrides.extra }
    };
}
