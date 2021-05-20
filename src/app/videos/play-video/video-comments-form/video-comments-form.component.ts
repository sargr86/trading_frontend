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
    placeholderClicked = false;
    comment = null;
    cancelled = 'idle';


    @Input() editComment = false;
    @Input() selectedComment = null;
    @Input() reply = false;
    @ViewChild('cEditable') cEditable;
    @Output('added') commentAdded = new EventEmitter();
    @Output('updated') commentUpdated = new EventEmitter();
    @Output('cancelled') editingCancelled = new EventEmitter();

    placeholderText;

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private renderer: Renderer2,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef
    ) {
        this.renderer.listen('window', 'click', (e: Event) => {
            // this.inputFocused = e.target === this.cEditable.nativeElement || this.editComment;
            // this.cdr.detectChanges();
        });
    }


    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.placeholderText = this.getPlaceholderText();

        this.videoCommentsForm = this.fb.group({
            id: [''],
            from_id: [this.authUser.id],
            comment: ['', Validators.required],
            video_id: [this.videoData.id]
        });

    }

    saveComment() {
        this.isSubmitted = true;
        if (this.videoCommentsForm.valid) {
            if (this.editComment) {
                this.videoService.updateVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.commentUpdated.emit(dt);
                    this.videoCommentsForm.get('comment').reset();
                });
            } else {
                this.videoService.addVideoComment(this.videoCommentsForm.value).subscribe(dt => {
                    this.inputFocused = false;
                    this.commentAdded.emit(dt);
                    this.videoCommentsForm.get('comment').reset();
                });
            }
        }
    }

    onCancel() {
        this.inputFocused = false;
        this.videoCommentsForm.get('comment').reset();
        if (this.editComment) {
            this.editingCancelled.emit();
        }
    }


    getPlaceholderText() {
        return 'Add a public ' + (this.reply ? 'reply' : 'comment') + '...';
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
        } else {
            this.cdr.detectChanges();
        }
    }

}
