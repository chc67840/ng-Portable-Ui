import { Component } from '@angular/core';

@Component({
    selector: 'app-portfolio-tracker',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Portfolio Tracker</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Monitor allocations, performance, and rebalancing signals.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: allocation pie + performance chart.</div>
    </section>
  `
})
export class PortfolioTrackerComponent { }
