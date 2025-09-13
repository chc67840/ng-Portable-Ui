import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-payment-timeline',
    template: `<div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Payment Timeline</h1>
    <p class="text-sm text-slate-600">Projected payoff schedule, milestone visualization, and plan adjustments.</p>
  </div>`
})
export class PaymentTimelineComponent { }
