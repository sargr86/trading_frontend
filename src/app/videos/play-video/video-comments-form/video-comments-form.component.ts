import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-video-comments-form',
    templateUrl: './video-comments-form.component.html',
    styleUrls: ['./video-comments-form.component.scss']
})
export class VideoCommentsFormComponent implements OnInit {
    @Input() videoData;
    videoCommentsForm: FormGroup;
    comment;

    constructor(
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        console.log(this.videoData)
        this.videoCommentsForm = this.fb.group({
            comment: ['', Validators.required],
            video_id: [this.videoData.id]
        });
    }

    addComment() {
        console.log(this.videoCommentsForm.value)
    }

    onCommentChange(val) {
        this.videoCommentsForm.patchValue({comment: val})
        console.log(this.videoCommentsForm.value)
    }

}
