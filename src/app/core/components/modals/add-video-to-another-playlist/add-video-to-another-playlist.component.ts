import {Component, Inject, OnInit} from '@angular/core';
import {PlaylistsService} from '@core/services/playlists.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
    selector: 'app-add-video-to-another-playlist',
    templateUrl: './add-video-to-another-playlist.component.html',
    styleUrls: ['./add-video-to-another-playlist.component.scss']
})
export class AddVideoToAnotherPlaylistComponent implements OnInit {
    playlists;
    playlistForm: FormGroup;
    playlistIds = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private playlistsService: PlaylistsService,
        private fb: FormBuilder
    ) {
        this.playlistForm = this.fb.group({
            video_id: [data.video_id, Validators.required],
            playlist_ids: [[], Validators.required]
        });
    }

    ngOnInit(): void {
        this.playlistsService.get().subscribe(dt => {
            this.playlists = dt;
        });
    }

    addToPlaylist(e, id) {
        this.playlistIds.push(id);
        this.playlistForm.patchValue(this.playlistIds);
        console.log(this.playlistIds)
        console.log(this.playlistForm.value)
    }

    save() {

    }

}
