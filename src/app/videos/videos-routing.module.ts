import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowVideosComponent} from '@app/videos/show-videos/show-videos.component';
import {PlayVideoComponent} from '@app/videos/play-video/play-video.component';
import {ShowSavedVideosComponent} from '@app/videos/show-saved-videos/show-saved-videos.component';
import {AuthGuard} from '@core/guards/auth.guard';


const routes: Routes = [
    {
        path: '',
        component: ShowVideosComponent,
        pathMatch: 'full'
    },
    {
        path: 'play',
        component: PlayVideoComponent
    },
    {
        path: 'saved',
        component: ShowSavedVideosComponent,
        canActivate: [AuthGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideosRoutingModule {
}

