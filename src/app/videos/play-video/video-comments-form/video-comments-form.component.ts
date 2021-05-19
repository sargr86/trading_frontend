import {Component, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';

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
    @Output('added') commentAdded = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private renderer: Renderer2,
        private subject: SubjectService
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
                this.commentAdded.emit(dt)
                // this.subject.changeVideoComments(dt);
            });
        }
    }

    onCancel(cEditable) {
        this.inputFocused = false;
        cEditable.innerHTML = '';
    }

    onCommentChange(val) {
        this.videoCommentsForm.patchValue({comment: val})
    }

}
