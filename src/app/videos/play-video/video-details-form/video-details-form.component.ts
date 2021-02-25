import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';

@Component({
    selector: 'app-video-details-form',
    templateUrl: './video-details-form.component.html',
    styleUrls: ['./video-details-form.component.scss']
})
export class VideoDetailsFormComponent implements OnInit {
    @Input('videoData') videoData;
    @Output('formReady') formReady = new EventEmitter();
    videoDetailsForm: FormGroup;

    isSubmitted = false;
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(
        private fb: FormBuilder
    ) {
        this.videoDetailsForm = this.fb.group({
            name: [''],
            tags: [[], Validators.required],
        });
    }

    ngOnInit(): void {
        this.videoDetailsForm.patchValue({name: this.videoData.name});
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.videoData.tags.push({name: value.trim()});
            this.videoDetailsForm.patchValue({tags: this.videoData.tags});

            // this.saveTags();
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(tag): void {
        const index = this.videoData.tags.indexOf(tag);

        if (index >= 0) {
            this.videoData.tags.splice(index, 1);
            this.videoDetailsForm.patchValue({tags: this.videoData.tags});
        }
    }

    saveDetails() {
        this.videoDetailsForm.patchValue({tags: this.videoData.tags});
        if (this.videoDetailsForm.valid) {
            this.formReady.emit(this.videoDetailsForm.value);
        }
    }

}
