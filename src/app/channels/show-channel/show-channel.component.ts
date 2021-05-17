import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {PlaylistsService} from '@core/services/playlists.service';
import {WatchlistTabComponent} from '@app/channels/show-channel/watchlist-tab/watchlist-tab.component';
import {VideosTabComponent} from '@app/channels/show-channel/videos-tab/videos-tab.component';
import {PlaylistsTabComponent} from '@app/channels/show-channel/playlists-tab/playlists-tab.component';
import {AuthService} from '@core/services/auth.service';
import {StocksListsModalComponent} from '@shared/components/stocks-lists-modal/stocks-lists-modal.component';
import {LoaderService} from '@core/services/loader.service';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {StocksService} from '@core/services/stocks.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-show-channel',
    templateUrl: './show-channel.component.html',
    styleUrls: ['./show-channel.component.scss']
})
export class ShowChannelComponent implements OnInit, OnDestroy {

    authUser;

    activeTab;
    allTabs = PROFILE_PAGE_TABS;

    apiUrl = API_URL;


    channelUser;
    passedUsername;
    passedTab;

    searchVideosForm: FormGroup;


    playlists = [];
    editMode = false;

    showFilters = false;
    filters = null;

    dataLoading = 'idle';

    userStocks = [];
    filteredStocks = [];
    subscriptions = [];


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
        public auth: AuthService,
        private dialog: MatDialog,
        public loader: LoaderService,
        private updateStocks: UpdateUserStocksPipe,
        private stocksService: StocksService,
        private toastr: ToastrService
    ) {
        this.authUser = this.getAuthUser.transform();
        this.passedUsername = this.route.snapshot.queryParams.username;
        this.passedTab = this.route.snapshot.queryParams.tab;
        this.searchVideosForm = this.fb.group({search: ['', Validators.required]});

    }

    ngOnInit(): void {
        // localStorage.setItem('search', '');
        this.activeTab = PROFILE_PAGE_TABS.filter(tabs => tabs.name.toLowerCase() === this.passedTab)?.[0] || PROFILE_PAGE_TABS[0];
        this.getUserInfo();

        this.subject.currentUserStocks.subscribe((dt: any) => {
            this.userStocks = dt.stocks;
            this.filteredStocks = this.userStocks;
        });
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
        this.subject.setToggleFiltersData(this.showFilters);
    }

    getUserInfo() {
        this.dataLoading = 'loading';
        if (this.passedUsername) {
            this.usersService.getUserInfo({username: this.passedUsername}).subscribe(dt => {
                if (dt) {
                    this.channelUser = dt;
                }
                this.dataLoading = 'finished';
            });
        }
    }


    changeActiveTab(tab) {
        this.activeTab = tab;
        this.showFilters = false;
        this.subject.setToggleFiltersData(this.showFilters);
        if (this.activeTab.name === 'Videos') {
            this.getUserInfo();
        }
    }

    searchInUserStocks(e) {
        localStorage.setItem('searchStock', e.search);
        this.watchListTab.getSearchResults(e);
    }

    searchVideos(e?) {
        localStorage.setItem('search', e.search);
        this.showFilters = false;
        this.subject.setToggleFiltersData(this.showFilters);
        if (this.activeTab.name === 'Videos') {
            this.searchInUserVideos(e.search);
        } else if (this.activeTab.name === 'Playlists') {
            this.searchInPlaylists(e.search);
        }

    }

    searchInVideosByAuthor(s) {
        if (this.watchListTab) {
            // this.watchListTab.getSearchResults(s);
        }

    }

    searchInUserVideos(s) {
        if (this.videosTab) {
            this.videosTab.getSearchResults(s);
        }
    }

    searchInPlaylists(s) {
        if (this.playlistsTab) {
            this.playlistsTab.getSearchResults(s);
        }
    }


    async getVideosByTag(name) {
        await this.router.navigate(['videos'], {queryParams: {tag: name}});
    }

    openModal() {
        this.dialog.open(StocksListsModalComponent, {
            maxWidth: '100vw',
            maxHeight: '100vh',
            height: '100%',
            width: '100%',
            panelClass: 'stocks-lists-modal'
        }).afterClosed().subscribe(dt => {
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {
        const result = this.updateStocks.transform(this.userStocks, stock, this.isStockFollowed(stock));
        if (result) {
            this.loader.stocksLoading.status = 'loading';
            this.subscriptions.push(this.stocksService.updateFollowedStocks(
                {user_id: this.authUser.id, ...{stocks: result}})
                .subscribe(dt => {
                    this.userStocks = dt?.user_stocks || [];
                    this.loader.stocksLoading.status = 'finished';
                    this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
                }));
        }

    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
