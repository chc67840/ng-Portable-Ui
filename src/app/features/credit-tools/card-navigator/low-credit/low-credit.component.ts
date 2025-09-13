import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-low-credit',
    template: `<div class='p-6 space-y-4'>
    <h1 class='text-2xl font-semibold tracking-tight'>Low Credit Cards</h1>
    <p class='text-sm text-slate-600'>Finder for secured and subprime cards to rebuild score responsibly.</p>
  </div>`
})
export class LowCreditComponent { }
