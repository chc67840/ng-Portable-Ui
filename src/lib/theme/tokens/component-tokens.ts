// Component-level tokens compose semantic primitives into ready-to-use roles.
// They can be overridden per theme.

import { SemanticTokens } from './semantic-tokens';

export interface ComponentStateColors {
    bg: string;
    fg: string;
    border?: string;
    ring?: string;
}

export interface InputTokens {
    height: { sm: string; md: string; lg: string; };
    radius: string; // default radius key (maps to semantic radii)
    paddingX: string;
    paddingY: string;
    fontSize: string;
    lineHeight: string;
    weight: string;
    variants: {
        filled: ComponentStateColors & { hoverBg: string; focusBg: string; placeholder: string; };
        outline: ComponentStateColors & { hoverBorder: string; focusBorder: string; placeholder: string; };
        ghost: ComponentStateColors & { hoverBg: string; focusBg: string; placeholder: string; };
    };
    invalid: { border: string; ring: string; fg?: string; };
    disabled: { opacity: string; };
}

export interface ButtonTokens {
    radius: string;
    fontWeight: string;
    sizes: { sm: string; md: string; lg: string; };
    variants: {
        solid: ComponentStateColors & { hoverBg: string; activeBg: string; };
        soft: ComponentStateColors & { hoverBg: string; activeBg: string; };
        outline: ComponentStateColors & { hoverBg: string; activeBg: string; };
        ghost: ComponentStateColors & { hoverBg: string; activeBg: string; };
    };
    disabled: { opacity: string; };
}

export interface SurfaceTokens {
    radius: string;
    padding: string;
    gap: string;
    bg: string;
    border: string;
    elevation: string; // shadow token
    headingColor: string;
    bodyColor: string;
}

export interface ComponentTokens {
    input: InputTokens;
    button: ButtonTokens;
    surface: SurfaceTokens;
}

export interface ThemeDefinition {
    name: string;
    semantic: SemanticTokens;
    components: ComponentTokens;
}

export function buildComponentTokens(semantic: SemanticTokens): ComponentTokens {
    const c = semantic.colors;
    return {
        input: {
            height: { sm: '2rem', md: '2.25rem', lg: '2.75rem' },
            radius: 'sm',
            paddingX: '0.75rem',
            paddingY: '0.25rem',
            fontSize: semantic.typography.scale.md,
            lineHeight: semantic.typography.lineHeight,
            weight: semantic.typography.weight.regular,
            variants: {
                filled: { bg: c.bg.subtle, fg: c.text.primary, border: c.border.subtle, ring: c.border.focus, hoverBg: c.bg.elevated, focusBg: '#ffffff', placeholder: c.text.secondary },
                outline: { bg: 'transparent', fg: c.text.primary, border: c.border.subtle, ring: c.border.focus, hoverBorder: c.border.strong, focusBorder: c.border.focus, placeholder: c.text.secondary },
                ghost: { bg: 'transparent', fg: c.text.primary, border: 'transparent', ring: c.border.focus, hoverBg: 'rgba(0,0,0,0.04)', focusBg: 'rgba(0,0,0,0.06)', placeholder: c.text.secondary }
            },
            invalid: { border: c.danger[500], ring: c.danger[400], fg: c.danger[600] },
            disabled: { opacity: '0.5' }
        },
        button: {
            radius: 'sm',
            fontWeight: semantic.typography.weight.medium,
            sizes: { sm: '2rem', md: '2.25rem', lg: '2.75rem' },
            variants: {
                solid: { bg: c.primary[600], fg: '#fff', border: c.primary[600], ring: c.border.focus, hoverBg: c.primary[500], activeBg: c.primary[700] },
                soft: { bg: c.primary[100], fg: c.primary[700], border: c.primary[100], ring: c.border.focus, hoverBg: c.primary[200], activeBg: c.primary[300] },
                outline: { bg: 'transparent', fg: c.primary[700], border: c.primary[300], ring: c.border.focus, hoverBg: c.primary[50], activeBg: c.primary[100] },
                ghost: { bg: 'transparent', fg: c.primary[700], border: 'transparent', ring: c.border.focus, hoverBg: c.primary[50], activeBg: c.primary[100] }
            },
            disabled: { opacity: '0.5' }
        },
        surface: {
            radius: 'md',
            padding: '1rem',
            gap: '0.75rem',
            bg: c.bg.elevated,
            border: c.border.subtle,
            elevation: 'md',
            headingColor: c.text.primary,
            bodyColor: c.text.secondary
        }
    };
}
