import { DsNavTreeItem } from '../../lib/nav/ds-nav-tree.component';

// Centralized navigation configuration for ds-nav-tree.
// Adjust icons/labels/routes here only.
export const NAV_ITEMS: DsNavTreeItem[] = [
    {
        label: 'Money Hub', icon: 'fa-wallet', children: [
            { label: 'Dashboard', route: '/money-hub/dashboard', icon: 'fa-home' },
            { label: 'Notifications', route: '/money-hub/notifications', icon: 'fa-bell' },
            { label: 'Quick Actions', route: '/money-hub/quick-actions', icon: 'fa-bolt' }
        ]
    },
    {
        label: 'Financial Checklist', icon: 'fa-list-check', children: [
            { label: 'Roadmap', route: '/financial-checklist/roadmap', icon: 'fa-route' },
            { label: 'Progress Tracking', route: '/financial-checklist/progress-tracking', icon: 'fa-check-circle' },
            { label: 'Save Money', route: '/financial-checklist/save-money', icon: 'fa-piggy-bank' },
            { label: 'Pay Off Debt', route: '/financial-checklist/pay-off-debt', icon: 'fa-money-check-alt' },
            { label: 'Improve Credit', route: '/financial-checklist/improve-credit', icon: 'fa-chart-line' },
            { label: 'Build Wealth Mindset', route: '/financial-checklist/build-wealth-mindset', icon: 'fa-brain' },
            { label: 'Invest', route: '/financial-checklist/invest', icon: 'fa-coins' }
        ]
    },
    {
        label: 'Budgeting Suite', icon: 'fa-chart-pie', children: [
            {
                label: 'Budget Builder', icon: 'fa-chart-pie', children: [
                    { label: 'Monthly Plan', route: '/budgeting-suite/budget-builder/monthly-plan', icon: 'fa-calendar-day' },
                    { label: 'Template Selector', route: '/budgeting-suite/budget-builder/template-selector', icon: 'fa-sliders-h' },
                    { label: 'Level Assessment', route: '/budgeting-suite/budget-builder/level-assessment', icon: 'fa-signal' }
                ]
            },
            {
                label: 'Emergency Fund', icon: 'fa-piggy-bank', children: [
                    { label: 'Fund Goal', route: '/budgeting-suite/emergency-fund/fund-goal', icon: 'fa-bullseye' },
                    { label: 'High-Yield Accounts', route: '/budgeting-suite/emergency-fund/high-yield-accounts', icon: 'fa-university' }
                ]
            },
            {
                label: 'Big Purchase Planner', icon: 'fa-car', children: [
                    { label: 'Car Calculator', route: '/budgeting-suite/big-purchase-planner/car-calculator', icon: 'fa-car-side' },
                    { label: 'Insurance Savings', route: '/budgeting-suite/big-purchase-planner/insurance-savings', icon: 'fa-shield-alt' }
                ]
            }
        ]
    },
    {
        label: 'Debt Destroyer', icon: 'fa-bomb', children: [
            {
                label: 'Debt Planner', icon: 'fa-credit-card', children: [
                    { label: 'Snowball Method', route: '/debt-destroyer/debt-planner/snowball-method', icon: 'fa-snowflake' },
                    { label: 'Avalanche Method', route: '/debt-destroyer/debt-planner/avalanche-method', icon: 'fa-mountain' }
                ]
            },
            { label: 'Payment Timeline', route: '/debt-destroyer/payment-timeline', icon: 'fa-calendar-alt' }
        ]
    },
    {
        label: 'Credit Tools', icon: 'fa-credit-card-front', children: [
            {
                label: 'Card Navigator', icon: 'fa-credit-card-front', children: [
                    { label: 'Low Credit', route: '/credit-tools/card-navigator/low-credit', icon: 'fa-user-check' },
                    { label: 'Cash Rewards', route: '/credit-tools/card-navigator/cash-rewards', icon: 'fa-dollar-sign' },
                    { label: 'Travel', route: '/credit-tools/card-navigator/travel', icon: 'fa-plane' },
                    { label: 'Business', route: '/credit-tools/card-navigator/business', icon: 'fa-briefcase' }
                ]
            },
            {
                label: 'Credit Health', icon: 'fa-heartbeat', children: [
                    { label: 'Utilization Tracker', route: '/credit-tools/credit-health/utilization-tracker', icon: 'fa-percentage' },
                    { label: 'Score Tips', route: '/credit-tools/credit-health/score-tips', icon: 'fa-lightbulb' }
                ]
            }
        ]
    },
    {
        label: 'Investing & Retirement', icon: 'fa-chart-line', children: [
            {
                label: 'Investment Planner', icon: 'fa-chart-line', children: [
                    { label: 'Compound Interest', route: '/investing-retirement/investment-planner/compound-interest', icon: 'fa-calculator' },
                    { label: 'Financial Freedom Goal', route: '/investing-retirement/investment-planner/financial-freedom-goal', icon: 'fa-flag-checkered' },
                    { label: 'Retirement Needs', route: '/investing-retirement/investment-planner/retirement-needs', icon: 'fa-user-tie' }
                ]
            },
            {
                label: 'Brokerages & Accounts', icon: 'fa-university', children: [
                    { label: 'Broker Comparison', route: '/investing-retirement/brokerages-accounts/broker-comparison', icon: 'fa-table' },
                    { label: 'Account Types', route: '/investing-retirement/brokerages-accounts/account-types', icon: 'fa-file-invoice' }
                ]
            },
            {
                label: 'Portfolio Tools', icon: 'fa-briefcase', children: [
                    { label: 'Options Tracker', route: '/investing-retirement/portfolio-tools/options-tracker', icon: 'fa-stream' },
                    { label: 'Portfolio Tracker', route: '/investing-retirement/portfolio-tools/portfolio-tracker', icon: 'fa-tasks' }
                ]
            },
            {
                label: 'Investment Resources', icon: 'fa-book-open', children: [
                    { label: 'Books', route: '/investing-retirement/investment-resources/books', icon: 'fa-book' },
                    { label: 'Podcasts', route: '/investing-retirement/investment-resources/podcasts', icon: 'fa-podcast' },
                    { label: 'Communities & Courses', route: '/investing-retirement/investment-resources/communities-courses', icon: 'fa-users' }
                ]
            }
        ]
    },
    {
        label: 'Income & Entrepreneurship', icon: 'fa-rocket', children: [
            {
                label: 'Income Boost', icon: 'fa-rocket', children: [
                    { label: 'Side Hustles', route: '/income-entrepreneurship/income-boost/side-hustles', icon: 'fa-handshake' },
                    { label: 'Skills to Learn', route: '/income-entrepreneurship/income-boost/skills-to-learn', icon: 'fa-tools' }
                ]
            },
            {
                label: 'Business Launchpad', icon: 'fa-lightbulb', children: [
                    { label: 'High-Income Skills', route: '/income-entrepreneurship/business-launchpad/high-income-skills', icon: 'fa-brain' },
                    { label: 'Service Business', route: '/income-entrepreneurship/business-launchpad/service-business', icon: 'fa-concierge-bell' },
                    { label: 'Productizing', route: '/income-entrepreneurship/business-launchpad/productizing', icon: 'fa-box-open' },
                    { label: 'Sales Systems', route: '/income-entrepreneurship/business-launchpad/sales-systems', icon: 'fa-cash-register' },
                    { label: 'Team & Culture', route: '/income-entrepreneurship/business-launchpad/team-culture', icon: 'fa-users-cog' },
                    { label: 'Revenue Streams', route: '/income-entrepreneurship/business-launchpad/revenue-streams', icon: 'fa-chart-area' },
                    { label: 'Scaling & Exits', route: '/income-entrepreneurship/business-launchpad/scaling-exits', icon: 'fa-rocket-launch' }
                ]
            }
        ]
    },
    {
        label: 'Tax Assistant', icon: 'fa-calculator', children: [
            { label: 'Tax Calculator', route: '/tax-assistant/tax-calculator', icon: 'fa-calculator' },
            { label: 'Tax Brackets', route: '/tax-assistant/tax-brackets', icon: 'fa-layer-group' },
            { label: 'Deductions Guide', route: '/tax-assistant/deductions-guide', icon: 'fa-receipt' }
        ]
    },
    {
        label: 'Resources & Learning', icon: 'fa-book-reader', children: [
            {
                label: 'Resource Library', icon: 'fa-book-reader', children: [
                    { label: 'Articles & Guides', route: '/resources-learning/resource-library/articles-guides', icon: 'fa-newspaper' },
                    { label: 'Video Tutorials', route: '/resources-learning/resource-library/video-tutorials', icon: 'fa-video' }
                ]
            },
            { label: 'Free Classes', route: '/resources-learning/free-classes', icon: 'fa-chalkboard-teacher' },
            { label: 'Budgeting Apps', route: '/resources-learning/budgeting-apps', icon: 'fa-mobile-alt' }
        ]
    }
];
