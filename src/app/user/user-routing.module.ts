import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {VideoComponent} from '@app/user/video/video.component';
import {VideoLibraryComponent} from '@app/user/video-library/video-library.component';
import {ChatComponent} from './chat/chat.component';


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'video',
    component: VideoComponent
  },
  {
    path: 'video-library',
    component: VideoLibraryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
