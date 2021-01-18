import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {API_URL, VIDEO_CATEGORIES} from '@core/constants/global';
import {MatChipInputEvent} from '@angular/material/chips';
import {VideoService} from '@core/services/video.service';
import {ToastrService} from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-start-streaming-form',
    templateUrl: './start-streaming-form.component.html',
    styleUrls: ['./start-streaming-form.component.scss']
})
export class StartStreamingFormComponent implements OnInit {

    startStreamingForm: FormGroup;
    isSubmitted = false;
    thumbnailFile;
    thumbnailUploading = false;
    thumbnailUploaded = false;
    apiUrl = API_URL;
    tags = [];
    videoCategories;
    authUser;

    sessionName = 'SessionA';
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    privacyTypes = [{name: 'Public', icon: 'public'}, {name: 'Private', icon: 'lock'}];
    selectedPrivacy;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @Output('formReady') formReady = new EventEmitter();

    constructor(
        private videoService: VideoService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.selectedPrivacy = this.privacyTypes[0];
        this.initForm();
        this.getVideoCategories();
    }

    initForm(): void {
        this.startStreamingForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            category_id: ['', Validators.required],
            tags: [[], Validators.required],
            sessionName: [this.sessionName],
            myUserName: [this.authUser.username],
            thumbnail: ['', Validators.required],
            privacy: ['Public'],
            status: ['live']
        });
    }

    getVideoCategories() {
        this.videoService.getVideoCategories().subscribe(dt => {
            this.videoCategories = dt;
        });
    }

    changedPrivacy(e) {
        this.selectedPrivacy = this.privacyTypes.find(t => t.name === e.target.value);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.tags.push(value.trim());
            this.startStreamingForm.patchValue({tags: this.tags});
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(fruit): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
            this.startStreamingForm.patchValue({tags: this.tags});
        }
    }

    getThumbnailFile(e) {
        this.thumbnailFile = e.target.files[0];
        const fd = new FormData();
        fd.append('video_thumbnail_file', this.thumbnailFile);
        this.startStreamingForm.patchValue({thumbnail: this.thumbnailFile.name});
        this.thumbnailUploading = true;

        this.videoService.saveVideoThumbnail(fd).subscribe(filename => {
            this.toastr.success('The thumbnail has been uploaded successfully');
            this.thumbnailUploading = false;
            this.thumbnailUploaded = true;
        });
    }

    removeUploadedThumbnail(filename) {
        // this.videoService.removeVideoThumbnail(filename).subscribe(dt => {
        this.thumbnailFile = [];
        this.toastr.success('The thumbnail has been removed successfully');
        this.thumbnailUploaded = false;
        // });
    }

    submit() {
        this.isSubmitted = true;
        if (this.startStreamingForm.valid) {
            console.log('OK')
            this.formReady.emit({
                categoryName: this.videoCategories.find(c => c.id === +this.startStreamingForm.value.category_id)?.name,
                ...this.startStreamingForm.value
            });
        }
    }


    get streamName(): AbstractControl {
        return this.startStreamingForm.get('name');
    }


    get streamDesc(): AbstractControl {
        return this.startStreamingForm.get('description');
    }

    get streamCategory(): AbstractControl {
        return this.startStreamingForm.get('category_id');
    }

    get streamTags(): AbstractControl {
        return this.startStreamingForm.get('tags');
    }

}
