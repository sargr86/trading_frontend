import {
    Component,
    OnInit,
    OnDestroy,
    ElementRef, AfterViewInit, EventEmitter, Output, Input
} from '@angular/core';

import videojs from 'video.js';
import * as adapter from 'webrtc-adapter/out/adapter_no_global.js';
import * as RecordRTC from 'recordrtc';
import * as moment from 'moment';


import * as Record from 'videojs-record/dist/videojs.record.js';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {BlobToFilePipe} from '@shared/pipes/blob-to-file.pipe';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';

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
    videoId;
    recordingStartTimeStamp;
    recordingEndTimeStamp;
    readonly config: any;
    private player: any;
    private plugin: any;

    @Input('openViduToken') openViduToken;
    @Input('videoSettings') videoSettings;
    @Input('thumbnailFile') thumbnailFile;

    @Output() shareScreen = new EventEmitter();
    @Output() recordingStarted = new EventEmitter();

    screenSharing = false;

    // constructor initializes our declared vars
    constructor(
        elementRef: ElementRef,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        private blobToFile: BlobToFilePipe,
        private subject: SubjectService,
        public router: Router
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
                    video: {
                        frameRate: {ideal: 30, max: 30},
                        width: {min: 640, ideal: 640, max: 1280},
                        height: {min: 480, ideal: 480, max: 720}
                    },
                    screen: true,
                    displayMilliseconds: false,
                    maxLength: 3600, //30
                    debug: true,
                    videoEngine: 'recordrtc',
                    videoMimeType: 'video/webm;codecs=H264',
                    frameWidth: 640,
                    frameHeight: 480
                    // convertEngine: 'ts-ebml'
                },

                // videoJsResolutionSwitcher: {
                //     default: 'low', // Default resolution [{Number}, 'low', 'high'],
                //     dynamicLabel: true
                // }

            }
        };
    }

    ngOnInit() {
        this.authUser = this.getAuthUser.transform();
    }

    // use ngAfterViewInit to make sure we initialize the videojs element
    // after the component template itself has been rendered
    ngAfterViewInit() {
        // ID with which to access the template's video element
        const el = 'video_' + this.idx;


        // setup the player via the unique element ID
        this.player = videojs(document.getElementById(el), this.config, () => {
            // console.log('player ready! id:', el);

            // print version information at startup
            const msg = 'Using video.js ' + videojs.VERSION +
                ' with videojs-record ' + videojs.getPluginVersion('record') +
                ' and recordrtc ' + RecordRTC.version;
            videojs.log(msg);
        }, () => {
            this.player.updateSrc([
                {
                    src: 'https://vjs.zencdn.net/v/oceans.mp4?SD',
                    type: 'video/mp4',
                    label: 'SD',
                    res: 360
                },
                {
                    src: 'https://vjs.zencdn.net/v/oceans.mp4?HD',
                    type: 'video/mp4',
                    label: 'HD',
                    res: 720
                }
            ]);
            this.player.on('resolutionchange', () => {
                console.log('Source changed to %s', this.player.src());
            });
        });

        // device is ready
        this.player.on('deviceReady', (a) => {
            // console.log(a)
            this.shareScreen.emit();
            // console.log('device is ready!');
        });

        // user clicked the record button and started recording
        this.player.on('startRecord', (aa) => {
            // console.log(this.openViduToken)
            this.recordingState = 'active';
            this.subject.setVideoRecordingState({recording: true, viaSocket: false});

            // console.log('start timestamp:' + this.player.currentTimestamp)
            this.recordingStartTimeStamp = moment(this.player.currentTimestamp);

            // this.thumbnailFile = this.videoSettings.thumbnail;
            // console.log(this.videoSettings.thumbnail)


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
                thumbnail: this.videoSettings.thumbnail,
                name: this.videoSettings.name,
                description: this.videoSettings.description,
                tags: this.videoSettings.tags
            }).subscribe((dt) => {
                this.videoId = dt?.id;
                this.recordingStarted.emit(this.videoId);
            });


            // console.log('started recording!');
        });


        // user completed recording and stream is available
        this.player.on('finishRecord', () => {
            // recordedData is a blob object containing the recorded data that
            // can be downloaded by the user, stored on server etc.
            // console.log('finished recording: ', this.player);
            // console.log(document.getElementsByTagName('video')[0].duration)
            // console.log('end timestamp:' + this.player.currentTimestamp)
            this.recordingEndTimeStamp = moment(this.player.currentTimestamp);
            // console.log('Duration timestamp:' + moment.utc((moment.duration(this.recordingEndTimeStamp - this.recordingStartTimeStamp, 'seconds').asMilliseconds()).format('HH:mm')))

            const recordingDuration = moment.utc(this.recordingEndTimeStamp.diff(this.recordingStartTimeStamp)).format('mm:ss');

            // console.log(this.videoSettings)
            const fd: FormData = new FormData();
            fd.append('username', this.authUser.username);
            // fd.append('avatar', this.authUser.avatar);
            fd.append('id', this.videoId);
            fd.append('author_id', this.authUser.id);
            // fd.append('full_name', this.authUser.full_name);
            // fd.append('category_id', this.authUser._id);
            fd.append('video_name', this.player.recordedData.name);
            fd.append('video_duration', recordingDuration);
            fd.append('video_stream_file', this.blobToFile.transform(this.player.recordedData));
            // if (this.thumbnailFile) {
            //     fd.append('thumbnail', this.thumbnailFile.name);
            // }
            fd.append('video_settings', JSON.stringify(this.videoSettings));
            this.subject.setVideoRecordingState({recording: false});
            this.recordingState = 'finished';
            this.videoService.saveRecordedData(fd).subscribe(() => {
                localStorage.setItem('session', '');
                localStorage.setItem('video_settings', '');
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

    backToChannelVideos() {
        const route = 'channels/show';
        const params = {tab: 'videos', username: this.authUser.username};
        this.router.navigate([route], {queryParams: params});
    }


    // use ngOnDestroy to detach event handlers and remove the player
    ngOnDestroy() {
        if (this.player) {
            this.player.dispose();
            this.player = false;
        }
    }

}
