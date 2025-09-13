import { Routes } from '@angular/router';

// Lazy feature route factories using dynamic import of placeholder to reduce boilerplate for now.
const placeholder = (title: string, icon?: string) => () => import('./shared/page-placeholder.component').then(m => m.PagePlaceholderComponent).then(c => Object.assign(c, {}));

export const routes: Routes = [
    //{ path: '', component: HomeComponent },
    // Money Hub
    {
        path: 'money-hub', children: [
            { path: 'dashboard', loadComponent: () => import('./features/money-hub/dashboard.component').then(m => m.DashboardComponent) },
            { path: 'notifications', loadComponent: () => import('./features/money-hub/notifications.component').then(m => m.NotificationsComponent) },
            { path: 'quick-actions', loadComponent: () => import('./features/money-hub/quick-actions.component').then(m => m.QuickActionsComponent) }
        ]
    },
    // Financial Checklist
    {
        path: 'financial-checklist', children: [
            { path: 'roadmap', loadComponent: () => import('./features/financial-checklist/roadmap.component').then(m => m.RoadmapComponent) },
            { path: 'progress-tracking', loadComponent: () => import('./features/financial-checklist/progress-tracking.component').then(m => m.ProgressTrackingComponent) },
            { path: 'save-money', loadComponent: () => import('./features/financial-checklist/save-money/save-money.component').then(m => m.SaveMoneyComponent) },
            { path: 'pay-off-debt', loadComponent: () => import('./features/financial-checklist/pay-off-debt/pay-off-debt.component').then(m => m.PayOffDebtComponent) },
            { path: 'improve-credit', loadComponent: () => import('./features/financial-checklist/improve-credit/improve-credit.component').then(m => m.ImproveCreditComponent) },
            { path: 'build-wealth-mindset', loadComponent: () => import('./features/financial-checklist/build-wealth-mindset/build-wealth-mindset.component').then(m => m.BuildWealthMindsetComponent) },
            { path: 'invest', loadComponent: () => import('./features/financial-checklist/invest/invest.component').then(m => m.InvestComponent) }
        ]
    },
    // Budgeting Suite
    {
        path: 'budgeting-suite', children: [
            {
                path: 'budget-builder', children: [
                    { path: 'monthly-plan', loadComponent: () => import('./features/budgeting-suite/budget-builder/monthly-plan/monthly-plan.component').then(m => m.MonthlyPlanComponent) },
                    { path: 'template-selector', loadComponent: () => import('./features/budgeting-suite/budget-builder/template-selector/template-selector.component').then(m => m.TemplateSelectorComponent) },
                    { path: 'level-assessment', loadComponent: () => import('./features/budgeting-suite/budget-builder/level-assessment/level-assessment.component').then(m => m.LevelAssessmentComponent) }
                ]
            },
            {
                path: 'emergency-fund', children: [
                    { path: 'fund-goal', loadComponent: () => import('./features/budgeting-suite/emergency-fund/fund-goal/fund-goal.component').then(m => m.FundGoalComponent) },
                    { path: 'high-yield-accounts', loadComponent: () => import('./features/budgeting-suite/emergency-fund/high-yield-accounts/high-yield-accounts.component').then(m => m.HighYieldAccountsComponent) }
                ]
            },
            {
                path: 'big-purchase-planner', children: [
                    { path: 'car-calculator', loadComponent: () => import('./features/budgeting-suite/big-purchase-planner/car-calculator/car-calculator.component').then(m => m.CarCalculatorComponent) },
                    { path: 'insurance-savings', loadComponent: () => import('./features/budgeting-suite/big-purchase-planner/insurance-savings/insurance-savings.component').then(m => m.InsuranceSavingsComponent) }
                ]
            }
        ]
    },
    // Debt Destroyer
    {
        path: 'debt-destroyer', children: [
            {
                path: 'debt-planner', children: [
                    { path: 'snowball-method', loadComponent: () => import('./features/debt-destroyer/debt-planner/snowball-method/snowball-method.component').then(m => m.SnowballMethodComponent) },
                    { path: 'avalanche-method', loadComponent: () => import('./features/debt-destroyer/debt-planner/avalanche-method/avalanche-method.component').then(m => m.AvalancheMethodComponent) }
                ]
            },
            { path: 'payment-timeline', loadComponent: () => import('./features/debt-destroyer/payment-timeline/payment-timeline.component').then(m => m.PaymentTimelineComponent) }
        ]
    },
    // Credit Tools
    {
        path: 'credit-tools', children: [
            {
                path: 'card-navigator', children: [
                    { path: 'low-credit', loadComponent: () => import('./features/credit-tools/card-navigator/low-credit/low-credit.component').then(m => m.LowCreditComponent) },
                    { path: 'cash-rewards', loadComponent: () => import('./features/credit-tools/card-navigator/cash-rewards/cash-rewards.component').then(m => m.CashRewardsComponent) },
                    { path: 'travel', loadComponent: () => import('./features/credit-tools/card-navigator/travel/travel.component').then(m => m.TravelComponent) },
                    { path: 'business', loadComponent: () => import('./features/credit-tools/card-navigator/business/business.component').then(m => m.BusinessComponent) }
                ]
            },
            {
                path: 'credit-health', children: [
                    { path: 'utilization-tracker', loadComponent: () => import('./features/credit-tools/credit-health/utilization-tracker/utilization-tracker.component').then(m => m.UtilizationTrackerComponent) },
                    { path: 'score-tips', loadComponent: () => import('./features/credit-tools/credit-health/score-tips/score-tips.component').then(m => m.ScoreTipsComponent) }
                ]
            }
        ]
    },
    // Investing & Retirement
    {
        path: 'investing-retirement', children: [
            {
                path: 'investment-planner', children: [
                    { path: 'compound-interest', loadComponent: () => import('./features/investing-retirement/investment-planner/compound-interest/compound-interest.component').then(m => m.CompoundInterestComponent) },
                    { path: 'financial-freedom-goal', loadComponent: () => import('./features/investing-retirement/investment-planner/financial-freedom-goal/financial-freedom-goal.component').then(m => m.FinancialFreedomGoalComponent) },
                    { path: 'retirement-needs', loadComponent: () => import('./features/investing-retirement/investment-planner/retirement-needs/retirement-needs.component').then(m => m.RetirementNeedsComponent) }
                ]
            },
            {
                path: 'brokerages-accounts', children: [
                    { path: 'broker-comparison', loadComponent: () => import('./features/investing-retirement/brokerages-accounts/broker-comparison/broker-comparison.component').then(m => m.BrokerComparisonComponent) },
                    { path: 'account-types', loadComponent: () => import('./features/investing-retirement/brokerages-accounts/account-types/account-types.component').then(m => m.AccountTypesComponent) }
                ]
            },
            {
                path: 'portfolio-tools', children: [
                    { path: 'options-tracker', loadComponent: () => import('./features/investing-retirement/portfolio-tools/options-tracker/options-tracker.component').then(m => m.OptionsTrackerComponent) },
                    { path: 'portfolio-tracker', loadComponent: () => import('./features/investing-retirement/portfolio-tools/portfolio-tracker/portfolio-tracker.component').then(m => m.PortfolioTrackerComponent) }
                ]
            },
            {
                path: 'investment-resources', children: [
                    { path: 'books', loadComponent: () => import('./features/investing-retirement/investment-resources/books/books.component').then(m => m.BooksComponent) },
                    { path: 'podcasts', loadComponent: () => import('./features/investing-retirement/investment-resources/podcasts/podcasts.component').then(m => m.PodcastsComponent) },
                    { path: 'communities-courses', loadComponent: () => import('./features/investing-retirement/investment-resources/communities-courses/communities-courses.component').then(m => m.CommunitiesCoursesComponent) }
                ]
            }
        ]
    },
    // Income & Entrepreneurship
    {
        path: 'income-entrepreneurship', children: [
            {
                path: 'income-boost', children: [
                    { path: 'side-hustles', loadComponent: () => import('./features/income-entrepreneurship/income-boost/side-hustles/side-hustles.component').then(m => m.SideHustlesComponent) },
                    { path: 'skills-to-learn', loadComponent: () => import('./features/income-entrepreneurship/income-boost/skills-to-learn/skills-to-learn.component').then(m => m.SkillsToLearnComponent) }
                ]
            },
            {
                path: 'business-launchpad', children: [
                    { path: 'high-income-skills', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/high-income-skills/high-income-skills.component').then(m => m.HighIncomeSkillsComponent) },
                    { path: 'service-business', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/service-business/service-business.component').then(m => m.ServiceBusinessComponent) },
                    { path: 'productizing', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/productizing/productizing.component').then(m => m.ProductizingComponent) },
                    { path: 'sales-systems', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/sales-systems/sales-systems.component').then(m => m.SalesSystemsComponent) },
                    { path: 'team-culture', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/team-culture/team-culture.component').then(m => m.TeamCultureComponent) },
                    { path: 'revenue-streams', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/revenue-streams/revenue-streams.component').then(m => m.RevenueStreamsComponent) },
                    { path: 'scaling-exits', loadComponent: () => import('./features/income-entrepreneurship/business-launchpad/scaling-exits/scaling-exits.component').then(m => m.ScalingExitsComponent) }
                ]
            }
        ]
    },
    // Tax Assistant
    {
        path: 'tax-assistant', children: [
            { path: 'tax-calculator', loadComponent: () => import('./features/tax-assistant/tax-calculator/tax-calculator.component').then(m => m.TaxCalculatorComponent) },
            { path: 'tax-brackets', loadComponent: () => import('./features/tax-assistant/tax-brackets/tax-brackets.component').then(m => m.TaxBracketsComponent) },
            { path: 'deductions-guide', loadComponent: () => import('./features/tax-assistant/deductions-guide/deductions-guide.component').then(m => m.DeductionsGuideComponent) }
        ]
    },
    // Resources & Learning
    {
        path: 'resources-learning', children: [
            {
                path: 'resource-library', children: [
                    { path: 'articles-guides', loadComponent: () => import('./features/resources-learning/resource-library/articles-guides/articles-guides.component').then(m => m.ArticlesGuidesComponent) },
                    { path: 'video-tutorials', loadComponent: () => import('./features/resources-learning/resource-library/video-tutorials/video-tutorials.component').then(m => m.VideoTutorialsComponent) }
                ]
            },
            { path: 'free-classes', loadComponent: () => import('./features/resources-learning/free-classes/free-classes.component').then(m => m.FreeClassesComponent) },
            { path: 'budgeting-apps', loadComponent: () => import('./features/resources-learning/budgeting-apps/budgeting-apps.component').then(m => m.BudgetingAppsComponent) }
        ]
    },
    { path: '', loadComponent: () => import('./features/money-hub/dashboard.component').then(m => m.DashboardComponent) },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
