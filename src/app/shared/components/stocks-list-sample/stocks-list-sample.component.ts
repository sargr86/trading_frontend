import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Router} from '@angular/router';

@Component({
    selector: 'app-stocks-list-sample',
    templateUrl: './stocks-list-sample.component.html',
    styleUrls: ['./stocks-list-sample.component.scss']
})
export class StocksListSampleComponent implements OnInit {
    @Input('stocks') passedStocks = [];
    @Input('userStocks') userStocks = [];
    @Input('follow') follow = true;
    stocksLoading = 'idle';
    authUser;
    userStocksOnly = this.passedStocks === this.userStocks;

    @Output('followedStock') followedStock = new EventEmitter();

    constructor(
        private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
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

        this.followedStock.emit(this.userStocks);

    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    openStockProfile(stock) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

}
