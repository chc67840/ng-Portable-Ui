import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, OnChanges, SimpleChanges, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-spinner: Enhanced wrapper for <wa-spinner>.
 * Slots: (none projected by vendor) – wrapper allows projecting optional label via [slot=label] span.
 * Inputs:
 *  - size: small|medium|large (maps to class utility scale)
 *  - trackWidth, trackColor, indicatorColor, speed (css custom props)
 *  - ariaLabel (accessibility label)
 *  - disabled (adds state class + aria-disabled)
 *  - checked (semantic flag for future conditional display, toggles ds-spinner-checked class)
 *  - hint/help (not rendered unless showHint true)
 *  - showHint boolean to render hint below
 *  - spinnerClass (styling hook) wrapperClass, hintClass
 *  - cssVars: additional custom properties
 * Outputs:
 *  - showEvent / hideEvent (future when conditional) currently emits when checked toggles true/false
 * Methods:
 *  - focus(), blur() (pass-through) toggle(on/off)
 * CSS Custom Properties supported: --track-width, --track-color, --indicator-color, --speed + arbitrary via cssVars
 * CSS Parts (vendor): base
 * Custom States: .ds-spinner-disabled, .ds-spinner-checked
 */
@Component({
    selector: 'ds-spinner',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <div [class]="computedWrapperClass">
      <wa-spinner #el [attr.aria-label]="ariaLabel || null" [class]="computedSpinnerClass"></wa-spinner>
      <span *ngIf="showHint && displayHint" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
    </div>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsSpinnerComponent implements OnChanges {
    static readonly tag = WA_TAGS.spinner;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() trackWidth?: string | number;
    @Input() trackColor?: string;
    @Input() indicatorColor?: string;
    @Input() speed?: string; // e.g. 800ms
    @Input() ariaLabel?: string;
    @Input() disabled = false;
    @Input() checked = true; // semantic: show active spinner
    @Input() hint?: string; @Input() help?: string; @Input() showHint = false;
    @Input() wrapperClass = 'inline-flex flex-col items-center gap-1';
    @Input() spinnerClass = '';
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;

    @Output() showEvent = new EventEmitter<void>();
    @Output() hideEvent = new EventEmitter<void>();

    @HostBinding('class.ds-spinner-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-spinner-checked') get checkedClass() { return this.checked; }

    get displayHint() { return this.hint ?? this.help; }
    get computedWrapperClass() { return this.wrapperClass; }
    get computedSpinnerClass() {
        let cls = this.spinnerClass || '';
        if (!/w-/.test(cls)) cls += ' ' + (this.size === 'small' ? 'w-4 h-4' : this.size === 'large' ? 'w-8 h-8' : 'w-6 h-6');
        return cls.trim();
    }

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['cssVars'] || ch['trackWidth'] || ch['trackColor'] || ch['indicatorColor'] || ch['speed']) this.applyCssVars();
        if (ch['checked'] && !ch['checked'].firstChange) { this.emitToggle(); }
    }

    private emitToggle() { if (this.checked) this.showEvent.emit(); else this.hideEvent.emit(); }
    private applyCssVars() {
        if (!this.el?.nativeElement) return; const style = this.el.nativeElement.style;
        const vars: Record<string, string | number | undefined> = {
            '--track-width': this.trackWidth,
            '--track-color': this.trackColor,
            '--indicator-color': this.indicatorColor,
            '--speed': this.speed
        };
        for (const [k, v] of Object.entries({ ...vars, ...(this.cssVars || {}) })) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    // Public methods
    focus() { this.el?.nativeElement?.focus?.(); }
    blur() { this.el?.nativeElement?.blur?.(); }
    toggle(v?: boolean) { if (v == null) this.checked = !this.checked; else this.checked = v; this.emitToggle(); }
}