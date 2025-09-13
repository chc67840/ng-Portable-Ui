import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-checkbox: wrapper for <wa-checkbox> exposing full form API + class & css var hooks.
 * Supported Slots:
 *  - default: label / arbitrary content to the right of control
 *  - [slot=hint]: projected hint element (alternative to hint attr)
 * Attributes / Inputs:
 *  - name, size (small|medium|large), disabled, indeterminate, checked, required, hint (attr) + cssVars map
 *  - validationMessage: custom validity message (sets setCustomValidity)
 * Events (Outputs):
 *  - checkedChange (2-way), inputEvent, changeEvent, focusEvent, blurEvent, invalidEvent (wa-invalid)
 * CSS Custom Properties (via cssVars): forward any key (e.g. --focus-ring-color, --indicator-color, etc.)
 * CSS Parts (targetable with Tailwind arbitrary variants if desired): control, base, checked-icon, indeterminate-icon
 * Dynamic Features:
 *  - Custom Validity: provide validationMessage input or call setCustomValidity() method
 *  - Hint: pass hint input or use [slot=hint]
 *  - Sizes: size input maps to underlying attribute
 *  - Disabled / Indeterminate fully supported and kept in sync
 *  - Methods: focus, blur, click, setCustomValidity, reportValidity
 */
@Component({
    selector: 'ds-checkbox',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-checkbox #el
      [class]="checkboxClass"
      [attr.name]="name || null"
      [attr.size]="size"
      [attr.disabled]="disabled ? '' : null"
      [attr.indeterminate]="indeterminate ? '' : null"
      [attr.checked]="checked ? '' : null"
      [attr.required]="required ? '' : null"
      [attr.hint]="hint || null"
      (input)="onInput($event)"
      (change)="onChange($event)"
      (focus)="focusEvent.emit($event)"
      (blur)="blurEvent.emit($event)"
      (wa-invalid)="invalidEvent.emit($event)"
    >
      <ng-content></ng-content>
      <ng-content select="[slot=hint]"></ng-content>
    </wa-checkbox>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsCheckboxComponent implements OnChanges {
    static readonly tag = WA_TAGS.checkbox;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaCheckboxEl>;

    // Inputs
    @Input() name?: string;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() disabled = false;
    @Input() indeterminate = false;
    @Input() checked = false;
    @Input() required = false;
    @Input() hint?: string;
    @Input() checkboxClass = 'inline-flex items-start gap-2';
    @Input() cssVars?: Record<string, string | number | null>;
    // Custom validity message (empty string clears)
    @Input() validationMessage: string | null = null;

    // Outputs
    @Output() checkedChange = new EventEmitter<boolean>();
    @Output() inputEvent = new EventEmitter<Event>();
    @Output() changeEvent = new EventEmitter<Event>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    ngAfterViewInit() { this.applyCssVars(); this.syncState(); this.applyCustomValidity(); }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['checked'] || changes['indeterminate']) this.syncState();
        if (changes['validationMessage']) this.applyCustomValidity();
    }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }
    private syncState() {
        const el = this.el?.nativeElement as any;
        if (!el) return;
        if (el.checked !== this.checked) el.checked = this.checked;
        if (el.indeterminate !== this.indeterminate) el.indeterminate = this.indeterminate;
    }
    private applyCustomValidity() {
        const el = this.el?.nativeElement as any;
        if (!el) return;
        if (this.validationMessage != null) {
            el.setCustomValidity?.(this.validationMessage);
        } else {
            el.setCustomValidity?.('');
        }
    }
    onInput(e: Event) { this.syncFromEl(); this.inputEvent.emit(e); }
    onChange(e: Event) { this.syncFromEl(); this.changeEvent.emit(e); }
    private syncFromEl() {
        const el = this.el?.nativeElement as any;
        if (el) {
            const newVal = !!el.checked;
            if (newVal !== this.checked) {
                this.checked = newVal;
                this.checkedChange.emit(this.checked);
            }
        }
    }
    // Methods
    focus(opts?: FocusOptions) { (this.el?.nativeElement as any)?.focus?.(opts); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    click() { (this.el?.nativeElement as any)?.click?.(); }
    setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
}

interface WaCheckboxEl extends HTMLElement { checked: boolean; indeterminate: boolean; setCustomValidity?(m: string): void; reportValidity?(): boolean; }
