import {Component, Input, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';
import {ActivatedRoute, ActivationEnd, Data, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {filter, map, tap} from 'rxjs/operators';
import {checkIfObjectEmpty} from '@core/helpers/check-if-object-empty';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit {
    items = {videos: [], playlists: []};
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    authUser;
    showTrending = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe
    ) {
        router.events.pipe(
            filter(e => e instanceof ActivationEnd),
        ).subscribe((d: Data) => {
            this.search = !checkIfObjectEmpty(d.snapshot.queryParams);
            if (this.search) {
                this.searchChannelsVideos(d.snapshot.queryParams);
            }
        });
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.showTrending = this.router.url.includes('trending');
        this.videoService.get({
            withPlaylists: !this.showTrending ? 1 : 0,
            trending: this.showTrending ? 1 : 0
        }).subscribe(dt => {
            this.items = dt;
        });


    }

    searchChannelsVideos(d) {
        this.channelsService.searchWithVideos(d).subscribe(dt => {
            this.channelsVideos = dt;
        });
    }


    getUploadDateTime(datetime) {
        return moment(datetime).format('MMM DD, YYYY');
    }

    openVideoPage(video, username) {
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username};
        } else {
            route = 'videos/play';
            params = {id: video.id};
        }


        this.router.navigate([route], {queryParams: params});
    }

    openChannelPage(channel, username) {
        this.router.navigate(['channels/show'], {queryParams: {username}});
    }


    openPlaylistPage(playlist, firstVideoId) {
        const route = 'videos/play';
        const params = {id: firstVideoId, playlist_id: playlist.id};
        this.router.navigate([route], {queryParams: params});
    }
}
