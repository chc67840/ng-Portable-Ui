import { Component } from '@angular/core';

@Component({
    selector: 'app-budgeting-apps',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Budgeting Apps</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Comparison of popular budgeting and tracking applications.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: feature matrix + pricing toggles.</div>
    </section>
  `
})
export class BudgetingAppsComponent { }
