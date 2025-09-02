import { Component, Input, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, HostBinding, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-skeleton wrapper for <wa-skeleton>
 * Vendor attributes: effect ("none" | "sheen" | "pulse")
 * Parts: indicator
 * CSS Custom Properties: --color, --sheen-color (derives from --color + surface raised), plus sizing via container.
 * Wrapper dynamic features:
 *  - Shapes: pill (default), circle, rounded, square via border-radius vars/classes
 *  - Paragraphs: generate stacked skeleton lines with configurable count + line height + gap
 *  - Avatar placeholder: size variant (sm/md/lg) with circle enforced
 *  - Custom colors through cssVars ( --color, --sheen-color )
 *  - Effect shortcuts (pulse, sheen, none)
 *  - Width/height inputs for single skeleton block
 *  - Accessible: optional ariaLabel; role="status" while loading
 *  - Custom state classes: ds-skeleton-effect-* for styling hooks
 */
@Component({
    selector: 'ds-skeleton',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <ng-container *ngIf="paragraphs > 1; else single">
      <div [class]="wrapperClass" [style.gap.rem]="gapRem" role="status" aria-live="polite">
        <ng-container *ngFor="let line of lines; let i = index">
          <wa-skeleton #el
            [attr.effect]="effect"
            [class]="lineClass(i)"
            [style.width]="lineWidth(i)"
            [style.height]="lineHeightPx"
          ></wa-skeleton>
        </ng-container>
      </div>
    </ng-container>
    <ng-template #single>
      <wa-skeleton #singleEl
        [attr.effect]="effect"
        [class]="skeletonClass"
        [style.width]="widthPx"
        [style.height]="heightPx"
        role="status"
        [attr.aria-label]="ariaLabel || null"
      ></wa-skeleton>
    </ng-template>
  `,
    styles: [`
    :host{display:block}
  `]
})
export class DsSkeletonComponent implements AfterViewInit, OnChanges {
    protected readonly tag = WA_TAGS.skeleton;
    @ViewChild('singleEl') singleEl?: ElementRef<HTMLElement>;

    // Core vendor attr
    @Input() effect: 'none' | 'sheen' | 'pulse' = 'none';

    // Single shape sizing
    @Input() width: number | string | null = null; // px or css (e.g., '40%')
    @Input() height: number | string | null = null; // px or css

    // Paragraph mode
    @Input() paragraphs = 1; // when >1 renders multiple lines
    @Input() paragraphHeight = 12; // px
    @Input() gap = 8; // px gap between lines
    @Input({ transform: booleanAttribute }) randomizeLast = true; // last line shorter for realism

    // Avatar shortcut
    @Input({ transform: booleanAttribute }) avatar = false;
    @Input() avatarSize: 'sm' | 'md' | 'lg' = 'md';

    // Shape overrides
    @Input({ transform: booleanAttribute }) circle = false; @Input({ transform: booleanAttribute }) rounded = true; @Input({ transform: booleanAttribute }) square = false;

    // Styling hooks
    @Input() skeletonClass = '';
    @Input() wrapperClass = 'flex flex-col';
    @Input() lineBaseClass = 'block';
    @Input() cssVars?: Record<string, string | number | null>;

    @Input() ariaLabel?: string;

    @HostBinding('class') hostBase = 'relative';
    @HostBinding('class.ds-skeleton') hostId = true;
    @HostBinding('class.ds-skeleton-effect-sheen') get sheen() { return this.effect === 'sheen'; }
    @HostBinding('class.ds-skeleton-effect-pulse') get pulsing() { return this.effect === 'pulse'; }

    get widthPx() { return this.width == null ? null : (typeof this.width === 'number' ? this.width + 'px' : this.width); }
    get heightPx() {
        if (this.avatar) {
            const map = { sm: 32, md: 48, lg: 72 } as const; return map[this.avatarSize] + 'px';
        }
        if (this.height == null) return (this.paragraphs > 1) ? null : '1rem';
        return typeof this.height === 'number' ? this.height + 'px' : this.height;
    }
    get lineHeightPx() { return this.paragraphHeight + 'px'; }
    get gapRem() { return (this.gap / 16).toFixed(4); }

    get lines() { return Array.from({ length: this.paragraphs }); }

    constructor(private hostEl: ElementRef<HTMLElement>) { }
    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars'] || ch['paragraphs']) queueMicrotask(() => this.applyCssVars()); }

    private applyCssVars() {
        if (!this.cssVars) return;
        const nodes = this.hostEl.nativeElement.querySelectorAll('wa-skeleton');
        nodes.forEach(el => {
            const s = (el as HTMLElement).style;
            for (const [k, v] of Object.entries(this.cssVars!)) {
                if (v == null) s.removeProperty(k); else s.setProperty(k, String(v));
            }
        });
    }

    lineClass(i: number) {
        const shape = this.circle || this.avatar ? 'rounded-full' : this.square ? 'rounded-none' : this.rounded ? 'rounded-md' : '';
        return [this.lineBaseClass, this.skeletonClass, shape].filter(Boolean).join(' ');
    }
    lineWidth(i: number) {
        if (this.avatar) return this.heightPx; // square avatar lines if misused in paragraphs
        if (i === this.paragraphs - 1 && this.randomizeLast) { const pct = 50 + Math.random() * 40; return pct.toFixed(0) + '%'; }
        return '100%';
    }
}
