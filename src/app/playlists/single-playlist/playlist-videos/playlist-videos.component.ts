import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {AddVideoToAnotherPlaylistComponent} from '@core/components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {MatDialog} from '@angular/material/dialog';
import {API_URL} from '@core/constants/global';

@Component({
    selector: 'app-playlist-videos',
    templateUrl: './playlist-videos.component.html',
    styleUrls: ['./playlist-videos.component.scss']
})
export class PlaylistVideosComponent implements OnInit {

    apiUrl = API_URL;


    @Input('playlist') playlist;
    @Output('refreshPlaylist') refreshPlaylist = new EventEmitter();

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
    }

    openVideoPage(video) {
        this.router.navigate(['videos/play'], {queryParams: {id: video.id}});
    }

    dragDropped(e, video) {
        console.log(e)
        // console.log(channel)
        this.playlist.videos = moveItemInArray(this.playlist.videos, e.previousIndex, e.currentIndex);
        // console.log(this.playlist)
        const sendData = {
            rows: JSON.stringify(this.playlist),
            playlist_id: this.playlist.id,
            // user_id: this.authUser.id
        };
        this.playlistsService.updateVideoPosition(sendData).subscribe(dt => {
        });
    }

    changePlaylistThumbnail(playlistId, thumbnail) {
        const params = {playlist_id: playlistId, ...{thumbnail}};
        this.playlistsService.changePlaylistThumbnail(params).subscribe(dt => {
            this.playlist = dt;
        });
    }

    removeVideoFromPlaylist(playlistId, videoId) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.playlistsService.removeVideoFromPlaylist({
                    playlist_id: playlistId,
                    video_id: videoId
                }).subscribe(dt => {
                    this.playlist = dt;
                });
            }
        });
    }


    addToAnotherPlaylist(video) {
        this.playlistsService.get().subscribe(dt => {
            this.dialog.open(AddVideoToAnotherPlaylistComponent, {
                width: '500px',
                data: {video_id: video.id, playlists: dt}
            }).afterClosed().subscribe(result => {
                this.refreshPlaylist.emit();
            });
        });
    }

}
