import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, signal, computed, HostBinding, inject, TemplateRef, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';
import { DsThemeService } from '../ds-theme.service';
import { computeUnderlineInputClass } from '../util/underline.util';

/**
 * ds-select: Angular wrapper around <wa-select>.
 * Goals:
 *  - Stable Inputs/Outputs mirroring design system API (independent of vendor naming drift)
 *  - Provide ergonomic bindings for options (array Input) or projected <wa-option>/<ds-option>
 *  - Support advanced dynamic features: label positioning, hints, clearable, multiple, pill, appearance, sizes, placement, groups, lazy loading, custom tag creation, start/end decorations.
 *  - Expose methods & validity APIs; manage CSS custom properties via cssVars Input.
 *  - Add host state classes (invalid/disabled/open) for styling integration.
 *
 * Dynamic Features Implemented:
 *  - Labels: label/labelPosition + optional reserved space flags
 *  - Hint / Placeholder
 *  - Clearable: withClear
 *  - Appearance: appearance (filled|outlined) & pill
 *  - Disabled / Multiple / Required
 *  - Setting Initial Values: value (string | string[])
 *  - Grouping Options: options input supports groups { label, options: [...] }
 *  - Sizes: size (small|medium|large)
 *  - Placement: placement (top|bottom|auto|... forwarded)
 *  - Start & End Decorations: content projection slots [slot=start],[slot=end]
 *  - Custom Tags: allowCreate + createSeparator
 *  - Lazy loading options: lazyLoad (callback) and (wa-lazy-load) event bridging
 *  - CSS Vars: cssVars Input applied after view init & on changes
 *  - Methods: focus(), blur(), show(), hide(), checkValidity(), reportValidity(), setCustomValidity()
 */
@Component({
    selector: 'ds-select',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <label [class]="computedWrapperClass">
      <span *ngIf="label && labelPosition !== 'srOnly'" [class]="computedLabelClass" class="text-sm font-medium">{{ label }}</span>
      <span *ngIf="label && labelPosition === 'srOnly'" class="sr-only">{{ label }}</span>
      <wa-select #el
        [class]="computedInputClass"
        class="block w-full"
        [attr.name]="name || null"
        [attr.placeholder]="placeholder || null"
        [attr.clearable]="withClear ? '' : null"
        [attr.disabled]="disabled ? '' : null"
        [attr.required]="required ? '' : null"
        [attr.multiple]="multiple ? '' : null"
        [attr.pill]="pill ? '' : null"
        [attr.size]="size"
        [attr.appearance]="appearance"
        [attr.placement]="placement || null"
        [attr.hoist]="hoist ? '' : null"
        [attr.max-options-visible]="maxOptionsVisible != null ? maxOptionsVisible : null"
        [attr.help-text]="helpText || null"
        [attr.clear-icon]="clearIcon || null"
        [attr.check-icon]="checkIcon || null"
        [attr.expand-icon]="expandIcon || null"
        [attr.loading]="loading ? '' : null"
        [attr.loading-text]="loadingText || null"
        [attr.no-results-text]="noResultsText || null"
  [attr.value]="isMultiple() ? null : (singleValue() || '')"
        [attr.with-label]="withLabelSpace ? '' : null"
        [attr.with-hint]="withHintSpace ? '' : null"
        [attr.filterable]="filterable ? '' : null"
        [attr.clear-on-select]="clearOnSelect ? '' : null"
        [attr.stay-open-on-select]="stayOpenOnSelect ? '' : null"
        [attr.allow-create]="allowCreate ? '' : null"
        [attr.create-separator]="createSeparator || null"
        (wa-change)="onWaChange($event)"
        (change)="onNativeChange($event)"
        (wa-clear)="onWaClear($event)"
        (input)="onInput($event)"
        (focus)="onFocus($event)"
        (blur)="onBlur($event)"
        (invalid)="onInvalid($event)"
        (wa-show)="onShow($event)"
        (wa-after-show)="afterShowEvent.emit($event)"
        (wa-hide)="onHide($event)"
        (wa-after-hide)="afterHideEvent.emit($event)"
        (wa-lazy-load)="onLazyLoad($event)"
      >
        <!-- Start/End decoration slots -->
        <ng-content select="[slot=start]"></ng-content>
        <ng-content select="[slot=end]"></ng-content>
        <!-- Projected options/groups if user supplies them -->
        <ng-content></ng-content>
        <!-- Generated options from options Input when provided -->
        <ng-container *ngIf="options?.length">
          <ng-container *ngFor="let opt of options">
            <wa-option *ngIf="!isGroup(opt)" [value]="opt.value" [disabled]="opt.disabled ? '' : null">{{ opt.label }}</wa-option>
            <ng-container *ngIf="isGroup(opt)">
              <wa-option disabled class="font-semibold opacity-70 cursor-default select-none">{{ opt.label }}</wa-option>
              <wa-option *ngFor="let child of opt.options" [value]="child.value" [disabled]="child.disabled ? '' : null">{{ child.label }}</wa-option>
            </ng-container>
          </ng-container>
        </ng-container>
      </wa-select>
      <span *ngIf="displayHint" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
    </label>
  `,
    styles: [``]
})
export class DsSelectComponent implements AfterContentInit {
    protected readonly tag = WA_TAGS.select;
    private theme = inject(DsThemeService);

    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { value: any }>; // underlying element ref

    // VALUE MANAGEMENT
    private internalValue = signal<string | string[] | null>(null);
    @Input() set value(v: string | string[] | null | undefined) {
        if (this.multiple) {
            this.internalValue.set(Array.isArray(v) ? v : (v != null ? [String(v)] : []));
        } else {
            this.internalValue.set(v == null ? '' : (Array.isArray(v) ? v[0] : String(v)));
        }
    }
    get value(): string | string[] | null {
        if (this.multiple) return this.internalValue() as string[];
        const v = this.internalValue();
        return v === '' ? null : (v as string);
    }
    isMultiple = computed(() => this.multiple);
    singleValue = computed(() => (this.multiple ? '' : (this.internalValue() as string | null)) || '');

    // OPTIONS API
    @Input() options?: Array<{ label: string; value: string; disabled?: boolean } | { label: string; options: { label: string; value: string; disabled?: boolean }[] }>;
    isGroup = (o: any): o is { label: string; options: any[] } => !!o && Array.isArray((o as any).options);

    // CORE INPUTS
    @Input() label?: string;
    @Input() hint?: string;
    @Input() help?: string;
    @Input() name?: string;
    @Input() placeholder?: string;
    @Input() withClear = false;
    @Input() disabled = false;
    @Input() required = false;
    @Input() multiple = false;
    @Input() appearance: 'filled' | 'outlined' = 'outlined';
    @Input() pill = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() placement?: string; // forwarded
    @Input() hoist = false; // forces portal/overlay
    @Input() maxOptionsVisible?: number;
    @Input() helpText?: string;
    @Input() clearIcon?: string;
    @Input() checkIcon?: string;
    @Input() expandIcon?: string;
    @Input() loading = false;
    @Input() loadingText?: string;
    @Input() noResultsText?: string;
    @Input() filterable = false;
    @Input() clearOnSelect = false;
    @Input() stayOpenOnSelect = false;
    @Input() allowCreate = false;
    @Input() createSeparator?: string;
    @Input() withLabelSpace = false;
    @Input() withHintSpace = false;

    // STYLING & LAYOUT
    @Input() wrapperClass = 'block';
    @Input() labelClass?: string;
    @Input() inputClass?: string;
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() labelPosition: 'block' | 'inline' | 'srOnly' = 'block';
    @Input() cssVars?: Record<string, string | number | null>;

    // STATE & HOST BINDINGS
    private isInvalid = false;
    private open = false;
    @HostBinding('class.ds-input-invalid') get invalidClass() { return this.isInvalid; }
    @HostBinding('class.ds-input-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-select-open') get openClass() { return this.open; }

    // DERIVED PRESENTATION
    get displayHint(): string | undefined { return this.hint ?? this.help; }
    get computedLabelClass(): string { return this.labelClass || this.theme.controlLabel(); }
    get computedWrapperClass(): string {
        let base = this.wrapperClass || '';
        if (this.labelPosition === 'inline') { if (!/flex /.test(base)) base += ' flex items-center gap-2'; }
        else if (this.labelPosition === 'block') { if (!/space-y-/.test(base)) base += ' space-y-1'; if (!/block/.test(base)) base += ' block'; }
        else if (this.labelPosition === 'srOnly') { if (!/block/.test(base)) base += ' block'; }
        return base.trim();
    }
    get computedInputClass(): string { return computeUnderlineInputClass({ base: this.inputClass || this.theme.controlInputUnderlineFilled() }); }

    // OUTPUTS
    @Output() valueChange = new EventEmitter<string | string[] | null>();
    @Output() changeEvent = new EventEmitter<Event>();
    @Output() inputEvent = new EventEmitter<Event>();
    @Output() clearEvent = new EventEmitter<Event>();
    @Output() invalidEvent = new EventEmitter<Event>();
    @Output() focusEvent = new EventEmitter<FocusEvent>();
    @Output() blurEvent = new EventEmitter<FocusEvent>();
    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();
    @Output() lazyLoadEvent = new EventEmitter<CustomEvent>();
    @Output() createEvent = new EventEmitter<string>();

    // LAZY LOAD HANDLER (user supplies optional callback)
    @Input() lazyLoad?: () => Promise<Array<{ label: string; value: string }>>;

    // INTERNAL HELPERS
    private readCurrentValue(): string | string[] | null {
        const el: any = this.el?.nativeElement;
        if (!el) return null;
        if (this.multiple) {
            const selected: string[] = Array.from(el.querySelectorAll('wa-option[selected]')).map((o: any) => o.value);
            return selected;
        } else {
            return el.value ?? null;
        }
    }

    // EVENT HANDLERS
    onInput(e: Event) { this.syncValue(); this.inputEvent.emit(e); }
    onNativeChange(e: Event) { this.syncValue(); this.changeEvent.emit(e); }
    onWaChange(e: Event) { this.syncValue(); this.changeEvent.emit(e); }
    onWaClear(e: Event) { this.internalValue.set(this.multiple ? [] : ''); this.syncEmit(); this.clearEvent.emit(e); this.resetInvalid(); }
    onFocus(e: FocusEvent) { this.focusEvent.emit(e); }
    onBlur(e: FocusEvent) { this.blurEvent.emit(e); }
    onInvalid(e: Event) { this.isInvalid = true; this.invalidEvent.emit(e); }
    onShow(e: Event) { this.open = true; this.showEvent.emit(e); }
    onHide(e: Event) { this.open = false; this.hideEvent.emit(e); }
    onLazyLoad(e: Event) {
        this.lazyLoadEvent.emit(e as CustomEvent);
        if (this.lazyLoad) {
            this.lazyLoad().then(loaded => {
                // Append new options if provided and not duplicates
                const existing = new Set((this.options || []).filter(o => !this.isGroup(o)).map(o => (o as any).value));
                const extra = loaded.filter(o => !existing.has(o.value));
                if (extra.length) {
                    this.options = [...(this.options || []), ...extra];
                }
            }).catch(() => { /* swallow errors for now */ });
        }
    }

    private syncValue() {
        const val = this.readCurrentValue();
        if (this.multiple) {
            this.internalValue.set(Array.isArray(val) ? val : (val != null ? [String(val)] : []));
        } else {
            this.internalValue.set(val == null ? '' : String(val));
        }
        this.syncEmit();
        this.resetInvalid();
    }
    private syncEmit() {
        const current = this.value;
        this.valueChange.emit(current);
    }
    private resetInvalid() { if (this.isInvalid) this.isInvalid = false; }

    // METHODS (public API)
    focus() { (this.el?.nativeElement as any)?.focus?.(); }
    blur() { (this.el?.nativeElement as any)?.blur?.(); }
    show() { (this.el?.nativeElement as any)?.show?.(); }
    hide() { (this.el?.nativeElement as any)?.hide?.(); }
    checkValidity(): boolean { return (this.el?.nativeElement as any)?.checkValidity?.() ?? true; }
    reportValidity(): boolean { return (this.el?.nativeElement as any)?.reportValidity?.() ?? true; }
    setCustomValidity(message: string) { (this.el?.nativeElement as any)?.setCustomValidity?.(message); }
    applyCssVars() {
        if (!this.cssVars || !this.el?.nativeElement) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
    }

    ngAfterViewInit() { this.applyCssVars(); this.syncValue(); }
    ngOnChanges() { this.applyCssVars(); }
    ngAfterContentInit() { /* placeholder if we later introspect projected options */ }
}
