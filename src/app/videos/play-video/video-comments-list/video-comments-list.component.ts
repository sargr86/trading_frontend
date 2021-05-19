import {Component, Input, OnInit} from '@angular/core';
import {SubjectService} from '@core/services/subject.service';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-video-comments-list',
    templateUrl: './video-comments-list.component.html',
    styleUrls: ['./video-comments-list.component.scss']
})
export class VideoCommentsListComponent implements OnInit {

    authUser;
    @Input() videoData;
    @Input() videoComments = [];

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
        // this.subject.currentVideoComments.subscribe(dt => {
        //     console.log(dt);
        // });

    }


    isAuthor(c) {
        return c.user.id === this.videoData.author_id;
    }

    isMyComment(c) {
        return c.user.id === this.authUser.id;
    }

    removeComment(c) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideoComment({
                    user_id: this.authUser.id,
                    id: c.id,
                    video_id: c.video_id
                }).subscribe(dt => {
                    this.videoComments = dt;
                })
            }
        });
    }

}
