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
import {ConnectionEvent, OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber} from 'openvidu-browser';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OpenviduService} from '@core/services/openvidu.service';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {VideoService} from '@core/services/video.service';
import {Router} from '@angular/router';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {API_URL, VIDEO_CATEGORIES} from '@core/constants/global';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, AfterViewInit, OnDestroy {


    videoJSPlayerOptions = {
        autoplay: true,
        controls: true,
        fluid: false,
        sources: []
    };

    videoSettings;

    streamCreated = false;
    userNickname;

    OPENVIDU_SERVER_URL = 'https://localhost:4443';
    OPENVIDU_SERVER_SECRET = 'MY_SECRET';

    // OpenVidu objects
    OV: OpenVidu;
    session: Session;
    publisher: StreamManager; // Local
    subscribers: StreamManager[] = []; // Remotes


    @ViewChild('video') videoEl;

    // Main video of the page, will be 'publisher' or one of the 'subscribers',
    // updated by click event in UserVideoComponent children
    mainStreamManager: StreamManager;

    authUser;
    openViduToken;

    recordingState = 'idle';
    watcher = false;

    webcams = [];
    tags = [];

    participants = [];


    thumbnailFile;
    thumbnailUploaded = false;
    apiUrl = API_URL;

    publisherData;
    sessionData;

    constructor(
        private ref: ChangeDetectorRef,
        private toastr: ToastrService,
        private elRef: ElementRef,
        private fb: FormBuilder,
        private openViduService: OpenviduService,
        private subject: SubjectService,
        private getAuthUser: GetAuthUserPipe,
        private videoService: VideoService,
        public router: Router
    ) {
    }

    ngOnInit(): void {

        this.watcher = this.router.url.includes('watch');

        this.authUser = this.getAuthUser.transform();

        this.subject.getVideoRecordingState().subscribe(data => {

            if (data.recordingState === 'finished') {
                this.leaveSession();
            }

            if (!data.viaSocket) {
                this.sendRecordingState(data.recording);
            }
        });
    }


    @HostListener('window:beforeunload')
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
    }


    joinSession() {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.getStreamEvents();

        this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionData.sessionName,
            role: this.watcher ? 'SUBSCRIBER' : 'PUBLISHER'
        }).subscribe((token: any) => {
            // const {token} = data;
            this.openViduToken = token;
            this.receiveMessage();
            this.receiveRecordingState();

            // console.log(token)
            // console.log({clientData: this.joinSessionForm.value.myUserName})
            this.session.connect(token, {clientData: this.sessionData})
                .then(() => {
                    console.log('PUBLISHER: ' + token.includes('PUBLISHER'))
                    if (token.includes('PUBLISHER')) {


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
                    } else {

                    }
                });

        });

    }

    getStreamEvents() {
        this.session.on('streamCreated', (event: StreamEvent) => {

            const video = this.elRef.nativeElement.querySelector('video');
            // const video = undefined;
            this.streamCreated = true;
            console.log('stream created', video)
            console.log(event.stream)

            // const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
            // this.subscribers.push(subscriber);

            const subscriber: Subscriber = this.session.subscribe(event.stream, undefined
                // {
                //   insertMode: 'append'
                // },
                // (error) => {
                //   console.log(error)
                //   if (error) {
                //     console.log('error: ' + error.message);
                //   } else {
                //     console.log('callback')
                //     // this.handleScreenShare(event.stream.videoType);
                //     // this.getVideo(event.stream);
                //
                //   }
                // }
            );
            this.subscribers.push(subscriber);
            console.log(this.subscribers);
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            console.log('connection created!!!')
            console.log(event)
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            // this.toastr.success(from.clientData.myUserName + 'joined the session');
            this.participants.push(connection.clientData.myUserName);
        });

        this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
            console.log('connection destroyed!!!')
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            this.participants = this.participants.filter(p => p !== connection.clientData.myUserName);
        });

        // On every Stream destroyed...
        this.session.on('streamDestroyed', (event: StreamEvent) => {

            console.log('stream destroyed!!!!!')
            console.log(event)

            // Remove the stream from 'subscribers' array
            this.deleteSubscriber(event.stream.streamManager);
            this.leaveSession();
        });
    }

    updateMainStreamManager(streamManager: StreamManager) {
        this.mainStreamManager = streamManager;
    }


    deleteSubscriber(streamManager: StreamManager) {
        console.log(this.subscribers)
    }

    leaveSession() {
        console.log('leaving session!!!')
        if (this.session) {
            this.session.disconnect();
        }

        if (!this.watcher) {


            // Empty all properties...
            this.subscribers = [];
            delete this.publisher;
            delete this.session;
            delete this.OV;

            this.thumbnailFile = [];
            this.thumbnailUploaded = false;
        }

        if (this.sessionData) {

            this.openViduService.leaveSession({
                token: this.openViduToken,
                sessionName: this.sessionData.sessionName,
                role: this.watcher ? 'subscriber' : 'publisher'
            }).subscribe(() => {

            });
        }
    }

    sendMessage(e) {
        console.log(e)
        this.session.signal({
            data: e.message,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
        })
            .then(() => {
                this.videoService.saveVideoMessage(e).subscribe(() => {
                });
                console.log('Message successfully sent');
            })
            .catch(error => {
                console.error(error);
            });
    }

    sendRecordingState(recording) {
        console.log('recording!!!!')
        this.session.signal({
            data: recording,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'recording-state'             // The type of message (optional)
        }).then(() => {

        });
    }

    receiveRecordingState() {
        this.session.on('signal:recording-state', (event: any) => {
            const obj = {event, ...{socket: true}};
            this.recordingState = !!event.data ? 'started' : 'finished';
            if (this.recordingState === 'finished') {
                this.tags = [];
            }

            console.log(obj)
            console.log(this.recordingState)
            console.log('received')
            this.subject.setVideoRecordingState({recordingState: this.recordingState, ...{viaSocket: true}});
        });
    }

    receiveMessage() {
        this.session.on('signal:my-chat', (event: any) => {
            // console.log(event.from)
            this.subject.setMsgData({message: event.data, from: event.from.data});
            // console.log(event.data); // Message
            // console.log(event.from); // Connection object of the sender
            // console.log(event.type); // The type of message ("my-chat")
        });
    }


    getVideo(eventStream) {
        const video = this.elRef.nativeElement.querySelector('video');
        console.log(video)

        if (video) {
            this.userNickname = JSON.parse(eventStream.connection.data.replace(/}%\/%{/g, ',')).clientData.myUserName;
            console.log(this.userNickname)
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


    getPublisherData(e) {
        this.videoSettings = e;
        this.sessionData = {sessionName: e.sessionName, myUserName: e.myUserName};
        console.log(this.sessionData)
        this.joinSession();
    }

    getWatcherData(e) {
        this.publisherData = e;
        this.sessionData = {sessionName: e.sessionName, myUserName: e.myUserName};
        console.log(this.sessionData)
        this.joinSession();
    }


    ngOnDestroy() {
        // On component destroyed leave session
        this.leaveSession();
    }


    ngAfterViewInit() {
        // this.getVideo();
    }
}
