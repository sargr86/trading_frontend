import {Component, Input, OnInit} from '@angular/core';
import {API_URL} from '@core/constants/global';

@Component({
    selector: 'app-video-regular-player',
    templateUrl: './video-regular-player.component.html',
    styleUrls: ['./video-regular-player.component.scss']
})
export class VideoRegularPlayerComponent implements OnInit {

    @Input() videoData;
    videoUrl;

    constructor() {
    }

    ngOnInit(): void {
        const video = document.getElementsByTagName('video')[0];
        this.videoUrl = API_URL + 'uploads/videos/' + this.videoData.filename;
        video.setAttribute('src', this.videoUrl);
    }

}
