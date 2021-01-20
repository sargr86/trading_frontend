import {Component, ElementRef, HostListener, OnDestroy, OnInit} from '@angular/core';
import {ConnectionEvent, OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber} from 'openvidu-browser';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute} from '@angular/router';
import {OpenviduService} from '@core/services/openvidu.service';
import {SubjectService} from '@core/services/subject.service';
import {LoaderService} from '@core/services/loader.service';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-join-video-streaming',
    templateUrl: './join-video-streaming.component.html',
    styleUrls: ['./join-video-streaming.component.scss']
})
export class JoinVideoStreamingComponent implements OnInit, OnDestroy {
    recordingState = 'started';

    // OpenVidu objects
    OV: OpenVidu;
    openViduToken;
    session: Session;
    sessionData = {sessionName: '', myUserName: ''};
    streamCreated;

    authUser;
    participants = [];
    subscribers = [];
    tags = [];

    mainStreamManager: StreamManager;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private route: ActivatedRoute,
        private openViduService: OpenviduService,
        private videoService: VideoService,
        private subject: SubjectService,
        public loader: LoaderService,
        private elRef: ElementRef
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getSessionData();
        this.getRecordingState();
        this.joinSession();
    }


    @HostListener('window:beforeunload')
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
    }

    getRecordingState() {
        this.subject.getVideoRecordingState().subscribe(data => {
            console.log(data)
            if (data.recordingState === 'finished') {
                this.leaveSession();
            }

            if (!data.viaSocket) {
                // this.sendRecordingState(data.recording);
            }
        });
    }

    getSessionData() {
        const params: any = this.route.snapshot.queryParams;
        if (params && params.hasOwnProperty('session')) {
            console.log('has session!!!!!')
            this.sessionData.sessionName = params.session;
            this.sessionData.myUserName = this.authUser.username;
            this.recordingState = 'started';
            console.log(this.sessionData)

        }
    }

    joinSession() {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.loader.dataLoading = true;
        this.getStreamEvents();

        console.log(this.session)

        this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionData.sessionName,
            role: 'SUBSCRIBER'
        }).subscribe((token: any) => {
            // const {token} = data;
            this.openViduToken = token;
            this.receiveMessage();
            this.recordingState = 'started';
            this.receiveRecordingState();


            // console.log(token)
            console.log({...this.sessionData, avatar: this.authUser.avatar})
            this.session.connect(token, {clientData: {...this.sessionData, avatar: this.authUser.avatar}})
                .then(() => {
                    this.loader.dataLoading = false;
                });

        });

    }

    getStreamEvents() {
        this.session.on('streamCreated', (event: StreamEvent) => {
            this.streamCreated = true;
            const video = this.elRef.nativeElement.querySelector('video');
            // const video = undefined;
            // this.streamCreated = true;
            console.log('stream created', video);
            console.log(event.stream);

            const subscriber: Subscriber = this.session.subscribe(event.stream, undefined);
            this.subscribers.push(subscriber);
            console.log(this.subscribers)
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            console.log('connection created!!!');
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            console.log(event.connection.data);
            console.log('RECORDING STATE' + this.recordingState)
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
            // this.deleteSubscriber(event.stream.streamManager);
            this.leaveSession();
        });
    }


    receiveRecordingState() {
        console.log('receive recording!!!!')
        this.session.on('signal:recording-state', (event: any) => {
            const obj = {event, ...{socket: true}};
            this.recordingState = !!event.data ? 'started' : 'finished';
            if (this.recordingState === 'finished') {
                this.tags = [];
            }

            console.log(obj);
            console.log(this.recordingState);
            console.log('received');
            this.subject.setVideoRecordingState({recordingState: this.recordingState, ...{viaSocket: true}});
        });
    }

    receiveMessage() {
        this.session.on('signal:my-chat', (event: any) => {
            console.log(event);
            this.subject.setMsgData({message: event.data, from: event.from.data});
            // console.log(event.data); // Message
            // console.log(event.from); // Connection object of the sender
            // console.log(event.type); // The type of message ("my-chat")
        });
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


    updateMainStreamManager(streamManager: StreamManager) {
        this.mainStreamManager = streamManager;
    }

    leaveSession() {
        if (this.session) {
            this.session.disconnect();
        }

        if (this.sessionData) {

            this.openViduService.leaveSession({
                token: this.openViduToken,
                sessionName: this.sessionData.sessionName,
                role: 'subscriber'
            }).subscribe(() => {

            });
        }
    }

    ngOnDestroy() {
        // On component destroyed leave session
        this.leaveSession();
    }


}
