import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-tree-item: optional explicit wrapper for <wa-tree-item> when users prefer Angular templates.
 * Slots: default (label/content), expand-icon, collapse-icon.
 * Inputs map to attributes; events re-emitted.
 */
@Component({
    selector: 'ds-tree-item',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-tree-item #el
      [attr.expanded]="expanded ? '' : null"
      [attr.selected]="selected ? '' : null"
      [attr.disabled]="disabled ? '' : null"
      [attr.lazy]="lazy ? '' : null"
      [attr.loading]="loading ? '' : null"
      [attr.indeterminate]="indeterminate ? '' : null"
      (wa-expand)="expand.emit($event)"
      (wa-expand-after)="expandAfter.emit($event)"
      (wa-collapse)="collapse.emit($event)"
      (wa-collapse-after)="collapseAfter.emit($event)"
      (wa-lazy-change)="lazyChange.emit($event)"
      (wa-lazy-load)="lazyLoad.emit($event)"
    >
      <ng-content></ng-content>
      <ng-content select="[slot=expand-icon]"></ng-content>
      <ng-content select="[slot=collapse-icon]"></ng-content>
    </wa-tree-item>
  `,
    styles: [':host{display:contents}']
})
export class DsTreeItemComponent implements OnChanges {
    static readonly tag = WA_TAGS.treeItem;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement>;

    @Input() expanded = false;
    @Input() selected = false;
    @Input() disabled = false;
    @Input() lazy = false;
    @Input() loading = false;
    @Input() indeterminate = false;

    @Output() expand = new EventEmitter<Event>();
    @Output() expandAfter = new EventEmitter<Event>();
    @Output() collapse = new EventEmitter<Event>();
    @Output() collapseAfter = new EventEmitter<Event>();
    @Output() lazyChange = new EventEmitter<Event>();
    @Output() lazyLoad = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        // Could sync additional runtime props if underlying element exposes methods
    }
}
