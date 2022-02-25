import {Component, OnInit} from '@angular/core';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {StocksStoreService} from '@core/services/stores/stocks-store.service';

@Component({
    selector: 'app-watchlist-tab',
    templateUrl: './watchlist-tab.component.html',
    styleUrls: ['./watchlist-tab.component.scss']
})
export class WatchlistTabComponent implements OnInit {
    authUser: User;
    subscriptions: Subscription[] = [];

    constructor(
        private stocksStore: StocksStoreService
    ) {
    }

    ngOnInit(): void {
        this.trackUserStocks();
    }

    trackUserStocks() {
        this.subscriptions.push()
    }

}
