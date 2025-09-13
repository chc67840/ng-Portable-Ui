import { Component } from '@angular/core';

@Component({
    selector: 'app-articles-guides',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Articles & Guides</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Curated educational articles and long-form guides.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: search + categories + save feature.</div>
    </section>
  `
})
export class ArticlesGuidesComponent { }
