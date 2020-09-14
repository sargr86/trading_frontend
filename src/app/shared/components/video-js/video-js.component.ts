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
    }
  };
  player: videojs.Player;

  constructor(
    private elementRef: ElementRef,
  ) {
  }

  ngOnInit(): void {
    // instantiate Video.js
    this.player = videojs(this.target.nativeElement, this.options, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
  }

  ngOnDestroy() {
    // destroy player
    if (this.player) {
      this.player.dispose();
    }
  }

}
