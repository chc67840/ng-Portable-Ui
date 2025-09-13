import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
@Component({ selector: 'app-notifications', standalone: true, imports: [CommonModule], template: `<div class="p-6"><h1 class="text-xl font-semibold mb-2 flex items-center gap-2"><i class="fa fa-bell text-indigo-600"></i> Notifications</h1><p class="text-sm text-slate-600">Notifications placeholder.</p></div>` }) export class NotificationsComponent { }
