import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'board', pathMatch: 'full'},
  { path: 'board', loadChildren: () => import('@chess/board').then(m => m.chessRoutes) }
];
