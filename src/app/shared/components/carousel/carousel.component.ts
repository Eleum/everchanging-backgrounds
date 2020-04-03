import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit, AfterViewInit {
    @Output() slidechanged: EventEmitter<number> = new EventEmitter();

    carouselHover = false;

    images = [
        './assets/bg1.jpg',
        './assets/bg.jpg'
    ];
    slides = [];
    carouselConfig: NguCarouselConfig = {
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

    public slideChange(e: NguCarouselStore) {
        this.slidechanged.emit(e.currentSlide);
    }

    private loadCarouselSlides() {
        this.slides = this.slides.concat(this.images);
    }

    private setElementsStyle() {
        (<any>document.getElementsByClassName('ngu-touch-container')[0]).style.height = '100%';
        Array.from(document.getElementsByClassName('tile')).forEach((element: any) => {
            element.style.height = '100%';
        });
    }
}
