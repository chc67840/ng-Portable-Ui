import { Component } from '@angular/core';

@Component({
    selector: 'app-investment-podcasts',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Podcasts</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Curated list of educational investing and markets podcasts.</p>
      <ul class="list-disc pl-6 text-neutral-600 dark:text-neutral-300 space-y-1">
        <li>Animal Spirits</li>
        <li>Invest Like the Best</li>
        <li>ChooseFI</li>
      </ul>
    </section>
  `
})
export class PodcastsComponent { }
