import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WA_TAGS } from '../wa-registry';

/**
 * ds-tree: wrapper around <wa-tree> with dynamic data model & advanced config.
 * Slots: default (tree items), expand-icon, collapse-icon.
 * Attributes/Props: selection(single|multiple|leaf)
 * Events: wa-selection-change -> selectionChange
 * CSS Custom Properties: --indent-size, --indent-guide-color, --indent-guide-offset, --indent-guide-style, --indent-guide-width
 * CSS Parts: base
 * Dynamic Features: indent guide toggle, custom expand/collapse icons, lazy loading handler, icon support per node, multi/leaf/single selection.
 */
@Component({
    selector: 'ds-tree',
    standalone: true,
    imports: [CommonModule],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
    <wa-tree #el
      [class]="treeClass"
      [attr.selection]="selection"
      (wa-selection-change)="onSelectionChange($event)"
      (wa-expand)="onExpand($event)"
      (wa-collapse)="onCollapse($event)"
      (wa-lazy-load)="onLazyLoad($event)"
    >
      <!-- Global expand/collapse icons -->
      <ng-content select="[slot=expand-icon]"></ng-content>
      <ng-content select="[slot=collapse-icon]"></ng-content>

      <!-- Static projected tree-item children -->
      <ng-content select="wa-tree-item"></ng-content>

      <!-- Dynamic items (render if provided) -->
      <ng-container *ngIf="nodes?.length">
        <ng-container *ngFor="let node of nodes">
          <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: node }"></ng-container>
        </ng-container>
      </ng-container>
    </wa-tree>

    <ng-template #renderNode let-node>
      <wa-tree-item
        [attr.expanded]="node.expanded ? '' : null"
        [attr.selected]="node.selected ? '' : null"
        [attr.disabled]="node.disabled ? '' : null"
        [attr.lazy]="node.lazy ? '' : null"
        [attr.indeterminate]="node.indeterminate ? '' : null"
      >
        <span class="inline-flex items-center gap-1">
          <span *ngIf="node.icon" [innerHTML]="node.icon"></span>
          {{ node.label }}
        </span>
        <!-- Children -->
        <ng-container *ngIf="node.children?.length" >
          <ng-container *ngFor="let child of node.children">
            <ng-container *ngTemplateOutlet="renderNode; context: { $implicit: child }"></ng-container>
          </ng-container>
        </ng-container>
        <!-- Custom per-node expand/collapse icons -->
        <span *ngIf="node.expandIcon" slot="expand-icon" [innerHTML]="node.expandIcon"></span>
        <span *ngIf="node.collapseIcon" slot="collapse-icon" [innerHTML]="node.collapseIcon"></span>
      </wa-tree-item>
    </ng-template>
  `,
    styles: [`:host{display:block}`]
})
export class DsTreeComponent implements OnChanges {
    static readonly tag = WA_TAGS.tree;
    @ViewChild('el', { static: true }) el!: ElementRef<HTMLElement & WaTreeEl>;

    // Selection behavior
    @Input() selection: 'single' | 'multiple' | 'leaf' = 'single';

    // Dynamic nodes
    @Input() nodes: DsTreeNode[] = [];

    // Indent guide toggle & vars
    @Input() showIndentGuide = false;
    @Input() treeClass = '';
    @Input() cssVars?: Record<string, string | number | null>; // indent related css vars

    // Outputs
    @Output() selectionChange = new EventEmitter<WaTreeItemSelectionPayload>();
    @Output() itemExpand = new EventEmitter<Event>();
    @Output() itemCollapse = new EventEmitter<Event>();
    @Output() itemLazyLoad = new EventEmitter<Event>();

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['cssVars']) this.applyCssVars();
    }
    ngAfterViewInit() { this.applyCssVars(); }

    private applyCssVars() {
        if (!this.el?.nativeElement || !this.cssVars) return;
        const style = (this.el.nativeElement as HTMLElement).style;
        for (const [k, v] of Object.entries(this.cssVars)) {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        }
        // Optional indent guide enablement via --indent-guide-width
        if (this.showIndentGuide && !('--indent-guide-width' in (this.cssVars || {}))) {
            style.setProperty('--indent-guide-width', '1px');
        }
    }

    onSelectionChange(e: Event) {
        const ce = e as CustomEvent<{ selection: any[] }>;
        if (ce?.detail) this.selectionChange.emit({ selection: ce.detail.selection });
    }

    onExpand(e: Event) { this.itemExpand.emit(e); }
    onCollapse(e: Event) { this.itemCollapse.emit(e); }
    onLazyLoad(e: Event) { this.itemLazyLoad.emit(e); }

    // Programmatic helpers
    getSelectedItems(): any[] { return (this.el?.nativeElement as any)?.selectedItems ?? []; }
}

export interface DsTreeNode {
    label: string;
    icon?: string; // HTML for icon
    expanded?: boolean;
    selected?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    lazy?: boolean;
    expandIcon?: string;
    collapseIcon?: string;
    children?: DsTreeNode[];
}

export interface WaTreeItemSelectionPayload { selection: any[]; }

interface WaTreeEl extends HTMLElement {
    selection: 'single' | 'multiple' | 'leaf';
    selectedItems: any[];
}
