import {Component, Input, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-video-comments-form',
    templateUrl: './video-comments-form.component.html',
    styleUrls: ['./video-comments-form.component.scss']
})
export class VideoCommentsFormComponent implements OnInit {
    @Input() videoData;
    videoCommentsForm: FormGroup;
    videoComments = [];
    inputFocused = false;
    authUser;
    isSubmitted = false;

    @ViewChild('cEditable') cEditable;

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private renderer: Renderer2
    ) {
        this.renderer.listen('window', 'click', (e: Event) => {
            this.inputFocused = e.target === this.cEditable.nativeElement;
        });
    }


    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.videoCommentsForm = this.fb.group({
            from_id: [this.authUser.id],
            comment: ['', Validators.required],
            video_id: [this.videoData.id]
        });
    }

    addComment(cEditable) {
        this.isSubmitted = true;
        if (this.videoCommentsForm.valid) {
            this.videoService.addVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                this.videoCommentsForm.patchValue({comment: ''});
                cEditable.innerHTML = '';
                this.inputFocused = false;
            });
        }
    }

    onCancel(cEditable) {
        this.inputFocused = false;
        cEditable.innerHTML = '';
    }

    onCommentChange(val) {
        this.videoCommentsForm.patchValue({comment: val})
        console.log(this.videoCommentsForm.value)
    }

}
