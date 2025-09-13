import { Component } from '@angular/core';

@Component({
    selector: 'app-team-culture',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Team & Culture</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Principles for hiring, onboarding, and culture maintenance.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: role scorecards + onboarding checklist.</div>
    </section>
  `
})
export class TeamCultureComponent { }
