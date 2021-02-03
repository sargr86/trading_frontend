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
    subscribedToChannel = false;
    showFilters = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe,
    ) {
        this.authUser = this.getAuthUser.transform();
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
        this.showTrending = this.router.url.includes('trending');
        this.getVideosList();
    }

    getVideosList(filters = {}) {
        this.videoService.get({
            withPlaylists: !this.showTrending ? 1 : 0,
            trending: this.showTrending ? 1 : 0,
            filters: JSON.stringify(filters)
        }).subscribe(dt => {
            this.items = dt;
        });
    }

    searchChannelsVideos(d) {
        this.channelsService.searchWithVideos({user_id: this.authUser.id, ...d}).subscribe(dt => {
            this.channelsVideos = dt;
        });
    }

    checkIfSubscribed(channel) {
        return channel.subscribers.find(s => s.id === this.authUser.id) || this.subscribedToChannel;
    }


    getUploadDateTime(datetime) {
        return moment(datetime).fromNow();
    }

    openVideoPage(video, username) {
        let route;
        let params;
        if (video.status === 'live') {
            route = 'user/video/watch';
            params = {session: video.session_name, publisher: username, id: video.id};
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

    subscribeToChannel(channel) {
        this.channelsService.subscribeToChannel({user_id: this.authUser.id, channel_id: channel.id}).subscribe(dt => {
            this.subscribedToChannel = dt.status === 'Subscribed';
            this.channelsService.getUserChannelSubscriptions({user_id: this.authUser.id}).subscribe(d => {
                this.subject.setUserSubscriptions(d);
            });
        });
    }

    checkIfSavedByCurrentUser(video) {
        return video.users_vids.find(v => v.username === this.authUser.username && v.users_videos.saved);
    }
}
