import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({ selector: 'app-quick-actions', standalone: true, imports: [CommonModule], template: `<div class="p-6"><h1 class="text-xl font-semibold mb-2 flex items-center gap-2"><i class="fa fa-bolt text-indigo-600"></i> Quick Actions</h1><p class="text-sm text-slate-600">Quick Actions placeholder.</p></div>` }) export class QuickActionsComponent { }
