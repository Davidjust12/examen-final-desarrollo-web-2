import { Component, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, map, combineLatest } from 'rxjs';
import { ApiService } from './api.service';
import { Character, Episode } from './models';
import { CharacterCardComponent } from './character-card.component';
@Component({ standalone: true, imports: [RouterLink, CharacterCardComponent], template: `
<main class="detail section"><a class="back" [routerLink]="isCharacter ? '/personajes' : '/episodios'">← Volver a {{ isCharacter ? 'personajes' : 'episodios' }}</a>
@if (loading()) { <div class="message" role="status"><span class="spinner"></span> Viajando a otra dimensión…</div> }
@else if (error()) { <div class="message" role="alert"><h1>Portal no disponible</h1><p>{{ error() }}</p><button class="button primary" (click)="load()">Reintentar</button></div> }
@else { @if (character(); as c) { <section class="character-detail"><img [src]="c.image" [alt]="c.name"><div><span class="eyebrow">ARCHIVO DEL MULTIVERSO · #{{ c.id }}</span><h1>{{ c.name }}<span class="green">.</span></h1><span class="badge">{{ c.status === 'Alive' ? 'Vivo' : c.status === 'Dead' ? 'Muerto' : 'Estado desconocido' }}</span><dl><div><dt>Especie</dt><dd>{{ c.species }}</dd></div><div><dt>Género</dt><dd>{{ c.gender }}</dd></div><div><dt>Tipo</dt><dd>{{ c.type || 'No especificado' }}</dd></div><div><dt>Origen</dt><dd>{{ c.origin.name }}</dd></div><div><dt>Última ubicación</dt><dd>{{ c.location.name }}</dd></div><div><dt>Apariciones</dt><dd>{{ c.episode.length }} episodios</dd></div></dl></div></section><h2 class="detail-title">Sus aventuras</h2><div class="episode-links">@for (url of c.episode; track url) { <a [routerLink]="['/episodios', idFromUrl(url)]">Episodio {{ idFromUrl(url) }} ↗</a> }</div> }
@if (episode(); as e) { <section class="episode-detail"><div class="mini-portal"></div><div class="episode-detail-copy"><span class="eyebrow">{{ e.episode }} · RICK AND MORTY</span><h1>{{ e.name }}<span class="green">.</span></h1><p>Estreno: {{ e.air_date }}</p><span class="badge">{{ e.characters.length }} personajes en este capítulo</span></div></section><div class="section-heading cast-heading"><div><span class="eyebrow">QUIÉN ES QUIÉN</span><h2>El reparto de esta dimensión</h2></div><span class="count">{{ cast().length }} personajes</span></div><div class="character-grid">@for (c of cast(); track c.id) { <app-character-card [character]="c" /> }</div> }
}</main>
` })
export class DetailComponent {
  private route = inject(ActivatedRoute); private api = inject(ApiService); private destroyRef = inject(DestroyRef); private request?: { unsubscribe(): void };
  isCharacter = this.route.snapshot.data['kind'] === 'characters'; loading = signal(true); error = signal(''); character = signal<Character | null>(null); episode = signal<Episode | null>(null); cast = signal<Character[]>([]);
  constructor() { combineLatest([this.route.data, this.route.paramMap]).pipe(takeUntilDestroyed()).subscribe(([data]) => { this.isCharacter = data['kind'] === 'characters'; this.load(); }); }
  idFromUrl(url: string) { return Number(url.split('/').pop()); }
  load() { this.request?.unsubscribe(); this.loading.set(true); this.error.set(''); this.character.set(null); this.episode.set(null); this.cast.set([]); const id = Number(this.route.snapshot.paramMap.get('id'));
    const onError = () => { this.error.set('No pudimos encontrar este contenido. Revisa tu conexión o regresa al catálogo.'); this.loading.set(false); };
    if (!Number.isInteger(id) || id < 1) { onError(); return; }
    if (this.isCharacter) this.request = this.api.character(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ next: c => { this.character.set(c); this.loading.set(false); }, error: onError });
    else this.request = this.api.episode(id).pipe(switchMap(e => this.api.cast(e.characters).pipe(map(cast => ({e, cast})))), takeUntilDestroyed(this.destroyRef)).subscribe({ next: ({e, cast}) => { this.episode.set(e); this.cast.set(cast); this.loading.set(false); }, error: onError });
  }
}
