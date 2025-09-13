import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, signal, HostBinding, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsThemeService } from '../ds-theme.service';
import { computeUnderlineInputClass } from '../util/underline.util';

/**
 * ds-date: wrapper around <wa-input type="date"> emitting ISO (YYYY-MM-DD) strings.
 * Standardized API: value/valueChange, focus/blur/invalid events, common form attrs.
 */
@Component({
  selector: 'ds-date',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <label [class]="computedWrapperClass">
    <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
    <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
    <wa-input #el
      type="date"
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
export class DsDateComponent {
  private theme = inject(DsThemeService);
  @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: string }>;
  // Value signal
  private internal = signal<string>('');
  @Input() set value(v: string | null | undefined) { this.internal.set(v ?? ''); }
  get value(): string { return this.internal(); }
  valueSignal = this.internal.asReadonly();

  // Common form inputs
  @Input() label?: string;
  @Input() hint?: string;
  @Input() name?: string;
  @Input() placeholder?: string;
  @Input() min?: string; // YYYY-MM-DD
  @Input() max?: string; // YYYY-MM-DD
  @Input() step?: string; // days step
  @Input() required = false;
  @Input() disabled = false;
  @Input() autocomplete?: string;
  @Input() form?: string;

  // Style customization hooks (can be combined with global theme classes)
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
  get computedInputClass(): string { return computeUnderlineInputClass({ base: this.inputClass || this.theme.controlInputUnderlineFilled() }); }

  // Outputs
  @Output() valueChange = new EventEmitter<string | null>();
  @Output() changeEvent = new EventEmitter<string | null>();
  @Output() clearEvent = new EventEmitter<void>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() invalidEvent = new EventEmitter<Event>();

  private read(): string { return (this.el.nativeElement as any).value || ''; }

  onInput(_e: Event) {
    const val = this.read();
    this.internal.set(val);
    this.valueChange.emit(val || null);
  }
  onChange(_e: Event) {
    const val = this.read();
    this.internal.set(val);
    this.changeEvent.emit(val || null);
  }
  onClear(_e: Event) {
    this.internal.set('');
    this.valueChange.emit(null);
    this.clearEvent.emit();
  }
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
}
