import { Component } from '@angular/core';

@Component({
    selector: 'app-retirement-needs',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Retirement Needs</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Estimate income needs and gap analysis for retirement planning.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: expense categories, inflation slider.</div>
    </section>
  `
})
export class RetirementNeedsComponent { }
