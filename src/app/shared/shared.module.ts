import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [
    CarouselModule
  ]
})
export class SharedModule {
}
