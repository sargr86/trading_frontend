import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {patternValidator} from '@core/helpers/pattern-validator';
import {URL_PATTERN} from '@core/constants/patterns';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';

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
    searched = false;

    @Input('playlist') playlist;

    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe
    ) {
    }

    ngOnInit(): void {
        this.searchVideoByUrlForm = this.fb.group({
            url: ['', [Validators.required, patternValidator(URL_PATTERN)]]
        });
    }

    getUrlString(e) {
        const possibleUrl = e?.clipboardData?.getData('text') || this.searchVideoByUrlForm.value.url;
        this.validUrl = URL_PATTERN.test(possibleUrl);
        this.searched = true;
        if (this.validUrl) {
            const parsedUrl = new URL(possibleUrl);
            const id = parsedUrl.searchParams.get('id');
            this.videoService.getVideoById({id}).subscribe(dt => {
                this.searchedVideos = dt ? [dt] : [];
            });
        }
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        this.selectedVideos = this.getSelectedVideos.transform(video, this.selectedVideos, this.playlist);
        this.selectVid.emit(this.selectedVideos);
    }

    checkIfVideoAddedToPlaylist(video) {
        return video?.playlists?.find(p => this.playlist.id === p.id);
    }



}
