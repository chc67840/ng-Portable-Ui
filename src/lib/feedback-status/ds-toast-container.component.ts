import { Component, Input, Signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ActiveToast } from '../services/toast.service';
import { DsToastComponent } from './ds-toast.component';

@Component({
    selector: 'ds-toast-container',
    standalone: true,
    imports: [CommonModule, DsToastComponent],
    template: `
    <div class="fixed inset-0 pointer-events-none" [class]="containerClass">
      <div class="absolute" [ngClass]="positionClass" [style.zIndex]="zIndex">
        <div class="flex flex-col gap-2 w-80 max-w-[90vw]" [class]="stackClass">
          <ds-toast *ngFor="let t of visibleToasts()" [id]="t.id" [title]="t.title" [message]="t.message"
            [variant]="t.variant || 'info'" [appearance]="t.appearance || 'filled'" [duration]="t.duration"
            [remaining]="t.remaining" [closable]="t.closable ?? true" [actionLabel]="t.actionLabel" [iconHtml]="t.iconHtml"
            [showProgress]="t.showProgress ?? true" [cssVars]="t.cssVars" (dismiss)="dismiss($event)"
            (action)="action($event)" (mouseEnter)="pause(t.id)" (mouseLeave)="resume(t.id)"></ds-toast>
        </div>
      </div>
    </div>
  `,
    styles: [`:host{display:contents}`]
})
export class DsToastContainerComponent {
    private svc = inject(ToastService);
    toasts = this.svc.toasts; // Signal<ActiveToast[]>

    @Input() limit = 5;
    @Input() zIndex = 1000;
    @Input() position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' = 'top-right';
    @Input() containerClass = '';
    @Input() stackClass = '';

    visibleToasts = computed(() => this.toasts().slice(0, this.limit));

    get positionClass() {
        return {
            'top-right': 'top-4 right-4',
            'top-left': 'top-4 left-4',
            'bottom-right': 'bottom-4 right-4',
            'bottom-left': 'bottom-4 left-4'
        }[this.position];
    }

    dismiss(id: string) { this.svc.dismiss(id); }
    action(id: string) { /* placeholder future event bus */ this.svc.dismiss(id); }
    pause(id: string) { this.svc.pause(id); }
    resume(id: string) { this.svc.resume(id); }
}
