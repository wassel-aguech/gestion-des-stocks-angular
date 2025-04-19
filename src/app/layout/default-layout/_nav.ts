import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    roles: ['admin'],

    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },

  // {
  //   name: 'Components',
  //   title: true
  // },
  {
    name: 'Gestion User',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'WireBreakDetails Uploads',
        url: '/base/accordion',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],




      },
      {
        name: 'Gestion Inventory',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],

      },
      {
        name: 'Gestion Wireconsumption',
        url: '/base/cards',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],

      },
      {
        name: 'Wireconsumption Uploads',
        url: '/base/carousel',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],

      },
      {
        name: 'WireBreakDetails',
        url: '/base/collapse',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],

      },
      {
        name: 'WireConsumption',
        url: '/base/list-group',
        icon: 'nav-icon-bullet',
        roles: ['plant','admin'],

      },
      // {
      //   name: 'Navs & Tabs',
      //   url: '/base/navs',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Pagination',
      //   url: '/base/pagination',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Placeholder',
      //   url: '/base/placeholder',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Popovers',
      //   url: '/base/popovers',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Progress',
      //   url: '/base/progress',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Spinners',
      //   url: '/base/spinners',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tables',
      //   url: '/base/tables',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tabs',
      //   url: '/base/tabs',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Tooltips',
      //   url: '/base/tooltips',
      //   icon: 'nav-icon-bullet'
      // }
    ]
  },

  {
    name: 'Gestion Admin',
    roles: ['admin'],
   // url: '/forms',
    iconComponent: { name: 'cil-notes' },

    children: [
      {
        name: 'Users',
        url: '/forms/form-control',
        icon: 'nav-icon-bullet',
        roles: ['admin'],
      },
      {
        name: 'Machines',
        url: '/forms/select',
        icon: 'nav-icon-bullet',
        roles: ['admin'],

      },
      {
        name: 'WireBreakType',
        url: '/forms/checks-radios',
        icon: 'nav-icon-bullet',
        roles: ['admin'],

      },
      {
        name: 'Suppliers',
        url: '/forms/range',
        icon: 'nav-icon-bullet',
        roles: ['admin'],

      },
      // {
      //   name: 'Input Group',
      //   url: '/forms/input-group',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Floating Labels',
      //   url: '/forms/floating-labels',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Layout',
      //   url: '/forms/layout',
      //   icon: 'nav-icon-bullet'
      // },
      // {
      //   name: 'Validation',
      //   url: '/forms/validation',
      //   icon: 'nav-icon-bullet'
      // }
    ]
  },

  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404',
  //       icon: 'nav-icon-bullet'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500',
  //       icon: 'nav-icon-bullet'
  //     }
  //   ]
  // },

];
