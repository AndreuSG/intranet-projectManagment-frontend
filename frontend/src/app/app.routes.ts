import { Routes } from '@angular/router';

export const routes: Routes = [
  {path: 'admin', loadComponent: () => import('./pages/admin/admin.component').then(mod => mod.AdminComponent) },
];
