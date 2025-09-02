import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, HostBinding, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-ta: Wrapper for <wa-tag> (tag element / token / badge-like component)
 * Assumptions (adjust when underlying API confirmed):
 * Slots:
 *  - default: content label
 *  - start: leading icon/content
 *  - end: trailing icon/content
 * Attributes / Inputs:
 *  - appearance: filled|outlined|soft
 *  - pill: boolean -> rounded-full style
 *  - removable: boolean -> shows a remove affordance (fires remove event)
 *  - disabled: boolean
 *  - size: small|medium|large
 *  - value: string (semantic value)
 *  - hint/help (stored / not rendered unless projected)
 *  - cssVars: custom properties applied to element style
 * Events:
 *  - removeEvent (wa-remove?) -> rename if actual event differs
 *  - clickEvent (native click)
 * CSS Parts (document only): base, content, remove (future)
 * Methods:
 *  - focus(), blur(), remove()
 * Custom States (host classes): ds-ta-disabled, ds-ta-removable
 * Dynamic Features Implemented: Appearance, Pill, Removable, Disabled, Sizes, Hint, Custom Styles
 */
@Component({
    selector: 'ds-ta',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <wa-tag #el
      [attr.appearance]="appearance"
      [attr.pill]="pill ? '' : null"
      [attr.removable]="removable ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.size]="size"
      [attr.value]="value || null"
      (click)="onClick($event)"
      (wa-remove)="onRemove($event)"
      [class]="taClass"
      [attr.variant]="variant"
    >
      <ng-content select="[slot=start]"></ng-content>
      <span class="inline-flex items-center" part="content"><ng-content></ng-content></span>
      <ng-content select="[slot=end]"></ng-content>
  </wa-tag>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsTaComponent implements OnChanges {
    protected readonly tag = WA_TAGS.tag;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { focus(): void; blur(): void; remove?(): void }>;

    // Inputs
    @Input() appearance: 'filled' | 'outlined' | 'soft' = 'filled';
    @Input() pill = false;
    @Input() removable = false;
    @Input() disabled = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() value?: string;
    @Input() hint?: string;
    @Input() help?: string;
    @Input() taClass = '';
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() variant: 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral' = 'primary';

    // Outputs
    @Output() removeEvent = new EventEmitter<Event>();
    @Output() clickEvent = new EventEmitter<MouseEvent>();

    // Host state classes
    @HostBinding('class.ds-ta-disabled') get disabledClass() { return this.disabled; }
    @HostBinding('class.ds-ta-removable') get removableClass() { return this.removable; }
    @HostBinding('class') hostBase = 'inline-block align-middle';

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars'] && this.el) this.applyCssVars(); }

    private applyCssVars() { if (!this.cssVars) return; const style = this.el.nativeElement.style; for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); } }

    // Events
    onRemove(e: Event) { this.removeEvent.emit(e); }
    onClick(e: MouseEvent) { this.clickEvent.emit(e); }

    // Public methods
    focus() { this.el?.nativeElement?.focus?.(); }
    blur() { this.el?.nativeElement?.blur?.(); }
    remove() { (this.el?.nativeElement as any)?.remove?.(); }
}
