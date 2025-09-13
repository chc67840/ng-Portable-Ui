import { CommonModule, NgClass } from '@angular/common';
import { AfterViewInit, booleanAttribute, Component, CUSTOM_ELEMENTS_SCHEMA, effect, ElementRef, EventEmitter, HostBinding, inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import type { CellClickedEvent, ColDef, FirstDataRenderedEvent, GridApi, GridOptions, RowClickedEvent } from 'ag-grid-community';
import { AllCommunityModule, createGrid, ModuleRegistry } from 'ag-grid-community';
import { DS_GRID_THEMES, DsGridTheme } from '../ds-theme';
import { DsThemeService } from '../ds-theme.service';
import { DsGridConfigService } from '../grid/ds-grid-config.service';

// Register all community modules once (safe to call multiple times but we'll guard)
let __dsGridModulesRegistered = (globalThis as any).__dsGridModulesRegistered as boolean | undefined;
if (!__dsGridModulesRegistered) {
    ModuleRegistry.registerModules([AllCommunityModule]);
    (globalThis as any).__dsGridModulesRegistered = true;
}

/**
 * ds-grid: Wrapper around AG Grid (vanilla community) providing Angular Inputs/Outputs and css var hooks.
 * Inputs:
 *  Inputs (core data & columns): rowData, columnDefs, defaultColDef, gridOptions (shallow merged), columnState
 *  Inputs (appearance): theme (single AG theme class), themeClasses (extra classes string|string[]), height, gridClass, cssVars, themeVars
 *  Inputs (behavior): pagination(+pageSize), rowSelection, animateRows, suppressFieldDotNotation, sizeColumnsToFit, autoSizeAll, quickFilter, domLayout
 *  Inputs (overlays): loading, noRowsMessage, overlayNoRowsTemplate, overlayLoadingTemplate
 *  Inputs (enterprise‑like patterns w/ community fallback): sideBar (object|boolean), localeText
 *  Misc: icons (custom svg strings)
 *  Outputs: gridReady, rowClicked, cellClicked, selectionChanged(array), firstDataRendered, dataUpdated, filterChanged, sortChanged, columnStateChange
 *  Methods: refreshCells, setRowData, exportCsv, sizeToFit, autoSizeAll, getSelectedRows, deselectAll, showLoading, hideOverlay, setQuickFilter, getState, applyColumnState, setTheme
 *  Theming: both cssVars & themeVars applied as CSS custom properties on host for tokenized styling.
 * Custom host state classes: ds-grid-loading, ds-grid-empty
 */
@Component({
    selector: 'ds-grid',
    standalone: true,
    imports: [CommonModule, NgClass],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    template: `
        <div #grid class="w-full h-full relative" [ngClass]="[theme, gridClass]" style="min-height:100%;"></div>
    `,
    styles: [
        `:host{display:block;position:relative;width:100%;}
     :host(.ds-grid-loading)::after{content:'"';position:absolute;inset:0;}
     :host{border:1px solid rgba(0,0,0,0.05);} /* subtle baseline so blank state is visible */
    `
    ]
})
export class DsGridComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
    @ViewChild('grid', { static: true }) gridEl!: ElementRef<HTMLDivElement>;
    private api!: GridApi;
    private created = false;

    // Core config
    @Input() rowData: any[] = [];
    @Input() columnDefs: ColDef[] = [];
    @Input() defaultColDef: ColDef | null = null;
    @Input() gridOptions: GridOptions | null = null;
    @Input() icons?: Record<string, string>;
    @Input() theme = 'ag-theme-quartz';
    // themeMode: 'legacy' uses CSS file themes (ag-theme-* classes). 'modern' uses new Theming API (no ag-grid.css import)
    @Input() themeMode: 'legacy' | 'modern' = 'legacy';
    // name referencing DS_GRID_THEMES map; if provided overrides theme + css vars
    @Input() gridThemeName: keyof typeof DS_GRID_THEMES | null = null;
    // auto-bind to DsThemeService theme name (if service present) when gridThemeName not explicitly set
    @Input({ transform: booleanAttribute }) autoBindTheme: boolean = true;
    // Extra theme / utility classes appended to host & inner container
    @Input() themeClasses: string | string[] | null = null;
    // Opt-out of global defaults service merge
    @Input({ transform: booleanAttribute }) useGlobalDefaults: boolean = true;

    // Behavior toggles
    @Input({ transform: booleanAttribute }) pagination = false;
    @Input() paginationPageSize = 25;
    // Expose selector options (AG Grid expects active size to be included here when using new pagination panel)
    @Input() paginationPageSizeSelector: number[] | null = [10, 20, 25, 50, 100];
    @Input({ transform: booleanAttribute }) sizeColumnsToFit = true;
    @Input({ transform: booleanAttribute }) autoSizeAll = false;
    @Input() rowSelection: 'single' | 'multiple' | undefined;
    @Input({ transform: booleanAttribute }) animateRows = true;
    @Input({ transform: booleanAttribute }) suppressFieldDotNotation = false;
    @Input({ transform: booleanAttribute }) loading = false;
    @Input() noRowsMessage = 'No Rows';
    // Quick filter text (applied to grid)
    @Input() quickFilter: string | null = null;
    @Input() domLayout: 'normal' | 'autoHeight' | 'print' | undefined;
    @Input() sideBar: any; // boolean | object
    @Input() localeText: Record<string, string> | undefined;
    @Input() columnState: any[] | null = null;
    @Input() overlayNoRowsTemplate?: string;
    @Input() overlayLoadingTemplate?: string;

    // Styling
    @Input() height: string | number = 400;
    @Input() gridClass = '';
    @Input() cssVars?: Record<string, string | number | null>;
    @Input() themeVars?: Record<string, string | number | null>;
    @Input() showOutline: boolean = false;

    // Outputs
    @Output() gridReady = new EventEmitter<{ api: GridApi; }>();
    @Output() rowClicked = new EventEmitter<RowClickedEvent>();
    @Output() cellClicked = new EventEmitter<CellClickedEvent>();
    @Output() selectionChanged = new EventEmitter<any[]>();
    @Output() firstDataRendered = new EventEmitter<FirstDataRenderedEvent>();
    @Output() dataUpdated = new EventEmitter<any[]>();
    @Output() filterChanged = new EventEmitter<void>();
    @Output() sortChanged = new EventEmitter<void>();
    @Output() columnStateChange = new EventEmitter<any[]>();

    @HostBinding('class') get hostClass() {
        const extra = Array.isArray(this.themeClasses) ? this.themeClasses : (this.themeClasses ? [this.themeClasses] : []);
        const themeClass = this.themeMode === 'legacy' ? this.theme : '';
        return [themeClass, ...extra, this.gridClass, this.loading ? 'ds-grid-loading' : '', this.rowData?.length ? '' : 'ds-grid-empty', this.showOutline ? 'ds-grid-outline' : ''].filter(Boolean).join(' ');
    }
    @HostBinding('style.height') get hostHeight() { return typeof this.height === 'number' ? this.height + 'px' : this.height; }

    private themeService = inject(DsThemeService, { optional: true });
    private configService = inject(DsGridConfigService, { optional: true });
    private unboundExplicit = false;
    private appliedHostThemeClasses: string[] = [];
    private appliedGridThemeClasses: string[] = [];

    // Auto theme binding effect (must be created in injection context - field initializer)
    private _autoThemeEffect = this.themeService ? effect(() => {
        if (!this.autoBindTheme) return;
        const current = this.themeService!.themeName();
        if (this.gridThemeName) { this.unboundExplicit = true; return; }
        if (this.unboundExplicit) return;
        if (DS_GRID_THEMES[current]) {
            this.gridThemeName = current as keyof typeof DS_GRID_THEMES;
            if (this.created) {
                this.applyDesignSystemTheme();
                this.applyCssVars();
            }
        }
    }) : null;

    ngOnInit() { /* no-op: effect handled via field initializer */ }
    ngAfterViewInit() { this.initGrid(); }
    ngOnChanges(ch: SimpleChanges) {
        if (this.created) {
            if (ch['gridThemeName']) this.applyDesignSystemTheme();
            if (ch['rowData'] && this.api) { this.api.setGridOption('rowData', this.rowData); this.updateOverlays(); this.dataUpdated.emit(this.rowData); }
            if (ch['columnDefs'] && this.api) { this.api.setGridOption('columnDefs', this.columnDefs); this.refreshColumns(); }
            if (ch['loading']) this.updateOverlays();
            if (ch['quickFilter']) this.applyQuickFilter();
            if (ch['cssVars']) this.applyCssVars();
            if (ch['themeVars']) this.applyCssVars();
            if (ch['columnState']) this.applyColumnState();
        }
    }

    private initGrid() {
        // Merge global defaults (if service provided) with instance inputs.
        const globalDefaults = (this.useGlobalDefaults ? (this.configService?.defaults() || {}) : {});
        const options: GridOptions = {
            rowData: this.rowData,
            columnDefs: this.columnDefs.length ? this.columnDefs : (globalDefaults.columnDefs || []),
            defaultColDef: this.defaultColDef || globalDefaults.defaultColDef || { resizable: true, sortable: true, filter: true },
            pagination: this.pagination,
            paginationPageSize: this.paginationPageSize || globalDefaults.paginationPageSize || 25,
            paginationPageSizeSelector: this.paginationPageSizeSelector || globalDefaults.paginationPageSizeSelector || undefined,
            animateRows: this.animateRows ?? globalDefaults.animateRows ?? true,
            rowSelection: this.rowSelection ?? globalDefaults.rowSelection,
            suppressFieldDotNotation: this.suppressFieldDotNotation ?? globalDefaults.suppressFieldDotNotation ?? false,
            icons: this.icons,
            domLayout: this.domLayout || globalDefaults.domLayout,
            sideBar: this.sideBar,
            localeText: this.localeText,
            // Set legacy to silence mixed theme warning when CSS files are present
            theme: this.themeMode === 'legacy' ? 'legacy' : undefined,
            onRowClicked: (e: RowClickedEvent) => this.rowClicked.emit(e),
            onCellClicked: (e: CellClickedEvent) => this.cellClicked.emit(e),
            onSelectionChanged: () => this.selectionChanged.emit(this.getSelectedRows()),
            onFirstDataRendered: (e: FirstDataRenderedEvent) => { this.onFirstData(e); },
            onFilterChanged: () => this.filterChanged.emit(),
            onSortChanged: () => this.sortChanged.emit(),
            onColumnMoved: () => this.emitColumnState(),
            onColumnVisible: () => this.emitColumnState(),
            onColumnResized: () => this.emitColumnState(),
            overlayNoRowsTemplate: this.overlayNoRowsTemplate || `<div class="ag-overlay-loading-center text-sm text-slate-600">${this.noRowsMessage}</div>`,
            overlayLoadingTemplate: this.overlayLoadingTemplate || `<div class="ag-overlay-loading-center text-sm">Loading...</div>`
        };
        if (this.gridOptions) Object.assign(options, this.gridOptions);
        // Ensure theme class exists on the element passed to AG Grid
        const container = this.gridEl.nativeElement;
        if (this.themeMode === 'legacy' && !container.classList.contains(this.theme)) container.classList.add(this.theme);
        this.api = createGrid(container, options);
        // Fallback: if no columns rendered (rare timing), schedule a fit next frame
        requestAnimationFrame(() => {
            const rect = container.getBoundingClientRect();
            if (rect.height < 10) {
                container.style.minHeight = (this.hostHeight || 300) + '';
            }
            if (this.sizeColumnsToFit) this.sizeToFit();
        });
        this.created = true;
        this.applyDesignSystemTheme();
        this.applyCssVars();
        this.applyColumnState();
        this.updateOverlays();
        this.gridReady.emit({ api: this.api });
    }

    private onFirstData(e: FirstDataRenderedEvent) {
        if (this.sizeColumnsToFit) this.sizeToFit();
        if (this.autoSizeAll) this.autoSizeAllColumns();
        this.firstDataRendered.emit(e);
        this.updateOverlays();
    }

    private refreshColumns() { if (this.sizeColumnsToFit) this.sizeToFit(); else if (this.autoSizeAll) this.autoSizeAllColumns(); }
    private updateOverlays() { if (!this.api) return; if (this.loading) this.api.showLoadingOverlay(); else if (!this.rowData?.length) this.api.showNoRowsOverlay(); else this.api.hideOverlay(); }
    private applyCssVars() {
        const el = this.gridEl.nativeElement.parentElement as HTMLElement; // host element
        const s = el.style;
        const merged = { ...(this.themeVars || {}), ...(this.cssVars || {}) } as Record<string, any>;
        for (const [k, v] of Object.entries(merged)) {
            if (v == null) s.removeProperty(k); else s.setProperty(k, String(v));
        }
    }
    private emitColumnState() {
        const state = (this.api as any)?.getColumnState ? (this.api as any).getColumnState() : [];
        this.columnStateChange.emit(state);
    }

    // Public API methods
    refreshCells(params?: any) { this.api?.refreshCells(params); }
    setRowData(data: any[]) { this.rowData = data; this.api?.setGridOption('rowData', data); this.updateOverlays(); }
    exportCsv(params?: any) { this.api?.exportDataAsCsv(params); }
    sizeToFit() { this.api?.sizeColumnsToFit(); }
    autoSizeAllColumns() { const cols: any[] = (this.api as any).getColumns?.() || []; const ids = cols.map(c => c.getId?.()).filter(Boolean); if ((this.api as any).autoSizeColumns && ids.length) { (this.api as any).autoSizeColumns(ids, { skipHeader: false }); } }
    getSelectedRows() { return this.api?.getSelectedRows() || []; }
    deselectAll() { this.api?.deselectAll(); }
    showLoading() { this.loading = true; this.updateOverlays(); }
    hideOverlay() { this.loading = false; this.updateOverlays(); }
    setQuickFilter(value: string) { this.quickFilter = value; this.applyQuickFilter(); }
    private applyQuickFilter() { if (!this.api) return; this.api.setGridOption('quickFilterText', this.quickFilter || ''); }
    // State helpers
    getState() {
        return {
            columnState: (this.api as any)?.getColumnState?.() || [],
            sortModel: (this.api as any)?.getSortModel?.() || [],
            filterModel: this.api?.getFilterModel?.() || {}
        };
    }
    applyColumnState() {
        if (!this.columnState || !this.api || !(this as any).columnState?.length) return;
        const api: any = this.api;
        if (api.applyColumnState) api.applyColumnState({ state: (this as any).columnState, applyOrder: true });
    }
    setTheme(theme: string) {
        const host = this.gridEl.nativeElement.parentElement as HTMLElement;
        if (this.theme && host.classList.contains(this.theme)) host.classList.remove(this.theme);
        this.theme = theme;
        host.classList.add(theme);
    }
    private applyDesignSystemTheme() {
        if (!this.gridThemeName) return;
        const def: DsGridTheme | undefined = DS_GRID_THEMES[this.gridThemeName];
        if (!def) return;
        // remove previously applied theme classes
        const host = this.gridEl.nativeElement.parentElement as HTMLElement;
        this.appliedHostThemeClasses.forEach(c => host.classList.remove(c));
        this.appliedGridThemeClasses.forEach(c => this.gridEl.nativeElement.classList.remove(c));
        this.appliedHostThemeClasses = [];
        this.appliedGridThemeClasses = [];
        // Switch legacy/modern & base theme class
        this.themeMode = def.mode;
        this.theme = def.agTheme;
        // merge css vars (DS theme first so explicit cssVars override)
        this.cssVars = { ...(def.cssVars || {}), ...(this.cssVars || {}) };
        if (def.hostClasses) {
            const arr = Array.isArray(def.hostClasses) ? def.hostClasses : [def.hostClasses];
            arr.forEach(c => { host.classList.add(c); this.appliedHostThemeClasses.push(c); });
        }
        if (def.gridClasses) {
            const arr = Array.isArray(def.gridClasses) ? def.gridClasses : [def.gridClasses];
            arr.forEach(c => { this.gridEl.nativeElement.classList.add(c); this.appliedGridThemeClasses.push(c); });
        }
    }

    ngOnDestroy() { this.api?.destroy(); }
}
