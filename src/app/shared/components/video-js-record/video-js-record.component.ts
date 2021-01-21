import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef, AfterViewInit, EventEmitter, Output, Input
} from '@angular/core';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';


import * as Record from 'videojs-record/dist/videojs.record.js';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {BlobToFilePipe} from '@shared/pipes/blob-to-file.pipe';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-video-js-record',
    templateUrl: './video-js-record.component.html',
    styleUrls: ['./video-js-record.component.scss']
})
export class VideoJsRecordComponent implements OnInit, OnDestroy, AfterViewInit {

    // index to create unique ID for component
    idx = 'clip1';
    authUser;
    recordingState = 'idle';
    readonly config: any;
    private player: any;
    private plugin: any;

    @Input('openViduToken') openViduToken;
    @Input('videoSettings') videoSettings;
    @Input('thumbnailFile') thumbnailFile;

    @Output() shareScreen = new EventEmitter();

    screenSharing = false;

    // constructor initializes our declared vars
    constructor(
        elementRef: ElementRef,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private blobToFile: BlobToFilePipe,
        private subject: SubjectService
    ) {


        this.player = false;

        // save reference to plugin (so it initializes)
        this.plugin = Record;

        // video.js configuration
        this.config = {
            controls: true,
            autoplay: false,
            fluid: false,
            loop: false,
            width: 640,
            height: 480,
            bigPlayButton: false,
            controlBar: {
                volumePanel: true
            },
            plugins: {
                /*
                // wavesurfer section is only needed when recording audio-only
                wavesurfer: {
                    backend: 'WebAudio',
                    waveColor: '#36393b',
                    progressColor: 'black',
                    debug: true,
                    cursorWidth: 1,
                    displayMilliseconds: true,
                    hideScrollbar: true,
                    plugins: [
                        // enable microphone plugin
                        WaveSurfer.microphone.create({
                            bufferSize: 4096,
                            numberOfInputChannels: 1,
                            numberOfOutputChannels: 1,
                            constraints: {
                                video: false,
                                audio: true
                            }
                        })
                    ]
                },
                */
                // configure videojs-record plugin
                record: {
                    audio: true,
                    // video: true,
                    video: {frameRate: {ideal: 30, max: 30}, width: 640, height: 480},
                    screen: true,
                    displayMilliseconds: false,
                    maxLength: 3000, //30
                    debug: true,
                    videoMimeType: 'video/webm;codecs=H264',
                    // convertEngine: 'ts-ebml'
                },

            }
        };
    }

    ngOnInit() {
        console.log('TOKEN!!!!!!')
        console.log(this.openViduToken)
        console.log(this.videoSettings)
        console.log(this.thumbnailFile)
        this.authUser = this.getAuthUser.transform();
    }

    // use ngAfterViewInit to make sure we initialize the videojs element
    // after the component template itself has been rendered
    ngAfterViewInit() {
        // ID with which to access the template's video element
        const el = 'video_' + this.idx;

        // setup the player via the unique element ID
        this.player = videojs(document.getElementById(el), this.config, () => {
            console.log('player ready! id:', el);

            // print version information at startup
            const msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        });

        // device is ready
        this.player.on('deviceReady', (a) => {
            console.log(a)
            this.shareScreen.emit();
            console.log('device is ready!');
        });

        // user clicked the record button and started recording
        this.player.on('startRecord', (aa) => {
            console.log(this.openViduToken)
            this.recordingState = 'active';
            this.subject.setVideoRecordingState({recording: true, viaSocket: false});
            console.log('RECORDING!!!!')
            console.log(this.authUser)
            console.log(console.log(this.videoSettings))
            console.log('RECORDING!!!!')
            this.videoService.saveVideoToken({
                token: this.openViduToken,
                author_id: this.authUser.id,
                channel_id: this.authUser.channel.id,
                category_id: this.videoSettings.category_id,
                privacy: this.videoSettings.privacy,
                filename: '',
                session_name: this.videoSettings.sessionName,
                publisher: this.videoSettings.myUserName,
                status: 'live',
                tags: this.videoSettings.tags
            }).subscribe((dt) => {
            });
            console.log('started recording!');
        });


        // user completed recording and stream is available
        this.player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished recording: ', this.player.recordedData);
            console.log(this.videoSettings)
            const fd: FormData = new FormData();
            // fd.append('username', this.authUser.username);
            // fd.append('full_name', this.authUser.full_name);
            // fd.append('avatar', this.authUser.avatar);
            fd.append('author_id', this.authUser.id);
            // fd.append('category_id', this.authUser._id);
            fd.append('video_name', this.player.recordedData.name);
            fd.append('video_stream_file', this.blobToFile.transform(this.player.recordedData));
            if (this.thumbnailFile) {
                fd.append('thumbnail', this.thumbnailFile.name);
            }
            fd.append('video_settings', JSON.stringify(this.videoSettings));
            this.subject.setVideoRecordingState({recording: false});
            this.recordingState = 'finished';
            this.videoService.saveRecordedData(fd).subscribe(() => {

            });
        });

        // converter ready and stream is available
        this.player.on('finishConvert', () => {
            // the convertedData object contains the converted data that
            // can be downloaded by the user, stored on server etc.
            console.log('finished converting: ', this.player.convertedData);
        });

        // error handling
        this.player.on('error', (element, error) => {
            console.warn(error);
        });

        this.player.on('deviceError', () => {
            console.error('device error:', this.player.deviceErrorCode);
        });
    }

    // use ngOnDestroy to detach event handlers and remove the player
    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
            this.player = false;
        }
    }

}
