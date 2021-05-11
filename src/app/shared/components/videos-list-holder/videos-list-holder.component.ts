import {Component, Input, OnInit} from '@angular/core';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-videos-list-holder',
    templateUrl: './videos-list-holder.component.html',
    styleUrls: ['./videos-list-holder.component.scss']
})
export class VideosListHolderComponent implements OnInit {

    authUser;
    videoLoading = 'idle';

    @Input('videos') videos = [];
    @Input('title') title = '';
    @Input('removable') removable = false;
    @Input('detailsSource') detailsSource;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private videoService: VideoService,
        public router: Router,
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.videoLoading = 'loading';
        if (this.videos.length > 0) {
            this.videoLoading = 'finished';
        }
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    async openChannelPage(username) {
        this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            await this.router.navigate(['channels/show'], {queryParams: {username}})
        );
    }

    removeVideo(video) {
        this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.videoService.removeVideo({
                    id: video.id,
                    filename: video.filename,
                    username: this.authUser.username
                }).subscribe(dt => {
                    this.toastr.success('The video was removed successfully');
                    this.videos = dt.videos;
                });
            }
        });

    }

    isSmallScreen(videoLen) {
        return window.screen.availWidth > 568 && videoLen === 1;
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    isChannelPage(){
        return this.router.url.includes('channel') && this.removable;
    }


    updatePrivacy(video, privacy) {
        this.videoService.updatePrivacy({
            video_id: video.id,
            privacy: privacy === 'Public' ? 'Private' : 'Public'
        }).subscribe(dt => {
            video.privacy = dt;
        });
    }


}
