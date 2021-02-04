import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, PROFILE_PAGE_TABS} from '@core/constants/global';
import {User} from '@shared/models/user';
import {VideoService} from '@core/services/video.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';
import {Base64ToFilePipe} from '@shared/pipes/base64-to-file.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ChannelsService} from '@core/services/channels.service';
import {SubjectService} from '@core/services/subject.service';
import {MatDialog} from '@angular/material/dialog';
import {AddPlaylistDialogComponent} from '@core/components/modals/add-playlist-dialog/add-playlist-dialog.component';
import {PlaylistsService} from '@core/services/playlists.service';
import {WatchlistTabComponent} from '@app/channels/show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from '@app/channels/show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from '@app/channels/show-channel/playlists-tab/playlists-tab.component';
import {search} from '@ctrl/ngx-emoji-mart/svgs';

@Component({
    selector: 'app-show-channel',
    templateUrl: './show-channel.component.html',
    styleUrls: ['./show-channel.component.scss']
})
export class ShowChannelComponent implements OnInit, OnDestroy {

    owlOptions: OwlOptions = OWL_OPTIONS;
    watchlistVideos = [];
    authUser;

    activeTab = PROFILE_PAGE_TABS[1];
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;


    channelUser;
    passedUsername;

    searchVideosForm: FormGroup;


    playlists = [];
    editMode = false;

    showFilters = false;

    @ViewChild(WatchlistTabComponent) watchListTab: WatchlistTabComponent;
    @ViewChild(VideosTabComponent) videosTab: VideosTabComponent;
    @ViewChild(PlaylistsTabComponent) playlistsTab: PlaylistsTabComponent;

    constructor(
        private videoService: VideoService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private usersService: UsersService,
        private base64ToFile: Base64ToFilePipe,
        private route: ActivatedRoute,
        private fb: FormBuilder,
        private subjectService: SubjectService,
        private channelService: ChannelsService,
        private playlistsService: PlaylistsService,
        private subject: SubjectService,
        private dialog: MatDialog
    ) {
        this.authUser = this.getAuthUser.transform();
        this.passedUsername = this.route.snapshot.queryParams.username;
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});

    }

    ngOnInit(): void {
        localStorage.setItem('search', '');
        if (this.passedUsername) {
            this.usersService.getUserInfo({username: this.passedUsername}).subscribe(dt => {
                if (dt) {
                    this.channelUser = dt;
                }
            });
        }


    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
        this.subject.setToggleFiltersData(this.showFilters);
    }


    changeActiveTab(tab) {
        this.activeTab = tab;
        this.searchVideos();
        this.showFilters = false;
        this.subject.setToggleFiltersData(this.showFilters);
    }

    searchVideos() {

        const s = this.searchVideosForm.value;
        localStorage.setItem('search', s.search);
        this.showFilters = false;
        this.subject.setToggleFiltersData(this.showFilters);
        if (this.activeTab.name === 'Watchlist') {
            console.log(s)
            this.searchInVideosByAuthor(s.search);
        } else if (this.activeTab.name === 'Videos') {
            this.searchInUserVideos(s.search);
        } else if (this.activeTab.name === 'Playlists') {
            this.searchInPlaylists(s);
        }

    }

    searchInVideosByAuthor(s) {
        if (this.watchListTab) {
            this.watchListTab.getSearchResults(s);
        }

    }

    searchInUserVideos(s) {
        if (this.videosTab) {
            this.videosTab.getSearchResults(s);
        }
    }

    searchInPlaylists(s) {
        if (this.playlistsTab && s) {
            this.playlistsTab.getSearchResults(s.search);
        }
    }

    ngOnDestroy() {
    }


}
