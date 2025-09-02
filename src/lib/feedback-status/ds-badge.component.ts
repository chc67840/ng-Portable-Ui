import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostBinding, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-badge: wrapper for <wa-badge>
 * Slots:
 *  - default: badge text / content
 *  - start: leading icon
 *  - end: trailing icon or button
 *  - button: projected <button slot="button"> to action inside badge
 * Inputs / Attributes:
 *  - appearance: 'filled' | 'outlined' | 'soft'
 *  - variant: semantic coloring e.g. 'primary' | 'success' | 'warning' | 'danger' | 'neutral'
 *  - pill: boolean -> rounded shape
 *  - pulse: boolean -> attention (animated ring)
 *  - removable: boolean -> show remove affordance (fires remove event)
 *  - disabled
 *  - size: small|medium|large
 *  - value: number|string for numeric badges
 *  - maxValue: number for value overflow (e.g. 99+)
 *  - label: accessible label (aria-label)
 *  - hint/help (not rendered unless showHint true)
 *  - showHint boolean to render hint beneath
 *  - cssVars custom properties
 *  - badgeClass, wrapperClass, hintClass styling hooks
 * Events:
 *  - removeEvent (wa-remove)
 *  - clickEvent (native click) (when badge itself clicked)
 *  - buttonClick (custom when internal button with #buttonRef clicked)
 * Methods:
 *  - focus(), blur(), remove()
 * CSS Custom Properties: forwarded via cssVars (document typical: --badge-bg, --badge-color, --badge-border-color, --badge-radius, --badge-padding)
 * CSS Parts (vendor): base, content, remove, icon (provided by wa-badge)
 * Custom States (host classes): ds-badge-disabled, ds-badge-pulse, ds-badge-removable
 * Dynamic Features Implemented: Appearance, Variants, Pill, Pulse (attention), Removable, Disabled, Sizes, Hint, Custom Styles, With Buttons.
 */
@Component({
    selector: 'ds-badge',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-badge #el
      [attr.appearance]="appearance"
      [attr.variant]="variant || null"
      [attr.pill]="pill ? '' : null"
      [attr.pulse]="pulse ? '' : null"
      [attr.removable]="removable ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.size]="size"
      [attr.value]="value != null ? value : null"
      [attr.max-value]="maxValue != null ? maxValue : null"
      [attr.aria-label]="label || null"
      (click)="onClick($event)"
      (wa-remove)="onRemove($event)"
      [class]="badgeClass"
    >
      <ng-content select="[slot=start]"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[slot=end]"></ng-content>
      <ng-content select="[slot=button]"></ng-content>
    </wa-badge>
    <span *ngIf="showHint && displayHint" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsBadgeComponent implements OnChanges {
    protected readonly tag = WA_TAGS.badge;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { focus(): void; blur(): void; remove?: () => void }>;

    // Inputs
    @Input() appearance: 'filled' | 'outlined' | 'soft' = 'filled';
    @Input() variant: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral' | string | null = null;
    @Input() pill = false;
    @Input() pulse = false;
    @Input() removable = false;
    @Input() disabled = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() value?: string | number;
    @Input() maxValue?: number;
    @Input() label?: string;
    @Input() hint?: string; @Input() help?: string; @Input() showHint = false;
    @Input() wrapperClass = 'inline-flex flex-col items-center gap-1';
    @Input() badgeClass = '';
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;

    // Outputs
    @Output() removeEvent = new EventEmitter<Event>();
    @Output() clickEvent = new EventEmitter<MouseEvent>();

    // Host state classes
    @HostBinding('class.ds-badge-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-badge-pulse') get pulseClass() { return this.pulse; }
    @HostBinding('class.ds-badge-removable') get removableClass() { return this.removable; }
    @HostBinding('class') hostBase = 'inline-block align-middle';

    get displayHint() { return this.hint ?? this.help; }

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars'] && this.el) this.applyCssVars(); }

    private applyCssVars() { if (!this.cssVars) return; const s = this.el.nativeElement.style; for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) s.removeProperty(k); else s.setProperty(k, String(v)); } }

    // Events
    onRemove(e: Event) { this.removeEvent.emit(e); }
    onClick(e: MouseEvent) { this.clickEvent.emit(e); }

    // Methods
    focus() { this.el?.nativeElement?.focus?.(); }
    blur() { this.el?.nativeElement?.blur?.(); }
    remove() { (this.el?.nativeElement as any)?.remove?.(); }
}
