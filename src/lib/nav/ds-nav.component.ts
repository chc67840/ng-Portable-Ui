import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
// Refactored: removed DsThemeService dependency; now uses CSS variable driven classes from ThemeEngineService.

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
export class DsNavComponent implements OnInit {
  private router = inject(Router);
  private currentUrl = '';

  // Data
  @Input() items: DsNavItem[] = [];
  @Input() brand: string = '';
  @Input() brandHref?: string; // If provided, clickable brand
  @Input() brandRouterLink: boolean = true; // interpret brandHref as routerLink when true
  @Input() activeMatchMode: 'exact' | 'startsWith' = 'startsWith';

  // Styling hooks
  @Input() wrapperClass?: string; // overrides entire nav wrapper class
  /** When true, applies fixed positioning (default false now for flexibility) */
  @Input() fixed = false;
  /** Toggle bottom border */
  @Input() showBorder = false;
  /** Sticky positioning (alternative to fixed). Kept separate to avoid layout shift. */
  @Input() sticky = false;
  @Input() brandContainerClass?: string;
  @Input() brandClass?: string;
  // Center container no longer forces full flex so right actions align to right via ml-auto on right container.
  @Input() centerContainerClass = 'flex items-center gap-1';
  @Input() itemsContainerClass?: string;
  @Input() itemClass?: string;
  @Input() activeItemClass?: string;
  @Input() inactiveItemClass?: string;
  @Input() rightContentClass?: string;
  /** Visual variant for nav item styling */
  @Input() variant: 'pill' | 'underline' | 'ghost' | 'subtle' | 'bottom-pill' | 'top-pill' = 'pill';
  /** Compact density (reduces horizontal & vertical padding) */
  @Input() dense = false;
  /** Nav height utility (e.g., h-12, h-14). Default h-14 for more spacious layout */
  @Input() height = 'h-14';
  /** Border style when showBorder=true */
  @Input() borderStyle: 'line' | 'gradient' | 'double' = 'line';
  /** Align items container overall (affects nav-level centering) */
  @Input() itemsAlign: 'start' | 'center' | 'end' = 'start';

  get computedWrapperClass(): string {
    const base = this.wrapperClass || this.defaultWrapperClass();
    const cls: string[] = [base];
    if (this.fixed) cls.unshift('fixed top-0 left-0 right-0 z-[80]');
    else if (this.sticky) cls.unshift('sticky top-0 z-[80]');
    if (this.showBorder) {
      switch (this.borderStyle) {
        case 'gradient':
          cls.push('relative');
          cls.push('after:content-["\""] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-gradient-to-r after:from-indigo-500 after:via-sky-500 after:to-emerald-500');
          break;
        case 'double':
          cls.push('relative border-b border-[var(--ds-border-subtle)]');
          cls.push('after:content-["\""] after:absolute after:left-0 after:right-0 after:bottom-1 after:h-px after:bg-[var(--ds-border-subtle)]');
          break;
        case 'line':
        default:
          cls.push('border-b border-[var(--ds-border-subtle)]');
      }
    }
    return cls.join(' ');
  }

  // Right content toggle
  @Input() rightContent = false; // consumer sets and supplies projected [right]

  @Output() itemSelect = new EventEmitter<DsNavItem>();

  trackItem = (_: number, item: DsNavItem) => item.id || item.route || item.href || item.label;

  computeItemClass(item: DsNavItem): string {
    const active = this.isActive(item);
    // If consumer supplies full override, honor it completely
    if (this.itemClass && (active ? this.activeItemClass : this.inactiveItemClass)) {
      const customActive = active ? this.activeItemClass : this.inactiveItemClass;
      return [this.itemClass, customActive].filter(Boolean).join(' ');
    }
    const base = this.itemClass || this.defaultItemClass();
    const activeCls = active ? (this.activeItemClass || this.defaultActiveItemClass()) : (this.inactiveItemClass || this.defaultInactiveItemClass());
    return [base, activeCls].filter(Boolean).join(' ');
  }

  get computedBrandContainer() { return this.brandContainerClass || this.defaultBrandContainer(); }
  get computedBrand() { return this.brandClass || this.defaultBrandClass(); }
  get computedItemsContainer() { return this.itemsContainerClass || this.defaultItemsContainer(); }
  get computedRightContainer() { return this.rightContentClass || this.defaultRightContainer(); }

  // ----- Default class builders (token-driven via CSS vars) -----
  private defaultWrapperClass(): string {
    return [
      this.height, 'flex', 'items-center', 'gap-4', 'px-4', 'select-none', 'relative',
      'bg-[var(--ds-bg-base)]', 'text-[var(--ds-color-text-primary)]', 'backdrop-blur-sm'
    ].join(' ');
  }
  private defaultBrandContainer(): string { return 'flex items-center'; }
  private defaultBrandClass(): string { return 'text-sm font-semibold tracking-wide no-underline decoration-none'; }
  private defaultItemsContainer(): string {
    if (this.itemsAlign === 'center') return 'absolute left-1/2 -translate-x-1/2 flex items-center gap-1';
    if (this.itemsAlign === 'end') return 'ml-auto flex items-center gap-1';
    return 'flex items-center gap-1';
  }
  private defaultRightContainer(): string { return 'flex items-center gap-2 ml-auto'; }
  private defaultItemClass(): string {
    const padX = this.dense ? 'px-2.5' : 'px-3';
    const padY = this.dense ? 'py-1.5' : 'py-2';
    const common = [
      'inline-flex', 'items-center', 'text-sm', 'font-medium', 'select-none', 'whitespace-nowrap', 'transition-colors', 'relative',
      'focus:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-[var(--ds-border-focus)]', 'ring-offset-2', 'ring-offset-[var(--ds-bg-base)]'
    ];
    switch (this.variant) {
      case 'underline':
        return [
          ...common, padX, padY,
          // underline animation track
          'after:content-[""] after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:rounded-full after:bg-[var(--ds-color-primary-600)] after:scale-x-0 after:origin-center after:transition-transform after:duration-200 after:ease-[cubic-bezier(0.86,0.11,0.85,0.10)]'
        ].join(' ');
      case 'bottom-pill':
        return [
          ...common, padX, padY, 'rounded-none',
          'after:content-[" "] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-0 after:bg-[var(--ds-color-primary-600)] after:rounded-t-full after:transition-all after:duration-200 after:ease-[cubic-bezier(0.86,0.11,0.85,0.10)]'
        ].join(' ');
      case 'top-pill':
        return [
          ...common, padX, padY, 'rounded-none',
          'before:content-[" "] before:absolute before:left-0 before:right-0 before:top-0 before:h-0 before:bg-[var(--ds-color-primary-600)] before:rounded-b-full before:transition-all before:duration-200 before:ease-[cubic-bezier(0.86,0.11,0.85,0.10)]'
        ].join(' ');
      case 'ghost':
        return [...common, padX, padY, 'rounded-md'].join(' ');
      case 'subtle':
        return [...common, padX, padY, 'rounded-md'].join(' ');
      case 'pill':
      default:
        return [...common, padX, padY, 'rounded-md'].join(' ');
    }
  }
  private defaultActiveItemClass(): string {
    switch (this.variant) {
      case 'underline':
        return 'text-[var(--ds-color-text-primary)] after:scale-x-100';
      case 'bottom-pill':
        return 'text-[var(--ds-color-text-primary)] after:h-2';
      case 'top-pill':
        return 'text-[var(--ds-color-text-primary)] before:h-2';
      case 'ghost':
        return 'text-[var(--ds-color-text-primary)] bg-[var(--ds-bg-subtle)]';
      case 'subtle':
        return 'bg-[var(--ds-color-primary-100)] text-[var(--ds-color-primary-700)]';
      case 'pill':
      default:
        return 'bg-[var(--ds-color-primary-600)] text-white shadow-sm';
    }
  }
  private defaultInactiveItemClass(): string {
    switch (this.variant) {
      case 'underline':
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:after:scale-x-100';
      case 'bottom-pill':
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:after:h-2 hover:after:bg-[var(--ds-color-primary-600)]';
      case 'top-pill':
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:before:h-2 hover:before:bg-[var(--ds-color-primary-600)]';
      case 'ghost':
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-bg-subtle)]';
      case 'subtle':
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-primary-700)] hover:bg-[var(--ds-color-primary-50)]';
      case 'pill':
      default:
        return 'text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:bg-[var(--ds-bg-subtle)]';
    }
  }

  onItemClick(item: DsNavItem, ev: Event) { this.itemSelect.emit(item); }

  ngOnInit(): void {
    // Track current URL for initial and subsequent route changes to ensure active state styling applies immediately.
    this.currentUrl = this.router.url || '';
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.currentUrl = e.urlAfterRedirects || e.url || this.router.url;
    });
  }

  // Updated to use tracked currentUrl to avoid timing race on initial render
  private currentPath(): string { return this.currentUrl || this.router.url || ''; }
  // Override isActive to use currentPath
  isActive(item: DsNavItem): boolean {
    const current = this.currentPath();
    if (item.route) {
      // Root route special-case: only active on exact root
      if (item.route === '/' || item.route === '') {
        return current === '/' || current === '';
      }
      if (this.activeMatchMode === 'exact') return current === item.route;
      // Prefix match must align on segment boundary: '/about' matches '/about' or '/about/...'
      return current === item.route || current.startsWith(item.route + '/');
    }
    if (item.href && !item.route) return false;
    return false;
  }
}
