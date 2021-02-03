import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {OWL_OPTIONS} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import * as moment from 'moment';

@Component({
    selector: 'app-video-carousel-holder',
    templateUrl: './video-carousel-holder.component.html',
    styleUrls: ['./video-carousel-holder.component.scss']
})
export class VideoCarouselHolderComponent implements OnInit {
    owlOptions: OwlOptions = OWL_OPTIONS;
    authUser;

    @Input('videos') videos = [];
    @Input('title') title = '';
    @Input('removable') removable = false;
    @Input('detailsSource') detailsSource;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private videoService: VideoService,
        public router: Router,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    openVideoPage(video, username) {
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username, id: video.id};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    openChannelPage(username) {
        this.router.navigate(['channels/show'], {queryParams: {username}});
    }

    removeVideo(video) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideo({
                    id: video.id,
                    filename: video.filename,
                    username: this.authUser.username
                }).subscribe(dt => {
                    this.videos = dt.videos;
                });
            }
        });

    }

    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
    }

}
