import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowVideosComponent} from '@app/videos/show-videos/show-videos.component';


const routes: Routes = [
    {
        path: '',
        component: ShowVideosComponent
    }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VideosRoutingModule {
}

