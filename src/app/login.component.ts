import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './auth.service';
@Component({ standalone: true, imports: [FormsModule], template: `
<main class="login-page"><a class="brand login-brand" href="/">RICK<span>FLIX</span><i></i></a>
<div class="login-art" aria-hidden="true"><div class="portal"></div><img src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt=""><img src="https://rickandmortyapi.com/api/character/avatar/2.jpeg" alt=""></div>
<section class="login-card"><span class="eyebrow">TU PRÓXIMA DIMENSIÓN TE ESPERA</span><h1>Entra al<br>multiverso<span class="green">.</span></h1><p>Episodios inolvidables. Personajes de otro mundo.<br>Todo en un solo lugar.</p>
<form (ngSubmit)="submit()"><label for="username">Usuario</label><input id="username" name="username" [(ngModel)]="username" autocomplete="username" placeholder="Tu usuario" required>
<label for="password">Contraseña</label><input id="password" name="password" [(ngModel)]="password" type="password" autocomplete="current-password" placeholder="Tu contraseña" required>
@if (error) { <p role="alert" class="error">{{ error }}</p> }
<button class="button primary login-submit" type="submit">Iniciar sesión <span>→</span></button></form>
<div class="demo"><span class="green">◉</span> Acceso de demostración<br><strong>admin</strong><span> / </span><strong>admin123</strong></div><small>Sin suscripciones. Sin límites dimensionales.</small></section></main>
` })
export class LoginComponent {
  username = ''; password = ''; error = ''; private auth = inject(AuthService); private router = inject(Router); private route = inject(ActivatedRoute);
  constructor() { if (this.auth.authenticated()) this.router.navigateByUrl('/episodios'); }
  submit() { if (this.auth.login(this.username, this.password)) { const target = this.route.snapshot.queryParamMap.get('returnUrl'); this.router.navigateByUrl(target?.startsWith('/') && !target.startsWith('//') ? target : '/episodios'); } else this.error = 'Usuario o contraseña incorrectos. Inténtalo de nuevo.'; }
}
