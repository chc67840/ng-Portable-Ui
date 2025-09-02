import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, HostBinding, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-callout: wrapper for <wa-callout>
 * Slots:
 *  - default: main body content
 *  - icon: leading icon slot (optional)
 *  - header: title/header area
 *  - footer: actions (e.g., buttons)
 *  - badge: small badge/label inside header (if vendor supports)
 * Supported native attributes (verified): appearance (space-delimited tokens), variant, size.
 * Wrapper extras (purely cosmetic): hideIcon, hint/help/showHint, cssVars, class hooks.
 * Removed speculative features (pulse, dismissible, pillIcon, heading, disabled, footer/header slots) not in current wa-callout implementation.
 * Dynamic features implemented now: Appearance (pass-through), Variants, Sizes, With / Without Icons, Custom Styles via css vars + class hooks, Hint rendering.
 */
@Component({
    selector: 'ds-callout',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
  <wa-callout #el
    [attr.appearance]="appearance"
    [attr.variant]="variant || null"
    [attr.size]="size"
    [class]="calloutClass"
    (click)="onClick($event)"
  >
    <ng-container *ngIf="!hideIcon">
      <slot name="icon"><ng-content select="[slot=icon]"></ng-content></slot>
    </ng-container>
    <ng-content></ng-content>
  </wa-callout>
  <span *ngIf="showHint && displayHint" [class]="hintClass" class="text-xs text-slate-500">{{ displayHint }}</span>
  `,
    styles: [`:host{display:block}`]
})
export class DsCalloutComponent implements OnChanges, AfterViewInit {
    protected readonly tag = WA_TAGS.callout;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & { focus(): void; blur(): void; dismiss?: () => void }>;

    // Inputs
    @Input() appearance: string = 'outlined filled';
    @Input() variant: string | null = 'brand';
    @Input() size: 'small' | 'medium' | 'large' = 'medium';
    @Input() hideIcon = false;
    @Input() hint?: string; @Input() help?: string; @Input() showHint = false;
    @Input() calloutClass = '';
    @Input() iconClass = 'text-slate-500';
    @Input() hintClass = 'text-xs text-slate-500';
    @Input() cssVars?: Record<string, string | number | null>;

    // Outputs
    @Output() clickEvent = new EventEmitter<MouseEvent>();

    // Host state classes
    // retained minimal host classes for future extension
    @HostBinding('class') hostBase = 'block';

    get displayHint() { return this.hint ?? this.help; }

    ngAfterViewInit() { this.applyCssVars(); }
    ngOnChanges(ch: SimpleChanges) { if (ch['cssVars'] && this.el) this.applyCssVars(); }

    private applyCssVars() { if (!this.cssVars) return; const s = this.el.nativeElement.style; for (const [k, v] of Object.entries(this.cssVars)) { if (v == null) s.removeProperty(k); else s.setProperty(k, String(v)); } }

    // Events
    onClick(e: MouseEvent) { this.clickEvent.emit(e); }

    // Methods
    focus() { this.el?.nativeElement?.focus?.(); }
    blur() { this.el?.nativeElement?.blur?.(); }
}
