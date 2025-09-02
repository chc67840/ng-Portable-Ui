import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, AfterViewInit, OnChanges, SimpleChanges, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';
import { DsDropdownComponent } from './ds-dropdown.component';
import { DsTooltipComponent } from '../feedback-status/ds-tooltip.component';

/**
 * ds-button-group: Angular wrapper for <wa-button-group>
 * Vendor attrs: label (aria), orientation, size, variant
 * Slots: default -> wa-button children
 * CSS Part: base
 * Added features:
 *  - items Input to auto-generate buttons (text, iconHtml, variant override, pill, tooltip, dropdown submenu)
 *  - split buttons (primary action + caret dropdown) via splitItems config
 *  - pill styling toggle (rounded-full)
 *  - toolbar convenience layout (aria-role + styling utility class) via toolbar=true
 *  - cssVars pass-through
 *  - Events: buttonClick emit with item, index
 */
export interface DsButtonGroupItem {
    label: string;
    value: string;
    disabled?: boolean;
    iconHtml?: string; // inserted before label
    variant?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
    size?: 'small' | 'medium' | 'large';
    pill?: boolean; // rounded full
    tooltip?: string; // optional tooltip text
    dropdownItems?: any[]; // if present renders a nested dropdown trigger button
    split?: boolean; // begin a split button (primary + caret with dropdownItems)
    onClick?: () => void; // custom handler
}

@Component({
    selector: 'ds-button-group',
    standalone: true,
    imports: [CommonModule, DsDropdownComponent, DsTooltipComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-button-group #el [attr.label]="label || null" [attr.orientation]="orientation" [attr.size]="size" [attr.variant]="variant" [class.inline-flex]="orientation==='horizontal'" [class.flex-col]="orientation==='vertical'" [class.ds-toolbar]="toolbar" class="align-middle" >
      <ng-content></ng-content>
      <ng-container *ngFor="let item of items; let i = index">
        <!-- Split primary button -->
        <wa-button *ngIf="item.split" [attr.variant]="item.variant || variant" [attr.size]="item.size || size" [disabled]="item.disabled? '' : null" (click)="handleItemClick(item, i, $event)" [class.rounded-full]="item.pill"> 
          <span class="inline-flex items-center gap-1" [innerHTML]="item.iconHtml || ''"></span>{{ item.label }}
        </wa-button>
        <!-- Split caret dropdown -->
        <ds-dropdown *ngIf="item.split && item.dropdownItems" class="-ml-px" [items]="item.dropdownItems" triggerLabel="" [placement]="'bottom-start'">
          <button trigger type="button" class="px-2 h-full flex items-center" aria-label="More options">
            <wa-icon name="chevron-down" family="classic" variant="solid"></wa-icon>
          </button>
        </ds-dropdown>

        <!-- Normal button or dropdown button -->
        <ng-container *ngIf="!item.split">
          <ds-dropdown *ngIf="item.dropdownItems" [items]="item.dropdownItems" [placement]="'bottom-start'" [triggerLabel]="item.label">
            <button trigger type="button" class="inline-flex items-center gap-1 px-2 py-1" [class.rounded-full]="item.pill" (click)="$event.stopPropagation()">
              <span *ngIf="item.iconHtml" [innerHTML]="item.iconHtml"></span>
              <span>{{ item.label }}</span>
              <wa-icon name="chevron-down" family="classic" variant="solid"></wa-icon>
            </button>
          </ds-dropdown>
          <wa-button *ngIf="!item.dropdownItems" [attr.variant]="item.variant || variant" [attr.size]="item.size || size" [disabled]="item.disabled? '' : null" (click)="handleItemClick(item, i, $event)" [class.rounded-full]="item.pill">
            <span class="inline-flex items-center gap-1">
              <span *ngIf="item.iconHtml" [innerHTML]="item.iconHtml"></span>
              {{ item.label }}
            </span>
          </wa-button>
        </ng-container>
        <ds-tooltip *ngIf="item.tooltip" [content]="item.tooltip" [hoverDelay]="120" [placement]="'top'">
          <span tooltip></span>
        </ds-tooltip>
      </ng-container>
    </wa-button-group>
  `,
    styles: [`:host{display:inline-flex}.ds-toolbar{gap:.25rem}`]
})
export class DsButtonGroupComponent implements AfterViewInit, OnChanges {
    static readonly tag = WA_TAGS.buttonGroup;
    @ViewChild('el') elRef!: ElementRef<HTMLElement>;

    @Input() label?: string;
    @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' = 'neutral';
    @Input() items: DsButtonGroupItem[] = [];
    @Input({ transform: booleanAttribute }) pill = false; // apply to all buttons if true
    @Input({ transform: booleanAttribute }) toolbar = false;
    @Input() cssVars?: Record<string, string | number | null>;

    @Output() buttonClick = new EventEmitter<{ item: DsButtonGroupItem; index: number; event: Event }>();

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars']) this.applyCssVars(); }

    private applyCssVars() { if (!this.cssVars) return; const el = this.elRef?.nativeElement; if (!el) return; const s = el.style; for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) s.removeProperty(k); else s.setProperty(k, String(v)); } }

    handleItemClick(item: DsButtonGroupItem, index: number, e: Event) {
        item.onClick?.();
        this.buttonClick.emit({ item, index, event: e });
    }
}
