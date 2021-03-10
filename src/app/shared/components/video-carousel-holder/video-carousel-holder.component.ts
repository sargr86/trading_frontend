import {Component, Input, OnInit} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {OWL_OPTIONS} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';
import {ToastrService} from 'ngx-toastr';

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
        private dialog: MatDialog,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
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

}
