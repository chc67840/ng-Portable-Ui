import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, SimpleChanges, OnChanges, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-radio-group: wrapper over <wa-radio-group> managing a set of <wa-radio> options.
 * Slots:
 *  - default: projected <wa-radio> elements or arbitrary content
 *  - [slot=hint]: custom hint content (alternative to hint input)
 * Inputs / Attributes:
 *  - value (selected value), name, orientation (horizontal|vertical), size (small|medium|large), disabled, required
 *  - options: array to auto-render radios (each {label,value,disabled?})
 *  - hint (string) or projected hint slot, validationMessage, cssVars (custom properties), groupClass, radioClass
 * Events:
 *  - valueChange (two-way), changeEvent, inputEvent, focusEvent, blurEvent, invalidEvent
 * Methods:
 *  - focus(), blur(), checkValidity(), reportValidity(), setCustomValidity()
 * CSS Custom Properties: forwarded via cssVars map (e.g., --gap, --radio-color, --focus-ring-color, etc.)
 * CSS Parts (vendor): base, radio, label (accessible via ::part())
 * Custom States: host classes ds-input-disabled, ds-radio-invalid
 * Dynamic Features: hint, radio buttons (auto + projected), disabling, orientation, sizes, custom styles, validation + custom validity.
 */
@Component({
    selector: 'ds-radio-group',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <fieldset [class]="computedWrapperClass" [attr.disabled]="disabled? '' : null">
      <legend *ngIf="label && labelPosition !== 'srOnly'" [class]="labelClass" class="text-sm font-medium">{{ label }}</legend>
      <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
      <wa-radio-group #el
        [class]="groupClass"
        [attr.name]="name || null"
        [attr.value]="internalValue"
        [attr.orientation]="orientation"
        [attr.size]="size"
        [attr.required]="required ? '' : null"
        [attr.disabled]="disabled ? '' : null"
        (change)="onChange($event)"
        (input)="onInput($event)"
        (focus)="focusEvent.emit($event)"
        (blur)="blurEvent.emit($event)"
        (wa-invalid)="invalidEvent.emit($event)"
      >
        <!-- Projected radios -->
        <ng-content></ng-content>
        <!-- Auto rendered radios from options array -->
        <ng-container *ngIf="options?.length">
          <wa-radio *ngFor="let opt of options"
            [attr.value]="opt.value"
            [attr.disabled]="opt.disabled ? '' : null"
            [class]="radioClass"
            [attr.checked]="opt.value === internalValue ? '' : null"
          >{{ opt.label }}</wa-radio>
        </ng-container>
        <ng-content select="[slot=hint]"></ng-content>
      </wa-radio-group>
      <span *ngIf="hint && !hintProjected" [class]="hintClass" class="text-xs text-slate-500">{{ hint }}</span>
    </fieldset>
  `,
    styles: [`:host{display:block}`]
})
export class DsRadioGroupComponent implements OnChanges {
    static readonly tag = WA_TAGS.radioGroup;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaRadioGroupEl>;

    // VALUE
    @Input() set value(v: string | null | undefined) { this.internalValue = v ?? ''; }
    get value(): string | null { return this.internalValue || null; }
    internalValue = '';

    // OPTIONS
    @Input() options?: { label: string; value: string; disabled?: boolean }[];

    // CORE INPUTS
    @Input() name?: string;
    @Input() label?: string;
    @Input() labelPosition: 'block' | 'srOnly' = 'block';
    @Input() hint?: string;
    @Input() hintProjected = false;
    @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() disabled = false;
    @Input() required = false;
    @Input() groupClass = 'flex flex-col gap-2';
    @Input() radioClass = 'inline-flex items-center gap-2';
    @Input() wrapperClass = 'space-y-1';
    @Input() labelClass = 'text-sm font-medium text-slate-700';
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() validationMessage: string | null = null;

    // HOST STATE CLASSES
    @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-radio-invalid') get invalidClass() { return this.isInvalid; }
    private isInvalid = false;

    // OUTPUTS
    @Output() valueChange = new EventEmitter<string | null>();
    @Output() changeEvent = new EventEmitter<Event>();
    @Output() inputEvent = new EventEmitter<Event>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    get computedWrapperClass(): string {
        let base = this.wrapperClass || '';
        if (this.labelPosition === 'block') {
            if (!/space-y-/.test(base)) base += ' space-y-1';
        }
        return base.trim();
    }

    ngAfterViewInit() { this.applyCssVars(); this.syncState(); this.applyCustomValidity(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['cssVars']) this.applyCssVars();
        if (ch['value']) this.syncState();
        if (ch['disabled']) this.syncDisabled();
        if (ch['validationMessage']) this.applyCustomValidity();
    }

    private applyCssVars() {
        if (!this.cssVars || !this.el?.nativeElement) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
    }
    private syncState() { const el = this.el?.nativeElement as any; if (el) el.value = this.internalValue; }
    private syncDisabled() { const el = this.el?.nativeElement as any; if (el) el.disabled = this.disabled; }
    private applyCustomValidity() {
        const el = this.el?.nativeElement as any; if (!el) return;
        if (this.validationMessage != null) el.setCustomValidity?.(this.validationMessage); else el.setCustomValidity?.('');
    }

    onInput(e: Event) { this.readValue(); this.inputEvent.emit(e); }
    onChange(e: Event) { this.readValue(); this.changeEvent.emit(e); }
    private readValue() {
        const el = this.el?.nativeElement as any; if (!el) return;
        this.internalValue = el.value || '';
        this.valueChange.emit(this.value);
        if (this.isInvalid) this.isInvalid = false;
    }

    // METHODS
    focus() { (this.el?.nativeElement as any)?.focus?.(); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
    setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
}

interface WaRadioGroupEl extends HTMLElement { value: string; disabled: boolean; setCustomValidity?(m: string): void; reportValidity?(): boolean; }
