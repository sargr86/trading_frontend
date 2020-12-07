import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-add-playlist-dialog',
    templateUrl: './add-playlist-dialog.component.html',
    styleUrls: ['./add-playlist-dialog.component.scss']
})
export class AddPlaylistDialogComponent implements OnInit {
    addPlaylistForm: FormGroup;

    constructor(
        private modal: MatDialogRef<AddPlaylistDialogComponent>,
        private fb: FormBuilder,
        private playlistService: PlaylistsService
    ) {
        this.addPlaylistForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            privacy: ['', Validators.required]
        });
    }

    ngOnInit(): void {
    }

    createPlaylist() {
        console.log(this.addPlaylistForm.value)
        this.playlistService.addPlaylist(this.addPlaylistForm.value).subscribe(dt => {
            this.modal.close();
        });
    }

    cancel() {
        this.modal.close();
    }

}
