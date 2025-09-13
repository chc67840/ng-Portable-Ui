import { Component } from '@angular/core';

@Component({
    selector: 'app-account-types',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Account Types</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Overview of taxable, tax-deferred, and tax-free investment accounts.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: comparison grid + decision helper.</div>
    </section>
  `
})
export class AccountTypesComponent { }
