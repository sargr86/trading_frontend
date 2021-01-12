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
import {CategoriesComponent} from '@shared/components/categories/categories.component';
import {FilterDevicesPipe} from './pipes/filter-devices.pipe';
import {GetThumbPathPipe} from './pipes/get-thumb-path.pipe';
import {VideoCarouselHolderComponent} from './components/video-carousel-holder/video-carousel-holder.component';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from './pipes/get-selected-videos-to-be-added-to-playlist.pipe';

@NgModule({
    declarations: [
        VideoJsComponent,
        VideoJsRecordComponent,
        CategoriesComponent,
        ChatBoxComponent,
        GetAuthUserPipe,
        BlobToFilePipe,
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetThumbPathPipe,
        VideoCarouselHolderComponent,
        GetSelectedVideosToBeAddedToPlaylistPipe,
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
        Base64ToFilePipe,
        FilterDevicesPipe,
        GetSelectedVideosToBeAddedToPlaylistPipe
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CarouselModule,
        PickerModule,
        MaterialModule,
        VideoJsComponent,
        VideoJsRecordComponent,
        ChatBoxComponent,
        CategoriesComponent,
        FilterDevicesPipe,
        GetThumbPathPipe,
        VideoCarouselHolderComponent
    ]

})
export class SharedModule {
}
