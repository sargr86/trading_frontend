import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {API_URL} from '@core/constants/global';
import videojs from 'video.js';
import watermark from 'videojs-watermark';

@Component({
    selector: 'app-video-js-player',
    templateUrl: './video-js-player.component.html',
    styleUrls: ['./video-js-player.component.scss']
})
export class VideoJsPlayerComponent implements OnInit {
    @Input() videoData;
    videoUrl;

    @ViewChild('target', {static: true}) target: ElementRef;
    @Input() options: {
        fluid: boolean,
        liveui: boolean,
        aspectRatio: string,
        autoplay: boolean,
        sources: {
            src: string,
            type: string,
        }[],
        plugins?: {
            record: {
                audio: boolean,
                video: boolean,
                maxLength: number,
                debug: boolean
            }
        },

        html5: {
            vhs: {
                withCredentials: boolean
            }
        }

    };
    player: videojs.Player;

    constructor() {
    }

    ngOnInit(): void {
        this.initPlayer();

    }

    initPlayer() {
        const video = document.getElementsByTagName('video')[0];
        this.videoUrl = API_URL + 'uploads/videos/' + this.videoData.filename;
        video.setAttribute('src', this.videoUrl);
        this.player = videojs(video, this.options, () => {
            videojs.registerPlugin('watermark', watermark);
            this.player.watermark({
                image: 'assets/img/logo.png',
                position: 'bottom-right',
                fadeTime: 1000
            });
        });
    }

}
