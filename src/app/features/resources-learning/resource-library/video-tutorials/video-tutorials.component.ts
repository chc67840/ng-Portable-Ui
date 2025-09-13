import { Component } from '@angular/core';

@Component({
    selector: 'app-video-tutorials',
    standalone: true,
    template: `
    <section class="p-6 space-y-4">
      <h1 class="text-2xl font-semibold">Video Tutorials</h1>
      <p class="text-sm text-neutral-600 dark:text-neutral-300">Hand-picked video content for visual learners.</p>
      <div class="border rounded-md p-4 text-neutral-500 dark:text-neutral-400">(Stub) Future: playlist builder + progress tracking.</div>
    </section>
  `
})
export class VideoTutorialsComponent { }
