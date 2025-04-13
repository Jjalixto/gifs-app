import { Component, inject, signal } from '@angular/core';
import { GifListComponent } from "../../components/gif-list/gif-list.component";
import { Gif } from '../../interfaces/gif.interface';
import { GifService } from '../../services/gif.service';

@Component({
  selector: 'app-search-page',
  imports: [GifListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {
  private searchQuery = inject(GifService);
  gifs = signal<Gif[]>([]);

  onSearch(query : string) {
    this.searchQuery.searchGifs(query)
      .subscribe((resp) => {
          this.gifs.set(resp);
      } );
  }
}
