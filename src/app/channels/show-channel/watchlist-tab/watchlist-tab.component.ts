import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {User} from '@shared/models/user';
import {updateStockDetails} from '@core/helpers/update-stock-details';
import {LoaderService} from '@core/services/loader.service';
import {PageEvent} from '@angular/material/paginator';
import {filter} from 'rxjs/operators';
import {Stock} from '@shared/models/stock';

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
    userStocks: Stock[] = [];
    filteredStocks: Stock[] = [];

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
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.search = localStorage.getItem('search');
        this.stocksLoading = 'loading';
        this.subject.currentUserStocks.pipe(filter(d => !d.initial))
            .subscribe(dt => {
                this.userStocks = dt.stocks;
                this.filteredStocks = this.userStocks;
                this.stocksLoading = 'finished';
            });
    }

    getSearchResults(s) {
        this.search = s;
        if (s.search) {
            this.filteredStocks = this.userStocks.filter(us => us.name.toLowerCase().includes(s.search));
        }
    }

    saveUpdatedStocksList(stocks) {
        this.stocksLoading = 'loading';
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            ...{stocks}
        }).subscribe(dt => {
            this.userStocks = dt?.user_stocks || [];
            this.subject.changeUserStocks({stocks: this.userStocks, empty: this.userStocks.length === 0});
            this.stocksLoading = 'finished';
            this.cdr.detectChanges();
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
