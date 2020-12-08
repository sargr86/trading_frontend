import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlaylistsRoutingModule} from './playlists-routing.module';
import {SinglePlaylistComponent} from './single-playlist/single-playlist.component';
import {SharedModule} from '@shared/shared.module';


@NgModule({
    declarations: [SinglePlaylistComponent],
    imports: [
        CommonModule,
        PlaylistsRoutingModule,
        SharedModule
    ]
})
export class PlaylistsModule {
}
