import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-avatar: Wrapper for <wa-avatar>
 * Features supported: image, fallback initials, icon slot, shapes, sizes, status badge, custom css vars.
 * Slots (projectable): default (text/initials), icon (slot="icon"), badge (slot="badge").
 * Attributes (mapped): shape, size, src, alt, label, initials, loading, fit, status, color.
 * Events: wa-load, wa-error.
 * CSS Custom Properties (pass via cssVars): --size, --border-radius, --font-size, --color, --background, --ring-color, --ring-width, --status-size, etc.
 * Parts (usable via ::part): base, image, initials, icon, badge, status.
 */
@Component({
    selector: 'ds-avatar',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-avatar #el
      [class]="avatarClass"
      [attr.shape]="shape"
      [attr.size]="size"
      [attr.src]="src || null"
      [attr.alt]="alt || null"
      [attr.label]="label || null"
      [attr.initials]="initials || null"
      [attr.loading]="loading || null"
      [attr.fit]="fit || null"
      [attr.status]="status || null"
      [attr.color]="color || null"
      (wa-load)="loadEvent.emit($event)"
      (wa-error)="errorEvent.emit($event)"
    >
      <ng-content></ng-content>
      <ng-content select="[slot=icon]"></ng-content>
      <ng-content select="[slot=badge]"></ng-content>
    </wa-avatar>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsAvatarComponent implements OnChanges {
    static readonly tag = WA_TAGS.avatar;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaAvatarEl>;

    // Core mapping inputs
    @Input() shape: 'circle' | 'square' | 'rounded' = 'circle';
    @Input() size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | string = 'medium';
    @Input() src?: string;
    @Input() alt?: string;
    @Input() label?: string; // accessible label
    @Input() initials?: string; // fallback if image missing
    @Input() loading?: 'eager' | 'lazy';
    @Input() fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
    @Input() status?: 'online' | 'busy' | 'away' | 'offline' | string | null = null;
    @Input() color?: string | null = null; // semantic / brand color token

    // Styling hooks
    @Input() avatarClass = '';
    @Input() cssVars?: Record<string, string | number | null>;

    // Outputs
    @Output() loadEvent = new EventEmitter<Event>();
    @Output() errorEvent = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
    }
    ngAfterViewInit() { this.applyCssVars(); }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }
}

interface WaAvatarEl extends HTMLElement { }
