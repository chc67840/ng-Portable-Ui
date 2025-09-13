import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
    selector: 'ds-footer',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <footer [class]="computedClass" role="contentinfo">
      <div class="flex-1"><ng-content /></div>
      <div *ngIf="right" class="flex items-center gap-2"><ng-content select="[right]" /></div>
    </footer>
  `
})
export class DsFooterComponent {
    @Input() footerClass?: string;
    @Input() padding: string = 'px-4 py-3';
    @Input() border: boolean = true;
    @Input() fixed: boolean = false;
    @Input() right: boolean = false;

    get computedClass(): string {
        if (this.footerClass) return this.footerClass;
        return [
            this.fixed ? 'fixed bottom-0 left-0 right-0 z-40' : 'relative',
            'flex items-center gap-4 text-sm',
            this.padding,
            'bg-[var(--ds-bg-base)] text-[var(--ds-color-text-secondary)]',
            this.border ? 'border-t border-[var(--ds-border-subtle)]' : '',
            'backdrop-blur-sm'
        ].join(' ');
    }
}
