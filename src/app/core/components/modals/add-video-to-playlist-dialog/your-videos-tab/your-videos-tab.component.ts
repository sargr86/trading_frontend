import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';

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

    @Output('selectVideo') selectVid = new EventEmitter();

    // @Input('selectedVideos')

    constructor(
        private videoService: VideoService
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

    selectVideo(id) {
        if (this.selectedVideos.includes(id)) {
            this.selectedVideos = this.selectedVideos.filter(v => v !== id);
        } else {
            this.selectedVideos.push(id);
        }
        console.log(this.selectedVideos)
        this.selectVid.emit(this.selectedVideos);
    }

}
