import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {
    images = [
        './assets/bg.jpg',
        './assets/bg1.jpg'
    ];
    tiles = [];
    tileConfig: NguCarouselConfig = {
        grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
        slide: 1,
        speed: 850,
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
        this.loadCarouselSlides();
    }

    ngAfterViewInit() {
        this.setElementsStyle();
    }    

    public slideChange(data: NguCarouselStore) {
        console.log(data);
    }

    private loadCarouselSlides() {
        this.tiles = this.tiles.concat(this.images);
    }

    private setElementsStyle() {
        (<any>document.getElementsByClassName('ngu-touch-container')[0]).style.height = '100%';
        Array.from(document.getElementsByClassName('tile')).forEach((element: any) => {
            element.style.height = '100%';
        });
    }
}
