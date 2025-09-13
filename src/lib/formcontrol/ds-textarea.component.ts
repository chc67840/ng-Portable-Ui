import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, signal, HostBinding, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';
import { computeUnderlineInputClass } from '../util/underline.util';

/**
 * ds-textarea: wrapper around <wa-textarea> with unified DS API.
 * Slots: default (content), [slot=label], [slot=hint], [slot=start], [slot=end]
 * Inputs / Attributes:
 *  - value, rows, placeholder, appearance(filled|outlined), size(small|medium|large), pill, disabled, readonly, required
 *  - minlength, maxlength, autocapitalize, autocorrect, autocomplete, autocapitalize, spellcheck, wrap, name, form
 *  - resize: 'vertical'|'none' (maps to CSS style) prevent resizing when 'none'
 *  - expand (auto-grow with content), maxRows for expansion limit
 *  - hint/help, label, labelPosition, withLabelSpace/withHintSpace
 *  - cssVars (custom properties), textareaClass / wrapperClass / labelClass / hintClass
 * Events:
 *  - valueChange, inputEvent, changeEvent, focusEvent, blurEvent, invalidEvent
 * Methods: focus, blur, select, setCustomValidity, checkValidity, reportValidity
 * Custom States: host classes ds-input-invalid, ds-input-disabled
 * Dynamic Features Implemented: Rows, Placeholder, Appearance, Value sync, Prevent Resizing, Disabled, Sizes, Hint, Custom Styles, Expand with Content.
 */
@Component({
    selector: 'ds-textarea',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <label [class]="computedWrapperClass">
    <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
    <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
    <wa-textarea #el
      [class]="computedTextareaClass"
      class="block w-full"
      [attr.rows]="rows != null ? rows : null"
      [attr.placeholder]="placeholder || null"
      [attr.appearance]="appearance"
      [attr.size]="size"
      [attr.pill]="pill ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.readonly]="readonly ? '' : null"
      [attr.required]="required ? '' : null"
      [attr.minlength]="minlength ?? null"
      [attr.maxlength]="maxlength ?? null"
      [attr.name]="name || null"
      [attr.form]="form || null"
      [attr.autocomplete]="autocomplete || null"
      [attr.autocapitalize]="autocapitalize || null"
      [attr.autocorrect]="autocorrect || null"
      [attr.spellcheck]="spellcheck"
      [attr.wrap]="wrap || null"
      [attr.with-label]="withLabelSpace ? '' : null"
      [attr.with-hint]="withHintSpace ? '' : null"
      (input)="onInput($event)"
      (change)="onChange($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (invalid)="onInvalid($event)"
    >
      <ng-content select="[slot=start]"></ng-content>
      <ng-content select="[slot=end]"></ng-content>
      <ng-content select="[slot=label]"></ng-content>
      <ng-content select="[slot=hint]"></ng-content>
    </wa-textarea>
    <span *ngIf="displayHint && !hintRich" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
  </label>
  `,
    styles: [`:host{display:block}`]
})
export class DsTextareaComponent implements OnChanges {
    protected readonly tag = WA_TAGS.textarea;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: string; setCustomValidity?(m: string): void; reportValidity?(): boolean; }>;

    // Value signal
    private model = signal('');
    @Input() set value(v: string | null | undefined) { this.model.set(v ?? ''); this.setElValue(); autoExpandMicrotask(this); }
    get value(): string { return this.model(); }

    // Core inputs
    @Input() rows: number | null = 3;
    @Input() maxRows?: number; // for auto expand limit
    @Input() placeholder?: string;
    @Input() appearance: 'filled' | 'outlined' = 'outlined';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() pill = false;
    @Input() disabled = false;
    @Input() readonly = false;
    @Input() required = false;
    @Input() minlength?: number;
    @Input() maxlength?: number;
    @Input() name?: string;
    @Input() form?: string;
    @Input() autocomplete?: string;
    @Input() autocapitalize?: string;
    @Input() autocorrect?: string;
    @Input() spellcheck: boolean = true;
    @Input() wrap?: string; // soft|hard
    @Input() resize: 'vertical' | 'none' = 'vertical';
    @Input() expand = false; // auto grow with content

    // Label / hint / help
    @Input() label?: string;
    @Input() hint?: string;
    @Input() help?: string;
    @Input() hintRich = false;
    @Input() labelPosition: 'block' | 'inline' | 'srOnly' = 'block';
    @Input() withLabelSpace = false;
    @Input() withHintSpace = false;

    // Style hooks
    @Input() wrapperClass = 'block';
    @Input() labelClass?: string;
    @Input() textareaClass?: string;
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;

    // Custom validity
    @Input() validationMessage: string | null = null;

    // Host state
    private isInvalid = false;
    @HostBinding('class.ds-input-invalid') get invalidClass() { return this.isInvalid; }
    @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }

    // Outputs
    @Output() valueChange = new EventEmitter<string>();
    @Output() inputEvent = new EventEmitter<Event>();
    @Output() changeEvent = new EventEmitter<Event>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    get displayHint(): string | undefined { return this.hint ?? this.help; }
    get computedLabelClass(): string { return this.labelClass || 'text-sm font-medium text-slate-700'; }
    get computedWrapperClass(): string {
        let base = this.wrapperClass || '';
        if (this.labelPosition === 'inline') { if (!/flex /.test(base)) base += ' flex items-center gap-2'; }
        else if (this.labelPosition === 'block') { if (!/space-y-/.test(base)) base += ' space-y-1'; if (!/block/.test(base)) base += ' block'; }
        else if (this.labelPosition === 'srOnly') { if (!/block/.test(base)) base += ' block'; }
        return base.trim();
    }
    get computedTextareaClass(): string {
        let cls = computeUnderlineInputClass({ base: this.textareaClass });
        if (this.resize === 'none' && !/resize-none/.test(cls)) cls += ' resize-none';
        return cls;
    }

    ngAfterViewInit() { this.applyCssVars(); this.setElValue(); this.applyCustomValidity(); if (this.expand) this.autoExpand(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['cssVars']) this.applyCssVars();
        if (ch['validationMessage']) this.applyCustomValidity();
        if (ch['resize']) {/* class getter covers it */ }
        if (ch['expand'] && this.expand) queueMicrotask(() => this.autoExpand());
    }

    private setElValue() { if (this.el?.nativeElement) (this.el.nativeElement as any).value = this.model(); }
    private applyCssVars() {
        if (!this.cssVars || !this.el?.nativeElement) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
    }
    private applyCustomValidity() { const el = this.el?.nativeElement as any; if (!el) return; if (this.validationMessage != null) el.setCustomValidity?.(this.validationMessage); else el.setCustomValidity?.(''); }
    autoExpand() {
        if (!this.expand || !this.el?.nativeElement) return;
        const ta = this.el.nativeElement.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement | null; // assume underlying textarea
        const styleTa = ta ?? (this.el.nativeElement as any);
        if (!styleTa) return;
        styleTa.style.height = 'auto';
        styleTa.style.height = styleTa.scrollHeight + 'px';
        if (this.maxRows && ta) {
            const lineHeight = parseInt(getComputedStyle(ta).lineHeight || '0', 10) || 0;
            const maxHeight = this.maxRows * lineHeight;
            if (styleTa.scrollHeight > maxHeight) styleTa.style.height = maxHeight + 'px';
        }
    }

    // Event handlers
    onInput(e: Event) { this.syncFromEl(); this.inputEvent.emit(e); if (this.expand) this.autoExpand(); }
    onChange(e: Event) { this.syncFromEl(); this.changeEvent.emit(e); }
    onFocus(e: FocusEvent) { this.focusEvent.emit(e); }
    onBlur(e: FocusEvent) { this.blurEvent.emit(e); }
    onInvalid(e: Event) { this.isInvalid = true; this.invalidEvent.emit(e); }

    private syncFromEl() { if (this.el?.nativeElement) { const val = (this.el.nativeElement as any).value ?? ''; this.model.set(val); this.valueChange.emit(val); if (this.isInvalid) this.isInvalid = false; } }

    // Public methods
    focus() { (this.el?.nativeElement as any)?.focus?.(); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    select() { (this.el?.nativeElement as any)?.select?.(); }
    setCustomValidity(msg: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(msg); }
    checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
}

function autoExpandMicrotask(self: DsTextareaComponent) { if (self.expand) queueMicrotask(() => self.autoExpand()); }
