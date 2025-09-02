import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-divider: Wrapper around <wa-divider> providing orientation + css variable hooks.
 * Exposes style/class hooks and optional semantic role adjustments.
 */
@Component({
    selector: 'ds-divider',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-divider #el
      [class]="dividerClass"
      [attr.orientation]="orientation"
      [attr.role]="role || null"
    ></wa-divider>
  `,
    styles: [`:host{display:contents}`]
})
export class DsDividerComponent implements OnChanges {
    static readonly tag = WA_TAGS.divider;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    /** Orientation of the divider */
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

    /** Optional override for accessibility role (e.g., 'separator', 'presentation') */
    @Input() role?: string;

    /** Tailwind / custom classes applied to the underlying wa-divider */
    @Input() dividerClass = '';

    /** Map of CSS custom properties: --color, --width, --spacing */
    @Input() cssVars?: Record<string, string | number | null>;

    ngOnChanges(changes: SimpleChanges): void { if (changes['cssVars']) this.applyCssVars(); }
    ngAfterViewInit() { this.applyCssVars(); }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }
}
