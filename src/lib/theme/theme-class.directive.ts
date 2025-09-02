import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';
import { DsThemeService } from './theme.service';

/**
 * Applies a class fragment from the active theme using a simple dotted path.
 * Example: <div dsThemeClass="control.label"></div>
 */
@Directive({
    selector: '[dsThemeClass]',
    standalone: true
})
export class DsThemeClassDirective implements OnChanges {
    private el = inject(ElementRef<HTMLElement>);
    private theme = inject(DsThemeService);

    @Input('dsThemeClass') key!: string; // e.g. control.label
    @Input() dsThemeFallback?: string;

    ngOnChanges(): void { this.apply(); }

    private apply() {
        const active = this.theme.getTheme();
        if (!active || !this.key) return;
        const parts = this.key.split('.');
        let cursor: any = active as any;
        for (const p of parts) {
            cursor = cursor ? cursor[p] : undefined;
        }
        const cls = (typeof cursor === 'string' && cursor) || this.dsThemeFallback;
        if (cls) {
            this.el.nativeElement.classList.add(...cls.split(/\s+/g).filter(Boolean));
        }
    }
}
