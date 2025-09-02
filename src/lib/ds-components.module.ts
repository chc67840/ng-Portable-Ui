import { NgModule } from '@angular/core';

// Form control components
import { DsTextComponent } from './formcontrol/ds-text.component';
import { DsNumberComponent } from './formcontrol/ds-number.component';
import { DsDateComponent } from './formcontrol/ds-date.component';
import { DsTimeComponent } from './ds-time.component';
import { DsDateTimeComponent } from './formcontrol/ds-datetime.component';
import { DsSelectComponent } from './formcontrol/ds-select.component';
import { DsSwitchComponent } from './formcontrol/ds-switch.component';
import { DsRadioGroupComponent } from './formcontrol/ds-radio-group.component';
import { DsTextareaComponent } from './formcontrol/ds-textarea.component';
import { DsCheckboxComponent } from './formcontrol/ds-checkbox.component';
import { DsAvatarComponent } from './formcontrol/ds-avatar.component';
import { DsAvatarGroupComponent } from './formcontrol/ds-avatar-group.component';

// Action / interactive components
import { DsButtonComponent } from './action/ds-button.component';
import { DsButtonGroupComponent } from './action/ds-button-group.component';
import { DsDropdownComponent } from './action/ds-dropdown.component';
import { DsPopoverComponent } from './action/ds-popover.component';
import { DsIconComponent } from './action/ds-icon.component';

// Feedback / status components
import { DsProgressRingComponent } from './feedback-status/ds-progress-ring.component';
import { DsTooltipComponent } from './feedback-status/ds-tooltip.component';
import { DsToastComponent } from './feedback-status/ds-toast.component';
import { DsToastContainerComponent } from './feedback-status/ds-toast-container.component';
import { DsBadgeComponent } from './feedback-status/ds-badge.component';
import { DsCalloutComponent } from './feedback-status/ds-callout.component';
import { DsSkeletonComponent } from './feedback-status/ds-skeleton.component';
import { DsSpinnerComponent } from './feedback-status/ds-spinner.component';
import { DsTaComponent } from './feedback-status/ds-ta.component';

// Navigation / structure
import { DsNavComponent } from './nav/ds-nav.component';
import { DsBreadcrumbComponent } from './nav/ds-breadcrumb.component';
import { DsTabGroupComponent } from './nav/ds-tab-group.component';
import { DsTreeComponent } from './nav/ds-tree.component';
import { DsTreeItemComponent } from './nav/ds-tree-item.component';

// Organize / layout
import { DsCardComponent } from './organize/ds-card.component';
import { DsDetailsComponent } from './organize/ds-details.component';
import { DsDialogComponent } from './organize/ds-dialog.component';
import { DsDividerComponent } from './organize/ds-divider.component';
import { DsSplitPanelComponent } from './organize/ds-split-panel.component';
import { DsDrawComponent } from './organize/ds-draw.component';

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
    imports: [...DS_COMPONENTS],
    exports: [...DS_COMPONENTS]
})
export class DsComponentsModule { }

// Re-export classes for direct imports
export {
    DsTextComponent, DsNumberComponent, DsDateComponent, DsTimeComponent, DsDateTimeComponent, DsSelectComponent,
    DsSwitchComponent, DsRadioGroupComponent, DsTextareaComponent, DsCheckboxComponent, DsAvatarComponent, DsAvatarGroupComponent,
    DsButtonComponent, DsButtonGroupComponent, DsDropdownComponent, DsPopoverComponent, DsIconComponent,
    DsProgressRingComponent, DsTooltipComponent, DsToastComponent, DsToastContainerComponent, DsBadgeComponent, DsCalloutComponent,
    DsSkeletonComponent, DsSpinnerComponent, DsTaComponent,
    DsNavComponent, DsBreadcrumbComponent, DsTabGroupComponent, DsTreeComponent, DsTreeItemComponent,
    DsCardComponent, DsDetailsComponent, DsDialogComponent, DsDividerComponent, DsSplitPanelComponent, DsDrawComponent,
    DsPopupComponent, DsGridComponent
};

// Re-export new layout component
export { DsCustomComponent };
