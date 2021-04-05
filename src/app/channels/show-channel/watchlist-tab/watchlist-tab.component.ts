import {Component, Input, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {VideoService} from '@core/services/video.service';
import {OwlOptions} from 'ngx-owl-carousel-o';
import {API_URL, OWL_OPTIONS, STOCK_CATEGORIES} from '@core/constants/global';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {StocksService} from '@core/services/stocks.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    apiUrl = API_URL;
    search;
    subscriptions: Subscription[] = [];
    showFilters = false;
    userStocks = [];
    stocks = [];
    filteredStocks = [];

    public pageSize = 14;
    public pageIndex = 0;

    stockTypes = STOCK_CATEGORIES;
    selectedStockType = STOCK_CATEGORIES[0].value;
    stocksLoading = 'idle';

    authUser;

    constructor(
        private videoService: VideoService,
        private subjectService: SubjectService,
        public router: Router,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private stocksService: StocksService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.search = localStorage.getItem('search');
        this.getStocksByType('stocks');
        this.getUserStocks();

        this.subject.getUserStocksData().subscribe(dt => {
            this.userStocks = dt;
        });
    }

    getStocksByType(type) {
        this.stocksLoading = 'loading';
        this.stocksService.getStocksByType({type}).subscribe(dt => {
            this.stocks = dt;
            this.stocksLoading = 'finished';
            this.filterStocks();
        });
    }

    // Filters routes for floating panel
    filterStocks() {
        this.filteredStocks = this.stocks.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }

    // Handles floating panel routes pagination
    handle(e) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterStocks();
    }

    followStock(stock) {

        const following = this.userStocks.find(f => f.name === stock.name);

        if (!following) {
            this.userStocks.push({
                name: stock.name,
                symbol: stock.symbol,
                change: stock.change,
                changesPercentage: stock.changesPercentage,
                price: stock.price,
            });
        } else {
            this.userStocks = this.userStocks.filter(f => f.name !== stock.name);
        }

        this.stocksService.updateFollowedStocks({user_id: this.authUser.id, stocks: this.userStocks}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    compareWithMainStockList(userStocks) {
        userStocks.map(st => {
            const found = this.stocks.find(fs => fs.name === st.name);
            if (found) {
                st.change = found.change;
                st.changesPercentage = found.changesPercentage;
                st.price = found.price;
                return st;
            }
        });
        return userStocks;
    }

    getUserStocks() {
        this.stocksService.getUserStocks({user_id: this.authUser.id}).subscribe(dt => {
            this.userStocks = dt.user_stocks;
        });
    }


    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
