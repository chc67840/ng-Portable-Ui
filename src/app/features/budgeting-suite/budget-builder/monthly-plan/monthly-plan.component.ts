import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-monthly-plan',
    template: `<div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Monthly Plan</h1>
    <p class="text-sm text-slate-600">Plan monthly inflows/outflows with envelope and zero-based budgeting aides.</p>
  </div>`
})
export class MonthlyPlanComponent { }
