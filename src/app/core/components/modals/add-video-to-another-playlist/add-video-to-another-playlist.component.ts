import {Component, Inject, OnInit} from '@angular/core';
import {PlaylistsService} from '@core/services/playlists.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-add-video-to-another-playlist',
    templateUrl: './add-video-to-another-playlist.component.html',
    styleUrls: ['./add-video-to-another-playlist.component.scss']
})
export class AddVideoToAnotherPlaylistComponent implements OnInit {
    playlists;
    playlistForm: FormGroup;
    videoId;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private playlistsService: PlaylistsService,
        private fb: FormBuilder,
        private dialog: MatDialogRef<AddVideoToAnotherPlaylistComponent>
    ) {
        this.videoId = data.video_id;
        this.playlists = data.playlists;
        this.playlistForm = this.fb.group({
            video_id: [this.videoId, Validators.required],
            playlists: this.fb.array(
                this.getPlaylistsFormGroup()
            )
        });
    }

    ngOnInit(): void {
    }

    getPlaylistsFormGroup() {
        const ret = [];
        this.playlists.map(p => {
            const found = p.videos.find(v => v.id === this.videoId);
            ret.push(this.fb.group({id: p.id, name: p.name, privacy: p.privacy, checked: !!found}));
        });
        return ret;
    }

    addToPlaylist(e, control) {

        control.patchValue({checked: e.target.checked});
        // console.log(this.playlistForm.value)
        // const value = id;
        // if (e.target.checked && !this.playlistIds.controls.find(c => c.value === value)) {
        //     // this.playlistIds.push(new FormControl(value));
        // } else {
        //     let i = 0;
        //     this.playlistIds.controls.forEach((item: FormControl) => {
        //         if (+item.value === value) {
        //             console.log('removing')
        //             // this.playlistIds.removeAt(i);
        //             return;
        //         }
        //         i++;
        //     });
        // }
    }

    checkIfVideoInPlaylist(videoId, playlist) {
        const found = playlist.videos.find(v => v.id === videoId);
        if (found && !this.playlistIds.controls.find(c => c.value === videoId)) {
            this.playlistIds.push(new FormControl(videoId));
        }
    }

    save() {
        this.playlistsService.addVideoToOtherPlaylists(this.playlistForm.value).subscribe(dt => {
            this.dialog.close();
        });
    }

    get playlistIds() {
        return this.playlistForm.controls.playlists as FormArray;
    }

}
