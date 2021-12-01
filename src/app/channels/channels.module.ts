import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChannelsRoutingModule} from './channels-routing.module';
import {ShowChannelComponent} from './show-channel/show-channel.component';
import {SharedModule} from '@shared/shared.module';
import {NgxPhotoEditorModule} from 'ngx-photo-editor';
import {ChannelProfileComponent} from './show-channel/channel-profile/channel-profile.component';
import {WatchlistTabComponent} from './show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from './show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from './show-channel/playlists-tab/playlists-tab.component';
import {AboutTabComponent} from './show-channel/about-tab/about-tab.component';


@NgModule({
    declarations: [
        ShowChannelComponent,
        ChannelProfileComponent,
        WatchlistTabComponent,
        VideosTabComponent,
        PlaylistsTabComponent,
        AboutTabComponent
    ],
    imports: [
        CommonModule,
        ChannelsRoutingModule,
        SharedModule,
        NgxPhotoEditorModule,
    ]
})
export class ChannelsModule {
}
