import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber} from 'openvidu-browser';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OpenviduService} from '@core/services/openvidu.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {

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

  streamCreated = false;

  OPENVIDU_SERVER_URL = 'https://localhost:4443';
  OPENVIDU_SERVER_SECRET = 'MY_SECRET';

  // OpenVidu objects
  OV: OpenVidu;
  session: Session;
  publisher: StreamManager; // Local
  subscribers: StreamManager[] = []; // Remotes

  @ViewChild('video') videoEl;

  // Join form
  joinSessionForm: FormGroup;
  mySessionId: string;
  myUserName: string;

  // Main video of the page, will be 'publisher' or one of the 'subscribers',
  // updated by click event in UserVideoComponent children
  mainStreamManager: StreamManager;

  constructor(
    private ref: ChangeDetectorRef,
    private toastr: ToastrService,
    private elRef: ElementRef,
    private fb: FormBuilder,
    private openViduService: OpenviduService
  ) {
    this.initForm();
  }

  ngOnInit(): void {


    // this.opentokService.initSession('ok').subscribe(({apiKey, sessionId, token}: any) => {
    //   this.session = OT.initSession(apiKey, sessionId);
    //
    //   this.session.on('streamCreated', (event) => {
    //     this.streams.push(event.stream);
    //     console.log(this.streams)
    //     console.log(event.stream.videoType)
    //
    //
    //     const streamContainer = event.stream.videoType === 'screen' ? 'screen' : 'subscriber';
    //     this.session.subscribe(
    //       event.stream,
    //       streamContainer,
    //       {
    //         insertMode: 'append',
    //         width: '100%',
    //         height: '100%'
    //       },
    //       (error) => {
    //         if (error) {
    //           console.log('error: ' + error.message);
    //         } else {
    //           console.log('callback')
    //           this.handleScreenShare(event.stream.videoType);
    //           this.getVideo(event.stream);
    //
    //         }
    //       }
    //     );
    //
    //
    //     this.changeDetectorRef.detectChanges();
    //   });
    //   this.session.on('streamDestroyed', (event) => {
    //     const idx = this.streams.indexOf(event.stream);
    //     if (idx > -1) {
    //       this.streams.splice(idx, 1);
    //       this.changeDetectorRef.detectChanges();
    //     }
    //   });
    //
    //   this.session.connect(token, (error) => {
    //     if (error) {
    //       console.log(error);
    //     }
    //     // this.toastr.error(error);
    //   });
    //   // this.opentokService.connect();
    // });

  }


  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    // On window closed leave session
    this.leaveSession();
  }


  initForm() {
    this.joinSessionForm = this.fb.group({
      mySessionId: ['SessionA'],
      myUserName: ['Participant' + Math.floor(Math.random() * 100)]
    });
  }

  joinSession() {
    this.OV = new OpenVidu();

    this.session = this.OV.initSession();
    this.getStreamEvents();

    // const authUser = localStorage.getItem()

    this.openViduService.getToken({email: 'admin@gmail.com', sessionName: 'SessionA'}).subscribe((token: any) => {
      // const {token} = data;
      console.log(token)
      console.log({clientData: this.joinSessionForm.value.myUserName})
      this.session.connect(token.href, {clientData: {myUserName: this.joinSessionForm.value.myUserName}})
        .then(() => {
          const video = this.elRef.nativeElement.querySelector('video');
          const publisher: Publisher = this.OV.initPublisher(video, {
            audioSource: undefined, // The source of audio. If undefined default microphone
            videoSource: undefined, // The source of video. If undefined default webcam
            publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
            publishVideo: true,     // Whether you want to start publishing with your video enabled or not
            resolution: '640x480',  // The resolution of your video
            frameRate: 30,          // The frame rate of your video
            insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
            mirror: false           // Whether to mirror your local video or not
          });

          this.session.publish(publisher);

          // Set the main video in the page to display our webcam and store our Publisher
          this.mainStreamManager = publisher;
          this.publisher = publisher;
          console.log(publisher.stream.connection)
        });


    });

  }

  getStreamEvents() {
    this.session.on('streamCreated', (event: StreamEvent) => {

      const video = this.elRef.nativeElement.querySelector('video');
      this.streamCreated = true;
      console.log('stream created', video)
      console.log(event.stream)

      // const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
      // this.subscribers.push(subscriber);

      const subscriber: Subscriber = this.session.subscribe(event.stream, video,
        {
          insertMode: 'append'
        },
        (error) => {
          console.log(error)
          if (error) {
            console.log('error: ' + error.message);
          } else {
            console.log('callback')
            // this.handleScreenShare(event.stream.videoType);
            this.getVideo(event.stream);

          }
        }
      );
      this.subscribers.push(subscriber);
      console.log(this.subscribers)
    });

    // On every Stream destroyed...
    this.session.on('streamDestroyed', (event: StreamEvent) => {

      // Remove the stream from 'subscribers' array
      this.deleteSubscriber(event.stream.streamManager);
    });
  }

  updateMainStreamManager(streamManager: StreamManager) {
    this.mainStreamManager = streamManager;
  }


  deleteSubscriber(streamManager: StreamManager) {

  }

  leaveSession() {

  }

  ngOnDestroy() {
    // On component destroyed leave session
    this.leaveSession();
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
