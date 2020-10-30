import {Component, Input, OnInit} from '@angular/core';
import {CHART_1, CHART_2, CHART_3, CHART_4} from '@core/constants/charts';
import {Chart} from 'chart.js';
import {ActivatedRoute} from '@angular/router';
import {API_URL} from '@core/constants/global';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-play-video',
    templateUrl: './play-video.component.html',
    styleUrls: ['./play-video.component.scss']
})
export class PlayVideoComponent implements OnInit {

    canvas: any;
    ctx: any;
    lineChart;

    videoUrl;
    videoData;

    videoJSPlayerOptions = {
        autoplay: true,
        controls: true,
        fluid: false,
        sources: []
    };

    constructor(
        private route: ActivatedRoute,
        private videoService: VideoService
    ) {

    }

    ngOnInit(): void {

        const videoId = this.route.snapshot.params.queryParams;
        this.videoService.getVideoById({_id: videoId}).subscribe(dt => {
            this.videoData = dt;
            this.videoUrl = API_URL + 'uploads/videos/' + this.videoData.filename;
        });


    }

    ngAfterViewInit() {
        this.canvas = document.getElementById('myChart');
        console.log(this.canvas)
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
