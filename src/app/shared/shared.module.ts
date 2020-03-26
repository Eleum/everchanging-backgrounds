import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NguCarouselModule } from '@ngu/carousel';
import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './components/';
import { CarouselComponent } from './components/';
import { WebviewDirective } from './directives/';


@NgModule({
  declarations: [
    PageNotFoundComponent, 
    WebviewDirective, 
    CarouselComponent
  ],
  imports: [
    CommonModule, 
    TranslateModule, 
    FormsModule,
    NguCarouselModule
  ],
  exports: [
    TranslateModule, 
    WebviewDirective, 
    FormsModule, 
    CarouselComponent
  ]
})
export class SharedModule { }
