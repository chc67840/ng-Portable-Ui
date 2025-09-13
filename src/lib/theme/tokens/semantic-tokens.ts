// Semantic design tokens (raw scales & primitives)
// These map to CSS custom properties at runtime: --ds-color-*, --ds-radius-*, etc.

export type ColorScale = {
    50: string; 100: string; 200: string; 300: string; 400: string; 500: string; 600: string; 700: string; 800: string; 900: string;
};

export interface SemanticColors {
    primary: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    danger: ColorScale;
    info: ColorScale;
    accent?: ColorScale;
    // Text roles (fallback to neutral if omitted)
    text: {
        primary: string; // main fg
        secondary: string; // subdued fg
        inverse: string; // on dark / primary surfaces
    };
    // Background roles
    bg: {
        base: string;
        subtle: string;
        elevated: string; // layered panel
        overlay: string; // dialog/drawer overlay
    };
    border: {
        subtle: string;
        strong: string;
        focus: string;
    };
    shadowColor: string; // base shadow tint
}

export interface SemanticRadii {
    none: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
}

export interface SemanticSpacing {
    // Base spacing multiples (base unit 4px by default)
    xs: string; // 4
    sm: string; // 8
    md: string; // 12
    lg: string; // 16
    xl: string; // 24
    '2xl': string; // 32
    '3xl': string; // 48
}

export interface SemanticTypography {
    fontFamily: string;
    lineHeight: string;
    scale: {
        xs: string; // 12
        sm: string; // 14
        md: string; // 16
        lg: string; // 18
        xl: string; // 20
        '2xl': string; // 24
        '3xl': string; // 30
    };
    weight: {
        regular: string;
        medium: string;
        semibold: string;
        bold: string;
    };
}

export interface SemanticElevation {
    // Offsets & blur simplified; color derives from shadowColor + opacity steps
    sm: string;
    md: string;
    lg: string;
    xl: string;
}

export interface SemanticMotion {
    duration: {
        fast: string; // 120ms
        base: string; // 200ms
        slow: string; // 320ms
    };
    easing: {
        standard: string; // cubic-bezier
        emphasized: string;
        decel: string;
    };
}

export interface SemanticTokens {
    colors: SemanticColors;
    radii: SemanticRadii;
    spacing: SemanticSpacing;
    typography: SemanticTypography;
    elevation: SemanticElevation;
    motion: SemanticMotion;
}

export const lightSemanticTokens: SemanticTokens = {
    colors: {
        primary: { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc', 400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81' },
        neutral: { 50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a' },
        success: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 300: '#6ee7b7', 400: '#34d399', 500: '#10b981', 600: '#059669', 700: '#047857', 800: '#065f46', 900: '#064e3b' },
        warning: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
        danger: { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d' },
        info: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
        accent: { 50: '#fdf2ff', 100: '#fce7ff', 200: '#fbcffe', 300: '#f9a8ff', 400: '#f472ff', 500: '#ec38f8', 600: '#d028d8', 700: '#b120b4', 800: '#89188a', 900: '#5f105f' },
        text: { primary: '#0f172a', secondary: '#475569', inverse: '#ffffff' },
        bg: { base: '#ffffff', subtle: '#f8fafc', elevated: '#ffffff', overlay: 'rgba(15,23,42,0.55)' },
        border: { subtle: '#e2e8f0', strong: '#94a3b8', focus: '#6366f1' },
        shadowColor: '0 0 0 1px rgba(15,23,42,0.02)'
    },
    radii: { none: '0', xs: '2px', sm: '4px', md: '6px', lg: '8px', xl: '12px', full: '9999px' },
    spacing: { xs: '4px', sm: '8px', md: '12px', lg: '16px', xl: '24px', '2xl': '32px', '3xl': '48px' },
    typography: {
        fontFamily: 'system-ui, sans-serif',
        lineHeight: '1.4',
        scale: { xs: '0.75rem', sm: '0.8125rem', md: '0.875rem', lg: '1rem', xl: '1.125rem', '2xl': '1.25rem', '3xl': '1.5rem' },
        weight: { regular: '400', medium: '500', semibold: '600', bold: '700' }
    },
    elevation: {
        sm: '0 1px 2px 0 rgba(0,0,0,0.05)',
        md: '0 2px 4px -1px rgba(0,0,0,0.08),0 1px 3px -1px rgba(0,0,0,0.06)',
        lg: '0 4px 6px -1px rgba(0,0,0,0.10),0 2px 4px -2px rgba(0,0,0,0.08)',
        xl: '0 10px 15px -3px rgba(0,0,0,0.10),0 4px 6px -4px rgba(0,0,0,0.05)'
    },
    motion: {
        duration: { fast: '120ms', base: '200ms', slow: '320ms' },
        // Updated standard easing to a "back" style curve for nav/menu emphasis
        easing: { standard: 'cubic-bezier(0.86,0.11,0.85,0.10)', emphasized: 'cubic-bezier(.2,0,0,1)', decel: 'cubic-bezier(0,0,.2,1)' }
    }
};

// Dark tokens derive from light with overrides for backgrounds + text
export const darkSemanticTokens: SemanticTokens = {
    ...lightSemanticTokens,
    colors: {
        ...lightSemanticTokens.colors,
        text: { primary: '#f1f5f9', secondary: '#94a3b8', inverse: '#0f172a' },
        bg: { base: '#0f172a', subtle: '#1e293b', elevated: '#1e293b', overlay: 'rgba(15,23,42,0.7)' },
        border: { subtle: '#334155', strong: '#475569', focus: '#6366f1' },
        shadowColor: '0 0 0 1px rgba(255,255,255,0.06)'
    }
};

export interface ThemeMeta {
    name: string;
    semantic: SemanticTokens;
}

export const SEMANTIC_THEMES: ThemeMeta[] = [
    { name: 'light', semantic: lightSemanticTokens },
    { name: 'dark', semantic: darkSemanticTokens },
    // Amber dark variant (pairs with amber but with dark surfaces)
    {
        name: 'amber-dark', semantic: {
            ...darkSemanticTokens,
            colors: {
                ...darkSemanticTokens.colors,
                primary: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
                accent: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337' },
                bg: { base: '#1e293b', subtle: '#283548', elevated: '#334155', overlay: 'rgba(15,23,42,0.7)' },
                border: { subtle: '#475569', strong: '#64748b', focus: '#f59e0b' },
                text: { primary: '#fef3c7', secondary: '#fde68a', inverse: '#1e293b' },
                shadowColor: '0 0 0 1px rgba(255,255,255,0.05)'
            }
        }
    },
    // Amber theme (warm amber primary palette, soft amber surfaces)
    {
        name: 'amber', semantic: {
            ...lightSemanticTokens,
            colors: {
                ...lightSemanticTokens.colors,
                primary: { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24', 500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f' },
                accent: { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 300: '#fda4af', 400: '#fb7185', 500: '#f43f5e', 600: '#e11d48', 700: '#be123c', 800: '#9f1239', 900: '#881337' },
                bg: { base: '#fffbeb', subtle: '#fef3c7', elevated: '#ffffff', overlay: 'rgba(120,53,15,0.45)' },
                border: { subtle: '#fde68a', strong: '#fbbf24', focus: '#f59e0b' },
                text: { primary: '#78350f', secondary: '#92400e', inverse: '#ffffff' },
                shadowColor: '0 0 0 1px rgba(120,53,15,0.08)'
            }
        }
    },
    // Ocean theme (sky primary palette, subtle blue backgrounds)
    {
        name: 'ocean', semantic: {
            ...lightSemanticTokens,
            colors: {
                ...lightSemanticTokens.colors,
                primary: { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e' },
                accent: { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 300: '#5eead4', 400: '#2dd4bf', 500: '#14b8a6', 600: '#0d9488', 700: '#0f766e', 800: '#115e59', 900: '#134e4a' },
                bg: { base: '#ffffff', subtle: '#f0f9ff', elevated: '#ffffff', overlay: 'rgba(7,89,133,0.45)' },
                border: { subtle: '#bae6fd', strong: '#38bdf8', focus: '#0284c7' }
            }
        }
    },
    // Primary theme (blue palette)
    {
        name: 'primary', semantic: {
            ...lightSemanticTokens,
            colors: {
                ...lightSemanticTokens.colors,
                primary: { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a' },
                accent: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 300: '#f0abfc', 400: '#e879f9', 500: '#d946ef', 600: '#c026d3', 700: '#a21caf', 800: '#86198f', 900: '#701a75' },
                border: { subtle: '#bfdbfe', strong: '#60a5fa', focus: '#2563eb' }
            }
        }
    }
];
