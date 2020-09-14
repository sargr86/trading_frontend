import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { VideoJsComponent } from './components/video-js/video-js.component';


@NgModule({
  declarations: [
    VideoJsComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [
    CarouselModule,
    VideoJsComponent
  ]
})
export class SharedModule {
}
