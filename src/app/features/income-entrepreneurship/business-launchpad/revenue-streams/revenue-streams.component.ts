import { Component } from '@angular/core';

@Component({
    selector: 'app-revenue-streams',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Revenue Streams</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Diversify and map recurring vs one-time income sources.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: revenue mix chart + forecast.</div>
    </section>
  `
})
export class RevenueStreamsComponent { }
