import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {API_URL} from '@core/constants/global';
import {PlaylistsService} from '@core/services/playlists.service';
import {AddVideoToPlaylistDialogComponent} from '@core/components/modals/add-video-to-playlist-dialog/add-video-to-playlist-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';
import {Router} from '@angular/router';

@Component({
    selector: 'app-playlist-info-form',
    templateUrl: './playlist-info-form.component.html',
    styleUrls: ['./playlist-info-form.component.scss']
})
export class PlaylistInfoFormComponent implements OnInit {
    playlistInfoForm: FormGroup;
    apiUrl = API_URL;
    editMode = false;

    @Input('playlist') playlist;
    @Output('refreshPlaylist') refreshPlaylist = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private playlistsService: PlaylistsService,
        private dialog: MatDialog,
        private toastr: ToastrService,
        public router: Router
    ) {
        this.playlistInfoForm = this.fb.group({
            id: [''],
            name: ['', Validators.required],
            description: [''],
            privacy: ['']
        });
    }

    ngOnInit(): void {
    }

    openVideosModal() {
        this.dialog.open(AddVideoToPlaylistDialogComponent, {data: {playlist: this.playlist}}).afterClosed().subscribe(dt => {
            this.refreshPlaylist.emit();
        });
    }

    updatePrivacy(value, playlist) {
        this.playlistsService.updatePrivacy({privacy: value, id: playlist.id}).subscribe(dt => {
            this.toastr.success('Playlist privacy is updated successfully');
        });

    }

    editPlaylistInfo(playlist) {
        this.editMode = true;
        this.playlistInfoForm.patchValue(playlist);
    }

    savePlaylistInfoChanges() {
        if (this.playlistInfoForm.valid) {
            this.playlistsService.updatePlaylistInfo(this.playlistInfoForm.value).subscribe((dt) => {
                this.editMode = false;
                this.playlist = dt;
            });
        }
    }

    openPlaylistPage(playlist) {
        const route = 'videos/play';
        const params = {id: playlist.videos?.[0]?.id, playlist_id: playlist.id};
        this.router.navigate([route], {queryParams: params});
    }

}
