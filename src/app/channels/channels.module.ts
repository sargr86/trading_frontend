import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsRoutingModule} from './channels-routing.module';
import {ShowChannelComponent} from './show-channel/show-channel.component';
import {SharedModule} from '@shared/shared.module';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';


@NgModule({
    declarations: [ShowChannelComponent],
    imports: [
        CommonModule,
        ChannelsRoutingModule,
        SharedModule,
        NgxPhotoEditorModule,
    ]
})
export class ChannelsModule {
}
