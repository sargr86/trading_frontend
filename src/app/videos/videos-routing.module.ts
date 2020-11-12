import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowVideosComponent} from '@app/videos/show-videos/show-videos.component';
import {PlayVideoComponent} from '@app/videos/play-video/play-video.component';


const routes: Routes = [
    {
        path: '',
        component: ShowVideosComponent
    },
    {
        path: 'play',
        component: PlayVideoComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideosRoutingModule {
}

