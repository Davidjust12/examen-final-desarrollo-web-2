export interface Character { id: number; name: string; status: string; species: string; type: string; gender: string; origin: { name: string }; location: { name: string }; image: string; episode: string[]; }
export interface Episode { id: number; name: string; air_date: string; episode: string; characters: string[]; }
export interface Page<T> { info: { count: number; pages: number; next: string | null; prev: string | null }; results: T[]; }
