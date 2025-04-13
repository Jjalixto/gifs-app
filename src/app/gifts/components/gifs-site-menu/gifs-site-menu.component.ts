import { Component } from '@angular/core';
import { GifsSideMenuHeaderComponent } from "../gifs-side-menu-header/gifs-side-menu-header.component";
import { GifsSideMenuOptionsComponent } from "../gifs-side-menu-options/gifs-side-menu-options.component";

@Component({
  selector: 'gifs-site-menu',
  imports: [GifsSideMenuHeaderComponent, GifsSideMenuOptionsComponent],
  templateUrl: './gifs-site-menu.component.html'
})
export class GifsSiteMenuComponent { }
