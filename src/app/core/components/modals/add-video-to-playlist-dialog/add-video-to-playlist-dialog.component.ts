import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-add-video-to-playlist-dialog',
    templateUrl: './add-video-to-playlist-dialog.component.html',
    styleUrls: ['./add-video-to-playlist-dialog.component.scss']
})
export class AddVideoToPlaylistDialogComponent implements OnInit {
    activeTab = 'yours';
    authUser;
    currentUser;
    selectedVideos = [];
    playlist;


    @ViewChild('urlInput') urlInput;

    constructor(
        private modal: MatDialogRef<AddVideoToPlaylistDialogComponent>,
        private videoService: VideoService,
        private playlistsService: PlaylistsService,
        private getAuthUser: GetAuthUserPipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
        this.playlist = data.playlist;
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
    }

    selectVideo(videos) {
        this.selectedVideos = videos;
        console.log(this.selectedVideos)
    }

    changeTab(tab) {
        this.activeTab = tab;
        this.selectedVideos = [];
    }


    addVideos() {
        const params = {playlist_id: this.playlist.id, video_ids: JSON.stringify(this.selectedVideos)};
        this.playlistsService.addVideosToPlaylist(params).subscribe(dt => {
            this.modal.close();
        });
    }

    cancel() {
        this.modal.close();
    }

    ifSubmitInactive(activeTab) {
        if (activeTab === 'yours') {
            return this.currentUser?.videos?.length === 0;
        }

    }

}
