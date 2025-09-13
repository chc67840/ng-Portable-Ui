import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, EventEmitter, HostBinding, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { ThemeEngineService } from '../theme/theme-engine.service';
import { computeUnderlineInputClass } from '../util/underline.util';

/**
 * ds-datetime: wrapper around <wa-input type="datetime-local"> emits ISO 8601 local date-time string without timezone.
 * Standardized API & theming hooks.
 */
@Component({
  selector: 'ds-datetime',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <label [class]="computedWrapperClass">
    <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
    <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
    <wa-input #el
      type="datetime-local"
      [class]="computedInputClass"
      class="block w-full"
      [attr.name]="name || null"
      [attr.placeholder]="placeholder || null"
      [attr.min]="min || null"
      [attr.max]="max || null"
      [attr.step]="step || null"
      [attr.required]="required ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.autocomplete]="autocomplete || null"
      [attr.form]="form || null"
      [attr.with-label]="withLabelSpace ? '' : null"
      [attr.with-hint]="withHintSpace ? '' : null"
      [value]="valueSignal()"
      (input)="onInput($event)"
      (change)="onChange($event)"
      (wa-clear)="onClear($event)"
      (focus)="onFocus($event)"
      (blur)="onBlur($event)"
      (invalid)="onInvalid($event)"
    ></wa-input>
    <span *ngIf="hint" [class]="hintClass" class="text-xs text-slate-500">{{ hint }}</span>
  </label>
  `
})
export class DsDateTimeComponent implements AfterViewInit {
  private engine = inject(ThemeEngineService);
  @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: string; }>;
  private internal = signal<string>('');
  @Input() set value(v: string | null | undefined) { this.internal.set(v ?? ''); }
  get value(): string { return this.internal(); }
  valueSignal = this.internal.asReadonly();

  @Input() label?: string;
  @Input() hint?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() min?: string; // YYYY-MM-DDTHH:mm(:ss)
  @Input() max?: string;
  @Input() step?: string; // seconds step
  @Input() required = false;
  @Input() disabled = false;
  @Input() autocomplete?: string;
  @Input() form?: string;

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
  get computedLabelClass(): string { return this.labelClass || 'text-[var(--ds-color-text-secondary)]'; }
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
    const baseDefault = 'transition-colors outline-none disabled:cursor-not-allowed';
    return computeUnderlineInputClass({ base: this.inputClass || baseDefault });
  }

  @Output() valueChange = new EventEmitter<string | null>();
  @Output() changeEvent = new EventEmitter<string | null>();
  @Output() clearEvent = new EventEmitter<void>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() invalidEvent = new EventEmitter<Event>();

  private read(): string { return (this.el.nativeElement as any).value || ''; }
  onInput(_e: Event) { const v = this.read(); this.internal.set(v); this.valueChange.emit(v || null); }
  onChange(_e: Event) { const v = this.read(); this.internal.set(v); this.changeEvent.emit(v || null); }
  onClear(_e: Event) { this.internal.set(''); this.valueChange.emit(null); this.clearEvent.emit(); }
  onFocus(e: FocusEvent) { this.focusEvent.emit(e); }
  onBlur(e: FocusEvent) { this.blurEvent.emit(e); }
  onInvalid(e: Event) { this.isInvalid = true; this.invalidEvent.emit(e); }
  checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
  reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
  setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
  applyCssVars() {
    if (!this.cssVars || !this.el?.nativeElement) return;
    const style = (this.el.nativeElement as HTMLElement).style;
    for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
  }
  ngAfterViewInit() { this.applyCssVars(); }
  private applyThemeVars() {
    const t = this.engine.active() as any;
    const tokens = t.components.input as any;
    const variant = tokens.variants.filled;
    const vars: Record<string, string> = {
      '--ds-input-height': tokens.height['md'],
      '--ds-input-radius': `var(--ds-radius-${tokens.radius})`,
      '--ds-input-padding-x': tokens.paddingX,
      '--ds-input-padding-y': tokens.paddingY,
      '--ds-input-font-size': tokens.fontSize,
      '--ds-input-line-height': tokens.lineHeight,
      '--ds-input-font-weight': tokens.weight,
      '--ds-input-bg': variant.bg,
      '--ds-input-fg': variant.fg,
      '--ds-input-border': variant.border || 'transparent',
      '--ds-input-ring': variant.ring || 'transparent',
      '--ds-input-hover-bg': (variant as any).hoverBg || variant.bg,
      '--ds-input-focus-bg': (variant as any).focusBg || variant.bg,
      '--ds-input-placeholder': (variant as any).placeholder || 'currentColor'
    };
    this.cssVars = { ...(this.cssVars || {}), ...vars };
    this.applyCssVars();
  }
  private _themeEff = effect(() => { this.applyThemeVars(); });
}
