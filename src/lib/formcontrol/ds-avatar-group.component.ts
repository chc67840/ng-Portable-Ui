import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-avatar-group: Wrapper for <wa-avatar-group>
 * Features: overlap sizing, max display count (with rest indicator slot), sizing propagation, stacking direction.
 * Slots: default (avatars), label (slot="label"), rest (slot="rest").
 * Attributes: size, overlap, max, shape.
 * CSS Vars: --gap, --overlap, --ring-color, --ring-width, etc via cssVars input.
 * Parts: base
 */
@Component({
    selector: 'ds-avatar-group',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-avatar-group #el
      [class]="groupClass"
      [attr.size]="size || null"
      [attr.overlap]="overlap || null"
      [attr.max]="max ?? null"
      [attr.shape]="shape || null"
    >
      <ng-content></ng-content>
      <ng-content select="[slot=label]"></ng-content>
      <ng-content select="[slot=rest]"></ng-content>
    </wa-avatar-group>
  `,
    styles: [':host{display:inline-block}']
})
export class DsAvatarGroupComponent implements OnChanges {
    static readonly tag = WA_TAGS.avatarGroup;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    @Input() size?: string; // propagate to children by WA behavior
    @Input() overlap?: string; // e.g. 'medium'
    @Input() max?: number; // max visible
    @Input() shape?: 'circle' | 'square' | 'rounded';
    @Input() groupClass = '';
    @Input() cssVars?: Record<string, string | number | null>;

    ngOnChanges(changes: SimpleChanges): void { if (changes['cssVars']) this.applyCssVars(); }
    ngAfterViewInit() { this.applyCssVars(); }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }
}
