import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './auth.service';
@Component({ selector: 'app-root', standalone: true, imports: [RouterOutlet, RouterLink, RouterLinkActive], template: `
  @if (auth.authenticated()) {
    <header class="header"><a class="brand" routerLink="/episodios" aria-label="Rickflix inicio">RICK<span>FLIX</span><i></i></a>
    <nav aria-label="Navegación principal"><a routerLink="/episodios" routerLinkActive="active">Episodios</a><a routerLink="/personajes" routerLinkActive="active">Personajes</a></nav>
    <div class="account"><span class="avatar">A</span><span class="username">Admin</span><button class="logout" (click)="logout()">Cerrar sesión <span aria-hidden="true">↗</span></button></div></header>
  }
  <router-outlet />
  <footer><a class="brand small" routerLink="/episodios">RICK<span>FLIX</span></a><p>Un universo de posibilidades. Y unas cuantas dimensiones más.</p><span>Proyecto de demostración · Rick and Morty API</span></footer>
` })
export class AppComponent { auth = inject(AuthService); private router = inject(Router); logout() { this.auth.logout(); this.router.navigateByUrl('/login'); } }
