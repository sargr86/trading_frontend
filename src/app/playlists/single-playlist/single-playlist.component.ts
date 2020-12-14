import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {MatDialog} from '@angular/material/dialog';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {API_URL} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';

@Component({
    selector: 'app-single-playlist',
    templateUrl: './single-playlist.component.html',
    styleUrls: ['./single-playlist.component.scss']
})
export class SinglePlaylistComponent implements OnInit {
    playlist;
    apiUrl = API_URL;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog
    ) {
        console.log(this.route.snapshot);

        const playlistId = this.route.snapshot?.params?.id;

        if (playlistId) {
            this.getPlaylistDetails(playlistId);
        }
    }

    ngOnInit(): void {
    }

    openVideosModal() {
        this.dialog.open(AddVideoToPlaylistDialogComponent, {data: {playlist: this.playlist}}).afterClosed().subscribe(dt => {
            this.getPlaylistDetails(this.playlist.id);
        });
    }

    updatePrivacy(value, playlist) {
        this.playlistsService.updatePrivacy({privacy: value, id: playlist.id}).subscribe(dt => {

        });

    }

    openVideoPage(video) {
        this.router.navigate(['videos/play'], {queryParams: {id: video.id}});
    }

    getPlaylistDetails(playlistId) {
        this.playlistsService.getById({playlist_id: playlistId}).subscribe(dt => {
            this.playlist = dt;
        });
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
        this.playlistsService.removeVideoFromPlaylist({playlist_id: playlistId, video_id: videoId}).subscribe(dt => {
            this.playlist = dt;
        });
    }

}
