import { Component } from '@angular/core';

@Component({
    selector: 'app-financial-freedom-goal',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Financial Freedom Goal</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Calculate required assets based on desired annual spending and withdrawal rate.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: FIRE number calculator + progress bar.</div>
    </section>
  `
})
export class FinancialFreedomGoalComponent { }
