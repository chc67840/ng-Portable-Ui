import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ds-card: wrapper for <wa-card> exposing attributes, slots, css vars & parts via class hooks.
 * Slots: default (body), header, footer, media.
 * Attributes/Props: appearance (accent|filled|outlined|plain), withHeader/withMedia/withFooter (SSR hints).
 * CSS Custom Properties: --spacing (forward via cssVars input map).
 * CSS Parts: media, header, body, footer (style via ::part()).
 */
@Component({
    selector: 'ds-card',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <wa-card
    [attr.appearance]="appearance"
    [attr.with-header]="withHeader ? '' : null"
    [attr.with-media]="withMedia ? '' : null"
    [attr.with-footer]="withFooter ? '' : null"
    [class]="cardClass"
  >
    <div *ngIf="hasMedia" part="media" [class]="mediaClass"><ng-content select="[slot=media]"></ng-content></div>
    <div *ngIf="hasHeader" part="header" [class]="headerClass"><ng-content select="[slot=header]"></ng-content></div>
    <div part="body" [class]="bodyClass"><ng-content></ng-content></div>
    <div *ngIf="hasFooter" part="footer" [class]="footerClass"><ng-content select="[slot=footer]"></ng-content></div>
  </wa-card>
  `,
    styles: [`:host{display:block}`]
})
export class DsCardComponent {
    /** Visual appearance */
    @Input() appearance: 'accent' | 'filled' | 'outlined' | 'plain' = 'plain';
    /** SSR hints (optional) */
    @Input() withHeader = false;
    @Input() withMedia = false;
    @Input() withFooter = false;

    /** Conditional flags to force slot rendering (if projection uses attributes we can't easily detect here) */
    @Input() hasHeader = true; // assume true; consumer can disable
    @Input() hasMedia = false;
    @Input() hasFooter = false;

    // Class hooks for styling (consumer can use ::part as well)
    @Input() cardClass = 'w-full max-w-none rounded-none sm:rounded-md border border-slate-200 bg-white shadow-sm overflow-hidden';
    @Input() mediaClass = 'block';
    @Input() headerClass = 'px-4 py-3 border-b border-slate-200 text-sm font-medium';
    @Input() bodyClass = 'p-4 text-sm text-slate-700';
    @Input() footerClass = 'px-4 py-3 border-t border-slate-200 text-xs text-slate-500';

    /** Pass CSS vars: e.g. { '--spacing': '1rem' } */
    @Input() set cssVars(vars: Record<string, string | number | null> | undefined) {
        if (!vars) return;
        const host = (this as any)._hostElement as HTMLElement | undefined; // placeholder (Angular doesn't expose automatically)
        if (!host) return;
        for (const [k, v] of Object.entries(vars)) {
            if (v == null) host.style.removeProperty(k); else host.style.setProperty(k, String(v));
        }
    }
}
