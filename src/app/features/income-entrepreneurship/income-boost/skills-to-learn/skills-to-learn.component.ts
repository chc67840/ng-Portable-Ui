import { Component } from '@angular/core';

@Component({
    selector: 'app-skills-to-learn',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Skills to Learn</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">High leverage skills to increase earnings and opportunity.</p>
      <ul class="list-disc pl-6 text-neutral-600 dark:text-neutral-300 space-y-1">
        <li>Copywriting</li>
        <li>Technical Writing</li>
        <li>Data Literacy</li>
      </ul>
    </section>
  `
})
export class SkillsToLearnComponent { }
