import { Component } from '@angular/core';

@Component({
    selector: 'app-tax-calculator',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Tax Calculator</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Estimate taxes owed using progressive bracket calculations.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: filing status select + deduction inputs.</div>
    </section>
  `
})
export class TaxCalculatorComponent { }
