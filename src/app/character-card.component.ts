import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Character } from './models';
@Component({ selector: 'app-character-card', standalone: true, imports: [RouterLink], template: `
<a class="character-card" [routerLink]="['/personajes', character().id]"><div class="portrait"><img [src]="character().image" [alt]="character().name" loading="lazy"><span class="status" [class.alive]="character().status === 'Alive'"><i></i>{{ character().status === 'Alive' ? 'Vivo' : character().status === 'Dead' ? 'Muerto' : 'Desconocido' }}</span></div><div class="card-body"><span class="card-meta">{{ character().species }}</span><h3>{{ character().name }}</h3><span class="card-link">Conocer personaje <span>↗</span></span></div></a>
` })
export class CharacterCardComponent { character = input.required<Character>(); }
