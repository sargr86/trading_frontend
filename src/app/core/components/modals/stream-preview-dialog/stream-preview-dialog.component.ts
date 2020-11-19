import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
    selector: 'app-stream-preview-dialog',
    templateUrl: './stream-preview-dialog.component.html',
    styleUrls: ['./stream-preview-dialog.component.scss']
})
export class StreamPreviewDialogComponent implements OnInit {

    constructor(
        private matDialogRef: MatDialogRef<StreamPreviewDialogComponent>
    ) {
    }

    ngOnInit(): void {
    }

    goLive() {
        this.matDialogRef.close();
    }

}
