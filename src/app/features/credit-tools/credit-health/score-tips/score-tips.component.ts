import { Component } from '@angular/core';

@Component({
    selector: 'app-score-tips',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Score Tips</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Actionable suggestions to improve and maintain your credit score.</p>
      <ul class="list-disc pl-6 text-neutral-600 dark:text-neutral-300 space-y-1">
        <li>Set payment reminders to avoid late payments.</li>
        <li>Lower utilization below 30% (10% ideal) over time.</li>
        <li>Keep oldest accounts open unless fees outweigh benefits.</li>
        <li>Limit hard inquiries; batch rate shopping within short windows.</li>
        <li>Maintain a healthy mix (revolving + installment).</li>
      </ul>
    </section>
  `
})
export class ScoreTipsComponent { }
