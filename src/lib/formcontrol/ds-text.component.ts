import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, EventEmitter, HostBinding, inject, Input, Output, signal, ViewChild } from '@angular/core';
// Old DsThemeService removed – now using ThemeEngineService component tokens
import { ThemeEngineService } from '../theme/theme-engine.service';
import { computeUnderlineInputClass } from '../util/underline.util';
import { WA_TAGS } from '../wa-registry';

// Thin wrapper over <wa-input>. Provides stable Angular Input/Output API.
// IMPORTANT: We rely on CUSTOM_ELEMENTS_SCHEMA globally (standalone build supports custom elements).
// Extended: label positioning, css vars, state classes, richer features doc.

@Component({
  selector: 'ds-text',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <!-- Wrapper label for accessible grouping -->
    <label [class]="computedWrapperClass">
      <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
      <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
      <wa-input #el
        [class]="computedInputClass"
        class="block w-full"
        [attr.type]="type"
        [attr.size]="size"
        [attr.appearance]="appearance"
        [attr.pill]="pill ? '' : null"
  [attr.title]="titleAttr || null"
        [attr.name]="name || null"
        [attr.placeholder]="placeholder || null"

        [attr.with-clear]="withClear ? '' : null"
        [attr.readonly]="readonly ? '' : null"
        [attr.password-toggle]="passwordToggle ? '' : null"
        [attr.password-visible]="passwordVisible ? '' : null"
  [attr.required]="required ? '' : null"
        [attr.pattern]="pattern || null"
        [attr.minlength]="minlength ?? null"
  [attr.maxlength]="maxlength ?? null"
  [attr.inputmode]="resolvedInputmode || null"
        [attr.enterkeyhint]="enterkeyhint || null"
  [attr.autocapitalize]="autocapitalize || null"
  [attr.autocorrect]="autocorrect || null"
  [attr.autocomplete]="autocomplete || null"
  [attr.autofocus]="autofocus ? '' : null"
  [attr.form]="form || null"
  [attr.spellcheck]="spellcheck"
  [attr.disabled]="disabled ? '' : null"
  [attr.with-label]="withLabelSpace ? '' : null"
  [attr.with-hint]="withHintSpace ? '' : null"
        [attr.density]="density || null"
        [value]="model()"
        (input)="onInput($event)"
        (change)="onChange($event)"
        (wa-clear)="onWaClear($event)"
        (invalid)="onInvalid($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
      >
        <!-- Projected slots -->
        <ng-content select="[slot=start]"></ng-content>
        <ng-content select="[slot=end]"></ng-content>
        <ng-content select="[slot=label]"></ng-content>
        <ng-content select="[slot=hint]"></ng-content>
      </wa-input>
  <span *ngIf="displayHint && !hintRich" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
    </label>
  `,
  styles: [``]
})
export class DsTextComponent implements AfterViewInit {
  private engine = inject(ThemeEngineService);
  protected readonly tag = WA_TAGS.input;

  @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: string; }>; // broaden typing

  // Internal value signal + external binding
  model = signal('');
  @Input() set value(v: string | undefined | null) { this.model.set(v ?? ''); }
  get value(): string { return this.model(); }

  // Core text API
  // Text-ish types only; numeric/date/time types handled by future specialized components
  @Input() type: 'text' | 'search' | 'email' | 'url' | 'password' | 'tel' = 'text';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() appearance: 'filled' | 'outlined' = 'outlined';
  @Input() pill = false;
  @Input() titleAttr?: string; // maps to 'title'
  @Input() label?: string; // (Our wrapper label element; component label slot available separately)
  @Input() hint?: string;  // plain string hint; rich hints could be projected later
  @Input() help?: string;  // alias for hint (legacy naming)
  @Input() hintRich = false; // future toggle if we add an ng-content for rich hint
  @Input() name?: string;
  @Input() withClear = false;
  @Input() placeholder?: string;
  @Input() readonly = false;
  @Input() passwordToggle = false;
  @Input() passwordVisible = false;
  @Input() required = false;
  @Input() pattern?: string;
  @Input() minlength?: number;
  @Input() maxlength?: number;
  @Input() inputmode?: string;
  @Input() enterkeyhint?: string;
  @Input() density?: 'comfortable' | 'compact' | string;
  @Input() autocapitalize?: string;
  @Input() autocorrect?: string;
  @Input() autocomplete?: string;
  @Input() autofocus = false;
  @Input() form?: string;
  @Input() spellcheck: boolean = true;
  @Input() disabled = false;
  @Input() withLabelSpace = false; // reserves internal label slot space
  @Input() withHintSpace = false;  // reserves internal hint slot space

  // Style hooks
  @Input() wrapperClass = 'block';
  @Input() labelClass?: string;
  @Input() inputClass?: string;
  @Input() hintClass = 'text-xs text-slate-500';
  @Input() labelPosition: 'block' | 'inline' | 'srOnly' = 'block';
  @Input() cssVars?: Record<string, string | number | null>;
  @HostBinding('class.ds-input-invalid') get invalidClass() { return this.isInvalid; }
  @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }
  private isInvalid = false;

  get displayHint(): string | undefined { return this.hint ?? this.help; }
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
  // Constraint behavior flags
  @Input() enforceMaxlength = true;   // trim text values that exceed maxlength

  // Placeholder flags for future slot detection (start/end). Could be replaced by ContentChildren queries.
  @Input() startTpl?: boolean;
  @Input() endTpl?: boolean;

  // Outputs
  @Output() valueChange = new EventEmitter<string>(); // unified value change (typing or commit)
  @Output() inputEvent = new EventEmitter<Event>();   // raw native 'input'
  @Output() changeEvent = new EventEmitter<Event>();  // raw native 'change'
  @Output() clearEvent = new EventEmitter<Event>();   // raw wa-clear event
  @Output() invalidEvent = new EventEmitter<Event>(); // raw wa-invalid event
  @Output() focusEvent = new EventEmitter<FocusEvent>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();

  // Event handlers mapping native + custom events to neutral API
  onInput(e: Event) { this.syncFromElement(); this.inputEvent.emit(e); }
  onChange(e: Event) { this.syncFromElement(); this.changeEvent.emit(e); }
  onWaClear(e: Event) { this.syncFromElement(); this.clearEvent.emit(e); }
  onInvalid(e: Event) { this.isInvalid = true; this.invalidEvent.emit(e); }
  onFocus(e: FocusEvent) { this.focusEvent.emit(e); }
  onBlur(e: FocusEvent) { this.blurEvent.emit(e); }

  private syncFromElement() {
    if (this.el?.nativeElement) {
      let val = (this.el.nativeElement as any).value ?? '';
      // Enforce maxlength for text-like inputs
      if (this.enforceMaxlength && typeof val === 'string' && this.maxlength != null && val.length > this.maxlength) {
        val = val.slice(0, this.maxlength);
        (this.el.nativeElement as any).value = val; // reflect trimmed value back
      }
      this.model.set(val);
      this.valueChange.emit(val);
      if (this.isInvalid) this.isInvalid = false;
    }
  }

  // Public method proxies (call underlying element methods if present)
  focus() { (this.el?.nativeElement as any)?.focus?.(); }
  blur() { (this.el?.nativeElement as any)?.blur?.(); }
  select() { (this.el?.nativeElement as any)?.select?.(); }
  checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
  reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }

  // Derived values
  get resolvedInputmode(): string | undefined {
    if (this.inputmode) return this.inputmode;
    if (this.type === 'tel') return 'tel';
    return undefined;
  }
  setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
  applyCssVars() {
    if (!this.cssVars || !this.el?.nativeElement) return;
    const style = (this.el.nativeElement as HTMLElement).style;
    for (const [k, v] of Object.entries(this.cssVars)) {
      if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
    }
  }
  ngAfterViewInit() { this.applyCssVars(); }

  private applyThemeVars() {
    const t = this.engine.active() as any;
    const tokens = t.components.input as any;
    const variant = this.appearance === 'filled' ? tokens.variants.filled : tokens.variants.outline;
    const vars: Record<string, string> = {
      '--ds-input-height': tokens.height[this.size === 'small' ? 'sm' : this.size === 'large' ? 'lg' : 'md'],
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
