import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({ selector: 'app-progress-tracking', standalone: true, imports: [CommonModule], template: `<div class="p-6"><h1 class="text-xl font-semibold mb-2 flex items-center gap-2"><i class="fa fa-check-circle text-indigo-600"></i> Progress Tracking</h1><p class="text-sm text-slate-600">Progress Tracking placeholder.</p></div>` }) export class ProgressTrackingComponent { }
