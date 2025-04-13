import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GifsSiteMenuComponent } from "../../components/gifs-site-menu/gifs-site-menu.component";

@Component({
  selector: 'app-dashboard-page',
  imports: [
    RouterOutlet,
    GifsSiteMenuComponent
],
  templateUrl: './dashboard-page.component.html',
})
export default class DashboardPageComponent { }
