import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-fund-goal',
    template: `<div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Fund Goal</h1>
    <p class="text-sm text-slate-600">Set and track emergency fund target with dynamic runway projections.</p>
  </div>`
})
export class FundGoalComponent { }
