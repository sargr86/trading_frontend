import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {VIDEOJS_PLAYER_OPTIONS} from '@core/constants/global';
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
    videoInit = 'idle';

    options = VIDEOJS_PLAYER_OPTIONS;
    player: videojs.Player;

    constructor(
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {

    }

    initPlayer() {
        const video = document.getElementById('player');
        this.videoInit = 'pending';
        this.player = videojs(video, this.options, () => {
            videojs.registerPlugin('watermark', watermark);
            this.player.watermark({
                image: 'assets/img/logo.png',
                position: 'bottom-right',
                fadeTime: null
            });

            videojs.deregisterPlugin('watermark');

        });

        this.player.on('loadedmetadata', () => {
            this.videoInit = 'finished';
        });

        this.player.on('error', (err) => {
            const error = this.player.error();
            this.videoInit = 'finished';
        });
        this.cdr.detectChanges();

    }

    ngAfterViewInit() {
        this.initPlayer();
    }

}