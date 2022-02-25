import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {StocksStoreService} from '@core/services/stores/stocks-store.service';
import {filter} from 'rxjs/operators';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit, OnDestroy {
    authUser: User;
    subscriptions: Subscription[] = [];

    userStocks = [];
    filteredStocks = [];
    stocksLoading = false;

    constructor(
        private stocksStore: StocksStoreService
    ) {
    }

    ngOnInit(): void {
        this.trackUserStocks();
    }

    trackUserStocks() {
        this.stocksLoading = true;
        this.subscriptions.push(
            this.stocksStore.userStocks$
                .pipe(filter(d => !d.initial))
                .subscribe(dt => {
                    this.userStocks = dt.stocks;
                    this.filteredStocks = this.userStocks;
                    this.stocksLoading = false;
                }));
    }

    saveUpdatedStocksList(stocks) {

    }

    updateStocksPriority(stocks) {

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
