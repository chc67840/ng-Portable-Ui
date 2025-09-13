import { Component } from '@angular/core';

@Component({
    selector: 'app-investment-books',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Books</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Recommended investing classics and modern strategy reads.</p>
      <ul class="list-disc pl-6 text-neutral-600 dark:text-neutral-300 space-y-1">
        <li>The Intelligent Investor</li>
        <li>A Random Walk Down Wall Street</li>
        <li>Common Sense on Mutual Funds</li>
      </ul>
    </section>
  `
})
export class BooksComponent { }
