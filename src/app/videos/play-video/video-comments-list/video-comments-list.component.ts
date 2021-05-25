import {ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import trackByElement from '@core/helpers/track-by-element';

@Component({
    selector: 'app-video-comments-list',
    templateUrl: './video-comments-list.component.html',
    styleUrls: ['./video-comments-list.component.scss'],
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoCommentsListComponent implements OnInit, OnDestroy {

    authUser;
    selectedComment;
    subscriptions: Subscription[] = [];
    showReplyForm = false;
    showReplies = false;
    editReply = false;
    selectedReply;
    trackByElement = trackByElement;

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
        this.editReply = false;
        this.selectedComment = e.find(cm => cm.id === this.selectedComment?.id);
        this.selectedReply = e.find(c => c.id === this.selectedReply?.id);
    }

    getRepliesTogglerText(c) {
        const len = c.replies.length;
        return `View ${len + (len > 1 ? ' replies' : ' reply')}`;
    }

    selectComment(c, replyBtnClicked = false, replyCommentSelected = false) {
        if (!replyBtnClicked && !replyCommentSelected) {
            this.editComment = !this.editComment;
            this.showReplyForm = !this.editComment;
            this.selectedComment = c;
        } else if (replyCommentSelected) {
            this.editReply = true;
            this.selectedReply = c;
        } else {
            this.showReplyForm = this.selectedComment !== c || !this.showReplyForm;
            this.selectedComment = c;
        }
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
                    console.log(this.videoComments)
                    this.selectedComment = dt.find(cm => cm.id === this.selectedComment?.id);
                });
            }
        }));
    }

    commentAdded(e) {
        this.videoComments = e;
        this.showReplyForm = false;
        this.showReplies = true;
        this.selectedComment = e.find(c => c.id === this.selectedComment.id);
    }

    toggleReplies(c) {
        this.showReplies = !this.showReplies;
        this.selectedComment = c;
    }

    likeDislikeComment(c, liked = true) {
        const params = {
            liked: +liked,
            disliked: +!liked,
            video_id: c.video_id,
            comment_id: c.id,
            user_id: this.authUser.id,
            likes: liked ? ++c.likes : this.checkUserCommentConnection(c) ? --c.likes : c.likes,
            dislikes: liked ? (this.checkUserCommentConnection(c) ? --c.dislikes : c.dislikes) : ++c.dislikes
        };


        // return this.checkUserCommentConnection(c);
        this.videoService.updateCommentLikes(params).subscribe(dt => {
            this.videoComments = dt;
        });
    }

    getLikersCount(reactors) {
        return reactors.filter(r => r?.users_comments.liked).length;
    }

    checkUserCommentConnection(comment) {
        const foundInReactors = comment.reactors.find(r => r.id === this.authUser.id);
        return foundInReactors?.users_comments;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
