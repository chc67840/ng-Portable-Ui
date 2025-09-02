import { Component, Input, Output, EventEmitter, signal, computed, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsThemeService } from '../ds-theme.service';

/**
 * ds-number: Numeric input wrapper around <wa-input type="number"> providing:
 *  - min / max clamping
 *  - step (advisory)
 *  - precision rounding
 *  - emits number | null through valueChange
 *  - optional removal of spin buttons (withoutSpinButtons)
 * Styling/Theming: override wrapperClass/labelClass/inputClass/hintClass.
 */
@Component({
    selector: 'ds-number',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <label [class]="computedWrapperClass">
        <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
        <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
        <wa-input #el
            type="number"
            [class]="computedInputClass"
            class="block w-full"
            [attr.name]="name || null"
            [attr.placeholder]="placeholder || null"
            [attr.min]="min != null ? min : null"
            [attr.max]="max != null ? max : null"
            [attr.step]="step != null ? step : null"
            [attr.required]="required ? '' : null"
            [attr.disabled]="disabled ? '' : null"
            [attr.form]="form || null"
            [attr.autocomplete]="autocomplete || null"
            [attr.with-label]="withLabelSpace ? '' : null"
            [attr.with-hint]="withHintSpace ? '' : null"
            [attr.without-spin-buttons]="withoutSpinButtons ? '' : null"
            [value]="displayString()"
            (input)="onInput($event)"
            (change)="onCommit($event)"
            (wa-clear)="onClear($event)"
            (focus)="onFocus($event)"
            (blur)="onBlur($event)"
            (invalid)="onInvalid($event)"
        ></wa-input>
        <span *ngIf="hint" [class]="hintClass" class="text-xs text-slate-500">{{ hint }}</span>
    </label>
  `,
    styles: [`:host{display:block}`]
})
export class DsNumberComponent {
    private theme = inject(DsThemeService);
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: string }>; // approximate typing

    // Public API
    @Input() set value(v: number | null | undefined) {
        if (v == null || Number.isNaN(v)) {
            this._number.set(null);
            this.raw.set('');
            return;
        }
        const clamped = this.clamp(v);
        const rounded = this.applyPrecision(clamped);
        this._number.set(rounded);
        this.raw.set(String(rounded));
    }
    get value(): number | null { return this._number(); }

    @Input() min?: number;
    @Input() max?: number;
    @Input() step: number = 1;
    @Input() precision?: number; // decimal places to round on emit/commit
    @Input() withoutSpinButtons = false;
    @Input() label?: string;
    @Input() placeholder?: string;
    @Input() hint?: string;
    @Input() enforceOnInput = true; // if true clamp/round as user types; else only on blur/change
    @Input() name?: string;
    @Input() required = false;
    @Input() disabled = false;
    @Input() form?: string;
    @Input() autocomplete?: string;

    // Style hooks
    @Input() wrapperClass = 'block';
    @Input() labelClass?: string;
    @Input() inputClass?: string;
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() labelPosition: 'block' | 'inline' | 'srOnly' = 'block';
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() withLabelSpace = false;
    @Input() withHintSpace = false;
    @HostBinding('class.ds-input-invalid') get invalidClass() { return this.isInvalid; }
    @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }
    private isInvalid = false;

    get computedLabelClass(): string { return this.labelClass || this.theme.controlLabel(); }
    get computedWrapperClass(): string {
        let base = this.wrapperClass || '';
        if (this.labelPosition === 'inline') {
            if (!/flex /.test(base)) base += ' flex items-center gap-2';
        } else if (this.labelPosition === 'block') {
            if (!/space-y-/.test(base)) base += ' space-y-1';
            if (!/block/.test(base)) base += ' block';
        } else if (this.labelPosition === 'srOnly') {
            if (!/block/.test(base)) base += ' block';
        }
        return base.trim();
    }
    get computedInputClass(): string {
        const underline = this.theme.controlInputUnderlineFilled();
        let cls = this.inputClass || underline;
        cls = cls
            .replace(/\bborder(?!-b)\b[^ ]*/g, '')
            .replace(/border-l[^ ]*/g, '')
            .replace(/border-r[^ ]*/g, '')
            .replace(/border-t[^ ]*/g, '')
            .replace(/rounded[^ ]*/g, '');
        if (!/border-b/.test(cls)) cls += ' border-b';
        cls += ' border-b-[1px]';
        if (!/bg-/.test(cls)) cls += ' bg-slate-100/70';
        if (!/focus:border-/.test(cls)) cls += ' focus:border-slate-500';
        if (!/focus:outline-/.test(cls)) cls += ' focus:outline-none';
        if (!/focus:ring/.test(cls)) cls += ' focus:ring-0';
        return cls.trim().replace(/\s+/g, ' ');
    }

    @Output() valueChange = new EventEmitter<number | null>();
    @Output() inputEvent = new EventEmitter<number | null>(); // fires on every input
    @Output() changeEvent = new EventEmitter<number | null>(); // fires on commit (change)
    @Output() clearEvent = new EventEmitter<void>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    // Internal state
    private raw = signal(''); // raw string in the element
    private _number = signal<number | null>(null);

    // Derived display (placeholder for future thousand separator formatting when not focused)
    displayString = computed(() => this.raw());

    // Event handlers
    onInput(_e: Event) {
        const str = (this.el.nativeElement as any).value as string;
        this.raw.set(str);
        const parsed = this.parse(str);
        if (parsed == null) {
            this._number.set(null);
            this.inputEvent.emit(null);
            this.valueChange.emit(null);
            this.resetInvalidIfNeeded();
            return;
        }
        const processed = this.enforceOnInput ? this.applyPrecision(this.clamp(parsed)) : parsed;
        this._number.set(processed);
        this.valueChange.emit(processed);
        this.inputEvent.emit(processed);
        this.resetInvalidIfNeeded();
    }

    onCommit(_e: Event) {
        const parsed = this.parse(this.raw());
        const finalVal = parsed == null ? null : this.applyPrecision(this.clamp(parsed));
        if (finalVal == null) {
            this._number.set(null);
            this.raw.set('');
        } else {
            this._number.set(finalVal);
            this.raw.set(String(finalVal));
        }
        this.valueChange.emit(finalVal);
        this.changeEvent.emit(finalVal);
        this.resetInvalidIfNeeded();
    }

    onClear(_e: Event) {
        this.raw.set('');
        this._number.set(null);
        this.valueChange.emit(null);
        this.clearEvent.emit();
        this.resetInvalidIfNeeded();
    }

    onFocus(e: FocusEvent) { this.focusEvent.emit(e); }
    onBlur(e: FocusEvent) { this.blurEvent.emit(e); }
    onInvalid(e: Event) { this.isInvalid = true; this.invalidEvent.emit(e); }

    // Utilities
    private parse(str: string): number | null {
        if (!str || !str.trim()) return null;
        // Remove common thousands separators (space, comma) except last decimal point or comma
        let cleaned = str.trim();
        // Accept both . and , but if both present, treat last occurrence as decimal
        const lastDot = cleaned.lastIndexOf('.');
        const lastComma = cleaned.lastIndexOf(',');
        if (lastComma > -1 && lastDot === -1) {
            // Use comma as decimal
            cleaned = cleaned.replace(/\./g, ''); // remove stray dots
            cleaned = cleaned.replace(/,/g, '.');
        } else if (lastDot > -1 && lastComma > -1) {
            // If both, remove thousands separators (commas) keep dot as decimal
            cleaned = cleaned.replace(/,/g, '');
        }
        // Remove spaces/underscores as grouping
        cleaned = cleaned.replace(/[\s_]/g, '');
        const num = Number(cleaned);
        return Number.isFinite(num) ? num : null;
    }

    private clamp(v: number): number {
        if (this.min != null && v < this.min) v = this.min;
        if (this.max != null && v > this.max) v = this.max;
        return v;
    }

    private applyPrecision(v: number): number {
        if (this.precision == null) return v;
        const m = Math.pow(10, this.precision);
        return Math.round(v * m) / m;
    }

    // Public API
    focus() { (this.el?.nativeElement as any)?.focus?.(); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
    setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
    applyCssVars() {
        if (!this.cssVars || !this.el?.nativeElement) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }
    private resetInvalidIfNeeded() { if (this.isInvalid) this.isInvalid = false; }
    ngAfterViewInit() { this.applyCssVars(); }
}
