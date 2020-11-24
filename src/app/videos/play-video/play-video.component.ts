import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {CHART_1, CHART_2, CHART_3, CHART_4} from '@core/constants/charts';
import {Chart} from 'chart.js';
import {ActivatedRoute, Router} from '@angular/router';
import {API_URL} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

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
    likeStatus;

    videoJSPlayerOptions = {
        autoplay: true,
        controls: true,
        fluid: false,
        sources: []
    };

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService,
        public router: Router,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();

    }

    ngOnInit(): void {

        const videoId = this.route.snapshot.queryParams.id;
        this.videoService.getVideoById({id: videoId, user_id: this.authUser.id}).subscribe(dt => {
            this.videoData = dt;
            this.likeStatus = this.checkUserVideoConnection(dt);
        });


    }


    checkUserVideoConnection(videoData) {
        const userVideoConnection = videoData.users_vids.find(u => u.id === this.authUser.id);
        if (!userVideoConnection) {
            return;
        } else {
            return ['liked', 'disliked'].find(st => userVideoConnection.users_videos[st] ? st : '');
        }
    }

    updateLikes(videoData, like = true) {

        // Video liked
        if (like) {
            if (this.likeStatus !== 'liked') {
                ++videoData.likes;
            }
            if (this.likeStatus === 'disliked' && videoData.dislikes > 0) {
                --videoData.dislikes;
            }
            if (this.likeStatus === 'liked' && videoData.likes > 0) {
                this.likeStatus = null;
                --videoData.likes;
                like = false;
            } else {
                this.likeStatus = 'liked';
            }
        }
        // Video disliked
        else {
            if (this.likeStatus === 'liked' && videoData.likes > 0) {
                --videoData.likes;
            }
            if (this.likeStatus !== 'disliked') {
                ++videoData.dislikes;
            }
            if (this.likeStatus === 'disliked' && videoData.dislikes > 0) {
                this.likeStatus = null;
                --videoData.dislikes;
                console.log(this.likeStatus)
            } else {
                this.likeStatus = 'disliked';
            }
        }

        console.log(this.likeStatus)


        this.videoService.updateLikes({
            video_id: videoData.id,
            user_id: this.authUser.id,
            likes: videoData.likes,
            dislikes: videoData.dislikes,
            likeStatus: this.likeStatus,
            saved: 0
        }).subscribe(dt => {

        });
    }


    openChannelPage(videoData) {
        console.log(videoData)
        this.router.navigate(['channels/show'], {queryParams: {username: videoData.users_vids[0].username}});
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
