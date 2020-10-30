import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';

@Component({
    selector: 'app-vjs-player',
    templateUrl: './video-js.component.html',
    styleUrls: ['./video-js.component.scss']
})
export class VideoJsComponent implements OnInit, OnDestroy {

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
    @Input('url') videoUrl;

    constructor(
        private elementRef: ElementRef,
    ) {
    }

    ngOnInit(): void {

        const video = document.getElementsByTagName('video')[0];

        video.setAttribute('src', this.videoUrl);
        video.muted = true;
        video.load();
        video.play();




        // instantiate Video.js
        // this.target.nativeElement.setAttribute('src', 'http://www.tools4movies.com/trailers/1012/Kill%20Bill%20Vol.3.mp4');
        // this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
        //     console.log('onPlayerReady', this);
        // });
        // this.player.src({type: 'video/x-matroska', src: this.videoUrl});
    }

    ngOnDestroy() {
        // destroy player
        if (this.player) {
            this.player.dispose();
        }
    }

}
