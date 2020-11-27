import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup} from '@angular/forms';
import {API_URL} from '@core/constants/global';

@Component({
    selector: 'app-stream-preview-dialog',
    templateUrl: './stream-preview-dialog.component.html',
    styleUrls: ['./stream-preview-dialog.component.scss']
})
export class StreamPreviewDialogComponent implements OnInit, AfterViewInit {
    streamPreviewForm: FormGroup;
    privacyTypes = [{name: 'Public', icon: 'public'}, {name: 'Private', icon: 'lock'}];
    selectedPrivacy;
    userMediaDevices;
    defaultVideoDevice;
    defaultAudioDevice;

    apiUrl = API_URL;

    constructor(
        private matDialogRef: MatDialogRef<StreamPreviewDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private fb: FormBuilder
    ) {
        this.streamPreviewForm = this.fb.group({
            privacy: ['Public'],
            video_device: [''],
            audio_device: ['']
        });
    }

    ngOnInit(): void {
        this.selectedPrivacy = this.privacyTypes[0];


    }

    goLive() {
        this.matDialogRef.close(this.streamPreviewForm.value);
    }

    changedPrivacy(e) {
        console.log(e)
        this.selectedPrivacy = this.privacyTypes.find(t => t.name === e.value);
    }

    ngAfterViewInit() {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                this.userMediaDevices = devices;
                this.defaultVideoDevice = devices.find(d => d.kind === 'videoinput');
                this.streamPreviewForm.patchValue({video_device: this.defaultVideoDevice.label})
                this.defaultAudioDevice = devices.find(d => d.kind === 'audioinput');
                this.streamPreviewForm.patchValue({audio_device: this.defaultAudioDevice.label})
            })
            .catch((err) => {
                console.log(err.name + ':' + err.message);
            });
    }

}
