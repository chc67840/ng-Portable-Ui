import { NgModule } from '@angular/core';

// Form control components
import { DsAvatarGroupComponent } from './formcontrol/ds-avatar-group.component';
import { DsAvatarComponent } from './formcontrol/ds-avatar.component';
import { DsCheckboxComponent } from './formcontrol/ds-checkbox.component';
import { DsDateComponent } from './formcontrol/ds-date.component';
import { DsDateTimeComponent } from './formcontrol/ds-datetime.component';
import { DsNumberComponent } from './formcontrol/ds-number.component';
import { DsRadioGroupComponent } from './formcontrol/ds-radio-group.component';
import { DsSelectComponent } from './formcontrol/ds-select.component';
import { DsSwitchComponent } from './formcontrol/ds-switch.component';
import { DsTextComponent } from './formcontrol/ds-text.component';
import { DsTextareaComponent } from './formcontrol/ds-textarea.component';
import { DsTimeComponent } from './formcontrol/ds-time.component';

// Action / interactive components
import { DsButtonGroupComponent } from './action/ds-button-group.component';
import { DsButtonComponent } from './action/ds-button.component';
import { DsDropdownComponent } from './action/ds-dropdown.component';
import { DsIconComponent } from './action/ds-icon.component';
import { DsPopoverComponent } from './action/ds-popover.component';

// Feedback / status components
import { DsBadgeComponent } from './feedback-status/ds-badge.component';
import { DsCalloutComponent } from './feedback-status/ds-callout.component';
import { DsProgressRingComponent } from './feedback-status/ds-progress-ring.component';
import { DsSkeletonComponent } from './feedback-status/ds-skeleton.component';
import { DsSpinnerComponent } from './feedback-status/ds-spinner.component';
import { DsTaComponent } from './feedback-status/ds-ta.component';
import { DsToastContainerComponent } from './feedback-status/ds-toast-container.component';
import { DsToastComponent } from './feedback-status/ds-toast.component';
import { DsTooltipComponent } from './feedback-status/ds-tooltip.component';

// Navigation / structure
import { DsBreadcrumbComponent } from './nav/ds-breadcrumb.component';
import { DsNavComponent } from './nav/ds-nav.component';
import { DsTabGroupComponent } from './nav/ds-tab-group.component';
import { DsTreeItemComponent } from './nav/ds-tree-item.component';
import { DsTreeComponent } from './nav/ds-tree.component';

// Organize / layout
import { DsCardComponent } from './organize/ds-card.component';
import { DsDetailsComponent } from './organize/ds-details.component';
import { DsDialogComponent } from './organize/ds-dialog.component';
import { DsDividerComponent } from './organize/ds-divider.component';
import { DsDrawComponent } from './organize/ds-draw.component';
import { DsSplitPanelComponent } from './organize/ds-split-panel.component';

// Utility
import { DsPopupComponent } from './utility/ds-popup.component';

// Data
import { DsGridComponent } from './data/ds-grid.component';
// Layout / dynamic
import { DsCustomComponent } from './layout/ds-custom.component';

// Aggregated array for convenience (also exported)
export const DS_COMPONENTS = [
    // form controls
    DsTextComponent, DsNumberComponent, DsDateComponent, DsTimeComponent, DsDateTimeComponent, DsSelectComponent,
    DsSwitchComponent, DsRadioGroupComponent, DsTextareaComponent, DsCheckboxComponent, DsAvatarComponent, DsAvatarGroupComponent,
    // action
    DsButtonComponent, DsButtonGroupComponent, DsDropdownComponent, DsPopoverComponent, DsIconComponent,
    // feedback
    DsProgressRingComponent, DsTooltipComponent, DsToastComponent, DsToastContainerComponent, DsBadgeComponent, DsCalloutComponent,
    DsSkeletonComponent, DsSpinnerComponent, DsTaComponent,
    // navigation
    DsNavComponent, DsBreadcrumbComponent, DsTabGroupComponent, DsTreeComponent, DsTreeItemComponent,
    // organize
    DsCardComponent, DsDetailsComponent, DsDialogComponent, DsDividerComponent, DsSplitPanelComponent, DsDrawComponent,
    // utility
    DsPopupComponent,
    // data
    DsGridComponent,
    // layout
    DsCustomComponent
];

@NgModule({
    // For standalone components we list them under imports so consumers using the module
    // get them transitively; avoid spread for better Angular static analysis.
    imports: DS_COMPONENTS,
    exports: DS_COMPONENTS
})
export class DsComponentsModule { }

// Re-export classes for direct imports
export { DsAvatarComponent, DsAvatarGroupComponent, DsBadgeComponent, DsBreadcrumbComponent, DsButtonComponent, DsButtonGroupComponent, DsCalloutComponent, DsCardComponent, DsCheckboxComponent, DsDateComponent, DsDateTimeComponent, DsDetailsComponent, DsDialogComponent, DsDividerComponent, DsDrawComponent, DsDropdownComponent, DsGridComponent, DsIconComponent, DsNavComponent, DsNumberComponent, DsPopoverComponent, DsPopupComponent, DsProgressRingComponent, DsRadioGroupComponent, DsSelectComponent, DsSkeletonComponent, DsSpinnerComponent, DsSplitPanelComponent, DsSwitchComponent, DsTabGroupComponent, DsTaComponent, DsTextareaComponent, DsTextComponent, DsTimeComponent, DsToastComponent, DsToastContainerComponent, DsTooltipComponent, DsTreeComponent, DsTreeItemComponent };

// Re-export new layout component
export { DsCustomComponent };

