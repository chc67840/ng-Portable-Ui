import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

export interface DsNavTreeItem {
    label: string;
    route?: string; // full route path
    icon?: string; // font awesome icon class (fa-home, etc.)
    children?: DsNavTreeItem[];
    id?: string;
}

@Component({
    selector: 'ds-nav-tree',
    standalone: true,
    imports: [CommonModule, RouterModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <nav class="flex items-stretch gap-4 h-14 px-4 bg-[var(--ds-bg-base)] text-[var(--ds-color-text-primary)] border-[var(--ds-border-subtle)] select-none relative z-[60]">
    <div class="flex items-center font-semibold text-sm tracking-wide">{{ brand }}</div>
    <ul class="flex items-center gap-1" role="menubar" aria-label="Primary navigation" (keydown)="onRootListKey($event)">
      <li *ngFor="let item of items; let i = index; trackBy: trackItem" class="relative" role="none">
        <button type="button"
          (click)="onRootClick(item)"
          (mouseenter)="open(item)"
          (mouseleave)="closeDelayed(item)"
          [attr.aria-haspopup]="item.children?.length ? 'true' : null"
          [attr.aria-expanded]="isOpen(item)"
          [attr.aria-current]="isActive(item) ? 'page' : null"
          [attr.data-index]="i"
          role="menuitem"
          class="root-btn inline-flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ds-border-focus)] relative"
          [class.is-active]="isActive(item)"
        >
          <i *ngIf="item.icon" class="fa-solid {{ item.icon.replace('fa-','fa-') }} text-xs opacity-80"></i>
          <span>{{ item.label }}</span>
          <svg *ngIf="item.children?.length" class="w-3 h-3 opacity-70" viewBox="0 0 12 12" fill="none"><path d="M3 4l3 4 3-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <!-- First level submenu -->
        <div *ngIf="item.children?.length" (mouseenter)="open(item)" (mouseleave)="closeDelayed(item)"
          class="absolute left-0 top-full mt-1 min-w-[14rem] z-[70]"
          [class.hidden]="!isOpen(item)"
        >
          <ul class="submenu-panel bg-[var(--ds-bg-elevated)] border border-[var(--ds-border-subtle)] rounded-md shadow-[var(--ds-shadow-md)] py-2 text-sm">
            <ng-container *ngFor="let child of item.children; trackBy: trackItem">
              <li class="relative" role="none">
                <a *ngIf="!child.children" [routerLink]="child.route" (click)="closeAll()" role="menuitem"
                  class="flex items-center gap-2 px-3 py-2 hover:bg-[var(--ds-bg-subtle)] rounded transition-colors"
                  [class.font-semibold]="isActive(child)"
                  [attr.aria-current]="isActive(child) ? 'page' : null"
                >
                  <i *ngIf="child.icon" class="fa-solid {{ child.icon.replace('fa-','fa-') }} text-xs opacity-70"></i>
                  <span>{{ child.label }}</span>
                </a>
                <div *ngIf="child.children" class="group/sub relative" (mouseenter)="open(child)" (mouseleave)="closeDelayed(child)">
                  <button type="button" (click)="toggle(child)" role="menuitem"
                    class="w-full text-left flex items-center gap-2 px-3 py-2 hover:bg-[var(--ds-bg-subtle)] rounded transition-colors"
                    [attr.aria-expanded]="isOpen(child)"
                  >
                    <i *ngIf="child.icon" class="fa-solid {{ child.icon.replace('fa-','fa-') }} text-xs opacity-70"></i>
                    <span>{{ child.label }}</span>
                    <svg class="ml-auto w-3 h-3 opacity-60" viewBox="0 0 12 12" fill="none"><path d="M5 3l4 3-4 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </button>
                  <!-- Second level submenu -->
                  <div class="absolute top-0 left-full ml-1 min-w-[14rem] z-[80]" [class.hidden]="!isOpen(child)">
                    <ul class="submenu-panel bg-[var(--ds-bg-elevated)] border border-[var(--ds-border-subtle)] rounded-md shadow-[var(--ds-shadow-md)] py-2 text-sm">
                      <li *ngFor="let leaf of child.children; trackBy: trackItem" role="none">
                        <a [routerLink]="leaf.route" (click)="closeAll()" role="menuitem"
                          class="flex items-center gap-2 px-3 py-2 hover:bg-[var(--ds-bg-subtle)] rounded transition-colors"
                          [class.font-semibold]="isActive(leaf)"
                          [attr.aria-current]="isActive(leaf) ? 'page' : null"
                        >
                          <i *ngIf="leaf.icon" class="fa-solid {{ leaf.icon.replace('fa-','fa-') }} text-xs opacity-70"></i>
                          <span>{{ leaf.label }}</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </li>
            </ng-container>
          </ul>
        </div>
      </li>
    </ul>
    <div class="ml-auto flex items-center gap-2">
      <ng-content select="[right]"></ng-content>
    </div>
  </nav>
  `,
    styles: [`
  :host{display:block}
  .root-btn{color:var(--ds-color-text-secondary);}
  .root-btn:hover{background:var(--ds-bg-subtle);color:var(--ds-color-text-primary);}
  .root-btn:focus-visible{outline:2px solid var(--ds-border-focus);outline-offset:2px;}
  .root-btn.is-active{color:var(--ds-color-text-primary);}
  .root-btn.is-active::after{content:'';position:absolute;left:0.4rem;right:0.4rem;bottom:2px;height:3px;border-radius:9999px;background:var(--ds-color-primary-600);}
  .submenu-panel{background:var(--ds-bg-elevated, #ffffff);backdrop-filter:blur(2px);}
  `]
})
export class DsNavTreeComponent {
    @Input() items: DsNavTreeItem[] = [];
    @Input() brand: string = '';
    @Input() rightContent = false;
    @Output() itemSelect = new EventEmitter<DsNavTreeItem>();

    private openSet = new Set<DsNavTreeItem>();
    private closeTimers = new Map<DsNavTreeItem, any>();

    trackItem = (_: number, it: DsNavTreeItem) => it.id || it.route || it.label;

    isOpen(it: DsNavTreeItem) { return this.openSet.has(it); }
    open(it: DsNavTreeItem) { if (it.children?.length) { this.clearTimer(it); this.openSet.add(it); } }
    toggle(it: DsNavTreeItem) { if (this.isOpen(it)) this.close(it); else this.open(it); }
    close(it: DsNavTreeItem) { this.openSet.delete(it); }
    closeAll() { this.openSet.clear(); }
    closeDelayed(it: DsNavTreeItem) { this.clearTimer(it); this.closeTimers.set(it, setTimeout(() => this.close(it), 250)); }
    clearTimer(it: DsNavTreeItem) { const t = this.closeTimers.get(it); if (t) { clearTimeout(t); this.closeTimers.delete(it); } }

    constructor(private router: Router, private elRef: ElementRef<HTMLElement>) { }
    isActive(it: DsNavTreeItem): boolean {
        if (!it.route) return false;
        const cur = this.router.url;
        if (it.route === '/' || it.route === '') return cur === '/' || cur === '';
        return cur === it.route || cur.startsWith(it.route + '/');
    }
    onRootClick(it: DsNavTreeItem) {
        if (it.children?.length) {
            this.toggle(it);
        } else if (it.route) {
            this.closeAll();
            this.router.navigateByUrl(it.route);
            this.itemSelect.emit(it);
        }
    }

    // Keyboard navigation on root menubar
    onRootListKey(ev: KeyboardEvent) {
        const buttons = Array.from(this.elRef.nativeElement.querySelectorAll('.root-btn')) as HTMLButtonElement[];
        if (!buttons.length) return;
        const currentIndex = buttons.findIndex(b => b === document.activeElement);
        const focusAt = (idx: number) => { const btn = buttons[(idx + buttons.length) % buttons.length]; btn?.focus(); };
        switch (ev.key) {
            case 'ArrowRight': ev.preventDefault(); focusAt(currentIndex < 0 ? 0 : currentIndex + 1); break;
            case 'ArrowLeft': ev.preventDefault(); focusAt(currentIndex < 0 ? 0 : currentIndex - 1); break;
            case 'Home': ev.preventDefault(); focusAt(0); break;
            case 'End': ev.preventDefault(); focusAt(buttons.length - 1); break;
            case 'Escape':
                this.closeAll();
                (document.activeElement as HTMLElement)?.blur();
                break;
            case 'ArrowDown':
                // If root with submenu, open it
                if (currentIndex >= 0) {
                    const item = this.items[currentIndex];
                    if (item?.children?.length) {
                        this.open(item);
                        // focus first submenu item after next frame
                        queueMicrotask(() => {
                            const first = this.elRef.nativeElement.querySelector('.submenu-panel a, .submenu-panel button') as HTMLElement;
                            first?.focus();
                        });
                    }
                }
                break;
        }
    }

    // Close menus on outside click
    @HostListener('document:click', ['$event']) onDocClick(ev: MouseEvent) {
        if (!this.elRef.nativeElement.contains(ev.target as Node)) this.closeAll();
    }
    @HostListener('document:keydown.escape') onEsc() { this.closeAll(); }
}
