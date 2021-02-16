import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import videojs from 'video.js';
import {API_URL} from '@core/constants/global';

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
    @Input('videoData') videoData;
    videoUrl;

    constructor(
        private elementRef: ElementRef,
    ) {
    }

    ngOnInit(): void {
        const video = document.getElementsByTagName('video')[0];
        this.videoUrl = API_URL + 'uploads/videos/' + this.videoData.filename;
        video.setAttribute('src', this.videoUrl);
        video.setAttribute('poster', API_URL + 'uploads/thumbnails/' + this.videoData.thumbnail);
        video.poster = API_URL + 'uploads/thumbnails/' + this.videoData.thumbnail;
        video.muted = true;
        video.load();
        video.play();


        // instantiate Video.js
        // this.target.nativeElement.setAttribute('src', this.videoUrl);
        // this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
        //     const player = this;
        //     console.log(player)
        //     player.on('pause', () => {
        //         console.log('paused')
        //         player.one('play', () => {
        //             console.log('play')
        //             player.load();
        //             player.play();
        //         });
        //     });
        //
        //     player.on('error', () => {
        //
        //         player.pause();
        //         player.trigger('ended');
        //
        //         player.reset();
        //
        //         player.src(player.currentSrc());
        //
        //     });
        //
        //
        //     // console.log('onPlayerReady', this);
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
