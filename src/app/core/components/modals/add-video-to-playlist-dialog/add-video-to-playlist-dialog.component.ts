import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import {PlaylistsService} from '@core/services/playlists.service';
import {patternValidator} from '@core/helpers/pattern-validator';
import {URL_PATTERN} from '@core/constants/patterns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-add-video-to-playlist-dialog',
    templateUrl: './add-video-to-playlist-dialog.component.html',
    styleUrls: ['./add-video-to-playlist-dialog.component.scss']
})
export class AddVideoToPlaylistDialogComponent implements OnInit {
    activeTab = 'yours';
    authUser;
    currentUser;
    apiUrl = API_URL;
    selectedVideos = [];
    playlist;
    searchedVideos = [];
    validUrl = true;
    searchVideoByUrlForm: FormGroup;

    @ViewChild('urlInput') urlInput;

    constructor(
        private modal: MatDialogRef<AddVideoToPlaylistDialogComponent>,
        private videoService: VideoService,
        private playlistsService: PlaylistsService,
        private getAuthUser: GetAuthUserPipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.playlist = data.playlist;
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        });

        this.searchVideoByUrlForm = this.fb.group({
            url: ['', [Validators.required, patternValidator(URL_PATTERN)]]
        });
    }

    selectVideo(id) {
        if (this.selectedVideos.includes(id)) {
            this.selectedVideos = this.selectedVideos.filter(v => v !== id);
        } else {
            this.selectedVideos.push(id);
        }
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

    getUrlString(e) {
        const possibleUrl = e.clipboardData.getData('text');
        this.validUrl = URL_PATTERN.test(possibleUrl);
        if (this.validUrl) {
            const parsedUrl = new URL(possibleUrl);
            const id = parsedUrl.searchParams.get('id');
            this.videoService.getVideoById({id}).subscribe(dt => {
                this.searchedVideos = [dt];
            });
        }
    }

    searchVideos(e) {
        this.videoService.searchInAllVideos(e).subscribe(dt => {
            this.searchedVideos = dt;
        });
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

}
