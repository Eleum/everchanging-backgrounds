import { Component, OnInit, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

@Component({
    selector: 'app-carousel',
    templateUrl: './carousel.component.html',
    styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent {
    @Output() slidechanged: EventEmitter<number> = new EventEmitter();

    private carouselHover = false;

    private slides = [];
    private carouselConfig: NguCarouselConfig = {
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

    private slideChange(e: NguCarouselStore) {
        this.slidechanged.emit(e.currentSlide);
    }

    public addCarouselSlide(slide: any) {
        this.slides.push(slide.image);
    }
}
