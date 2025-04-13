import { HttpClient } from "@angular/common/http";
import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { environment } from "@environments/environment";
import { GiphyResponse } from "../interfaces/giphy.interface";
import { Gif } from "../interfaces/gif.interface";
import { GifMapper } from "../mapper/gif.mapper";
import { map, Observable, tap } from "rxjs";

const GIT_KEY = 'gifs';

const loadFromLocalStorage = () => {
  const gifsFromLocalStorage = localStorage.getItem(GIT_KEY) ?? '{}';
  const gitfs = JSON.parse(gifsFromLocalStorage);
  return gitfs;
};

// {
//   'goku': [gif1, gif2, gif3],
//   'saitama': [gif1, gif2, gif3],
// }

// es para almacenar valores dinamicos
// Record<string, Gif[] >

@Injectable({ providedIn: 'root' })
export class GifService {

  //aqui se injecta
  private http = inject(HttpClient);

  trendingGifs = signal<Gif[]>([]);
  trendingGifsLoading = signal<boolean>(true);

  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());
  searchHistoryKey = computed ( () => Object.keys(this.searchHistory()));

  constructor() {
    this.loadTrendingGifs();
  }

  saveGifsToLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIT_KEY, historyString);
  })

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      }
    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);
      this.trendingGifsLoading.set(false);
      console.log({ gifs });
    })
  }

  searchGifs(query: string): Observable<Gif[]> {
    //sin el return obliga a utilizar el subscribe para que retorne el valor
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
        q : query,
        limit: 20
      },
    }).pipe(
      map( ({ data }) => data ),
      map(( items) => GifMapper.mapGiphyItemsToGifArray(items) ),

      //todo historial
      tap( (items) => {
        localStorage.setItem(query, JSON.stringify(items));
        this.searchHistory.update( (history) => ({
          ...history,
          [query.toLocaleLowerCase()]: items,
        }));
      })
    );
    //   .subscribe((resp) => {
    //   const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
    //   this.trendingGifs.set(gifs);
    //   console.log({ gifs });
    // })
  }

  getHistoryGifs(query: string): Gif[] {

    return this.searchHistory()[query] ?? [];
  }

}
