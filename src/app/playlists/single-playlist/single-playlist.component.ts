import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {MatDialog} from '@angular/material/dialog';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {API_URL} from '@core/constants/global';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddVideoToAnotherPlaylistComponent} from '@core/components/modals/add-video-to-another-playlist/add-video-to-another-playlist.component';

@Component({
    selector: 'app-single-playlist',
    templateUrl: './single-playlist.component.html',
    styleUrls: ['./single-playlist.component.scss']
})
export class SinglePlaylistComponent implements OnInit {
    playlist;
    apiUrl = API_URL;
    playlistInfoForm: FormGroup;
    editMode = false;

    constructor(
        public router: Router,
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
        private fb: FormBuilder
    ) {
        const playlistId = this.route.snapshot?.params?.id;

        if (playlistId) {
            this.playlistInfoForm = this.fb.group({
                id: [''],
                name: ['', Validators.required],
                description: ['']
            });
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

    editPlaylistInfo(playlist) {
        this.editMode = true;
        this.playlistInfoForm.patchValue(playlist);
    }

    savePlaylistInfoChanges() {
        this.playlistsService.updatePlaylistInfo(this.playlistInfoForm.value).subscribe((dt) => {
            this.editMode = false;
            this.playlist = dt;
        });
        console.log(this.playlistInfoForm.value)
    }

    addToAnotherPlaylist(video) {
        this.playlistsService.get().subscribe(dt => {
            this.dialog.open(AddVideoToAnotherPlaylistComponent, {
                width: '500px',
                data: {video_id: video.id, playlists: dt}
            }).afterClosed().subscribe(result => {

            });
        });
    }

}
