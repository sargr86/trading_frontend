import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {StreamManager} from 'openvidu-browser';

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

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this._streamManager.addVideoElement(this.elementRef.nativeElement);
  }

  @Input()
  set streamManager(streamManager: StreamManager) {
    this._streamManager = streamManager;
    if (!!this.elementRef) {
      this._streamManager.addVideoElement(this.elementRef.nativeElement);
    }
  }

}
