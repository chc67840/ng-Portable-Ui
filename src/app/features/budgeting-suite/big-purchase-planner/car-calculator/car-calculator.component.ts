import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-car-calculator',
    template: `<div class="p-6 space-y-4">
    <h1 class="text-2xl font-semibold tracking-tight">Car Calculator</h1>
    <p class="text-sm text-slate-600">Estimate total cost of ownership including insurance, depreciation, and fuel.</p>
  </div>`
})
export class CarCalculatorComponent { }
