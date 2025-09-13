import { Component } from '@angular/core';

@Component({
    selector: 'app-side-hustles',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Side Hustles</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Ideas and validation frameworks for earning extra income.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: idea filter + ROI estimator.</div>
    </section>
  `
})
export class SideHustlesComponent { }
