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


    videoRecordOptions = {
        controls: true,
        bigPlayButton: false,
        width: 640,
        height: 480,
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
    };

    streamCreated = false;
    userNickname;

    OPENVIDU_SERVER_URL = 'https://localhost:4443';
    OPENVIDU_SERVER_SECRET = 'MY_SECRET';

    // OpenVidu objects
    OV: OpenVidu;
    session: Session;
    publisher: StreamManager; // Local
    subscribers: StreamManager[] = []; // Remotes

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @ViewChild('video') videoEl;
    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;

    // Join form
    joinSessionForm: FormGroup;
    mySessionId: string;
    myUserName: string;

    // Main video of the page, will be 'publisher' or one of the 'subscribers',
    // updated by click event in UserVideoComponent children
    mainStreamManager: StreamManager;

    authUser;
    openViduToken;

    recordingState = 'idle';
    watcher = false;

    sessionName = 'SessionA';

    webcams = [];
    tags = [];

    startStreamingForm: FormGroup;
    videoCategories = VIDEO_CATEGORIES;
    thumbnailFile;
    thumbnailUploaded = false;
    apiUrl = API_URL;

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

        this.startStreamingForm = this.fb.group({
            name: ['', Validators.required],
            description: ['', Validators.required],
            category: ['', Validators.required],
            // thumbnail: ['', Validators.required],
            tags: [[], Validators.required]
        });
    }

    ngOnInit(): void {


        // navigator.mediaDevices.enumerateDevices()
        //   .then((devices) => {
        //     this.webcams = devices.filter(d => d.kind === 'videoinput');
        //     console.log(this.webcams);
        //   });


        this.watcher = this.router.url.includes('watch');

        this.authUser = this.getAuthUser.transform();
        this.initForm();

        if (!this.watcher) {
            // this.joinSession();
        }

        this.subject.getVideoRecordingState().subscribe(data => {

            if (data.recordingState === 'finished') {
                this.leaveSession();
            }

            console.log(data)
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


    initForm() {
        this.joinSessionForm = this.fb.group({
            mySessionId: [this.sessionName],
            // myUserName: ['Participant' + Math.floor(Math.random() * 100)]
            myUserName: [this.authUser.username]
        });
    }

    joinSession() {
        console.log(this.startStreamingForm.value)
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.getStreamEvents();

        this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionName,
            role: this.watcher ? 'SUBSCRIBER' : 'PUBLISHER'
        }).subscribe((token: any) => {
            // const {token} = data;
            console.log(token)
            this.openViduToken = token;
            this.receiveMessage();
            this.receiveRecordingState();

            console.log(token)
            console.log({clientData: this.joinSessionForm.value.myUserName})
            this.session.connect(token, {clientData: this.joinSessionForm.value})
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
            console.log(this.subscribers)
        });

        // On every Stream destroyed...
        this.session.on('streamDestroyed', (event: StreamEvent) => {

            console.log('stream destroyed!!!!!')

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
        console.log('leaving session!!!')
        if (this.session) {
            this.session.disconnect();
        }

        // Empty all properties...
        this.subscribers = [];
        delete this.publisher;
        delete this.session;
        delete this.OV;

        this.thumbnailFile = [];
        this.thumbnailUploaded = false;

        this.openViduService.leaveSession({token: this.openViduToken, sessionName: this.sessionName}).subscribe(() => {

        });
        // this.generateParticipantInfo();
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
                this.startStreamingForm.reset();
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

    testSession() {
        this.openViduService.getSession().subscribe(dt => {

        });
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        // Add our fruit
        if ((value || '').trim()) {
            this.tags.push(value.trim());
            this.startStreamingForm.patchValue({tags: this.tags});
        }

        // Reset the input value
        if (input) {
            input.value = '';
        }
    }

    remove(fruit): void {
        const index = this.tags.indexOf(fruit);

        if (index >= 0) {
            this.tags.splice(index, 1);
            this.startStreamingForm.patchValue({tags: this.tags});
        }
    }

    getThumbnailFile(e) {
        this.thumbnailFile = e.target.files[0];
        const fd = new FormData();
        fd.append('video_thumbnail_file', this.thumbnailFile);

        // this.startStreamingForm.patchValue({thumbnail: this.thumbnailFile.name});
        this.videoService.saveVideoThumbnail(fd).subscribe(filename => {
            this.toastr.success('The thumbnail has been uploaded successfully');
            this.thumbnailUploaded = true;
        });
    }

    removeUploadedThumbnail(filename) {
        // this.videoService.removeVideoThumbnail(filename).subscribe(dt => {
            this.thumbnailFile = [];
            this.toastr.success('The thumbnail has been removed successfully');
            this.thumbnailUploaded = false;
        // });
    }

    ngOnDestroy() {
        // On component destroyed leave session
        this.leaveSession();
    }


    ngAfterViewInit() {
        // this.getVideo();
    }
}
