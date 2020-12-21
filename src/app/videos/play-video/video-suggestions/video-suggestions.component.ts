import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-video-suggestions',
    templateUrl: './video-suggestions.component.html',
    styleUrls: ['./video-suggestions.component.scss']
})
export class VideoSuggestionsComponent implements OnInit {

    urlParams;
    videoId;
    playlistId;

    playlistOpened = false;

    constructor(
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.urlParams = this.route.snapshot.queryParams
        this.videoId = this.urlParams?.id;
        this.playlistId = this.urlParams?.playlist_id;
        this.playlistOpened = !!this.playlistId;
        console.log(!!this.playlistId)
    }

}
