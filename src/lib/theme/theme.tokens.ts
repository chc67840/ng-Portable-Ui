// Central theme token & registry definitions
import { InjectionToken } from '@angular/core';
import { DsTheme } from '../ds.model';

export interface DsThemeRegistry {
    [name: string]: DsTheme;
}

export const DS_THEME_REGISTRY = new InjectionToken<DsThemeRegistry>('DS_THEME_REGISTRY', {
    factory: () => ({})
});

export const DS_DEFAULT_THEME = new InjectionToken<string>('DS_DEFAULT_THEME', { factory: () => 'light' });
