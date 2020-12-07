import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistsRoutingModule } from './playlists-routing.module';
import { SinglePlaylistComponent } from './single-playlist/single-playlist.component';


@NgModule({
  declarations: [SinglePlaylistComponent],
  imports: [
    CommonModule,
    PlaylistsRoutingModule
  ]
})
export class PlaylistsModule { }
