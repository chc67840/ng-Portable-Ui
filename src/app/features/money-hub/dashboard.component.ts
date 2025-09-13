import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HomeComponent } from "../home/home.component";
@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, HomeComponent],
    template: `
        <app-home></app-home>
        ` })
export class DashboardComponent { }
