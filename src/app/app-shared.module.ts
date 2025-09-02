import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DsComponentsModule } from '../lib/ds-components.module';

// Central shared module: import once, export everywhere.
// Adds core Angular modules + all ds-* components via DsComponentsModule.
@NgModule({
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DsComponentsModule],
    exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, DsComponentsModule]
})
export class AppSharedModule { }
