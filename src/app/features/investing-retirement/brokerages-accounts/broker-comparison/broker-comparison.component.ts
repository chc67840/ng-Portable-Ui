import { Component } from '@angular/core';

@Component({
    selector: 'app-broker-comparison',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Broker Comparison</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Compare fees, features, and account types across brokerages.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: sortable table + filters.</div>
    </section>
  `
})
export class BrokerComparisonComponent { }
