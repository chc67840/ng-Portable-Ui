import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-button: stable Angular wrapper for <wa-button>.
 * Mirrors core attributes/properties, exposes slots, events, and class hooks.
 */
@Component({
    selector: 'ds-button',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-button #el
      [class]="computedClass"
      [attr.variant]="variant"
      [attr.appearance]="appearance"
      [attr.size]="size"
      [attr.with-caret]="withCaret ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.loading]="loading ? '' : null"
      [attr.pill]="pill ? '' : null"
      [attr.type]="type"
      [attr.name]="name || null"
      [attr.value]="valueAttr || null"
      [attr.href]="href || null"
      [attr.target]="target || null"
      [attr.rel]="rel || null"
      [attr.download]="download || null"
      [attr.form]="form || null"
      [attr.formaction]="formAction || null"
      [attr.formenctype]="formEnctype || null"
      [attr.formmethod]="formMethod || null"
      [attr.formnovalidate]="formNoValidate ? '' : null"
      [attr.formtarget]="formTarget || null"
      (focus)="focusEvent.emit($event)"
      (blur)="blurEvent.emit($event)"
      (wa-invalid)="invalidEvent.emit($event)"
    >
      <ng-content select="[slot=start]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[slot=end]"></ng-content>
    </wa-button>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsButtonComponent {
    static readonly tag = WA_TAGS.button;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { disabled?: boolean; click(): void; focus(o?: FocusOptions): void; blur(): void }>; // broaden

    // Core appearance
    @Input() variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' = 'neutral';
    @Input() appearance: 'accent' | 'filled' | 'outlined' | 'plain' = 'filled';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() withCaret = false;
    @Input() disabled = false;
    @Input() loading = false;
    @Input() pill = false;

    // Form/link behavior
    @Input() type: 'button' | 'submit' | 'reset' = 'button';
    @Input() name?: string;
    @Input() valueAttr?: string; // 'value' attribute (avoid TS naming collision with Angular's value semantics)
    @Input() href?: string;
    @Input() target?: '_blank' | '_parent' | '_self' | '_top';
    @Input() rel?: string;
    @Input() download?: string;
    @Input() form?: string | null;
    @Input() formAction?: string;
    @Input() formEnctype?: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    @Input() formMethod?: 'post' | 'get';
    @Input() formNoValidate = false;
    @Input() formTarget?: '_self' | '_blank' | '_parent' | '_top' | string;

    // Style hook
    @Input() buttonClass?: string;
    @Input() ensureBaseStyles = true; // auto-add minimal utilities when missing

    get computedClass(): string {
        let cls = this.buttonClass || 'inline-flex items-center justify-center gap-2 font-medium';
        if (this.ensureBaseStyles) {
            if (!/rounded/.test(cls)) cls += ' rounded-md';
            if (!/px-/.test(cls)) cls += ' px-4';
            if (!/py-/.test(cls)) cls += ' py-2';
            if (!/focus:outline-/.test(cls)) cls += ' focus:outline-none';
            if (!/focus:ring/.test(cls)) cls += ' focus:ring-2 focus:ring-slate-400/50';
            if (!/disabled:opacity-/.test(cls)) cls += ' disabled:opacity-50 disabled:cursor-not-allowed';
        }
        return cls.trim();
    }

    // Events
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() invalidEvent = new EventEmitter<Event>();

    // Methods
    click() { this.el?.nativeElement?.click(); }
    focus(options?: FocusOptions) { this.el?.nativeElement?.focus(options); }
    blur() { this.el?.nativeElement?.blur(); }
}
