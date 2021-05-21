import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-video-comments-list',
    templateUrl: './video-comments-list.component.html',
    styleUrls: ['./video-comments-list.component.scss']
})
export class VideoCommentsListComponent implements OnInit, OnDestroy {

    authUser;
    selectedComment;
    subscriptions: Subscription[] = [];
    showReplyForm = false;

    @Input() videoData;
    @Input() videoComments = [];
    @Input() editComment = false;

    constructor(
        private subject: SubjectService,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private dialog: MatDialog
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        console.log(this.videoComments)

    }


    isAuthor(c) {
        return c.user.id === this.videoData.author_id;
    }

    isMyComment(c) {
        return c.user.id === this.authUser.id;
    }

    getUpdatedComments(e) {
        this.videoComments = e;
        this.editComment = false;
    }

    selectComment(c, reply = false) {
        if (!reply) {
            this.editComment = !this.editComment;
            this.showReplyForm = !this.editComment;
        } else {
            this.showReplyForm = this.selectedComment !== c || !this.showReplyForm;
        }
        this.selectedComment = c;
    }


    removeComment(c) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideoComment({
                    user_id: this.authUser.id,
                    id: c.id,
                    video_id: c.video_id
                }).subscribe(dt => {
                    this.videoComments = dt;
                });
            }
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
