import {ChangeDetectorRef, Component, Input, OnDestroy, OnInit} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {API_URL, STOCK_CATEGORIES} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {User} from '@shared/models/user';
import {updateStockDetails} from '@core/helpers/update-stock-details';
import {LoaderService} from '@core/services/loader.service';

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

    public pageSize = 14;
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

        this.subject.currentUserStocks.subscribe((dt: any) => {
            this.getBatchStocksList(dt);
        });
    }


    getBatchStocksList(d) {
        let stocks = '';
        this.userStocks = d.stocks;
        if (!d.empty) {
            this.userStocks.map((us, index) => {
                stocks += us.symbol + (index === this.userStocks.length - 1 ? '' : ',');
            });
            this.stocksLoading = 'loading';
            this.subscriptions.push(this.stocksService.getBatchStocksList({stocks}).subscribe(dt => {
                this.stocks = dt;
                this.stocksLoading = 'finished';
                this.loader.hide();
                this.cdr.detectChanges();
            }));
        }
    }

    updateStocksList(stocks) {
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


    updateStockDetails(userStocks) {
        return updateStockDetails(userStocks, this.stocks);
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
