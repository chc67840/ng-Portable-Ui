import { Component } from '@angular/core';

@Component({
    selector: 'app-compound-interest',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Compound Interest</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Explore growth over time with principal, contribution, rate, and frequency inputs.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: interactive chart + schedule.</div>
    </section>
  `
})
export class CompoundInterestComponent { }
