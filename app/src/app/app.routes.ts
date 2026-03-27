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
  },
  {
    path: 'judges/:competitionId',
    loadComponent: () =>
      import('./pages/judges/judges.page').then(m => m.JudgesPage),
  },
  {
    path: 'judge-home',
    loadComponent: () => import('./pages/judge-home/judge-home.page').then( m => m.JudgeHomePage)
  }
];