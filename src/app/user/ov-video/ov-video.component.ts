import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StreamManager} from 'openvidu-browser';
import videojs from 'video.js';
import {SubjectService} from '@core/services/subject.service';

@Component({
  selector: 'app-ov-video',
  templateUrl: './ov-video.component.html',
  styleUrls: ['./ov-video.component.scss']
})
export class OvVideoComponent implements OnInit, AfterViewInit {
  videoJSPlayerOptions = {
    autoplay: true,
    controls: true,
    fluid: false,
    sources: []
  }

  @ViewChild('videoElement') elementRef: ElementRef;

  _streamManager: StreamManager;
  player: videojs.Player;
  recordingState;

  constructor(
    private subject: SubjectService
  ) {
  }

  ngOnInit(): void {
    this.subject.getVideoRecordingState().subscribe(data => {
      console.log('STATE!!!!' + data.recordingState);
      this.recordingState = data.recordingState;
      if (this.recordingState === 'finished') {
        const video = document.getElementById('live-video') as any;
        video.pause();
        video.currentTime = 0;
        video.controls = false;
        this.player.pause();
        this.player.src('');
        this.player.reset();
      }
    });
  }

  ngAfterViewInit() {
    this._streamManager.addVideoElement(this.elementRef.nativeElement);
    this.player = videojs(this.elementRef.nativeElement, this.videoJSPlayerOptions, function onPlayerReady() {
      console.log('onPlayerReady', this);
    });
    const video = document.getElementById('live-video') as any;
    console.log(video)
    video.setAttribute('controls', 'controls');
    video.controls = true;
  }

  @Input()
  set streamManager(streamManager: StreamManager) {
    this._streamManager = streamManager;
    if (!!this.elementRef) {
      this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }
  }

}
