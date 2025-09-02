import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-dialog: wrapper for <wa-dialog> (modal). Exposes full API: open state, label/header slots, header-actions, footer.
 * Provides lightDismiss + withoutHeader toggles and show/hide methods.
 */
@Component({
    selector: 'ds-dialog',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-dialog #el
      [class]="dialogClass"
      [attr.open]="open ? '' : null"
      [attr.label]="label || null"
      [attr.without-header]="withoutHeader ? '' : null"
      [attr.light-dismiss]="lightDismiss ? '' : null"
      (wa-show)="showEvent.emit($event)"
      (wa-after-show)="afterShowEvent.emit($event)"
      (wa-hide)="hideEvent.emit($event)"
      (wa-after-hide)="afterHideEvent.emit($event)"
    >
      <!-- Slots: default (body), label, header-actions, footer -->
      <ng-content></ng-content>
      <ng-content select="[slot=label]"></ng-content>
      <ng-content select="[slot=header-actions]"></ng-content>
      <ng-content select="[slot=footer]"></ng-content>
    </wa-dialog>
  `,
    styles: [`:host{display:contents}`]
})
export class DsDialogComponent implements OnChanges {
    static readonly tag = WA_TAGS.dialog;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { open?: boolean }>; // broaden

    // State / behavior
    @Input() open = false; // mirrors 'open' attribute
    @Input() label?: string; // alternative to label slot
    @Input() withoutHeader = false;
    @Input() lightDismiss = false; // click outside closes

    // Style/class + css vars
    @Input() dialogClass = '';
    @Input() cssVars?: Record<string, string | number | null>; // --spacing, --width, durations etc.

    // Events (mirror WA events)
    @Output() openChange = new EventEmitter<boolean>();
    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['open'] && !changes['open'].firstChange) this.syncOpen();
    }

    ngAfterViewInit() {
        this.applyCssVars();
        this.syncOpen();
    }

    private syncOpen() {
        const el: any = this.el?.nativeElement;
        if (!el) return;
        if (this.open) {
            if (!el.hasAttribute('open')) el.setAttribute('open', '');
        } else {
            if (el.hasAttribute('open')) el.removeAttribute('open');
        }
    }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    // Public methods for external control
    show() { this.open = true; this.syncOpen(); this.openChange.emit(true); }
    hide() { this.open = false; this.syncOpen(); this.openChange.emit(false); }
    toggle() { this.open ? this.hide() : this.show(); }
}
