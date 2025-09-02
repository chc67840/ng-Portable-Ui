import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, HostBinding, ElementRef, ViewChild, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DsToastAppearance, DsToastVariant, ActiveToast } from '../services/toast.service';

@Component({
    selector: 'ds-toast',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <div #base
    role="status"
    [attr.data-variant]="variant"
    [attr.data-appearance]="appearance"
    [class]="toastClass"
    (mouseenter)="mouseEnter.emit()" (mouseleave)="mouseLeave.emit()"
  >
    <div class="flex items-start gap-3">
      <div *ngIf="iconHtml && !hideIcon" class="flex items-center text-lg" [innerHTML]="iconHtml"></div>
      <div class="flex-1 min-w-0">
        <div *ngIf="title" class="font-medium text-sm mb-0.5" [class]="titleClass">{{ title }}</div>
        <div *ngIf="message" class="text-xs leading-snug" [class]="messageClass">{{ message }}</div>
        <ng-content></ng-content>
        <div *ngIf="actionLabel" class="mt-2">
          <button type="button" (click)="onActionClick($event)" [class]="actionClass">{{ actionLabel }}</button>
        </div>
      </div>
      <button *ngIf="closable" type="button" (click)="onDismissClick($event)" aria-label="Dismiss"
        [class]="closeButtonClass">&times;</button>
    </div>
    <div *ngIf="showProgress && duration && remaining != null" class="mt-2 h-1 bg-slate-200 rounded overflow-hidden">
      <div class="h-full bg-current" [style.width.%]="progressPercent"></div>
    </div>
  </div>
  `,
    styles: [`
    :host{display:block;}
    :host(.ds-toast-enter){animation: toast-in .35s ease forwards;}
    :host(.ds-toast-leave){animation: toast-out .4s ease forwards;}
    @keyframes toast-in{0%{opacity:0;transform:translateY(4px) scale(.96)}100%{opacity:1;transform:translateY(0) scale(1)}}
    @keyframes toast-out{0%{opacity:1;transform:translateY(0) scale(1)}100%{opacity:0;transform:translateY(-4px) scale(.96)}}
  `]
})
export class DsToastComponent implements OnChanges, AfterViewInit {
    @ViewChild('base', { static: true }) base!: ElementRef<HTMLDivElement>;
    @Input() id!: string;
    @Input() title?: string;
    @Input() message?: string;
    @Input() variant: DsToastVariant = 'info';
    @Input() appearance: DsToastAppearance = 'filled';
    @Input() duration?: number; // ms
    @Input() remaining?: number | null;
    @Input() closable = true;
    @Input() actionLabel?: string;
    @Input() iconHtml?: string;
    @Input() showProgress = true;
    @Input() hideIcon = false;
    @Input() cssVars?: Record<string, string | number | null>;
    // classes
    @Input() toastClass = 'rounded-md p-3 shadow bg-white border border-slate-200 text-slate-700 relative overflow-hidden';
    @Input() titleClass = '';
    @Input() messageClass = '';
    @Input() actionClass = 'text-xs font-medium text-indigo-600 hover:underline';
    @Input() closeButtonClass = 'text-slate-400 hover:text-slate-600 text-sm leading-none px-1';
    @Input() progressClass = '';

    @Output() dismiss = new EventEmitter<string>();
    @Output() action = new EventEmitter<string>();
    @Output() mouseEnter = new EventEmitter<void>();
    @Output() mouseLeave = new EventEmitter<void>();

    @HostBinding('attr.data-variant') get dataVariant() { return this.variant; }
    @HostBinding('attr.data-appearance') get dataAppearance() { return this.appearance; }

    progressPercent = 0;

    ngAfterViewInit() { this.applyCssVars(); this.computeProgress(); }
    ngOnChanges(ch: SimpleChanges) {
        if (ch['remaining'] || ch['duration']) this.computeProgress();
        if (ch['cssVars']) this.applyCssVars();
    }

    private applyCssVars() { if (!this.cssVars) return; const s = this.base.nativeElement.style; for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) s.removeProperty(k); else s.setProperty(k, String(v)); } }
    private computeProgress() { if (!this.duration || this.duration <= 0 || this.remaining == null) { this.progressPercent = 0; return; } const rem = Math.max(0, this.remaining); this.progressPercent = 100 - (rem / this.duration) * 100; }
    onDismissClick(_e: MouseEvent) { this.dismiss.emit(this.id); }
    onActionClick(_e: MouseEvent) { this.action.emit(this.id); }
}
