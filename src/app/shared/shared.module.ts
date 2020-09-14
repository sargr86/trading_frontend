import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import { VideoJsComponent } from './components/video-js/video-js.component';
import { VideoJsRecordComponent } from './components/video-js-record/video-js-record.component';


@NgModule({
  declarations: [
    VideoJsComponent,
    VideoJsRecordComponent
  ],
  imports: [
    CommonModule,
    CarouselModule
  ],
  exports: [
    CarouselModule,
    VideoJsComponent,
    VideoJsRecordComponent
  ]
})
export class SharedModule {
}
