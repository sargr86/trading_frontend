import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {API_URL, VIDEO_CATEGORIES} from '@core/constants/global';
import {MatChipInputEvent} from '@angular/material/chips';
import {VideoService} from '@core/services/video.service';
import {ToastrService} from 'ngx-toastr';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
    selector: 'app-start-streaming-form',
    templateUrl: './start-streaming-form.component.html',
    styleUrls: ['./start-streaming-form.component.scss']
})
export class StartStreamingFormComponent implements OnInit {

    startStreamingForm: FormGroup;
    isSubmitted = false;
    thumbnailFile;
    thumbnailUploaded = false;
    apiUrl = API_URL;
    tags = [];
    videoCategories = VIDEO_CATEGORIES;


    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @Output('formReady') formReady = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.initForm();
    }

    initForm(): void {
        this.startStreamingForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
            tags: [[], Validators.required]
        });
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

        this.videoService.saveVideoThumbnail(fd).subscribe(filename => {
            this.toastr.success('The thumbnail has been uploaded successfully');
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
        console.log(this.startStreamingForm.value)
        this.isSubmitted = true;
        if (this.startStreamingForm.valid) {
            this.formReady.emit(this.startStreamingForm.value);
        }
    }

    get streamName(): AbstractControl {
        return this.startStreamingForm.get('name');
    }


    get streamDesc(): AbstractControl {
        return this.startStreamingForm.get('description');
    }

    get streamCategory(): AbstractControl {
        return this.startStreamingForm.get('category');
    }

    get streamTags(): AbstractControl {
        return this.startStreamingForm.get('tags');
    }

}
