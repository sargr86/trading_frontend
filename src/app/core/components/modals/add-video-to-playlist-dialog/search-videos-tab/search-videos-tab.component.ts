import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';
import {Router} from '@angular/router';

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

    constructor(
        private videoService: VideoService,
        public getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe,
        public router: Router
    ) {
    }

    ngOnInit(): void {
    }

    searchVideos(e) {
        console.log('searched')
        this.searched = true;
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

    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

}
