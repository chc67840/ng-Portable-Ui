import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, OnChanges, SimpleChanges, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-dropdown: Angular wrapper for <wa-dropdown> + projected <wa-dropdown-item> content.
 * Features:
 *  - Inputs: open (2-way via openChange), size, placement, distance, skidding (offset), disabled
 *  - Content projection slots: trigger (with <button> or <ds-button>) and default for items.
 *  - Utility Inputs for building menus from data (items Input) supporting dividers, checkable items, danger variant, details, submenu items.
 *  - Outputs: showEvent, afterShowEvent, hideEvent, afterHideEvent, selectEvent (emits value + original Event + item ref), openChange.
 *  - Methods: show(), hide(), toggle(), getSelectedItem(), focus(), blur().
 *  - cssVars pass-through for custom animation durations etc.
 *  - Dynamic item rendering with <wa-dropdown-item>. Dividers are rendered as disabled items with role="separator".
 */
export interface DsDropdownItemConfig {
    label?: string;
    value?: string;
    disabled?: boolean;
    divider?: boolean; // render a separator
    danger?: boolean;  // variant="danger"
    checkbox?: boolean; // type="checkbox"
    checked?: boolean;
    details?: string; // simple text for details slot
    iconHtml?: string; // inserted into icon slot (unsafe innerHTML assumption for demo)
    submenu?: DsDropdownItemConfig[]; // nested submenu
}

@Component({
    selector: 'ds-dropdown',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-dropdown #el
      [attr.open]="open ? '' : null"
      [attr.size]="size"
      [attr.placement]="placement"
      [attr.distance]="distance"
      [attr.skidding]="skidding"
      (wa-show)="onShow($event)"
      (wa-after-show)="afterShowEvent.emit($event)"
      (wa-hide)="onHide($event)"
      (wa-after-hide)="afterHideEvent.emit($event)"
      (wa-select)="onSelect($event)"
    >
      <span slot="trigger" (click)="toggle()">
        <ng-content select="[trigger]"></ng-content>
        <button *ngIf="!hasProjectedTrigger" type="button" class="inline-flex items-center gap-1 px-2 py-1 text-sm rounded border bg-white shadow-sm">
          {{ triggerLabel }}
          <wa-icon name="chevron-down" family="classic" variant="solid"></wa-icon>
        </button>
      </span>
      <ng-content select="wa-dropdown-item, [dsDropdownItem]"></ng-content>
      <ng-container *ngIf="items?.length">
        <ng-container *ngFor="let item of items">
          <wa-dropdown-item *ngIf="!item.divider" [attr.value]="item.value || null"
            [attr.variant]="item.danger ? 'danger' : 'default'"
            [attr.type]="item.checkbox ? 'checkbox' : 'normal'"
            [attr.checked]="item.checkbox && item.checked ? '' : null"
            [attr.disabled]="item.disabled ? '' : null"
            (click)="onItemClicked(item, $event)"
          >
            <span *ngIf="item.iconHtml" slot="icon" [innerHTML]="item.iconHtml"></span>
            {{ item.label }}
            <span *ngIf="item.details" slot="details" class="opacity-70 ml-2 text-xs">{{ item.details }}</span>
            <div *ngIf="item.submenu?.length" slot="submenu">
              <wa-dropdown-item *ngFor="let sub of item.submenu" [attr.value]="sub.value || null"
                [attr.variant]="sub.danger ? 'danger':'default'"
                [attr.type]="sub.checkbox ? 'checkbox':'normal'"
                [attr.checked]="sub.checkbox && sub.checked ? '' : null"
                [attr.disabled]="sub.disabled ? '' : null"
                (click)="onItemClicked(sub, $event)"
              >
                <span *ngIf="sub.iconHtml" slot="icon" [innerHTML]="sub.iconHtml"></span>
                {{ sub.label }}
                <span *ngIf="sub.details" slot="details" class="opacity-70 ml-2 text-xs">{{ sub.details }}</span>
              </wa-dropdown-item>
            </div>
          </wa-dropdown-item>
          <wa-dropdown-item *ngIf="item.divider" disabled role="separator"></wa-dropdown-item>
        </ng-container>
      </ng-container>
    </wa-dropdown>
  `
})
export class DsDropdownComponent implements AfterViewInit, OnChanges {
    static readonly tag = WA_TAGS.dropdown;
    @ViewChild('el') elRef!: ElementRef<HTMLElement>;

    // Core Inputs
    @Input({ transform: booleanAttribute }) open = false;
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() placement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end' = 'bottom-start';
    @Input() distance = 4; // maps to distance attribute
    @Input() skidding = 0; // offset along trigger
    @Input() triggerLabel = 'Options';
    @Input() hasProjectedTrigger = false; // consumer sets when providing [trigger] slot
    @Input() items: DsDropdownItemConfig[] | null = null; // dynamic items array
    @Input() cssVars?: Record<string, string | number | null>;

    // Outputs
    @Output() openChange = new EventEmitter<boolean>();
    @Output() showEvent = new EventEmitter<Event>();
    @Output() afterShowEvent = new EventEmitter<Event>();
    @Output() hideEvent = new EventEmitter<Event>();
    @Output() afterHideEvent = new EventEmitter<Event>();
    @Output() selectEvent = new EventEmitter<{ value: string | null; event: Event; item?: DsDropdownItemConfig }>();

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars']) this.applyCssVars(); }

    private applyCssVars() {
        if (!this.cssVars) return; const el = this.elRef?.nativeElement; if (!el) return; const style = el.style;
        for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) style.removeProperty(k); else style.setProperty(k, String(v)); }
    }

    // Event handlers bridging vendor events
    onShow(e: Event) { this.showEvent.emit(e); this.openChange.emit(true); }
    onHide(e: Event) { this.hideEvent.emit(e); this.openChange.emit(false); }
    onSelect(e: Event) {
        // wa-select likely emits detail with item/value; fallback to closest dropdown-item value
        const target = e.target as HTMLElement | null;
        const value = (target?.getAttribute('value')) || null;
        this.selectEvent.emit({ value, event: e });
    }
    onItemClicked(cfg: DsDropdownItemConfig, e: Event) {
        this.selectEvent.emit({ value: cfg.value ?? null, event: e, item: cfg });
    }

    // Public methods
    show() { this.setOpen(true); }
    hide() { this.setOpen(false); }
    toggle() { this.setOpen(!this.open); }
    setOpen(v: boolean) { this.open = v; this.syncOpenAttr(); this.openChange.emit(this.open); }
    getSelectedItem(): HTMLElement | null { return this.elRef.nativeElement.querySelector('wa-dropdown-item[active]'); }
    focus() { (this.elRef.nativeElement as any).focus?.(); }
    blur() { (this.elRef.nativeElement as any).blur?.(); }

    private syncOpenAttr() { const el = this.elRef.nativeElement; if (this.open) el.setAttribute('open', ''); else el.removeAttribute('open'); }
}
