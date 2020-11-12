import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '@shared/shared.module';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';
import {VideoComponent} from '@app/user/video/video.component';
import {PublisherComponent} from './publisher/publisher.component';
import {SubscriberComponent} from './subscriber/subscriber.component';
import {UserVideoComponent} from './user-video/user-video.component';
import {OvVideoComponent} from './ov-video/ov-video.component';
import {VideoLibraryComponent} from './video-library/video-library.component';
import {OpenviduSessionModule} from 'openvidu-angular';
import {ChatComponent} from './chat/chat.component';
import {AccessibilityStatementComponent} from './accessibility-statement/accessibility-statement.component';
import {CookiePolicyComponent} from './cookie-policy/cookie-policy.component';
import {HelpComponent} from './help/help.component';
import {AboutComponent} from './about/about.component';
import {StartStreamingFormComponent} from './start-streaming-form/start-streaming-form.component';
import {JoinStreamingFormComponent} from './join-streaming-form/join-streaming-form.component';
import {HomeComponent} from '@app/user/home/home.component';

@NgModule({
    declarations: [
        ProfileComponent,
        VideoComponent,
        PublisherComponent,
        SubscriberComponent,
        UserVideoComponent,
        OvVideoComponent,
        HomeComponent,
        VideoLibraryComponent,
        ChatComponent,
        AccessibilityStatementComponent,
        CookiePolicyComponent,
        HelpComponent,
        AboutComponent,
        StartStreamingFormComponent,
        JoinStreamingFormComponent
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        OpenviduSessionModule,
        NgxPhotoEditorModule,
        SharedModule
    ],
    exports: []
})
export class UserModule {
}
