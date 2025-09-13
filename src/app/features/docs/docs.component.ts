import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-docs',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './docs.component.html'
})
export class DocsComponent {
    sections = [
        { id: 'getting-started', title: 'Getting Started', summary: 'Install and bootstrap the design system.' },
        { id: 'theming', title: 'Theming', summary: 'Customize via CSS variables and tokens.' },
        { id: 'components', title: 'Components', summary: 'ds-* wrapper catalogue and usage.' }
    ];
}
