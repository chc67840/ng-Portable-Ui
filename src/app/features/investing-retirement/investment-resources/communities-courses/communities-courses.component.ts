import { Component } from '@angular/core';

@Component({
    selector: 'app-communities-courses',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Communities & Courses</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Find interactive groups and structured learning programs.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: tags, difficulty filters, enrollment links.</div>
    </section>
  `
})
export class CommunitiesCoursesComponent { }
