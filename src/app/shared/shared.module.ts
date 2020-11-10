import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CarouselModule} from 'ngx-owl-carousel-o';
import {VideoJsComponent} from './components/video-js/video-js.component';
import {VideoJsRecordComponent} from './components/video-js-record/video-js-record.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChatBoxComponent} from './components/chat-box/chat-box.component';
import {GetAuthUserPipe} from './pipes/get-auth-user.pipe';
import {BlobToFilePipe} from './pipes/blob-to-file.pipe';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {MaterialModule} from '@core/modules/material.module';
import {Base64ToFilePipe} from './pipes/base64-to-file.pipe';

@NgModule({
    declarations: [
        VideoJsComponent,
        VideoJsRecordComponent,
        ChatBoxComponent,
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe
    ],
    imports: [
        CommonModule,
        CarouselModule,
        FormsModule,
        ReactiveFormsModule,
        PickerModule,
        MaterialModule
    ],
    providers: [
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CarouselModule,
        PickerModule,
        MaterialModule,
        VideoJsComponent,
        VideoJsRecordComponent,
        ChatBoxComponent
    ]
})
export class SharedModule {
}
