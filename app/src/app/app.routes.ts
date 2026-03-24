import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'competitions',
    loadComponent: () => import('./pages/competitions/competitions.page').then( m => m.CompetitionsPage)
  },
  {
  path: 'competitions',
  loadComponent: () =>
    import('./pages/competitions/competitions.page').then(m => m.CompetitionsPage),
  },
  {
  path: 'categories/:id',
    loadComponent: () =>
      import('./pages/categories/categories.page').then(m => m.CategoriesPage),
  },
  {
    path: 'entries',
    loadComponent: () => import('./pages/entries/entries.page').then( m => m.EntriesPage)
  },
  {
  path: 'entries/:competitionId/:categoryId',
    loadComponent: () =>
      import('./pages/entries/entries.page').then(m => m.EntriesPage),
  }
];