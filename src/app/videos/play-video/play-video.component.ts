import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {API_URL, VIDEOJS_PLAYER_OPTIONS} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import IsResponsive from '@core/helpers/is-responsive';

@Component({
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.scss']
})
export class PlayVideoComponent implements OnInit, AfterViewInit {
    videoData;
    apiUrl = API_URL;

    authUser;
    userVideoConnection = {liked: 0, disliked: 0, saved: '', viewed: false};
    videoJSPlayerOptions = VIDEOJS_PLAYER_OPTIONS;

    showTagsForm = false;
    isSmallScreen = IsResponsive.isSmallScreen();

    commentsRefreshed = false;
    formValue;
    videoComments = [];

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService,
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private toastr: ToastrService,
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {

        const videoId = this.route.snapshot.queryParams.id;
        const params = {id: videoId};

        this.videoService.getVideoById(params).subscribe(dt => {
            this.videoData = dt;
            if (this.auth.loggedIn()) {
                this.userVideoConnection = this.checkUserVideoConnection(dt);
                this.updateViewsCount(dt);
                this.indexUserTags(dt);
                this.getComments();
            }
        });


    }


    checkUserVideoConnection(videoData) {
        const userVideoConnection = videoData?.users_vids.find(u => u.id === this.authUser.id);
        if (!userVideoConnection) {
            return this.userVideoConnection;
        } else {
            const liked = userVideoConnection.users_videos?.liked;
            const disliked = userVideoConnection.users_videos?.disliked;
            const saved = userVideoConnection.users_videos.saved ? 'saved' : '';
            const viewed = !!userVideoConnection?.users_videos?.viewed;
            return {liked, disliked, saved, viewed};
        }
    }

    updateViewsCount(dt) {
        const params = {user_id: this.authUser.id, video_id: dt.id};
        if (!this.userVideoConnection.viewed) {
            this.videoService.updateViews(params).subscribe((d) => {
                this.videoData = d;
            });
        }
    }

    updateLikes(videoData, action) {
        if (this.auth.loggedIn()) {

            videoData = this.getLikesState(action, videoData);

            this.videoService.updateLikes({
                video_id: videoData.id,
                user_id: this.authUser.id,
                likes: videoData.likes,
                dislikes: videoData.dislikes,
                liked: this.userVideoConnection.liked,
                disliked: this.userVideoConnection.disliked,
                saved: videoData.saved
            }).subscribe(dt => {

            });
        } else {
            this.toastr.error('Please log in first to take this action');
        }
    }

    getLikesState(action, videoData) {
        if (action === 'like') {
            this.userVideoConnection.liked = +!this.userVideoConnection.liked;
            if (this.userVideoConnection.disliked) {
                videoData.dislikes += videoData.dislikes === 0 ? 0 : -1;
            }
            this.userVideoConnection.disliked = 0;
            videoData.likes += this.userVideoConnection.liked ? 1 : -1;

        } else {
            this.userVideoConnection.disliked = +!this.userVideoConnection.disliked;
            if (this.userVideoConnection.liked) {
                videoData.likes += videoData.likes === 0 ? 0 : -1;
            }
            this.userVideoConnection.liked = 0;
            videoData.dislikes += this.userVideoConnection.disliked ? 1 : -1;
        }
        return videoData;
    }

    indexUserTags(dt) {
        const params = {user_id: this.authUser.id, video_id: dt.id, tags: this.videoData?.tags};
        this.videoService.indexUserTags(params).subscribe(d => {

        });
    }


    openChannelPage(videoData) {
        this.router.navigate(['channels/show'], {queryParams: {username: videoData.users_vids[0].username}});
    }

    async openVideoByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    saveVideo(videoData) {

        this.videoService.saveVideo({
            video_id: videoData.id,
            user_id: this.authUser.id,
            saved: this.userVideoConnection.saved === 'saved' ? 0 : 1
        }).subscribe(dt => {
            this.userVideoConnection.saved = dt.saved ? 'saved' : '';
        });
    }

    saveVideoDetails(e) {
        this.videoData.tags = e.tags;
        this.videoService.saveVideoDetails({...e, video_id: this.videoData.id}).subscribe(dt => {
            this.videoData = dt;
            this.showTagsForm = false;
        });
    }

    getComments() {
        this.videoService.getVideoComments({video_id: this.videoData.id}).subscribe(dt => {
            this.videoComments = dt;
        });
    }

    commentAdded(e) {
        this.commentsRefreshed = true;
        this.videoComments = e;
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    ngAfterViewInit() {
    }

}
