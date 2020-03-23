import { Component, OnInit } from '@angular/core';
import { NguCarouselConfig } from '@ngu/carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
  imgags = [
    './assets/bg.jpg',
    './assets/bg1.jpg'
  ];
  carouselInstances: Array<any> = [0];
  carouselTiles = { 0: [] };
  tile: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
    slide: 1,
    speed: 950,
    point: {
      visible: false
    },
    loop: false,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)'
  };

  constructor() { }

  ngOnInit() {
    this.carouselInstances.forEach(el => {
      this.loadCarouselTile(el);
    });
  }

  public loadCarouselTile(carouselIdx: number) {
    this.carouselTiles[carouselIdx] = this.carouselTiles[carouselIdx].concat(this.imgags);
  }
}
