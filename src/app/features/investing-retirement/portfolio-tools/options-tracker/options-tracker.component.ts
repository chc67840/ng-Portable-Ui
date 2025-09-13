import { Component } from '@angular/core';

@Component({
    selector: 'app-options-tracker',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Options Tracker</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Track open options positions, Greeks, and expirations.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: position table + risk metrics.</div>
    </section>
  `
})
export class OptionsTrackerComponent { }
