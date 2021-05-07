import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL, STOCK_CATEGORIES} from '@core/constants/global';
import {Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {User} from '@shared/models/user';
import {updateStockDetails} from '@core/helpers/update-stock-details';
import {LoaderService} from '@core/services/loader.service';
import {PageEvent} from '@angular/material/paginator';
import {filter, switchMap, take} from 'rxjs/operators';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    search: string | null;
    subscriptions: Subscription[] = [];
    showFilters = false;
    userStocks = [];
    stocks = [];
    filteredStocks = [];

    public pageSize = 12;
    public pageIndex = 0;

    stockTypes;
    selectedStockType;
    stocksLoading = 'idle';

    authUser: User;

    @Input('channelUser') channelUser;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private cdr: ChangeDetectorRef,
        private loader: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.search = localStorage.getItem('search');
        this.stocksLoading = 'loading';
        this.subject.currentUserStocks
            .pipe(
                filter(d => !d.initial),
            )
            .subscribe(dt => {
                this.userStocks = dt.stocks;
                this.filterStocks();
                if (this.filteredStocks.length > 0) {
                    this.loadGraphs(this.filteredStocks);
                }
                this.stocksLoading = 'finished';
            });
    }


    loadGraphs(d) {
        let stocks = '';
        d.map((us, index) => {
            stocks += us.symbol + (index === d.length - 1 ? '' : ',');
        });

        this.subscriptions.push(this.stocksService.getStockGraphsDataByType({stocks}).subscribe(dt => {
            this.filteredStocks = this.filteredStocks.map((item, i) => Object.assign({}, item, dt[i]));
            this.loader.hide();
            this.cdr.detectChanges();
        }));
    }

    getSearchResults(s) {
        this.search = s;
        if (s.search) {
            this.filteredStocks = this.userStocks.filter(us => us.name.toLowerCase().includes(s.search));
        } else {
            this.filterStocks();
        }
    }

    updateStocksList(stocks) {
        this.stocksLoading = 'loading';
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            ...{stocks}
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.filterStocks();
            if (this.filteredStocks.length === 0) {
                this.pageIndex = 0;
            }
            this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            this.stocksLoading = 'finished';
            this.cdr.detectChanges();
        }));
    }


    updateStockDetails(userStocks) {
        return updateStockDetails(userStocks, this.stocks);
    }

    // Filters routes for floating panel
    filterStocks() {
        this.filteredStocks = this.userStocks.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }

    // Handles floating panel routes pagination
    handle(e?: PageEvent) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterStocks();
        this.loadGraphs(this.filteredStocks);
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
