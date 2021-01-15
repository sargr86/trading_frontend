import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patternValidator} from '@core/helpers/pattern-validator';
import {METL_URL_PATTERN} from '@core/constants/patterns';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';

@Component({
    selector: 'app-video-url-tab',
    templateUrl: './video-url-tab.component.html',
    styleUrls: ['./video-url-tab.component.scss']
})
export class VideoUrlTabComponent implements OnInit {
    searchVideoByUrlForm: FormGroup;
    validUrl = true;
    searchedVideos = [];
    selectedVideos = [];

    apiUrl = API_URL;

    searchingVideo = false;
    isSubmitted = false;
    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService
    ) {
    }

    ngOnInit(): void {
        this.searchVideoByUrlForm = this.fb.group({
            url: ['', [Validators.required, patternValidator(METL_URL_PATTERN)]]
        });
    }

    getUrlString(e) {
        const possibleUrl = e.clipboardData?.getData('text') || e;
        this.isSubmitted = true;
        this.searchedVideos = [];
        this.getVideos(possibleUrl);
    }

    getVideos(possibleUrl) {
        this.validUrl = METL_URL_PATTERN.test(possibleUrl);
        if (this.validUrl) {
            const parsedUrl = new URL(possibleUrl);
            const id = parsedUrl.searchParams.get('id');
            if (id) {
                this.searchingVideo = true;
                this.videoService.getVideoById({id}).subscribe(dt => {
                    this.searchingVideo = false;
                    this.searchedVideos = dt ? [dt] : [];
                });
            }
        }
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(id) {
        this.selectedVideos = this.selectedVideos.filter(v => v !== id).concat([id]);
        this.selectVid.emit(this.selectedVideos);
    }

    get urlCtrl(): AbstractControl {
        return this.searchVideoByUrlForm.get('url');
    }

}
