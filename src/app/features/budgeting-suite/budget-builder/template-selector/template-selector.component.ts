import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-template-selector',
    template: `<div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Template Selector</h1>
    <p class="text-sm text-slate-600">Choose starting templates: 50/30/20, envelopes, zero-based, or custom mix.</p>
  </div>`
})
export class TemplateSelectorComponent { }
