import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, SimpleChanges, OnChanges, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-switch: wrapper around <wa-switch> (toggle) with stable Angular API.
 * Slots:
 *  - default: label / inline content
 *  - [slot=hint]: optional hint below/aside depending on layout
 * Attributes / Inputs:
 *  - checked, disabled, size (small|medium|large), name, required, hint, onLabel, offLabel, alignment
 *  - wrapperClass, switchClass for styling + cssVars (CSS custom properties)
 * Events:
 *  - checkedChange (two-way), changeEvent, inputEvent, focusEvent, blurEvent, invalidEvent
 * CSS Custom Properties (forwarded via cssVars): e.g. --switch-track-color, --switch-thumb-color, --focus-ring-color
 * CSS Parts (vendor): track, thumb, label (accessible via ::part)
 * Methods: focus, blur, click, setCustomValidity, reportValidity
 * Custom States (host classes): ds-input-disabled, ds-switch-checked
 * Dynamic Features Implemented: Checked/Disabled/Sizes/Hint/Custom Styles (css vars & class hooks)
 */
@Component({
    selector: 'ds-switch',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <label [class]="computedWrapperClass">
      <span *ngIf="label && labelPosition !== 'srOnly'" [class]="labelClass" class="text-sm font-medium">{{ label }}</span>
      <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
      <wa-switch #el
        [class]="computedSwitchClass"
        [attr.name]="name || null"
        [attr.size]="size"
        [attr.disabled]="disabled ? '' : null"
        [attr.checked]="checked ? '' : null"
        [attr.required]="required ? '' : null"
        [attr.hint]="hint || null"
        [attr.off-label]="offLabel || null"
        (input)="onInput($event)"
        (change)="onChange($event)"
        (focus)="focusEvent.emit($event)"
        (blur)="blurEvent.emit($event)"
        (wa-invalid)="invalidEvent.emit($event)"
      >
        <ng-content></ng-content>
        <ng-content select="[slot=hint]"></ng-content>
      </wa-switch>
      <span *ngIf="hint && !hintProjected" [class]="hintClass" class="text-xs text-slate-500">{{ hint }}</span>
    </label>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsSwitchComponent implements OnChanges {
    static readonly tag = WA_TAGS.switch;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaSwitchEl>;

    // Inputs
    @Input() name?: string;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() disabled = false;
    @Input() checked = false;
    @Input() required = false;
    @Input() hint?: string;
    @Input() onLabel?: string; // underlying on-label attribute
    @Input() offLabel?: string; // underlying off-label attribute
    @Input() label?: string;
    @Input() labelPosition: 'inline' | 'block' | 'srOnly' = 'inline';
    @Input() wrapperClass = 'inline-flex items-center gap-2';
    @Input() switchClass = 'inline-flex';
    @Input() labelClass = 'text-sm font-medium text-slate-700';
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() validationMessage: string | null = null;
    @Input() hintProjected = false; // user can set true when providing custom hint slot to suppress default span

    // Host state classes
    @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-switch-checked') get checkedClass() { return this.checked; }

    // Outputs
    @Output() checkedChange = new EventEmitter<boolean>();
    @Output() inputEvent = new EventEmitter<Event>();
    @Output() changeEvent = new EventEmitter<Event>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    get computedWrapperClass(): string {
        let base = this.wrapperClass || '';
        if (this.labelPosition === 'block') {
            if (!/flex /.test(base)) base += ' flex flex-col gap-1';
        } else if (this.labelPosition === 'inline') {
            if (!/inline-flex/.test(base) && !/flex /.test(base)) base += ' inline-flex items-center gap-2';
        } else if (this.labelPosition === 'srOnly') {
            if (!/inline-flex/.test(base)) base += ' inline-flex items-center gap-2';
        }
        return base.trim();
    }
    get computedSwitchClass(): string {
        let cls = this.switchClass || '';
        if (!/cursor-/.test(cls)) cls += ' cursor-pointer';
        return cls.trim();
    }

    ngAfterViewInit() { this.applyCssVars(); this.syncState(); this.applyCustomValidity(); }
    ngOnChanges(changes: SimpleChanges) {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['checked']) this.syncState();
        if (changes['validationMessage']) this.applyCustomValidity();
        if (changes['onLabel']) this.applyOnLabel();
        if (changes['offLabel']) this.applyOffLabel();
    }

    private syncState() {
        const el = this.el?.nativeElement as any; if (!el) return; el.checked = this.checked;
    }
    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
    }
    private applyCustomValidity() {
        const el = this.el?.nativeElement as any; if (!el) return;
        if (this.validationMessage != null) el.setCustomValidity?.(this.validationMessage); else el.setCustomValidity?.('');
    }
    private applyOnLabel() {
        const el = this.el?.nativeElement as HTMLElement; if (!el) return;
        if (this.onLabel == null || this.onLabel === '') el.removeAttribute('on-label'); else el.setAttribute('on-label', this.onLabel);
    }
    private applyOffLabel() {
        const el = this.el?.nativeElement as HTMLElement; if (!el) return;
        if (this.offLabel == null || this.offLabel === '') el.removeAttribute('off-label'); else el.setAttribute('off-label', this.offLabel);
    }

    onInput(e: Event) { this.syncFromEl(); this.inputEvent.emit(e); }
    onChange(e: Event) { this.syncFromEl(); this.changeEvent.emit(e); }
    private syncFromEl() { const el = this.el?.nativeElement as any; if (el) { this.checked = !!el.checked; this.checkedChange.emit(this.checked); } }

    // Methods
    focus(opts?: FocusOptions) { (this.el?.nativeElement as any)?.focus?.(opts); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    click() { (this.el?.nativeElement as any)?.click?.(); }
    setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
}

interface WaSwitchEl extends HTMLElement { checked: boolean; setCustomValidity?(m: string): void; reportValidity?(): boolean; }
