import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {API_URL} from '@core/constants/global';
import videojs from 'video.js';
import watermark from 'videojs-watermark';

@Component({
    selector: 'app-video-js-player',
    templateUrl: './video-js-player.component.html',
    styleUrls: ['./video-js-player.component.scss']
})
export class VideoJsPlayerComponent implements OnInit, AfterViewInit {
    @Input() videoData;
    @Input() videoUrl;
    videoInit = false;

    @ViewChild('target', {static: true}) target: ElementRef;

    options = {
        preload: 'metadata',
        controls: true,
        autoplay: true,
        overrideNative: true,
        techOrder: ['html5'],
        html5: {
            nativeVideoTracks: false,
            nativeAudioTracks: false,
            nativeTextTracks: false,
            hls: {
                withCredentials: false,
                overrideNative: true,
                debug: true
            }
        }
    };
    player: videojs.Player;

    constructor(
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {

    }

    initPlayer() {
        const video = document.getElementById('player');

        this.player = videojs(video, this.options, () => {
            videojs.registerPlugin('watermark', watermark);
            this.player.watermark({
                image: 'assets/img/logo.png',
                position: 'bottom-right',
                fadeTime: 1000
            });
            videojs.deregisterPlugin('watermark');
        });
        this.videoInit = true;
        this.cdr.detectChanges();
    }

    ngAfterViewInit() {
        this.initPlayer();
    }

}
