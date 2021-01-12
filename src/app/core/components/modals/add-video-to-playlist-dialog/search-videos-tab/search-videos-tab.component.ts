import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';

@Component({
    selector: 'app-search-videos-tab',
    templateUrl: './search-videos-tab.component.html',
    styleUrls: ['./search-videos-tab.component.scss']
})
export class SearchVideosTabComponent implements OnInit {
    searchedVideos = [];
    selectedVideos = [];
    searched = false;

    @Input('playlist') playlist;
    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(private videoService: VideoService) {
    }

    ngOnInit(): void {
    }

    searchVideos(e) {
        this.searched = true;
        this.videoService.searchInAllVideos(e).subscribe(dt => {
            this.searchedVideos = dt;
        });
    }

    checkIfVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        const id = video.id;
        if (this.selectedVideos.includes(id)) {
            this.selectedVideos = this.selectedVideos.filter(v => v !== id);
        } else if (!this.checkIfVideoAddedToPlaylist(video)) {
            this.selectedVideos.push(id);
        }
        console.log(this.selectedVideos)
        this.selectVid.emit(this.selectedVideos);
    }

    checkIfVideoAddedToPlaylist(video) {
        return video?.playlists?.find(p => this.playlist.id === p.id);
    }

}
