import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {VideosRoutingModule} from './videos-routing.module';
import {ShowVideosComponent} from './show-videos/show-videos.component';
import {SharedModule} from '@shared/shared.module';

import {PlayVideoComponent} from '../videos/play-video/play-video.component';
import {ShowSavedVideosComponent} from './show-saved-videos/show-saved-videos.component';
import {VideoSuggestionsComponent} from './play-video/video-suggestions/video-suggestions.component';
import { VideoDetailsFormComponent } from './play-video/video-details-form/video-details-form.component';

@NgModule({
    declarations: [
        ShowVideosComponent,
        PlayVideoComponent,
        ShowSavedVideosComponent,
        VideoSuggestionsComponent,
        VideoDetailsFormComponent
    ],
    imports: [
        CommonModule,
        VideosRoutingModule,
        SharedModule
    ]
})
export class VideosModule {
}
