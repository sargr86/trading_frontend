import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as OT from '@opentok/client';
import {OpentokService} from '@core/services/opentok.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit {

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

  videoJSPlayerOptions = {
    autoplay: true,
    controls: true,
    fluid: false,
    sources: []
  }

  session: OT.Session;
  streams: Array<OT.Stream> = [];
  changeDetectorRef: ChangeDetectorRef;

  screenSharing = false;
  screenSharePublisher;

  @ViewChild('video') videoEl;

  constructor(
    private ref: ChangeDetectorRef,
    private opentokService: OpentokService,
    private toastr: ToastrService,
    private elRef: ElementRef
  ) {
    this.changeDetectorRef = ref;
  }

  ngOnInit(): void {


    this.opentokService.initSession('ok').subscribe(({apiKey, sessionId, token}: any) => {
      this.session = OT.initSession(apiKey, sessionId);

      this.session.on('streamCreated', (event) => {
        this.streams.push(event.stream);
        console.log(this.streams)
        console.log(event.stream.videoType)


        const streamContainer = event.stream.videoType === 'screen' ? 'screen' : 'subscriber';
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
              console.log('callback')
              this.handleScreenShare(event.stream.videoType);
              this.getVideo(event.stream);

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
      const sessionContainer = document.getElementById('session-container');
      sessionContainer.classList.add('sub-active');
    }
  }

  shareScreen() {


    OT.checkScreenSharingCapability(response => {
      if (!response.supported || response.extensionRegistered === false) {
        alert('Screen sharing not supported');
      } else if (response.extensionInstalled === false) {
        alert('Browser requires extension');
      } else {
        this.screenSharePublisher = OT.initPublisher(
          'screen',
          {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            videoSource: 'screen',
            publishAudio: true
          },
          this.handleCallback
        );
        this.screenSharing = true;
        const screenShare = document.getElementById('screen');
        screenShare.classList.add('pub-active');
        const sessionContainer = document.getElementById('session-container');
        sessionContainer.classList.add('pub-active');
        console.log('share')
        this.session.publish(this.screenSharePublisher, this.handleCallback);
      }
    });
  }

  stopScreenSharing() {
    this.screenSharePublisher.destroy();
    this.screenSharing = false;
  }

  handleCallback(error) {
    if (error) {
      console.log('error: ' + error.message);
    }
  }


  ngAfterViewInit() {
    // this.getVideo();
  }

  getVideo(eventStream) {
    const video = this.elRef.nativeElement.querySelector('video');
    console.log(video)

    if (video) {

      navigator.getUserMedia({
          video: true,
          audio: true
        },
        (stream) => {
          console.log(stream);
          console.log(eventStream);
          video.srcObject = stream;
          video.play();

          this.videoJSPlayerOptions.sources[0] = stream;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
