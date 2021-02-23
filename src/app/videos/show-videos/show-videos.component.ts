import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import * as moment from 'moment';
import {ActivatedRoute, ActivationEnd, Data, Router} from '@angular/router';
import {SubjectService} from '@core/services/subject.service';
import {ChannelsService} from '@core/services/channels.service';
import {filter, map, tap} from 'rxjs/operators';
import {checkIfObjectEmpty} from '@core/helpers/check-if-object-empty';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {Subscription} from 'rxjs';
import {buildPlayVideoRoute} from '@core/helpers/build-play-video-route';

@Component({
    selector: 'app-show-videos',
    templateUrl: './show-videos.component.html',
    styleUrls: ['./show-videos.component.scss']
})
export class ShowVideosComponent implements OnInit, OnDestroy {
    items = {videos: [], playlists: []};
    channelsVideos = [];
    apiUrl = API_URL;
    search;
    selectedTag;
    authUser;
    showTrending = false;
    subscribedToChannel = false;
    showFilters = false;
    filters = {};
    filterStatus = 'idle';
    subscriptions: Subscription[] = [];
    loadingVideos = false;

    constructor(
        private videoService: VideoService,
        public router: Router,
        private subject: SubjectService,
        private channelsService: ChannelsService,
        private route: ActivatedRoute,
        private getAuthUser: GetAuthUserPipe,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
        this.authUser = this.getAuthUser.transform();
        this.subscriptions.push(
            router.events.pipe(
                filter(e => e instanceof ActivationEnd),
            ).subscribe((d: Data) => {
                this.search = d.snapshot.queryParams?.search;
                this.selectedTag = d.snapshot.queryParams?.tag;
                if (this.search) {
                    this.searchChannelsVideos({search: this.search, filters: this.filters});
                } else {
                    this.getVideosList({search: this.search, filters: this.filters, tag: this.selectedTag});
                }
            }));
    }

    ngOnInit(): void {
        this.showTrending = this.router.url.includes('trending');
        // this.getVideosList({search: this.search, filters: this.filters});
    }

    getFilteredList(filters = {}) {
        this.filters = filters;
        this.filterStatus = 'applied';
        if (this.search) {
            this.searchChannelsVideos({search: this.search, filters: this.filters});
        } else {
            this.getVideosList({filters: this.filters});
        }
    }

    getVideosList(params) {
        params = this.getExactParams.transform(params);

        this.videoService.get({
            withPlaylists: !this.showTrending ? 1 : 0,
            trending: this.showTrending ? 1 : 0,
            ...params
        }).subscribe(dt => {
            this.items = dt;
        });
    }

    searchChannelsVideos(params) {

        params = this.getExactParams.transform(params);
        this.loadingVideos = true;

        this.channelsService.searchWithVideos({user_id: this.authUser?.id, ...params}).subscribe(dt => {
            this.loadingVideos = false;
            this.channelsVideos = dt;
            console.log(this.channelsVideos)
        });
    }

    checkIfSubscribed(channel) {
        return channel.subscribers.find(s => s.id === this.authUser?.id) || this.subscribedToChannel;
    }

    isFiltersShown() {
        return this.items.videos?.length > 0 || (this.search && this.channelsVideos.find(v => v.videos.length > 0)) || this.filterStatus === 'applied' && !this.loadingVideos;
    }

    async openVideoPage(video, username) {
        const r = buildPlayVideoRoute(video, username);
        await this.router.navigate([r.route], {queryParams: r.params});
    }

    async openChannelPage(channel, username) {
        await this.router.navigate(['channels/show'], {queryParams: {username}});
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
        return video.users_vids.find(v => v.username === this.authUser?.username && v.users_videos.saved);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
