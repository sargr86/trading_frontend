import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import {ConnectionEvent, OpenVidu, Publisher, Session, StreamEvent, StreamManager, Subscriber} from 'openvidu-browser';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {OpenviduService} from '@core/services/openvidu.service';

@Component({
    selector: 'app-start-video-streaming',
    templateUrl: './start-video-streaming.component.html',
    styleUrls: ['./start-video-streaming.component.scss']
})
export class StartVideoStreamingComponent implements OnInit {

    videoSettings;
    sessionData;
    loadingSession = false;
    streamCreated = false;

    // OpenVidu objects
    OV: OpenVidu;
    session: Session;
    openViduToken;
    mainStreamManager: StreamManager;
    publisher: StreamManager; // Local

    authUser;
    participants = [];

    recordingState = 'idle';

    thumbnailFile;
    thumbnailUploaded = false;

    constructor(
        private toastr: ToastrService,
        private getAuthUser: GetAuthUserPipe,
        private openViduService: OpenviduService,
        private elRef: ElementRef,
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    @HostListener('window:beforeunload')
    beforeunloadHandler() {
        // On window closed leave session
        this.leaveSession();
    }

    ngOnInit(): void {
        this.getVideoSessionData();
        if (!this.sessionData || !this.videoSettings) {
            this.toastr.error('Video settings and/or session details are unavailable', 'Data unavailable!');
        } else {
            this.joinSession();
        }


    }

    getVideoSessionData() {
        this.sessionData = JSON.parse(localStorage.getItem('session'));
        this.videoSettings = JSON.parse(localStorage.getItem('video_settings'));
    }

    joinSession() {

        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.loadingSession = true;
        this.getStreamEvents();

        console.log(this.session)

        this.openViduService.getToken({
            email: this.authUser.email,
            sessionName: this.sessionData.sessionName,
            role: 'PUBLISHER'
        }).subscribe((token: any) => {

            this.loadingSession = false;

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
            console.log(event.stream);
        });

        this.session.on('connectionCreated', (event: ConnectionEvent) => {
            console.log('connection created!!!')
            const connection = JSON.parse(event.connection.data.replace(/}%\/%{/g, ','));
            console.log(event.connection.data)
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

    receiveRecordingState() {

    }

    sendMessage(e) {

    }

    receiveMessage() {

    }

    deleteSubscriber(streamManager: StreamManager) {

    }

    leaveSession() {
        console.log('leaving session!!!')
        if (this.session) {
            this.session.disconnect();
        }

        if (this.sessionData) {

            this.openViduService.leaveSession({
                token: this.openViduToken,
                sessionName: this.sessionData.sessionName,
                role: 'publisher'
            }).subscribe(() => {

            });
        }
    }

}
