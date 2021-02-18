import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CHART_1, CHART_2, CHART_3, CHART_4} from '@core/constants/charts';
import {Chart} from 'chart.js';
import {ActivatedRoute, Router} from '@angular/router';
import {API_URL} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {AuthService} from '@core/services/auth.service';
import {ToastrService} from 'ngx-toastr';
import {PlaylistsService} from '@core/services/playlists.service';

@Component({
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.scss']
})
export class PlayVideoComponent implements OnInit, AfterViewInit {

    canvas: any;
    ctx: any;
    lineChart;

    videoUrl;
    videoData;
    apiUrl = API_URL;

    authUser;
    userVideoConnection = {liked: '', saved: '', viewed: false};

    videoJSPlayerOptions = {
        autoplay: true,
        controls: true,
        bigPlayButton: false,
        progressControl: true,
        fluid: false,
        preload: 'auto',
        html5: {
            vhs: {
                withCredentials: true,
                overrideNative: true,
            },
            nativeAudioTracks: false,
            nativeVideoTracks: false
        },
        sources: []
    };

    viewsCount = 0;

    showTagsForm = false;

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService,
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
        public auth: AuthService,
        private toastr: ToastrService,
        private playlistsService: PlaylistsService
    ) {
        this.authUser = this.getAuthUser.transform();

    }

    ngOnInit(): void {

        const videoId = this.route.snapshot.queryParams.id;
        const params = {id: videoId};

        // console.log(this.videoJSPlayerOptions)

        this.videoService.getVideoById(params).subscribe(dt => {
            this.videoData = dt;
            if (this.auth.loggedIn()) {
                this.userVideoConnection = this.checkUserVideoConnection(dt);
                this.updateViewsCount(dt);
                this.indexUserTags(dt);
            }
        });


    }


    checkUserVideoConnection(videoData) {
        const userVideoConnection = videoData?.users_vids.find(u => u.id === this.authUser.id);
        if (!userVideoConnection) {
            return this.userVideoConnection;
        } else {
            const liked = ['liked', 'disliked'].find(st => userVideoConnection.users_videos[st] ? st : '');
            const saved = userVideoConnection.users_videos.saved ? 'saved' : '';
            const viewed = !!userVideoConnection?.users_videos?.viewed;
            return {liked, saved, viewed};
        }
    }

    updateViewsCount(dt) {
        const params = {user_id: this.authUser.id, video_id: dt.id};
        console.log(this.userVideoConnection)
        if (!this.userVideoConnection.viewed) {
            this.videoService.updateViews(params).subscribe((d) => {
                this.videoData = d;
            });
        }
    }

    updateLikes(videoData, like = true) {
        if (this.auth.loggedIn()) {
            if (this.userVideoConnection) {

                // Video liked
                if (like) {
                    if (this.userVideoConnection.liked !== 'liked') {
                        ++videoData.likes;
                    }
                    if (this.userVideoConnection.liked === 'disliked' && videoData.dislikes > 0) {
                        --videoData.dislikes;
                    }
                    if (this.userVideoConnection.liked === 'liked' && videoData.likes > 0) {
                        this.userVideoConnection = null;
                        --videoData.likes;
                        like = false;
                    } else {
                        this.userVideoConnection.liked = 'liked';
                    }
                }
                // Video disliked
                else {
                    if (this.userVideoConnection.liked === 'liked' && videoData.likes > 0) {
                        --videoData.likes;
                    }
                    if (this.userVideoConnection.liked !== 'disliked') {
                        ++videoData.dislikes;
                    }
                    if (this.userVideoConnection.liked === 'disliked' && videoData.dislikes > 0) {
                        this.userVideoConnection = null;
                        --videoData.dislikes;
                        // console.log(this.likeStatus)
                    } else {
                        this.userVideoConnection.liked = 'disliked';
                    }
                }
            }


            this.videoService.updateLikes({
                video_id: videoData.id,
                user_id: this.authUser.id,
                likes: videoData.likes,
                dislikes: videoData.dislikes,
                likeStatus: ['liked', 'disliked'].find(c => c === this.userVideoConnection?.liked),
                saved: videoData.saved
            }).subscribe(dt => {

            });
        } else {
            this.toastr.error('Please log in first to take this action');
        }
    }

    indexUserTags(dt) {
        const params = {user_id: this.authUser.id, video_id: dt.id, tags: this.videoData?.tags};
        console.log('index!')
        this.videoService.indexUserTags(params).subscribe(d => {

        });
    }


    openChannelPage(videoData) {
        console.log(videoData)
        this.router.navigate(['channels/show'], {queryParams: {username: videoData.users_vids[0].username}});
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

    saveTags(e) {
        this.videoData.tags = e.tags;
        console.log(e)
        this.videoService.saveTags({...e, video_id: this.videoData.id}).subscribe(dt => {
            this.videoData = dt;
            this.showTagsForm = false;
        });
    }

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    ngAfterViewInit() {
        this.canvas = document.getElementById('myChart');
        // console.log(this.canvas)
        this.ctx = this.canvas.getContext('2d');
        this.lineChart = new Chart(this.ctx, CHART_1);

        this.canvas = document.getElementById('myChart2');
        this.ctx = this.canvas.getContext('2d');
        this.lineChart = new Chart(this.ctx, CHART_2);

        this.canvas = document.getElementById('myChart3');
        this.ctx = this.canvas.getContext('2d');
        this.lineChart = new Chart(this.ctx, CHART_3);

        this.canvas = document.getElementById('myChart4');
        this.ctx = this.canvas.getContext('2d');
        this.lineChart = new Chart(this.ctx, CHART_4);
    }

}
