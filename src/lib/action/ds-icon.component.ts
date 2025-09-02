import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-icon: wrapper for <wa-icon> exposing properties & load/error events + css vars.
 */
@Component({
    selector: 'ds-icon',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
        <wa-icon #el
            [class]="iconClass"
            [attr.name]="name || null"
            [attr.family]="family || null"
            [attr.variant]="variant || null"
            [attr.fixed-width]="fixedWidth ? '' : null"
            [attr.src]="resolvedSrc || src || null"
            [attr.label]="label || null"
            [attr.library]="library || null"
            [attr.size]="size || null"
            (wa-load)="loadEvent.emit($event)"
            (wa-error)="errorEvent.emit($event)"
        ></wa-icon>
  `,
    styles: [`:host{display:inline-block}`]
})
export class DsIconComponent implements OnChanges {
    static readonly tag = WA_TAGS.icon;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    // Inputs mapping WA icon properties
    @Input() name?: string;                // icon name within library
    @Input() family?: string;              // wa specific family (e.g. classic, sharp)
    @Input() variant?: string;             // wa variant (regular|solid|...)
    @Input() fixedWidth = false;           // ensure consistent width
    @Input() src?: string;                 // explicit src overrides library resolution
    @Input() label?: string;               // accessible label
    @Input() library?: string;             // custom or built-in library key
    @Input() size?: string;                // pass-through size attr (css may map)
    @Input() color?: string;               // applied via css var/style
    @Input() autoSrc = false;              // attempt to resolve external library URL automatically

    // Style hooks / CSS vars (e.g. duotone colors)
    @Input() iconClass = '';
    @Input() cssVars?: Record<string, string | number | null>;

    // Resolved src (computed) when autoSrc enabled
    resolvedSrc?: string;

    @Output() loadEvent = new EventEmitter<Event>();
    @Output() errorEvent = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
        if (changes['name'] || changes['library'] || changes['autoSrc'] || changes['src']) this.ensureAutoSrc();
        if (changes['color']) this.applyColor();
    }
    ngAfterViewInit() { this.applyCssVars(); this.ensureAutoSrc(); this.applyColor(); }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
    }

    private applyColor() {
        if (!this.color || !this.el?.nativeElement) return;
        (this.el.nativeElement as HTMLElement).style.setProperty('--icon-color', this.color);
        (this.el.nativeElement as HTMLElement).style.setProperty('color', this.color);
    }

    private ensureAutoSrc() {
        if (!this.autoSrc || this.src || !this.library || !this.name) { this.resolvedSrc = undefined; return; }
        const resolver = ICON_LIBRARY_RESOLVERS[this.library];
        if (resolver) {
            this.resolvedSrc = resolver(this.name, this.variant);
        }
    }
}

// External icon library URL resolvers (subset). Pattern aims for direct SVG delivery.
const ICON_LIBRARY_RESOLVERS: Record<string, (name: string, variant?: string) => string> = {
    bootstrap: (n) => `https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/icons/${n}.svg`,
    lucide: (n) => `https://cdn.jsdelivr.net/npm/lucide-static@0.321.0/icons/${n}.svg`,
    hero: (n, v) => {
        const style = v === 'solid' ? '24/solid' : '24/outline';
        return `https://cdn.jsdelivr.net/npm/heroicons@2.1.1/${style}/${n}.svg`;
    },
    boxicons: (n) => `https://cdn.jsdelivr.net/npm/boxicons@2.1.4/svg/regular/bx-${n}.svg`,
    unicons: (n) => `https://cdn.jsdelivr.net/npm/@iconscout/unicons@4.0.8/svg/line/${n}.svg`,
    ion: (n) => `https://cdn.jsdelivr.net/npm/ionicons@7.4.0/dist/ionicons/svg/${n}.svg`,
    jam: (n) => `https://cdn.jsdelivr.net/npm/jam-icons@2.0.0/svg/${n}.svg`,
    material: (n) => `https://fonts.gstatic.com/s/i/materialicons/${n}/v6/24px.svg`
};
