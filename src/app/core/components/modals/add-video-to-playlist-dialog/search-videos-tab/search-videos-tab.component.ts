import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-search-videos-tab',
    templateUrl: './search-videos-tab.component.html',
    styleUrls: ['./search-videos-tab.component.scss']
})
export class SearchVideosTabComponent implements OnInit {
    searchedVideos = [];
    selectedVideos = [];

    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(private videoService: VideoService) {
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

    selectVideo(id) {
        if (this.selectedVideos.includes(id)) {
            this.selectedVideos = this.selectedVideos.filter(v => v !== id);
        } else {
            this.selectedVideos.push(id);
        }
        this.selectVid.emit(this.selectedVideos);
    }

}
