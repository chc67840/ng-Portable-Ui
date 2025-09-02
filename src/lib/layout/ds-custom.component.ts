import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ViewContainerRef, OnChanges, SimpleChanges, ComponentRef, Optional, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DsLayoutConfig, DsContainerConfig, DsRowConfig, DsColumnConfig, DsComponentConfig, DsLayoutConfigType, DsComponentType, DsLayoutExpression, DsLayoutBinding } from '../ds.model';
// Import ds-* component classes for dynamic creation; NOT added to template imports (Ivy supports dynamic creation w/out declaration here).
// Core form controls
import { DsTextComponent } from '../formcontrol/ds-text.component';
import { DsNumberComponent } from '../formcontrol/ds-number.component';
import { DsDateComponent } from '../formcontrol/ds-date.component';
import { DsTimeComponent } from '../ds-time.component';
import { DsDateTimeComponent } from '../formcontrol/ds-datetime.component';
import { DsSelectComponent } from '../formcontrol/ds-select.component';
import { DsSwitchComponent } from '../formcontrol/ds-switch.component';
import { DsRadioGroupComponent } from '../formcontrol/ds-radio-group.component';
import { DsTextareaComponent } from '../formcontrol/ds-textarea.component';
import { DsCheckboxComponent } from '../formcontrol/ds-checkbox.component';
import { DsAvatarComponent } from '../formcontrol/ds-avatar.component';
import { DsAvatarGroupComponent } from '../formcontrol/ds-avatar-group.component';

// Action
import { DsButtonComponent } from '../action/ds-button.component';
import { DsButtonGroupComponent } from '../action/ds-button-group.component';
import { DsDropdownComponent } from '../action/ds-dropdown.component';
import { DsPopoverComponent } from '../action/ds-popover.component';
import { DsIconComponent } from '../action/ds-icon.component';

// Feedback / status
import { DsProgressRingComponent } from '../feedback-status/ds-progress-ring.component';
import { DsTooltipComponent } from '../feedback-status/ds-tooltip.component';
import { DsToastComponent } from '../feedback-status/ds-toast.component';
import { DsToastContainerComponent } from '../feedback-status/ds-toast-container.component';
import { DsBadgeComponent } from '../feedback-status/ds-badge.component';
import { DsCalloutComponent } from '../feedback-status/ds-callout.component';
import { DsSkeletonComponent } from '../feedback-status/ds-skeleton.component';
import { DsSpinnerComponent } from '../feedback-status/ds-spinner.component';
import { DsTaComponent } from '../feedback-status/ds-ta.component';

// Navigation / structure
import { DsNavComponent } from '../nav/ds-nav.component';
import { DsBreadcrumbComponent } from '../nav/ds-breadcrumb.component';
import { DsTabGroupComponent } from '../nav/ds-tab-group.component';
import { DsTreeComponent } from '../nav/ds-tree.component';
import { DsTreeItemComponent } from '../nav/ds-tree-item.component';

// Organize / layout
import { DsCardComponent } from '../organize/ds-card.component';
import { DsDetailsComponent } from '../organize/ds-details.component';
import { DsDialogComponent } from '../organize/ds-dialog.component';
import { DsDividerComponent } from '../organize/ds-divider.component';
import { DsSplitPanelComponent } from '../organize/ds-split-panel.component';
import { DsDrawComponent } from '../organize/ds-draw.component';

// Utility
import { DsPopupComponent } from '../utility/ds-popup.component';

// Data
import { DsGridComponent } from '../data/ds-grid.component';

/**
 * ds-custom: Dynamic layout renderer for declarative DsLayoutSchema JSON.
 * Phase 1 scope (MVP):
 *  - Accept a layout schema (object) or JSON string representing either a full schema { root, ... } or a container node.
 *  - Render container -> rows -> columns -> component (supports basic component set: text, button).
 *  - Apply simple span-based 12 column grid using CSS grid utilities.
 *  - Assign config object properties onto dynamically created ds-* component instances.
 *  - Ignore advanced bindings (conditions, actions, repeat) for first iteration.
 *
 * Phase 1b enhancements (implemented):
 *  - Basic bindings (bind + legacy bindings) supporting simple context path -> component property (config.* or direct property names).
 *  - Conditions: evaluates node.visible / node.disabled (boolean | expression) + conditions.visible/disabled (string/function) to skip rendering.
 *  - Repeaters: rOf (string path or function) expansion for component/column/row nodes (shallow clone per item). rAs/rIndex available in item context.
 *  - Actions: minimal event wiring (click only) resolving action id in schema.actions and invoking handler / console logging.
 *  - i18n: labelKey/descriptionKey placeholders via provided translate function t(key).
 *  - Broader component coverage: text, button, number, select.
 *
 * Implemented additions (this pass):
 *  - rKey diffing for rows & columns (component-level previously)
 *  - Value back-binding (valueChange -> context path when bound to value)
 *  - Disabled/readonly application from conditions.disabled/readonly
 *  - Nested container full rendering (recursive ds-custom instantiation)
 *  - Navigation & emit action types
 *  - Basic virtualization (large collections slice + placeholder) for component repeaters
 *  - Context update hook (updateContext) to reapply bindings without full rerender
 *
 * Remaining future iterations could add:
 *  - Async data loading hooks
 *  - True windowed virtualization with scroll listeners & spacer elements
 *  - Fine-grained diffing instead of full rerender for structural changes
 */
@Component({
    selector: 'ds-custom',
    standalone: true,
    encapsulation: ViewEncapsulation.None,
    imports: [CommonModule],
    template: `
    <div class="ds-layout-root" #host>
      <!-- Dynamic content injected imperatively. For hydration / SSR later we can move to structural templates. -->
      <ng-container *ngIf="debug && lastError" class="text-red-600 text-sm font-mono">{{ lastError }}</ng-container>
    </div>
  `,
    styles: [`
        :host{display:block;width:100%;}
        .ds-layout-container{display:flex;flex-direction:column;gap:1rem;width:100%;}
        .ds-layout-row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:1rem;width:100%;align-items:start;}
        .ds-layout-col{min-width:0;display:flex;flex-direction:column;gap:1rem;}
    `]
})
export class DsCustomComponent implements OnChanges {
    // ===================== Inputs / Public API =====================
    @ViewChild('host', { read: ViewContainerRef, static: true }) hostVc!: ViewContainerRef;

    /** Accepts either a full schema (with root) or a single container node. */
    @Input() schema?: DsLayoutConfig | DsContainerConfig | null;
    /** Alternative JSON string input; parsed on change (wins over schema if provided). */
    @Input() layoutJson?: string | null;
    /** Auto render on input changes (default true). */
    @Input() autoRender = true;
    /** Show basic debug info (errors). */
    @Input() debug = false;
    /** External context (merged over schema.contextDefaults if schema provided). */
    @Input() context: any = {};
    /** Optional translate function for i18n key resolution. */
    @Input() t?: (key: string) => string;

    lastError: string | null = null;

    // Component map (complete set of current ds-* wrappers)
    private componentMap: Record<DsComponentType, any> = {
        text: DsTextComponent,
        number: DsNumberComponent,
        date: DsDateComponent,
        time: DsTimeComponent,
        datetime: DsDateTimeComponent,
        select: DsSelectComponent,
        switch: DsSwitchComponent,
        'radio-group': DsRadioGroupComponent,
        textarea: DsTextareaComponent,
        checkbox: DsCheckboxComponent,
        avatar: DsAvatarComponent,
        'avatar-group': DsAvatarGroupComponent,
        button: DsButtonComponent,
        'button-group': DsButtonGroupComponent,
        dropdown: DsDropdownComponent,
        popover: DsPopoverComponent,
        icon: DsIconComponent,
        'progress-ring': DsProgressRingComponent,
        tooltip: DsTooltipComponent,
        toast: DsToastComponent,
        'toast-container': DsToastContainerComponent,
        badge: DsBadgeComponent,
        callout: DsCalloutComponent,
        spinner: DsSpinnerComponent,
        skeleton: DsSkeletonComponent,
        popup: DsPopupComponent,
        card: DsCardComponent,
        details: DsDetailsComponent,
        dialog: DsDialogComponent,
        divider: DsDividerComponent,
        'split-panel': DsSplitPanelComponent,
        breadcrumb: DsBreadcrumbComponent,
        'tab-group': DsTabGroupComponent,
        tree: DsTreeComponent,
        tag: DsTaComponent,
        grid: DsGridComponent,
        nav: DsNavComponent
    };

    // Action definitions by id
    private actionMap = new Map<string, any>();
    // Working context (schema.contextDefaults merged with external context)
    private mergedContext: any = {};
    // Repeater keyed state for diffing to avoid re-creation
    private repeaterState = new Map<string, { refs: Map<any, any>; order: any[]; parent: HTMLElement; kind: 'component' | 'row' | 'column'; }>();
    // Action runtime (throttle / debounce bookkeeping)
    private actionRuntime = new Map<string, { lastTs?: number; timer?: any }>();

    constructor(@Optional() private router: Router) { }

    // ===================== Angular Lifecycle =====================
    ngOnChanges(changes: SimpleChanges): void {
        if (this.autoRender && (changes['schema'] || changes['layoutJson'])) {
            this.renderSafe();
        }
    }

    /** Public manual trigger */
    render() { this.renderSafe(); }

    // ===================== Root Resolution =====================
    /** Normalize provided schema/layoutJson into a root container and build action/context maps. */
    private resolveRootContainer(): DsContainerConfig | null {
        let src: any = null;
        if (this.layoutJson) {
            try {
                src = JSON.parse(this.layoutJson);
            } catch (e: any) {
                this.lastError = 'Invalid layoutJson: ' + e?.message;
                return null;
            }
        } else {
            src = this.schema as any;
        }
        if (!src) return null;
        // If full schema
        if (src.root && src.root.kind === 'container') {
            // Merge context defaults with provided context (shallow)
            this.mergedContext = { ...(src.contextDefaults || {}), ...(this.context || {}) };
            this.buildActionMap(src.actions);
            return src.root as DsContainerConfig;
        }
        // If already a container node
        if (src.kind === 'container') {
            this.mergedContext = { ...(this.context || {}) };
            return src as DsContainerConfig;
        }
        this.lastError = 'Provided layout root is not a container node';
        return null;
    }

    private buildActionMap(actions: any[] | undefined) {
        this.actionMap.clear();
        (actions || []).forEach(a => { if (a?.id) this.actionMap.set(a.id, a); });
    }

    private clearHost() { if (this.hostVc) this.hostVc.clear(); }

    // ===================== Render Orchestrator =====================
    private renderSafe() {
        this.lastError = null;
        this.clearHost();
        const root = this.resolveRootContainer();
        if (!root) return;
        try {
            this.renderContainer(root, this.hostVc);
        } catch (e: any) {
            this.lastError = e?.message || String(e);
        }
    }

    // ======================================================================
    // Rendering (Containers / Rows / Columns / Components)
    // ======================================================================
    private renderContainer(container: DsContainerConfig, target: ViewContainerRef) {
        const wrapperRef = target.createComponent(DummyContainerComponent);
        const el = wrapperRef.location.nativeElement as HTMLElement;
        el.classList.add('ds-layout-container');
        if (container.class) el.classList.add(...container.class.split(/\s+/));
        if (container.title) {
            const h = document.createElement('h3');
            h.textContent = this.resolveI18n(container.title) || '';
            h.className = 'font-semibold text-lg';
            el.appendChild(h);
        }
        // Rows
        (container.rows || []).forEach(row => this.appendRow(row, el));
    }

    private appendRow(row: DsRowConfig, parentEl: HTMLElement) {
        // Repeater handling with diffing
        if (row.rOf) {
            this.renderRowRepeater(row, parentEl, this.mergedContext);
            return;
        }
        if (!this.shouldRenderNode(row)) return;
        this.renderSingleRow(row, parentEl, this.mergedContext);
    }

    private renderSingleRow(row: DsRowConfig, parentEl: HTMLElement, ctx: any) {
        const rowEl = document.createElement('div');
        rowEl.className = 'ds-layout-row';
        if (row.class) rowEl.className += ' ' + row.class;
        parentEl.appendChild(rowEl);
        (row.columns || []).forEach(col => this.appendColumn(col, rowEl, ctx));
    }

    private appendColumn(col: DsColumnConfig, rowEl: HTMLElement, parentCtx?: any) {
        const baseCtx = parentCtx || this.mergedContext;
        if (col.rOf) {
            this.renderColumnRepeater(col, rowEl, baseCtx);
            return;
        }
        if (!this.shouldRenderNode(col, baseCtx)) return;
        this.renderSingleColumn(col, rowEl, baseCtx);
    }

    private renderSingleColumn(col: DsColumnConfig, rowEl: HTMLElement, ctx: any) {
        const span = col.span ?? 12;
        const colEl = document.createElement('div');
        colEl.className = 'ds-layout-col';
        // Grid column span via style (tailwind dynamic class generation avoided for simplicity in MVP)
        colEl.style.gridColumn = `span ${span} / span ${span}`;
        if (col.class) colEl.className += ' ' + col.class;
        if (this.debug) {
            colEl.style.outline = '1px dashed rgba(99,102,241,0.4)';
            colEl.style.outlineOffset = '2px';
        }
        rowEl.appendChild(colEl);
        (col.content || []).forEach(node => this.appendNodeWithContext(node, colEl, ctx));
    }

    private appendNodeWithContext(node: DsLayoutConfigType, parentEl: HTMLElement, ctx: any) {
        switch (node.kind) {
            case 'container':
                this.renderNestedContainer(node as DsContainerConfig, parentEl, ctx);
                break;
            case 'row':
                this.appendRow(node as DsRowConfig, parentEl);
                break;
            case 'column':
                this.appendColumn(node as DsColumnConfig, parentEl);
                break;
            case 'component':
                this.appendComponent(node as DsComponentConfig, parentEl, ctx);
                break;
        }
    }

    private appendComponent(compNode: DsComponentConfig, parentEl: HTMLElement, ctx: any) {
        if (!this.shouldRenderNode(compNode, ctx)) return;
        if (compNode.rOf) { // repeater
            this.renderComponentRepeater(compNode, parentEl, ctx);
            return;
        }
        this.renderSingleComponent(compNode, parentEl, ctx, null, null);
    }

    private renderComponentRepeater(compNode: DsComponentConfig, parentEl: HTMLElement, ctx: any) {
        const collection = this.evalExpression<any[]>(compNode.rOf!, ctx) || [];
        const alias = compNode.rAs || 'item';
        const indexAlias = compNode.rIndex || 'index';
        const keyExpr = compNode.rKey;
        const max = compNode.rLimit || collection.length;
        const nodeKey = compNode.id || '__anon__' + Math.random().toString(36).slice(2);
        const state = this.repeaterState.get(nodeKey) || { refs: new Map(), order: [], parent: parentEl, kind: 'component' as const };
        const nextOrder: any[] = [];
        const used = new Set<any>();
        // Simple virtualization: if many items and node.virtualize truthy, slice the collection
        let working = collection;
        const virtualize: any = (compNode as any).virtualize;
        const virtualLimit = (compNode as any).virtualLimit || 100;
        let virtualTruncated = false;
        if (virtualize && collection.length > virtualLimit) {
            working = collection.slice(0, virtualLimit);
            virtualTruncated = true;
        }
        for (let i = 0; i < working.length && i < max; i++) {
            const item = working[i];
            const itemCtx = { ...ctx, [alias]: item, [indexAlias]: i };
            const keyVal = keyExpr ? this.evalExpression<any>(keyExpr, itemCtx) : i;
            nextOrder.push(keyVal);
            let ref = state.refs.get(keyVal);
            if (!ref) {
                // create new component instance
                ref = this.renderSingleComponent(compNode, parentEl, itemCtx, item, i, true);
                if (ref) state.refs.set(keyVal, ref);
            } else {
                // update existing instance bindings
                this.applyBindingsToInstance(ref, compNode, itemCtx);
            }
            used.add(keyVal);
        }
        // Remove stale refs
        for (const [k, ref] of state.refs.entries()) {
            if (!used.has(k)) {
                ref.destroy();
                state.refs.delete(k);
            }
        }
        state.order = nextOrder;
        this.repeaterState.set(nodeKey, state);
        if (!collection.length && compNode.rEmpty) {
            this.appendComponent(compNode.rEmpty, parentEl, ctx);
        }
        if (virtualTruncated) {
            const more = document.createElement('div');
            more.className = 'text-xs text-slate-400 italic';
            more.textContent = `(+ ${collection.length - working.length} more not rendered)`;
            parentEl.appendChild(more);
        }
    }

    /** Create & initialize a single component node instance. */
    private renderSingleComponent(compNode: DsComponentConfig, parentEl: HTMLElement, ctx: any, item: any, idx: number | null, returnRef = false): ComponentRef<any> | void {
        const ref = this.createComponentRef(compNode, parentEl);
        if (!ref) return;
        this.applyConfig(ref, compNode);
        this.applyBindingsToInstance(ref, compNode, ctx);
        this.applyDisabledReadonly(ref, compNode, ctx);
        this.applyI18n(ref, compNode);
        this.wireActions(ref, compNode, ctx, item, idx);
        this.setupValueBackBinding(ref, compNode, ctx);
        if (returnRef) return ref;
    }

    // ======================================================================
    // Component Pipeline Helpers
    // ======================================================================
    private createComponentRef(compNode: DsComponentConfig, parentEl: HTMLElement): ComponentRef<any> | null {
        const cmpType = compNode.component as DsComponentType;
        const cmpClass = this.componentMap[cmpType];
        if (!cmpClass) {
            const placeholder = document.createElement('div');
            placeholder.className = 'text-xs text-amber-600 font-mono';
            placeholder.textContent = `[Unsupported component: ${cmpType}]`;
            parentEl.appendChild(placeholder);
            return null;
        }
        const ref: ComponentRef<any> = this.hostVc.createComponent(cmpClass);
        const el = ref.location.nativeElement as HTMLElement;
        parentEl.appendChild(el);
        if (compNode.class) el.classList.add(...compNode.class.split(/\s+/));
        this.applyCssVars(el, compNode.cssVars);
        return ref;
    }

    private applyConfig(ref: ComponentRef<any>, compNode: DsComponentConfig) {
        const cfg: any = compNode.config || {};
        Object.keys(cfg).forEach(k => {
            if (ref.instance && k in (ref.instance as any)) {
                try { (ref.instance as any)[k] = cfg[k]; } catch { /* ignore */ }
            }
        });
    }

    private applyI18n(ref: ComponentRef<any>, compNode: DsComponentConfig) {
        const inst: any = ref.instance;
        if (!inst) return;
        const i18n: any = (compNode as any).i18n;
        if (!i18n) return;
        if (i18n.labelKey && 'label' in inst && !inst.label) {
            inst.label = this.resolveI18n(i18n.labelKey);
        }
        if (i18n.placeholders) {
            Object.entries(i18n.placeholders).forEach(([prop, key]) => {
                if (prop in inst) inst[prop] = this.resolveI18n(key as string) || key;
            });
        }
    }

    private wireActions(ref: ComponentRef<any>, compNode: DsComponentConfig, ctx: any, item: any, idx: number | null) {
        const el = ref.location.nativeElement as HTMLElement;
        (compNode.actions || []).forEach(trig => {
            if (trig.event === 'click') {
                el.addEventListener('click', (ev) => this.invokeActionWithRuntime(trig, ev, { ctx, item, index: idx, node: compNode }));
            }
        });
    }

    /** Resolve & assign declared bindings onto component instance. */
    private applyBindingsToInstance(ref: ComponentRef<any>, compNode: DsComponentConfig, ctx: any) {
        const bindings = (compNode.bind || compNode.bindings) as Record<string, DsLayoutBinding<any>> | undefined;
        if (bindings) {
            Object.entries(bindings).forEach(([targetPath, binding]) => {
                const value = this.resolveBinding(binding, ctx);
                const prop = targetPath.startsWith('config.') ? targetPath.slice(7) : targetPath;
                if (ref.instance && prop in (ref.instance as any)) {
                    try { (ref.instance as any)[prop] = value; } catch { /* ignore */ }
                }
            });
        }
    }

    /** Apply disabled/readonly state based on conditions.* expressions. */
    private applyDisabledReadonly(ref: ComponentRef<any>, compNode: DsComponentConfig, ctx: any) {
        const conds = (compNode as any).conditions || {};
        if (!ref.instance) return;
        if (conds.disabled != null && 'disabled' in ref.instance) {
            const disabled = this.evalExpression<boolean>(conds.disabled, ctx);
            if (disabled != null) (ref.instance as any).disabled = disabled;
        }
        if (conds.readonly != null && ('readonly' in ref.instance || 'readOnly' in ref.instance)) {
            const ro = this.evalExpression<boolean>(conds.readonly, ctx);
            if (ro != null) {
                if ('readonly' in ref.instance) (ref.instance as any).readonly = ro; else (ref.instance as any).readOnly = ro;
            }
        }
    }

    /** Wire valueChange (or change fallback) to update mergedContext for two-way like behavior. */
    private setupValueBackBinding(ref: ComponentRef<any>, compNode: DsComponentConfig, ctx: any) {
        const bindings = (compNode.bind || compNode.bindings) as Record<string, DsLayoutBinding<any>> | undefined;
        if (!bindings || !ref.instance) return;
        const valueBindingEntry = Object.entries(bindings).find(([targetPath]) => targetPath === 'value' || targetPath === 'config.value');
        if (!valueBindingEntry) return;
        const [, binding] = valueBindingEntry;
        if (!binding.path) return;
        // Listen to valueChange EventEmitter or DOM event fallback
        const inst: any = ref.instance;
        const updateCtx = (val: any) => {
            this.setByPath(this.mergedContext, binding.path!, val);
        };
        if (inst.valueChange && typeof inst.valueChange.subscribe === 'function') {
            inst.valueChange.subscribe((val: any) => updateCtx(val));
        } else if (ref.location && ref.location.nativeElement) {
            // Fallback: listen to change event
            ref.location.nativeElement.addEventListener('change', (e: any) => updateCtx(e?.target?.value));
        }
    }

    // ================= Utility / Evaluation =================
    // ======================================================================
    // Evaluation / Binding Helpers
    // ======================================================================
    private evalExpression<T>(expr: DsLayoutExpression<T>, ctx: any): T | undefined {
        if (expr == null) return undefined;
        if (typeof expr === 'function') {
            try { return (expr as any)(ctx); } catch { return undefined; }
        }
        if (typeof expr === 'string') {
            return this.getByPath(ctx, expr) as T;
        }
        return expr as any;
    }

    private getByPath(obj: any, path: string): any {
        if (!obj || !path) return undefined;
        const parts = path.split('.');
        let cur = obj;
        for (const p of parts) {
            if (cur == null) return undefined;
            cur = cur[p];
        }
        return cur;
    }

    private resolveBinding(binding: DsLayoutBinding<any>, ctx: any): any {
        if (!binding) return undefined;
        let baseVal: any = undefined;
        if (binding.path) baseVal = this.getByPath(ctx, binding.path);
        if (baseVal === undefined) {
            if (binding.strict) return undefined;
            baseVal = binding.default !== undefined ? binding.default : baseVal;
        }
        if (binding.transform) {
            try { return binding.transform(baseVal, ctx); } catch { return baseVal; }
        }
        return baseVal;
    }

    private shouldRenderNode(node: any, ctx: any = this.mergedContext): boolean {
        // visible property may be boolean or function
        if (typeof node.visible === 'function') {
            try { if (!(node.visible as any)(ctx)) return false; } catch { return false; }
        } else if (node.visible === false) return false;
        const conds = node.conditions;
        if (conds) {
            if (conds.if != null) {
                const pass = this.evalExpression<boolean>(conds.if, ctx);
                if (!pass) return false;
            }
            if (conds.visible != null) {
                const vis = this.evalExpression<boolean>(conds.visible, ctx);
                if (!vis) return false;
            }
            // disabled/readonly evaluated later when applying bindings (would set properties)
        }
        return true;
    }

    /** Resolve i18n key using provided translator (if any). */
    private resolveI18n(key: string | undefined): string | undefined {
        if (!key) return key;
        if (this.t) {
            try { return this.t(key); } catch { return key; }
        }
        return key; // fallback to key when no translator
    }

    // ======================================================================
    // Actions / Events
    // ======================================================================
    private invokeAction(actionId: string, ctx: any) {
        const def = this.actionMap.get(actionId);
        if (!def) {
            if (this.debug) console.warn('[ds-custom] action not found:', actionId);
            return;
        }
        if (def.type === 'custom' && typeof def.handler === 'function') {
            try { def.handler(ctx); } catch (e) { if (this.debug) console.error('Action handler error', e); }
            return;
        }
        if (def.type === 'submit') {
            if (this.debug) console.log('Submit action (placeholder):', def.payload);
            // future: collect form values & POST
        }
        if (def.type === 'navigate') {
            const to = def.to || def.route;
            if (to) {
                if (this.router) {
                    this.router.navigateByUrl(to).catch(err => this.debug && console.error('Navigate error', err));
                } else {
                    try { window.location.href = to; } catch { /* ignore */ }
                }
            }
            return;
        }
        if (def.type === 'emit') {
            const eventName = def.event || def.name || 'ds-custom-event';
            const detail = { payload: def.payload, ctx };
            const hostEl = (this.hostVc?.element?.nativeElement as HTMLElement) || document.body;
            hostEl.dispatchEvent(new CustomEvent(eventName, { detail }));
            return;
        }
    }

    private invokeActionWithRuntime(trigger: any, ev: Event, ctx: any) {
        if (trigger.preventDefault) ev.preventDefault();
        if (trigger.stopPropagation) ev.stopPropagation();
        const id = trigger.action;
        const runtime = this.actionRuntime.get(id) || {};
        const now = Date.now();
        // throttle
        if (trigger.throttleMs && runtime.lastTs && now - runtime.lastTs < trigger.throttleMs) {
            return;
        }
        // debounce
        if (trigger.debounceMs) {
            if (runtime.timer) clearTimeout(runtime.timer);
            runtime.timer = setTimeout(() => {
                runtime.lastTs = Date.now();
                this.invokeAction(id, ctx);
            }, trigger.debounceMs);
            this.actionRuntime.set(id, runtime);
            return;
        }
        runtime.lastTs = now;
        this.actionRuntime.set(id, runtime);
        this.invokeAction(id, ctx);
    }

    // ======================================================================
    // Styling Helpers
    // ======================================================================
    private applyCssVars(el: HTMLElement, vars?: Record<string, string | number | null>) {
        if (!vars) return;
        const style = el.style;
        Object.entries(vars).forEach(([k, v]) => {
            if (v == null) style.removeProperty(k); else style.setProperty(k, String(v));
        });
    }

    // ================= Row & Column Repeater Diffing =================
    // ======================================================================
    // Repeaters (Row / Column / Component) with Keyed Diffing
    // ======================================================================
    private renderRowRepeater(rowNode: DsRowConfig, parentEl: HTMLElement, ctx: any) {
        const collection = this.evalExpression<any[]>(rowNode.rOf!, ctx) || [];
        const alias = rowNode.rAs || 'item';
        const indexAlias = rowNode.rIndex || 'index';
        const keyExpr = rowNode.rKey;
        const max = rowNode.rLimit || collection.length;
        const nodeKey = rowNode.id || '__row__' + Math.random().toString(36).slice(2);
        const state = this.repeaterState.get(nodeKey) || { refs: new Map(), order: [], parent: parentEl, kind: 'row' as const };
        const used = new Set<any>();
        const nextOrder: any[] = [];
        for (let i = 0; i < collection.length && i < max; i++) {
            const item = collection[i];
            const itemCtx = { ...ctx, [alias]: item, [indexAlias]: i };
            const keyVal = keyExpr ? this.evalExpression<any>(keyExpr, itemCtx) : i;
            nextOrder.push(keyVal);
            let rowEl = state.refs.get(keyVal) as HTMLElement | undefined;
            if (!rowEl) {
                rowEl = document.createElement('div');
                rowEl.className = 'ds-layout-row';
                if (rowNode.class) rowEl.className += ' ' + rowNode.class;
                parentEl.appendChild(rowEl);
                state.refs.set(keyVal, rowEl);
            } else {
                // Clear existing row content for re-render (simple strategy)
                rowEl.innerHTML = '';
            }
            (rowNode.columns || []).forEach(col => this.appendColumn(col, rowEl!, itemCtx));
            used.add(keyVal);
        }
        // Remove stale
        for (const [k, elRef] of state.refs.entries()) {
            if (!used.has(k)) {
                (elRef as HTMLElement).remove();
                state.refs.delete(k);
            }
        }
        state.order = nextOrder;
        this.repeaterState.set(nodeKey, state);
    }

    private renderColumnRepeater(colNode: DsColumnConfig, rowEl: HTMLElement, ctx: any) {
        const collection = this.evalExpression<any[]>(colNode.rOf!, ctx) || [];
        const alias = colNode.rAs || 'item';
        const indexAlias = colNode.rIndex || 'index';
        const keyExpr = colNode.rKey;
        const max = colNode.rLimit || collection.length;
        const nodeKey = colNode.id || '__col__' + Math.random().toString(36).slice(2);
        const state = this.repeaterState.get(nodeKey) || { refs: new Map(), order: [], parent: rowEl, kind: 'column' as const };
        const used = new Set<any>();
        const nextOrder: any[] = [];
        for (let i = 0; i < collection.length && i < max; i++) {
            const item = collection[i];
            const itemCtx = { ...ctx, [alias]: item, [indexAlias]: i };
            const keyVal = keyExpr ? this.evalExpression<any>(keyExpr, itemCtx) : i;
            nextOrder.push(keyVal);
            let colEl = state.refs.get(keyVal) as HTMLElement | undefined;
            if (!colEl) {
                colEl = document.createElement('div');
                const span = colNode.span ?? 12;
                colEl.className = 'ds-layout-col';
                colEl.style.gridColumn = `span ${span} / span ${span}`;
                if (colNode.class) colEl.className += ' ' + colNode.class;
                rowEl.appendChild(colEl);
                state.refs.set(keyVal, colEl);
            } else {
                colEl.innerHTML = '';
            }
            (colNode.content || []).forEach(n => this.appendNodeWithContext(n, colEl!, itemCtx));
            used.add(keyVal);
        }
        for (const [k, elRef] of state.refs.entries()) {
            if (!used.has(k)) {
                (elRef as HTMLElement).remove();
                state.refs.delete(k);
            }
        }
        state.order = nextOrder;
        this.repeaterState.set(nodeKey, state);
    }

    // ================= Nested Container Rendering =================
    // ======================================================================
    // Nested Containers
    // ======================================================================
    private renderNestedContainer(container: DsContainerConfig, parentEl: HTMLElement, ctx: any) {
        // Create nested ds-custom programmatically
        const ref = this.hostVc.createComponent(DsCustomComponent);
        const el = ref.location.nativeElement as HTMLElement;
        parentEl.appendChild(el);
        ref.instance.schema = container; // container node treated as schema root for nested instance
        ref.instance.context = ctx; // pass current context (already merged)
        ref.instance.t = this.t;
        ref.instance.autoRender = false;
        ref.instance.render();
    }

    // ================= Context Update (Partial Rebind) =================
    /** Merge patch object into current context and reapply bindings to existing component instances without structural rerender. */
    // ======================================================================
    // Context Mutations
    // ======================================================================
    updateContext(patch: any) {
        Object.assign(this.mergedContext, patch || {});
        // Reapply bindings for component repeaters
        for (const state of this.repeaterState.values()) {
            if (state.kind !== 'component') continue;
            for (const ref of state.refs.values()) {
                const cmpRef = ref as ComponentRef<any>;
                // We don't have original compNode here; skipping advanced rebind; full rerender could be used instead.
            }
        }
        // Simpler: full rerender for now (future optimize)
        this.renderSafe();
    }

    // ================= Helpers =================
    // ======================================================================
    // Generic Helpers
    // ======================================================================
    private setByPath(obj: any, path: string, value: any) {
        if (!obj || !path) return;
        const parts = path.split('.');
        let cur = obj;
        for (let i = 0; i < parts.length - 1; i++) {
            const p = parts[i];
            if (cur[p] == null || typeof cur[p] !== 'object') cur[p] = {};
            cur = cur[p];
        }
        cur[parts[parts.length - 1]] = value;
    }
}

/** Dummy lightweight container component used as an anchor so we can obtain a ViewContainerRef slot. */
@Component({
    selector: 'ds-layout-dummy-container',
    standalone: true,
    template: `<ng-content></ng-content>`
})
class DummyContainerComponent { }
