import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '@shared/shared.module';
import {VideoComponent} from '@app/user/video/video.component';
import {PublisherComponent} from './publisher/publisher.component';
import {SubscriberComponent} from './subscriber/subscriber.component';
import { UserVideoComponent } from './user-video/user-video.component';
import { OvVideoComponent } from './ov-video/ov-video.component';
import { VideoLibraryComponent } from './video-library/video-library.component';
import { OpenviduSessionModule } from 'openvidu-angular';
import { ChatComponent } from './chat/chat.component';
import { AccessibilityStatementComponent } from './accessibility-statement/accessibility-statement.component';
import { CookiePolicyComponent } from './cookie-policy/cookie-policy.component';

@NgModule({
  declarations: [
    ProfileComponent,
    VideoComponent,
    PublisherComponent,
    SubscriberComponent,
    UserVideoComponent,
    OvVideoComponent,
    VideoLibraryComponent,
    ChatComponent,
    AccessibilityStatementComponent,
    CookiePolicyComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    OpenviduSessionModule,
    SharedModule
  ],
  exports: []
})
export class UserModule {
}
