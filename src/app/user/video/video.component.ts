import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import * as OT from '@opentok/client';
import {OpentokService} from '@core/services/opentok.service';
import {ToastrService} from 'ngx-toastr';

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
  session: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef: ChangeDetectorRef;

  constructor(
    private ref: ChangeDetectorRef,
    private opentokService: OpentokService,
    private toastr: ToastrService
  ) {
    this.changeDetectorRef = ref;
  }

  ngOnInit(): void {
    this.opentokService.initSession().subscribe(({apiKey, sessionId, token}: any) => {
      this.session = OT.initSession(apiKey, sessionId);

      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream);
        console.log(this.streams)
        console.log(event.stream.videoType)


        const streamContainer =
          event.stream.videoType === 'screen' ? 'screen' : 'subscriber';
        this.session.subscribe(
          event.stream,
          streamContainer,
          {
            insertMode: 'append',
            width: '100%',
            height: '100%'
          },
          (error) => {
            if (error) {
              console.log('error: ' + error.message);
            } else {
              this.handleScreenShare(event.stream.videoType);
            }
          }
        );


        this.changeDetectorRef.detectChanges();
      });
      this.session.on('streamDestroyed', (event) => {
        const idx = this.streams.indexOf(event.stream);
        if (idx > -1) {
          this.streams.splice(idx, 1);
          this.changeDetectorRef.detectChanges();
        }
      });

      this.session.connect(token, (error) => {
        if (error) {
          console.log(error);
        }
        // this.toastr.error(error);
      });
      // this.opentokService.connect();
    });

  }

  handleScreenShare(streamType) {

    if (streamType === 'screen') {
      const screenShare = document.getElementById('screen');
      screenShare.classList.add('sub-active');
    }
  }
}
