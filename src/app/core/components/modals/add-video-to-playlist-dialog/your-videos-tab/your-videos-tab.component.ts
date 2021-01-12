import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {GetSelectedVideosToBeAddedToPlaylistPipe} from '@shared/pipes/get-selected-videos-to-be-added-to-playlist.pipe';

@Component({
    selector: 'app-your-videos-tab',
    templateUrl: './your-videos-tab.component.html',
    styleUrls: ['./your-videos-tab.component.scss']
})
export class YourVideosTabComponent implements OnInit {
    apiUrl = API_URL;
    selectedVideos = [];

    @Input('currentUser') currentUser;
    @Input('authUser') authUser;
    @Input('playlist') playlist;

    @Output('selectVideo') selectVid = new EventEmitter();

    constructor(
        private videoService: VideoService,
        private getSelectedVideos: GetSelectedVideosToBeAddedToPlaylistPipe
    ) {
    }

    ngOnInit(): void {
        this.videoService.getUserVideos({user_id: this.authUser.id}).subscribe(dt => {
            this.currentUser = dt;
        });

    }

    ifVideoSelected(id) {
        return this.selectedVideos.find(v => v === id);
    }

    selectVideo(video) {
        this.selectedVideos = this.getSelectedVideos.transform(video, this.selectedVideos, this.playlist);
        this.selectVid.emit(this.selectedVideos);
    }

}
