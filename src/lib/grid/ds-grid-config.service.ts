import { Injectable, signal } from '@angular/core';
import type { ColDef, GridOptions } from 'ag-grid-community';

export interface DsGridGlobalDefaults {
    columnDefs?: ColDef[];
    defaultColDef?: ColDef;
    gridOptions?: GridOptions;
    paginationPageSize?: number;
    paginationPageSizeSelector?: number[] | null;
    rowSelection?: 'single' | 'multiple';
    animateRows?: boolean;
    suppressFieldDotNotation?: boolean;
    domLayout?: 'normal' | 'autoHeight' | 'print';
}

const DEFAULTS: Required<Pick<DsGridGlobalDefaults,
    'defaultColDef' | 'paginationPageSize' | 'paginationPageSizeSelector' | 'animateRows' | 'suppressFieldDotNotation'>> & DsGridGlobalDefaults = {
    columnDefs: [],
    defaultColDef: { resizable: true, sortable: true, filter: true },
    gridOptions: {},
    paginationPageSize: 25,
    paginationPageSizeSelector: [10, 20, 25, 50, 100],
    rowSelection: undefined,
    animateRows: true,
    suppressFieldDotNotation: false,
    domLayout: 'normal'
};

@Injectable({ providedIn: 'root' })
export class DsGridConfigService {
    private _defaults = signal<DsGridGlobalDefaults>({ ...DEFAULTS });
    readonly defaults = this._defaults.asReadonly();

    update(partial: Partial<DsGridGlobalDefaults>) {
        this._defaults.update(cur => ({ ...cur, ...partial }));
    }

    getMerged(overrides: Partial<DsGridGlobalDefaults> | null | undefined): DsGridGlobalDefaults {
        return { ...this._defaults(), ...(overrides || {}) };
    }
}
