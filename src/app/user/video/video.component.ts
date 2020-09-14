import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  videoRecordOptions = {
    controls: true,
    bigPlayButton: false,
    width: 320,
    height: 240,
    fluid: false,
    plugins: {
      record: {
        audio: true,
        video: true,
        maxLength: 10,
        debug: true
      }
    }
  };

  constructor() {
  }

  ngOnInit(): void {
  }

}
