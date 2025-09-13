import { Routes } from '@angular/router';
import { AboutComponent } from './features/about/about.component';
import { DocsComponent } from './features/docs/docs.component';
import { HomeComponent } from './features/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent },
    { path: 'docs', component: DocsComponent },
    { path: 'docs/:section', component: DocsComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
