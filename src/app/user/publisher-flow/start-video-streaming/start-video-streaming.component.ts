import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ConnectionEvent, OpenVidu, Publisher, Session, StreamEvent, StreamManager} from 'openvidu-browser';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {OpenviduService} from '@core/services/openvidu.service';
import {SubjectService} from '@core/services/subject.service';
import {VideoService} from '@core/services/video.service';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {LoaderService} from '@core/services/loader.service';
import {ChatService} from '@core/services/chat.service';

@Component({
    selector: 'app-start-video-streaming',
    templateUrl: './start-video-streaming.component.html',
    styleUrls: ['./start-video-streaming.component.scss']
})
export class StartVideoStreamingComponent implements OnInit, OnDestroy {

    videoSettings;
    sessionData = {sessionName: '', myUserName: ''};
    streamCreated = false;
    videoId;

    // OpenVidu objects
    OV: OpenVidu;
    session: Session;
    openViduToken;
    mainStreamManager: StreamManager;
    publisher: StreamManager; // Local

    authUser;
    participants = [];
    subscribers = [];
    tags = [];

    recordingState = 'idle';

    thumbnailFile;
    thumbnailUploaded = false;

    constructor(
        private toastr: ToastrService,
        private getAuthUser: GetAuthUserPipe,
        private openViduService: OpenviduService,
        private videoService: VideoService,
        private subject: SubjectService,
        private elRef: ElementRef,
        private dialog: MatDialog,
        public loader: LoaderService,
        private chatService: ChatService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getVideoSessionData();
        this.getRecordingState();

    }

    @HostListener('window:beforeunload')
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
        this.removeLiveVideoByToken();
    }


    getVideoSessionData() {
        this.sessionData = JSON.parse(localStorage.getItem('session'));
        this.videoSettings = JSON.parse(localStorage.getItem('video_settings'));
        console.log(this.videoSettings)
        if (!this.sessionData || !this.videoSettings) {
            this.toastr.error('Video settings and/or session details are unavailable', 'Data unavailable!');
        } else {
            this.joinSession();
        }
    }


    joinSession() {

        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.loader.dataLoading = true;
        this.getStreamEvents();

        this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionData.sessionName,
            role: 'PUBLISHER'
        }).subscribe((token: any) => {


            // const {token} = data;
            this.openViduToken = token;
            this.receiveMessage();
            // this.receiveRecordingState();


            // console.log(token)
            console.log({...this.sessionData, avatar: this.authUser.avatar})
            this.session.connect(token, {clientData: {...this.sessionData, avatar: this.authUser.avatar}})
                .then(async () => {
                    this.loader.dataLoading = false;

                    console.log('PUBLISHER: ' + token.includes('PUBLISHER'));
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


                        await this.session.publish(publisher);

                        // Set the main video in the page to display our webcam and store our Publisher
                        this.mainStreamManager = publisher;
                        this.publisher = publisher;
                        console.log(publisher.stream.connection);
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
            console.log('stream created', video);
            console.log(event.stream);
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            console.log('connection created!!!');
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            console.log(event.connection.data);
            // this.toastr.success(from.clientData.myUserName + 'joined the session');
            this.participants.push(connection.clientData.myUserName);
        });

        this.session.on('connectionDestroyed', (event: ConnectionEvent) => {
            console.log('connection destroyed!!!');
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            this.participants = this.participants.filter(p => p !== connection.clientData.myUserName);
        });

        // On every Stream destroyed...
        this.session.on('streamDestroyed', (event: StreamEvent) => {

            console.log('stream destroyed!!!!!');
            console.log(event);

            // Remove the stream from 'subscribers' array
            this.deleteSubscriber(event.stream.streamManager);
            this.leaveSession();
        });
    }

    getRecordingState() {
        this.subject.getVideoRecordingState().subscribe(data => {
            console.log(data)
            if (data.recordingState === 'finished') {
                this.leaveSession();
            }

            if (!data.viaSocket) {
                this.sendRecordingState(data.recording);
            }
        });
    }

    sendRecordingState(recording) {
        console.log('recording!!!!');
        this.session.signal({
            data: recording,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'recording-state'             // The type of message (optional)
        }).then(() => {

        });
    }


    sendMessage(e) {
        console.log('Message from chat box', e)
        this.session.signal({
            data: e.message,  // Any string (optional)
            to: [],                     // Array of Connection objects (optional. Broadcast to everyone if empty)
            type: 'my-chat'             // The type of message (optional)
        })
            .then(() => {
                this.chatService.saveMessage({video_id: this.videoId, ...e}).subscribe(dt => {
                    console.log('Message successfully sent');
                });
            })
            .catch(error => {
                console.error(error);
            });
    }

    receiveMessage() {
        this.session.on('signal:my-chat', (event: any) => {
            console.log(event)
            console.log(this.participants)
            this.subject.setMsgData({message: event.data, from: event.from.data, participants: this.participants});
            // console.log(event.data); // Message
            // console.log(event.from); // Connection object of the sender
            // console.log(event.type); // The type of message ("my-chat")
        });
    }

    deleteSubscriber(streamManager: StreamManager) {

    }

    removeLiveVideoByToken() {
        this.videoService.removeVideoByToken({token: this.openViduToken}).subscribe(() => {
        });
    }

    leaveSession() {
        console.log('leaving session!!!');
        this.subject.setVideoRecordingState({recording: false});
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

        if (this.sessionData) {
            this.openViduService.leaveSession({
                token: this.openViduToken,
                sessionName: this.sessionData.sessionName,
                role: 'publisher'
            }).subscribe(() => {

            });
        }
    }

    ngOnDestroy() {
        console.log(this.recordingState)
        console.log(this.videoSettings)
        console.log(this.openViduToken)
        if (this.recordingState === 'started') {
            this.removeLiveVideoByToken();
        }
        this.leaveSession();
        // On component destroyed leave session
    }


}
