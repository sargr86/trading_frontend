import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Router} from '@angular/router';

@Component({
    selector: 'app-check-requirements',
    templateUrl: './check-streaming-requirements.component.html',
    styleUrls: ['./check-streaming-requirements.component.scss']
})
export class CheckStreamingRequirementsComponent implements OnInit, AfterViewInit {

    deviceRecognitionForm: FormGroup;

    userMediaDevices;
    defaultVideoDevice;
    defaultAudioDevice;

    authUser;

    @Output('checked') checked = new EventEmitter();

    constructor(
        private toastr: ToastrService,
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();
    }

    initForm(): void {
        this.deviceRecognitionForm = this.fb.group({
            video_device: ['', Validators.required],
            audio_device: ['', Validators.required]
        });
    }

    async startLiveVideo() {
        if (this.deviceRecognitionForm.valid) {
            this.checked.emit(true);
        }
    }

    ngAfterViewInit() {
        this.getConnectedDevices(true);
    }

    getConnectedDevices(pageLoad = false) {
        navigator.mediaDevices.enumerateDevices()
            .then((devices) => {
                this.userMediaDevices = devices;
                this.defaultVideoDevice = devices.find(d => d.kind === 'videoinput');
                this.deviceRecognitionForm.patchValue({video_device: this.defaultVideoDevice?.label});
                this.defaultAudioDevice = devices.find(d => d.kind === 'audioinput');
                this.deviceRecognitionForm.patchValue({audio_device: this.defaultAudioDevice?.label});
            })
            .catch((err) => {
                console.log(err.name + ':' + err.message);
            });
    }

    get audioDevice() {
        return this.deviceRecognitionForm.get('audio_device');
    }

    get videoDevice() {
        return this.deviceRecognitionForm.get('video_device');
    }

}
