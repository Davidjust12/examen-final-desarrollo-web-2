import { Routes } from '@angular/router';
import { authGuard } from './auth.service';
import { LoginComponent } from './login.component';
import { CatalogComponent } from './catalog.component';
import { DetailComponent } from './detail.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'episodios', component: CatalogComponent, canActivate: [authGuard], data: { kind: 'episodes' } },
  { path: 'personajes', component: CatalogComponent, canActivate: [authGuard], data: { kind: 'characters' } },
  { path: 'episodios/:id', component: DetailComponent, canActivate: [authGuard], data: { kind: 'episodes' } },
  { path: 'personajes/:id', component: DetailComponent, canActivate: [authGuard], data: { kind: 'characters' } },
  { path: '', redirectTo: 'episodios', pathMatch: 'full' },
  { path: '**', redirectTo: 'episodios' }
];
