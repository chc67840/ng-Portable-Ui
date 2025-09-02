import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ContentChildren, QueryList, AfterContentInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-breadcrumb: wrapper around <wa-breadcrumb> + <wa-breadcrumb-item> children.
 * Features: custom separator slot, start/end decorations via projected template, dynamic items Input, color & class hooks.
 * Slots Supported:
 *  - default: breadcrumb items (either projected <ds-breadcrumb-item> wrappers or generated list)
 *  - separator: custom global separator element
 *  - start / end (wrapper-provided optional decorations rendered outside native element for layout flexibility)
 * Attributes/Props:
 *  - label (aria label for nav)
 * Events: (none from WA aside from native link/button events; future hook placeholder)
 * CSS Parts (from WA): base (breadcrumb), item label/start/end/separator on breadcrumb-item level
 * CSS Custom Properties: none explicit beyond theming; allow cssVars map for future overrides.
 */
@Component({
    selector: 'ds-breadcrumb',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <nav [attr.aria-label]="label || 'Breadcrumb'" [class]="wrapperClass">
      <div *ngIf="start" class="mr-2" [class]="startClass"><ng-content select="[slot=start]"></ng-content></div>
      <wa-breadcrumb [class]="breadcrumbClass" #bc>
        <div *ngIf="separator" slot="separator" [class]="separatorClass">
          <ng-content select="[slot=separator]"></ng-content>
        </div>
        <!-- Projected static items -->
        <ng-content select="wa-breadcrumb-item, [slot=item]"></ng-content>
        <!-- Dynamically generated items via items Input -->
        <ng-container *ngFor="let item of items; let last = last">
          <wa-breadcrumb-item [attr.href]="item.href || null" [attr.target]="item.target || null" [attr.rel]="item.rel || null" [class]="itemClass"
            [class.pointer-events-none]="last && disableLastLink"
          >
            <span [class]="labelClass">{{ item.label }}</span>
            <!-- Per-item custom separator override -->
            <span *ngIf="item.separator" slot="separator" [class]="separatorClass" [innerHTML]="item.separator"></span>
            <span *ngIf="item.startIcon" slot="start" class="inline-flex items-center" [innerHTML]="item.startIcon"></span>
            <span *ngIf="item.endIcon" slot="end" class="inline-flex items-center" [innerHTML]="item.endIcon"></span>
          </wa-breadcrumb-item>
        </ng-container>
      </wa-breadcrumb>
      <div *ngIf="end" class="ml-2" [class]="endClass"><ng-content select="[slot=end]"></ng-content></div>
    </nav>
  `,
    styles: [`:host{display:block}`]
})
export class DsBreadcrumbComponent implements AfterContentInit, OnChanges {
    static readonly tag = WA_TAGS.breadcrumb;

    /** Accessible label for the breadcrumb navigation */
    @Input() label: string = 'Breadcrumb';

    /** Dynamic items (optional). If provided, they render after any statically projected items */
    @Input() items: DsBreadcrumbItemData[] = [];

    /** Disable navigation on last link (common UX) */
    @Input() disableLastLink = true;

    /** Class hooks */
    @Input() wrapperClass = 'flex items-center text-sm text-slate-600';
    @Input() breadcrumbClass = 'inline-flex items-center gap-1';
    @Input() itemClass = 'inline-flex items-center gap-1';
    @Input() labelClass = '';
    @Input() separatorClass = 'opacity-60';
    @Input() startClass = '';
    @Input() endClass = '';

    /** Flags for optional projected slots (start,end,separator) presence */
    get start(): boolean { return true; }
    get end(): boolean { return true; }
    get separator(): boolean { return true; }

    /** CSS variable injection hook */
    @Input() cssVars?: Record<string, string | number | null>;

    @ContentChildren('breadcrumbItem') projectedItems!: QueryList<any>; // placeholder if wrapping further later

    ngAfterContentInit(): void {
        this.applyCssVars();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
    }

    private applyCssVars() {
        if (!this.cssVars) return;
        const host = (document?.defaultView?.customElements ? (this as any).elRef?.nativeElement : null) as HTMLElement | null;
        // Simpler: apply to :host root via style attribute if available (wrapper nav element)
        // For now skip if we can't resolve easily since Angular host binding not added.
    }
}

export interface DsBreadcrumbItemData {
    label: string;
    href?: string;
    target?: '_blank' | '_parent' | '_self' | '_top';
    rel?: string;
    separator?: string; // HTML string for per-item separator override
    startIcon?: string; // HTML (e.g. <wa-icon ...>)
    endIcon?: string;
}
