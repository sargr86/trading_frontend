import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';

@Component({
    selector: 'app-search-videos-tab',
    templateUrl: './search-videos-tab.component.html',
    styleUrls: ['./search-videos-tab.component.scss']
})
export class SearchVideosTabComponent implements OnInit {
    searchedVideos = [];
    selectedVideos = [];

    @Input('playlist') playlist;
    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe
    ) {
    }

    ngOnInit(): void {
    }

    searchVideos(e) {
        this.videoService.searchInAllVideos(e).subscribe(dt => {
            this.searchedVideos = dt;
        });
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        this.selectedVideos = this.getSelectedVideos.transform(video, this.selectedVideos, this.playlist);
        this.selectVid.emit(this.selectedVideos);
    }

}
