import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    Renderer2,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-video-comments-form',
    templateUrl: './video-comments-form.component.html',
    styleUrls: ['./video-comments-form.component.scss']
})
export class VideoCommentsFormComponent implements OnInit, AfterViewInit {
    @Input() videoData;
    videoCommentsForm: FormGroup;
    inputFocused = false;
    authUser;
    isSubmitted = false;

    @Input() editComment = false;
    @Input() selectedComment = null;
    @ViewChild('cEditable') cEditable;
    @Output('added') commentAdded = new EventEmitter();
    @Output('updated') commentUpdated = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private renderer: Renderer2,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef
    ) {
        this.renderer.listen('window', 'click', (e: Event) => {
            this.inputFocused = e.target === this.cEditable.nativeElement;
            this.cdr.detectChanges();
        });
    }


    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.videoCommentsForm = this.fb.group({
            id: [''],
            from_id: [this.authUser.id],
            comment: ['', Validators.required],
            video_id: [this.videoData.id]
        });

    }

    saveComment(cEditable) {
        this.isSubmitted = true;
        if (this.videoCommentsForm.valid) {
            if (this.editComment) {
                this.videoService.updateVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.commentUpdated.emit(dt);
                });
            } else {
                this.videoService.addVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.videoCommentsForm.patchValue({comment: ''});
                    cEditable.innerHTML = '';
                    this.inputFocused = false;
                    this.commentAdded.emit(dt);
                });
            }
        }
    }

    onCancel(cEditable) {
        this.inputFocused = false;
        cEditable.innerHTML = '';
    }

    onCommentChange(val) {
        this.videoCommentsForm.patchValue({comment: val})
    }

    get commentCtrl() {
        return this.videoCommentsForm.get('comment');
    }

    ngAfterViewInit() {
        if (this.editComment) {
            this.videoCommentsForm.patchValue({comment: this.selectedComment.comment, id: this.selectedComment.id});
            this.cEditable.nativeElement.innerHTML = this.selectedComment.comment;
            this.cEditable.nativeElement.focus();
            this.inputFocused = true;
            this.cdr.detectChanges();
        }
    }

}
