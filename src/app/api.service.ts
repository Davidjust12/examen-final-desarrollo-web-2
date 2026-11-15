import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, retry, throwError, timer } from 'rxjs';
import { Character, Episode, Page } from './models';
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = isDevMode() ? '/api' : 'https://rickandmortyapi.com/api';
  private portrait(character: Character): Character { return { ...character, image: isDevMode() ? character.image.replace('https://rickandmortyapi.com/api', '/api') : character.image }; }
  private resilient<T>(request: Observable<T>) { return request.pipe(retry({ count: 3, delay: (error, attempt) => error.status === 0 || error.status === 429 || error.status >= 500 ? timer(attempt * 2000) : throwError(() => error) })); }
  characters(page: number) { return this.resilient(this.http.get<Page<Character>>(`${this.base}/character${page === 1 ? '' : '/?page=' + page}`)).pipe(map(data => ({ ...data, results: data.results.map(c => this.portrait(c)) }))); }
  episodes(page: number) { return this.resilient(this.http.get<Page<Episode>>(`${this.base}/episode${page === 1 ? '' : '/?page=' + page}`)); }
  character(id: number) { return this.resilient(this.http.get<Character>(`${this.base}/character/${id}`)).pipe(map(c => this.portrait(c))); }
  episode(id: number) { return this.resilient(this.http.get<Episode>(`${this.base}/episode/${id}`)); }
  cast(urls: string[]): Observable<Character[]> {
    const ids = urls.map(url => Number(url.split('/').pop()));
    if (!ids.length) return of([]);
    return this.resilient(this.http.get<Character | Character[]>(`${this.base}/character/${ids.join(',')}`)).pipe(map(value => (Array.isArray(value) ? value : [value]).map(c => this.portrait(c))));
  }
}
