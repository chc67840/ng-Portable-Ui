import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
    selector: 'app-page-placeholder',
    standalone: true,
    imports: [CommonModule],
    template: `
  <div class="p-6">
    <h1 class="text-xl font-semibold mb-3 flex items-center gap-2">
      <i *ngIf="icon" class="fa {{ icon }} text-indigo-600"></i>
      {{ title }}
    </h1>
    <p class="text-sm text-slate-600">This page ({{ routePath || title }}) is a placeholder. Implement details here.</p>
  </div>
  `
})
export class PagePlaceholderComponent {
    @Input() title = 'Page';
    @Input() icon?: string;
    @Input() routePath?: string;
}
