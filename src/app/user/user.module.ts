import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '@shared/shared.module';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';
import {VideoComponent} from '@app/user/publisher-flow/video/video.component';
import {PublisherComponent} from './openvidu-test/publisher/publisher.component';
import {SubscriberComponent} from './openvidu-test/subscriber/subscriber.component';
import {UserVideoComponent} from './subscriber-flow/user-video/user-video.component';
import {OvVideoComponent} from './subscriber-flow/ov-video/ov-video.component';
import {VideoLibraryComponent} from './openvidu-test/video-library/video-library.component';
import {OpenviduSessionModule} from 'openvidu-angular';
import {JoinStreamingFormComponent} from './openvidu-test/join-streaming-form/join-streaming-form.component';
import {HomeComponent} from '@app/user/home/home.component';
import {CheckStreamingRequirementsComponent} from './publisher-flow/check-streaming-requirements/check-streaming-requirements.component';
import {PublisherFlowComponent} from './publisher-flow/publisher-flow.component';
import {SubscriberFlowComponent} from './subscriber-flow/subscriber-flow.component';
import {CollectStreamingDetailsFormComponent} from './publisher-flow/collect-streaming-details-form/collect-streaming-details-form.component';
import {JoinVideoStreamingComponent} from './subscriber-flow/join-video-streaming/join-video-streaming.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {DROPZONE_CONFIG, DropzoneConfigInterface, DropzoneModule} from 'ngx-dropzone-wrapper';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { TurboPlanComponent } from './turbo-plan/turbo-plan.component';

const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
    url: '{no_url}',
    maxFilesize: 50,
    maxFiles: 1,
    acceptedFiles: 'image/*',
    autoProcessQueue: false,
    addRemoveLinks: true
};

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
        JoinStreamingFormComponent,
        CheckStreamingRequirementsComponent,
        PublisherFlowComponent,
        SubscriberFlowComponent,
        CollectStreamingDetailsFormComponent,
        JoinVideoStreamingComponent,
        PaymentSuccessComponent,
        PaymentCancelComponent,
        TurboPlanComponent,
    ],
    imports: [
        CommonModule,
        UserRoutingModule,
        OpenviduSessionModule,
        NgxPhotoEditorModule,
        BsDatepickerModule.forRoot(),
        DropzoneModule,
        SharedModule
    ],
    providers: [
        {
            provide: DROPZONE_CONFIG,
            useValue: DEFAULT_DROPZONE_CONFIG
        }
    ],
    exports: []
})
export class UserModule {
}
