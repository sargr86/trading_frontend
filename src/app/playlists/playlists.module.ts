import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PlaylistsRoutingModule} from './playlists-routing.module';
import {SinglePlaylistComponent} from './single-playlist/single-playlist.component';
import {SharedModule} from '@shared/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';


@NgModule({
    declarations: [SinglePlaylistComponent],
    imports: [
        CommonModule,
        PlaylistsRoutingModule,
        DragDropModule,
        SharedModule
    ]
})
export class PlaylistsModule {
}
