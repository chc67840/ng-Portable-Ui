import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
    selector: 'ds-surface',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <section [class]="computedClass" [attr.data-variant]="variant" [attr.data-elevation]="elevation">
      <ng-content />
    </section>
  `
})
export class DsSurfaceComponent {
    @Input() padding: string = 'p-4';
    @Input() gap: string = 'gap-3';
    @Input() radius: string = 'rounded-md';
    @Input() elevation: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'sm';
    @Input() variant: 'base' | 'subtle' | 'elevated' = 'elevated';
    @Input() surfaceClass?: string;

    get computedClass(): string {
        if (this.surfaceClass) return this.surfaceClass;
        const bg = this.variant === 'base' ? 'bg-[var(--ds-bg-base)]' : (this.variant === 'subtle' ? 'bg-[var(--ds-bg-subtle)]' : 'bg-[var(--ds-bg-elevated)]');
        const shadow = this.elevation === 'none' ? '' : `shadow-[var(--ds-shadow-${this.elevation})]`; // arbitrary value will inline
        return [
            'ds-surface', 'relative', 'flex', 'flex-col', this.padding, this.gap, this.radius,
            'border', 'border-[var(--ds-border-subtle)]', bg,
            'text-[var(--ds-color-text-primary)]', 'transition-colors', shadow
        ].filter(Boolean).join(' ');
    }
}
