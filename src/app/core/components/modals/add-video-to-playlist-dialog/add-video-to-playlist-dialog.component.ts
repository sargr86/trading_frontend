import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-add-video-to-playlist-dialog',
    templateUrl: './add-video-to-playlist-dialog.component.html',
    styleUrls: ['./add-video-to-playlist-dialog.component.scss']
})
export class AddVideoToPlaylistDialogComponent implements OnInit {
    activeTab = 'search';

    constructor(
        private modal: MatDialogRef<AddVideoToPlaylistDialogComponent>
    ) {
    }

    ngOnInit(): void {
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

    cancel() {
        this.modal.close();
    }

}
