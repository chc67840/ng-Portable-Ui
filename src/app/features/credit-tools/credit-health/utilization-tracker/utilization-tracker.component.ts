import { Component } from '@angular/core';

@Component({
    selector: 'app-utilization-tracker',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Utilization Tracker</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Track your credit card utilization across cards to maintain healthy ratios.</p>
      <div class="border border-neutral-200 dark:border-neutral-700 rounded-md p-4">
        <p class="text-neutral-500 dark:text-neutral-400">(Stub) Add form for card limits & balances, aggregate utilization bar, and warnings.</p>
      </div>
    </section>
  `
})
export class UtilizationTrackerComponent { }
