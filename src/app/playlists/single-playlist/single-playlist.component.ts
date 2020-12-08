import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-single-playlist',
    templateUrl: './single-playlist.component.html',
    styleUrls: ['./single-playlist.component.scss']
})
export class SinglePlaylistComponent implements OnInit {
    playlist;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService
    ) {
        console.log(this.route.snapshot);

        const playlistId = this.route.snapshot?.params?.id;

        if (playlistId) {
            this.playlistsService.getById({id: playlistId}).subscribe(dt => {
                this.playlist = dt;
            });
        }
    }

    ngOnInit(): void {
    }

    updatePrivacy(value, playlist) {
        this.playlistsService.updatePrivacy({privacy: value, id: playlist.id}).subscribe(dt => {

        });

    }

}
