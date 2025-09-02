import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-spinner: wrapper for <wa-spinner>. Applies css custom properties via cssVars.
 */
@Component({
    selector: 'ds-spinner',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-spinner #el [class]="spinnerClass"></wa-spinner>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsSpinnerComponent implements OnChanges {
    static readonly tag = WA_TAGS.spinner;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    @Input() spinnerClass = '';
    @Input() cssVars?: Record<string, string | number | null>; // --track-width, --track-color, --indicator-color, --speed

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
