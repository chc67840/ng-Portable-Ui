import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { DsThemeService } from '../ds-theme.service';

export interface DsNavItem {
  label: string;
  route?: string;        // Angular router path
  href?: string;         // External link
  icon?: string;         // Future: icon name (placeholder)
  id?: string;           // Optional ID
}

@Component({
  selector: 'ds-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
  <nav role="navigation" aria-label="Main" [class]="computedWrapperClass">
    <div [class]="computedBrandContainer">
      <a *ngIf="brandHref; else brandText" [routerLink]="brandRouterLink ? brandHref : null" [href]="!brandRouterLink ? brandHref : null" [class]="computedBrand">{{ brand }}</a>
      <ng-template #brandText>
        <span [class]="computedBrand">{{ brand }}</span>
      </ng-template>
    </div>
    <div [class]="centerContainerClass">
      <ul [class]="computedItemsContainer">
        <li *ngFor="let item of items; trackBy: trackItem" class="flex">
          <a
            (click)="onItemClick(item, $event)"
            [routerLink]="item.route || null"
            [href]="item.href || null"
            [class]="computeItemClass(item)"
            [attr.aria-current]="isActive(item) ? 'page' : null"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
    <div *ngIf="rightContent" [class]="computedRightContainer">
      <ng-content select="[right]"></ng-content>
    </div>
  </nav>
  `
})
export class DsNavComponent {
  private router = inject(Router);
  private theme = inject(DsThemeService);

  // Data
  @Input() items: DsNavItem[] = [];
  @Input() brand: string = '';
  @Input() brandHref?: string; // If provided, clickable brand
  @Input() brandRouterLink: boolean = true; // interpret brandHref as routerLink when true
  @Input() activeMatchMode: 'exact' | 'startsWith' = 'startsWith';

  // Styling hooks
  @Input() wrapperClass?: string;
  /** When false, removes fixed positioning so nav scrolls with content */
  @Input() fixed = true;
  @Input() brandContainerClass?: string;
  @Input() brandClass?: string;
  @Input() centerContainerClass = 'flex flex-1 items-center justify-center';
  @Input() itemsContainerClass?: string;
  @Input() itemClass?: string;
  @Input() activeItemClass?: string;
  @Input() inactiveItemClass?: string;
  @Input() rightContentClass?: string;

  get computedWrapperClass(): string {
    const base = this.wrapperClass || this.theme.navWrapper();
    if (this.fixed) {
      // Always place positioning classes at front for predictability
      return `fixed top-0 left-0 right-0 z-50 ${base}`.trim();
    }
    // Remove fixed/sticky if present when fixed=false
    return base.replace(/\b(fixed|sticky)\b/g, '').trim();
  }

  // Right content toggle
  @Input() rightContent = false; // consumer sets and supplies projected [right]

  @Output() itemSelect = new EventEmitter<DsNavItem>();

  trackItem = (_: number, item: DsNavItem) => item.id || item.route || item.href || item.label;

  isActive(item: DsNavItem): boolean {
    const current = this.router.url || '';
    if (item.route) {
      if (this.activeMatchMode === 'exact') return current === item.route;
      return current.startsWith(item.route);
    }
    if (item.href && !item.route) {
      return false; // external not auto-active
    }
    return false;
  }

  computeItemClass(item: DsNavItem): string {
    const active = this.isActive(item);
    const itemBase = this.itemClass || this.theme.navItem();
    const activeCls = (active ? (this.activeItemClass || this.theme.navItemActive()) : (this.inactiveItemClass || this.theme.navItemInactive()));
    return [itemBase, activeCls].filter(Boolean).join(' ');
  }

  get computedBrandContainer() { return this.brandContainerClass || this.theme.navBrandContainer(); }
  get computedBrand() { return this.brandClass || this.theme.navBrand(); }
  get computedItemsContainer() { return this.itemsContainerClass || this.theme.navItemsContainer(); }
  get computedRightContainer() { return this.rightContentClass || this.theme.navRightContainer(); }

  onItemClick(item: DsNavItem, ev: Event) { this.itemSelect.emit(item); }
}
