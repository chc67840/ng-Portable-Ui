import { Component } from '@angular/core';

@Component({
    selector: 'app-deductions-guide',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Deductions Guide</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Common deductions and eligibility overview.</p>
      <ul class="list-disc pl-6 text-neutral-600 dark:text-neutral-300 space-y-1">
        <li>Retirement contributions</li>
        <li>HSA contributions</li>
        <li>Charitable donations</li>
      </ul>
    </section>
  `
})
export class DeductionsGuideComponent { }
