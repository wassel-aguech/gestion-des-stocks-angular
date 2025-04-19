import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Buttons'
    },
    children: [
      {
        path: '',
        redirectTo: 'buttons',
        pathMatch: 'full'
      },
     
    ]
  }
];

