import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
    selector: 'app-playlists-tab',
    templateUrl: './playlists-tab.component.html',
    styleUrls: ['./playlists-tab.component.scss']
})
export class PlaylistsTabComponent implements OnInit {
    playlists = [];
    apiUrl = API_URL;

    @Input('channelUser') channelUser;

    constructor(
        public router: Router,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog
    ) {
    }


    ngOnInit(): void {
        this.getPlaylists();
    }


    getPlaylists() {
        this.playlistsService.get({channel_id: this.channelUser.channel.id}).subscribe(dt => {
            this.playlists = dt;
        });
    }

    openAddPlaylistModal() {
        this.dialog.open(AddPlaylistDialogComponent, {data: {channel_id: this.channelUser.channel.id}}).afterClosed().subscribe(dt => {
            this.getPlaylists();
        });
    }

}
