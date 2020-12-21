import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PlaylistsService} from '@core/services/playlists.service';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-video-suggestions',
    templateUrl: './video-suggestions.component.html',
    styleUrls: ['./video-suggestions.component.scss']
})
export class VideoSuggestionsComponent implements OnInit {

    urlParams;
    videoId;
    playlistId;
    playlistData;

    playlistOpened = false;
    videoSuggestions = [];

    apiUrl = API_URL;
    authUser;

    constructor(
        private route: ActivatedRoute,
        private playlistsService: PlaylistsService,
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.urlParams = this.route.snapshot.queryParams;
        this.videoId = this.urlParams?.id;
        this.playlistId = this.urlParams?.playlist_id;
        this.playlistOpened = !!this.playlistId;
        if (this.playlistOpened) {
            this.playlistsService.getById({playlist_id: this.playlistId}).subscribe(dt => {
                this.playlistData = dt;
            });
        }

        this.videoService.get({limit: 5}).subscribe(dt => {
            this.videoSuggestions = dt;
        });

        console.log(!!this.playlistId)
    }

}
