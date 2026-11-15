import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ApiService } from './api.service';
import { Character, Episode } from './models';
import { CharacterCardComponent } from './character-card.component';
import { combineLatest } from 'rxjs';
@Component({ standalone: true, imports: [RouterLink, CharacterCardComponent], template: `
<main>
<section class="hero"><div class="hero-art" aria-hidden="true"><div class="portal"></div><img class="hero-rick" src="https://rickandmortyapi.com/api/character/avatar/1.jpeg" alt=""><img class="hero-morty" src="https://rickandmortyapi.com/api/character/avatar/2.jpeg" alt=""></div>
<div class="hero-copy"><span class="eyebrow"><i class="live-dot"></i> ORIGINAL DEL MULTIVERSO</span><h1>Rick y Morty<span class="green">.</span></h1><div class="hero-meta"><span class="green">98% de caos</span><span>2013</span><span class="age">16+</span><span>Ciencia ficción</span></div><p>Un científico brillante. Un nieto nada preparado.<br>Aventuras infinitas a través del espacio, el tiempo<br class="desktop"> y las peores decisiones del universo.</p><div class="hero-actions"><a class="button primary" routerLink="/episodios/1"><span>▶</span> Explorar episodios</a><a class="button secondary" routerLink="/personajes">Conocer personajes <span>↗</span></a></div><span class="hero-note">ABRÓCHATE EL CINTURÓN. O NO. NADA TIENE SENTIDO.</span></div><span class="hero-index">01 <span>/ ∞ DIMENSIONES</span></span></section>
<section class="catalog section"><div class="section-heading"><div><span class="eyebrow">EXPLORA SIN LÍMITES</span><h2>{{ isCharacters ? 'Personajes del multiverso' : 'Cada episodio, otra dimensión' }}</h2><p>{{ isCharacters ? 'Caras conocidas. Especies desconocidas. Conócelos a todos.' : 'Elige un capítulo. El caos corre por nuestra cuenta.' }}</p></div><span class="count">{{ total() }} {{ isCharacters ? 'personajes' : 'episodios' }}</span></div>
<div class="catalog-tabs"><a routerLink="/episodios" [class.selected]="!isCharacters">Todos los episodios</a><a routerLink="/personajes" [class.selected]="isCharacters">Todos los personajes</a><span>UNIVERSO C-137 Y MÁS ALLÁ</span></div>
@if (loading()) { <div class="message" role="status"><span class="spinner"></span> Abriendo un portal…</div> }
@else if (error()) { <div class="message" role="alert"><p>{{ error() }}</p><button class="button secondary" (click)="load()">Reintentar</button></div> }
@else { @if (isCharacters) { <div class="character-grid">@for (character of characters(); track character.id) { <app-character-card [character]="character" /> }</div> } @else { <div class="episode-grid">@for (episode of episodes(); track episode.id) { <a class="episode-card" [routerLink]="['/episodios', episode.id]"><div class="episode-art" [class.variant-two]="episode.id % 3 === 1" [class.variant-three]="episode.id % 3 === 2"><div class="mini-portal"></div><span class="episode-code">{{ episode.episode }}</span><span class="episode-number">{{ episode.id.toString().padStart(2, '0') }}</span><span class="play">▶</span><span class="art-label">RICK AND MORTY</span></div><div class="card-body"><span class="card-meta">{{ episode.episode }} <span>· {{ episode.characters.length }} personajes</span></span><h3>{{ episode.name }}</h3><div class="card-bottom"><span>{{ episode.air_date }}</span><span class="green">Ver episodio ↗</span></div></div></a> }</div> }
<nav class="pagination" aria-label="Paginación del catálogo"><a class="button secondary" [class.disabled]="page() === 1" [attr.aria-disabled]="page() === 1" [attr.tabindex]="page() === 1 ? -1 : 0" [routerLink]="isCharacters ? '/personajes' : '/episodios'" [queryParams]="{page: page() === 1 ? 1 : page() - 1}">← Anterior</a><span>Página <strong>{{ page() }}</strong> de {{ pages() }}</span><a class="button secondary" [class.disabled]="page() >= pages()" [attr.aria-disabled]="page() >= pages()" [attr.tabindex]="page() >= pages() ? -1 : 0" [routerLink]="isCharacters ? '/personajes' : '/episodios'" [queryParams]="{page: page() >= pages() ? page() : page() + 1}">Siguiente →</a></nav> }
</section></main>
` })
export class CatalogComponent {
  private route = inject(ActivatedRoute); private api = inject(ApiService); private destroyRef = inject(DestroyRef);
  isCharacters = this.route.snapshot.data['kind'] === 'characters'; page = signal(1); pages = signal(1); total = signal(0); loading = signal(true); error = signal(''); characters = signal<Character[]>([]); episodes = signal<Episode[]>([]);
  private request?: { unsubscribe(): void };
  constructor() { combineLatest([this.route.data, this.route.queryParamMap]).pipe(takeUntilDestroyed()).subscribe(([data, params]) => { this.isCharacters = data['kind'] === 'characters'; const page = Number(params.get('page') || 1); this.page.set(Number.isInteger(page) && page > 0 ? page : 1); this.load(); }); }
  load() { this.request?.unsubscribe(); this.loading.set(true); this.error.set('');
    const onError = () => { this.error.set('No pudimos cargar el catálogo. Revisa tu conexión o vuelve a la primera página.'); this.loading.set(false); };
    if (this.isCharacters) this.request = this.api.characters(this.page()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: data => { this.characters.set(data.results); this.pages.set(data.info.pages); this.total.set(data.info.count); this.loading.set(false); }, error: onError });
    else this.request = this.api.episodes(this.page()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: data => { this.episodes.set(data.results); this.pages.set(data.info.pages); this.total.set(data.info.count); this.loading.set(false); }, error: onError });
  }
}
