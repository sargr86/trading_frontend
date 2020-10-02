import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {VideoJsComponent} from './components/video-js/video-js.component';
import {VideoJsRecordComponent} from './components/video-js-record/video-js-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatBoxComponent} from './components/chat-box/chat-box.component';
import {GetAuthUserPipe} from './pipes/get-auth-user.pipe';


@NgModule({
  declarations: [
    VideoJsComponent,
    VideoJsRecordComponent,
    ChatBoxComponent,
    GetAuthUserPipe
  ],
  imports: [
    CommonModule,
    CarouselModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    GetAuthUserPipe
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    VideoJsComponent,
    VideoJsRecordComponent,
    ChatBoxComponent
  ]
})
export class SharedModule {
}
