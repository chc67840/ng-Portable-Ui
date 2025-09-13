import { Component } from '@angular/core';

@Component({
    selector: 'app-tax-brackets',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Tax Brackets</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Current year marginal tax brackets and thresholds.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: dynamic year selector + effective rate calc.</div>
    </section>
  `
})
export class TaxBracketsComponent { }
