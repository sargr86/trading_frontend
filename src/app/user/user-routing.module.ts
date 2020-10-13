import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ProfileComponent} from './profile/profile.component';
import {VideoComponent} from '@app/user/video/video.component';
import {VideoLibraryComponent} from '@app/user/video-library/video-library.component';
import {ChatComponent} from './chat/chat.component';
import { AccessibilityStatementComponent } from './accessibility-statement/accessibility-statement.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';
import {AuthGuard} from '@core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'cookie-policy',
    component: CookiePolicyComponent
  },
  {
    path: 'accessibility-statement',
    component: AccessibilityStatementComponent
  },
  {
    path: 'chat',
    component: ChatComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'video/publish',
    component: VideoComponent,
  },
  {
    path: 'video/watch',
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
