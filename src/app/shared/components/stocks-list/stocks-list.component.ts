import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {getFirstNItems} from '@core/helpers/get-first-n-items';
import {moveItemInArray} from '@core/helpers/move-item-in-array';
import {User} from '@shared/models/user';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {STOCK_ITEM_CHART_SETTINGS} from '@core/constants/charts';

@Component({
    selector: 'app-stocks-list',
    templateUrl: './stocks-list.component.html',
    styleUrls: ['./stocks-list.component.scss']
})
export class StocksListComponent implements OnInit {
    @Input('stocks') passedStocks = [];
    authUser: User;
    selectedSortType;

    stockChartSettings = STOCK_ITEM_CHART_SETTINGS;


    @Output('updatedStocksPriority') updatedStocksPriority = new EventEmitter();

    constructor(
        public router: Router,
        private getAuthUser: GetAuthUserPipe,
    ) {

    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    onlyFirst10Stocks(stocks) {
        return getFirstNItems(stocks, 10);
    }

    getPercentageDetails(stock) {
        const value = +stock.changesPercentage; // .replace(/[(%)]/g, '')
        return {
            ...{value},
            color: (+value > 0 ? 'green' : 'red'),
            class: 'stock-' + (+value > 0 ? 'green' : 'red')
        };
    }

    getColorScheme(stock) {
        return {
            domain: (stock.changesPercentage > 0 ? ['#18B587'] : ['#F53C6F'])
        };
    }

    openStockProfile(stock) {
        this.router.navigateByUrl('/test', {skipLocationChange: true}).then(async () =>
            await this.router.navigate([`stocks/${stock}/analytics`])
        );
    }

    dragDropped(e) {
        this.passedStocks = moveItemInArray(this.passedStocks, e.previousIndex, e.currentIndex);
        this.updatedStocksPriority.emit(this.passedStocks);
    }

}
