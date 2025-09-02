import { Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { DsTheme, DEFAULT_THEMES } from '../lib/organize/ds-draw.component';
import { ToastService } from '../lib/services/toast.service';
import { AppSharedModule } from './app-shared.module';
import { DsLayoutConfig } from '../lib/ds.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JsonPipe, AppSharedModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('nG-Portable-UI');
  navItems = [
    { label: 'Home', route: '/' },
    { label: 'Docs', href: 'https://example.com/docs' },
    { label: 'About', route: '/about' }
  ];
  age?: string;
  ageNum: number | null = null;
  price: number | null = null;
  birthday: string | null = null;
  meetingTime: string | null = null;
  appointment: string | null = null;
  selectedCountry: string | null = null;
  selectedTags: string[] = [];
  selectedFramework: string | null = null;
  selectedLazy: string | null = null;
  featureEnabled = false;
  selectedThemeOption: string | null = null;
  selectedSize: string | null = null;
  description: string | null = null;
  tooltipManualOpen = false;
  valueDynamic: number | null = null;
  constructor(private toast: ToastService) { }
  addDemoToast() {
    this.toast.add({ title: 'Saved', message: 'Your changes have been stored.', variant: 'success', appearance: 'filled', duration: 4000, iconHtml: '<wa-icon name="circle-check" family="classic" variant="solid"></wa-icon>' });
  }
  lazyBaseOptions = [
    { label: 'Initial A', value: 'a' },
    { label: 'Initial B', value: 'b' }
  ];
  private lazyExtraLoaded = false;
  loadMoreOptions = () => {
    return new Promise<Array<{ label: string; value: string }>>((resolve) => {
      if (this.lazyExtraLoaded) { resolve([]); return; }
      setTimeout(() => {
        this.lazyExtraLoaded = true;
        const extra = [
          { label: 'Lazy C', value: 'c' },
          { label: 'Lazy D', value: 'd' }
        ];
        this.lazyBaseOptions = [...this.lazyBaseOptions, ...extra];
        resolve(extra);
      }, 600);
    });
  };
  popupOpen = signal(false);
  dialogOpen = false; // simple boolean bound with [(open)]

  onFocus() {
    console.log('Input focused');
  }

  onInput(event: Event) {
    console.log('Input event:', event);
  }

  // Drawer & theme state
  drawerOpen = signal(false);
  themes: DsTheme[] = DEFAULT_THEMES;
  currentTheme = signal<DsTheme>(this.themes[0]);

  toggleDrawer() { this.drawerOpen.set(!this.drawerOpen()); }
  onThemeChange(th: DsTheme) { this.currentTheme.set(th); }
  togglePopup() { this.popupOpen.set(!this.popupOpen()); }

  // Tree state
  treeNodes = [
    {
      label: 'Documents', expanded: true, icon: '<wa-icon name="folder"></wa-icon>', children: [
        { label: 'Resume.pdf', icon: '<wa-icon name="file"></wa-icon>' },
        { label: 'CoverLetter.docx', icon: '<wa-icon name="file"></wa-icon>' }
      ]
    },
    {
      label: 'Pictures', expanded: true, icon: '<wa-icon name="image"></wa-icon>', children: [
        {
          label: 'Vacation', expanded: true, icon: '<wa-icon name="folder"></wa-icon>', children: [
            { label: 'photo1.jpg', icon: '<wa-icon name="image"></wa-icon>' },
            { label: 'photo2.jpg', icon: '<wa-icon name="image"></wa-icon>' }
          ]
        }
      ]
    },
    { label: 'Archive (lazy)', lazy: true, icon: '<wa-icon name="archive"></wa-icon>' }
  ];

  private _selectedTree = signal<any[]>([]);
  selectedTree = this._selectedTree.asReadonly();

  onTreeSelection(ev: any) {
    this._selectedTree.set(ev.selection);
  }

  onTreeLazyLoad(e: Event) {
    // Simple demo: populate children for first lazy node and remove lazy flag
    const target = e.target as HTMLElement & { parentElement?: HTMLElement };
    const label = target?.textContent?.trim();
    const node = this.treeNodes.find(n => n.label.startsWith('Archive'));
    if (node && (node as any).lazy) {
      (node as any).children = [
        { label: '2022.zip', icon: '<wa-icon name="file"></wa-icon>' },
        { label: '2023.zip', icon: '<wa-icon name="file"></wa-icon>' }
      ];
      (node as any).lazy = false;
      (node as any).expanded = true;
      // trigger change by reassigning array (if OnPush used in future)
      this.treeNodes = [...this.treeNodes];
    }
  }

  // Select handlers to safely coerce union value types
  onCountryChange(val: string | string[] | null) {
    if (Array.isArray(val)) this.selectedCountry = val[0] ?? null; else this.selectedCountry = val;
  }
  onTagsChange(val: string | string[] | null) {
    this.selectedTags = Array.isArray(val) ? val : (val ? [val] : []);
  }
  onFrameworkChange(val: string | string[] | null) {
    if (Array.isArray(val)) this.selectedFramework = val[0] ?? null; else this.selectedFramework = val;
  }
  onLazySelectChange(val: string | string[] | null) {
    if (Array.isArray(val)) this.selectedLazy = val[0] ?? null; else this.selectedLazy = val;
  }
  onFeatureToggle(v: boolean) { this.featureEnabled = v; }

  onSelectLazyLoad(_e: Event) {
    // placeholder hook for logging lazy loading events
    console.log('Select lazy load triggered');
  }

  onTagRemoved(e: Event) {
    const target = e.target as HTMLElement | null;
    // naive removal fallback if consumer wants to handle differently
    if (target && target.remove) target.remove();
  }

  onBadgeRemoved(e: Event) {
    const target = e.target as HTMLElement | null;
    if (target && target.remove) target.remove();
  }

  openInfoPopover() {
    const el = document.getElementById('infoPopover');
    if (el) el.setAttribute('open', '');
  }
  closeInfoPopover() {
    const el = document.getElementById('infoPopover');
    if (el) el.removeAttribute('open');
  }

  // Grid demo data & handlers
  gridRowData = [
    { id: 1, name: 'Alice', role: 'Developer', salary: 90000 },
    { id: 2, name: 'Bob', role: 'Designer', salary: 82000 },
    { id: 3, name: 'Charlie', role: 'Product', salary: 95000 },
    { id: 4, name: 'Dana', role: 'QA', salary: 76000 }
  ];
  gridColumnDefs: any[] = [
    { field: 'id', maxWidth: 90 },
    { field: 'name', filter: true },
    { field: 'role', filter: true },
    { field: 'salary', valueFormatter: (params: any) => '$' + params.value.toLocaleString() }
  ];
  gridLoading = false;
  selectedRowsCount = 0;
  onGridReady(e: any) { console.log('grid ready', e); }
  onGridSelection(rows: any[]) { this.selectedRowsCount = rows.length; }
  toggleGridLoading() { this.gridLoading = !this.gridLoading; }

  // ===== Demo simple layout schema for ds-custom (Phase 1) =====
  demoLayout = {
    kind: 'container',
    containerType: 'card',
    title: 'Demo Form',
    rows: [
      {
        kind: 'row',
        columns: [
          {
            kind: 'column', span: 12,
            content: [
              { kind: 'component', component: 'text', config: { label: 'Email', type: 'email', placeholder: 'you@example.com' } },
              { kind: 'component', component: 'text', config: { label: 'Password', type: 'password', placeholder: '••••••' } },
              { kind: 'component', component: 'button', config: { label: 'Submit', type: 'button', variant: 'brand', appearance: 'filled', pill: false } }
            ]
          }
        ]
      }
    ]
  } as any; // Using container-only form for MVP component

  // ================= Unified Multi-Section Layout Schema =================
  unifiedLayoutSchema: DsLayoutConfig = {
    contextDefaults: {
      reg: { firstName: '', lastName: '', email: '', password: '', confirm: '', phone: '', birthDate: '', country: null, plan: 'free', bio: '', terms: false },
      left: { username: '', nickname: '', timezone: '', language: 'en' },
      right: { notifyEmail: true, notifySms: false, mfaCode: '', backupEmail: '' },
      grid: {
        rows: [
          { id: 1, name: 'Alice', role: 'Developer', salary: 90000 },
          { id: 2, name: 'Bob', role: 'Designer', salary: 82000 },
          { id: 3, name: 'Charlie', role: 'Product', salary: 95000 },
          { id: 4, name: 'Dana', role: 'QA', salary: 76000 }
        ],
        columns: [
          { field: 'id', maxWidth: 90 },
          { field: 'name', filter: true },
          { field: 'role', filter: true },
          { field: 'salary', valueFormatter: (p: any) => '$' + p.value.toLocaleString() }
        ]
      },
      lists: {
        countries: [{ label: 'United States', value: 'us' }, { label: 'Canada', value: 'ca' }, { label: 'Germany', value: 'de' }, { label: 'India', value: 'in' }],
        plans: [{ label: 'Free', value: 'free' }, { label: 'Pro', value: 'pro' }, { label: 'Enterprise', value: 'ent' }],
        timezones: [{ label: 'UTC', value: 'UTC' }, { label: 'EST', value: 'EST' }, { label: 'IST', value: 'IST' }],
        languages: [{ label: 'English', value: 'en' }, { label: 'Deutsch', value: 'de' }, { label: 'Español', value: 'es' }]
      }
    },
    actions: [
      { id: 'submitRegistration', type: 'custom', handler: (ctx: any) => console.log('Registration submit', ctx.ctx.reg) },
      { id: 'saveProfile', type: 'custom', handler: (ctx: any) => console.log('Profile saved', ctx.ctx.left, ctx.ctx.right) },
      { id: 'emitProfile', type: 'emit', event: 'profile-updated', payload: { source: 'unifiedLayout' } },
      { id: 'emitGridRefresh', type: 'emit', event: 'grid-refresh', payload: { at: Date.now() } }
    ],
    root: {
      kind: 'container',
      containerType: 'section',
      title: 'Unified Layout',
      rows: [
        {
          kind: 'row',
          columns: [
            {
              kind: 'column', span: 12,
              content: [
                {
                  kind: 'container',
                  containerType: 'card',
                  title: 'User Registration',
                  rows: [
                    {
                      kind: 'row',
                      columns: [
                        {
                          kind: 'column', span: 12,
                          content: [
                            { kind: 'component', component: 'text', config: { label: 'First Name', placeholder: 'John' }, bind: { value: { path: 'reg.firstName' } } },
                            { kind: 'component', component: 'text', config: { label: 'Last Name', placeholder: 'Doe' }, bind: { value: { path: 'reg.lastName' } } },
                            { kind: 'component', component: 'text', config: { label: 'Email', type: 'email', placeholder: 'you@example.com' }, bind: { value: { path: 'reg.email' } } },
                            { kind: 'component', component: 'text', config: { label: 'Password', type: 'password', placeholder: '••••••' }, bind: { value: { path: 'reg.password' } } },
                            { kind: 'component', component: 'text', config: { label: 'Confirm Password', type: 'password', placeholder: 'Repeat password' }, bind: { value: { path: 'reg.confirm' } } },
                            { kind: 'component', component: 'text', config: { label: 'Phone', placeholder: '+1 555 123 4567' }, bind: { value: { path: 'reg.phone' } } },
                            { kind: 'component', component: 'date', config: { label: 'Birth Date' }, bind: { value: { path: 'reg.birthDate' } } },
                            { kind: 'component', component: 'select', config: { label: 'Country', placeholder: 'Select Country' }, bind: { options: { path: 'lists.countries' }, value: { path: 'reg.country' } } },
                            { kind: 'component', component: 'radio-group', config: { label: 'Plan', orientation: 'horizontal' }, bind: { options: { path: 'lists.plans' }, value: { path: 'reg.plan' } } },
                            { kind: 'component', component: 'textarea', config: { label: 'Biography', placeholder: 'Tell us about yourself', rows: 3 }, bind: { value: { path: 'reg.bio' } } },
                            { kind: 'component', component: 'switch', config: { label: 'Accept Terms', hint: 'You must accept to continue' }, bind: { checked: { path: 'reg.terms' } } },
                            { kind: 'component', component: 'button', config: { label: 'Create Account', appearance: 'filled', variant: 'brand' }, actions: [{ event: 'click', action: 'submitRegistration' }] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          kind: 'row',
          columns: [
            {
              kind: 'column', span: 6,
              content: [
                {
                  kind: 'container', containerType: 'card', title: 'Account Settings',
                  rows: [
                    {
                      kind: 'row',
                      columns: [
                        {
                          kind: 'column', span: 6,
                          content: [
                            { kind: 'component', component: 'text', config: { label: 'Username' }, bind: { value: { path: 'left.username' } } },
                            { kind: 'component', component: 'text', config: { label: 'Nickname' }, bind: { value: { path: 'left.nickname' } } },
                            { kind: 'component', component: 'select', config: { label: 'Timezone' }, bind: { options: { path: 'lists.timezones' }, value: { path: 'left.timezone' } } },
                            { kind: 'component', component: 'select', config: { label: 'Language' }, bind: { options: { path: 'lists.languages' }, value: { path: 'left.language' } } }
                          ]
                        },
                        {
                          kind: 'column', span: 6,
                          content: [
                            { kind: 'component', component: 'switch', config: { label: 'Email Notifications' }, bind: { checked: { path: 'right.notifyEmail' } } },
                            { kind: 'component', component: 'switch', config: { label: 'SMS Notifications' }, bind: { checked: { path: 'right.notifySms' } } },
                            { kind: 'component', component: 'text', config: { label: 'MFA Code', placeholder: '123456' }, bind: { value: { path: 'right.mfaCode' } } },
                            { kind: 'component', component: 'text', config: { label: 'Backup Email', type: 'email' }, bind: { value: { path: 'right.backupEmail' } } },
                            { kind: 'component', component: 'button', config: { label: 'Save Settings', appearance: 'outlined', variant: 'brand' }, actions: [{ event: 'click', action: 'saveProfile', throttleMs: 500 }, { event: 'click', action: 'emitProfile' }] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              kind: 'column', span: 6,
              content: [
                {
                  kind: 'container', containerType: 'card', title: 'Team Grid',
                  rows: [
                    {
                      kind: 'row',
                      columns: [
                        {
                          kind: 'column', span: 12,
                          content: [
                            { kind: 'component', component: 'grid', config: {}, bind: { rowData: { path: 'grid.rows' }, columnDefs: { path: 'grid.columns' } }, actions: [{ event: 'click', action: 'emitGridRefresh', debounceMs: 300 }] }
                          ]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  };
}
