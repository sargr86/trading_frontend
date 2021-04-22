import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {StocksService} from '@core/services/stocks.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {LoaderService} from '@core/services/loader.service';
import {XAxisTicksComponent} from '@swimlane/ngx-charts';
import * as moment from 'moment';
import {SubjectService} from '@core/services/subject.service';
import {UpdateUserStocksPipe} from '@shared/pipes/update-user-stocks.pipe';
import {Subscription} from 'rxjs';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-summary-tab',
    templateUrl: './summary-tab.component.html',
    styleUrls: ['./summary-tab.component.scss']
})
export class SummaryTabComponent implements OnInit {

    // Chart settings
    chartData: any[];
    colorScheme = {
        domain: ['#18B587', '#F53C6F']
    };


    // Table settings
    displayedColumns: string[] = ['symbol', 'name', 'price', 'change', 'changesPercentage', 'marketCap', 'open', 'volume', 'action'];
    tableData;

    userStocks = [];

    addedToWatchlist = false;
    subscriptions: Subscription[] = [];

    authUser;
    stocksUpdatedHere = false;

    @Input('selectedStock') selectedStock;

    constructor(
        private stocksService: StocksService,
        public loader: LoaderService,
        private subject: SubjectService,
        private updateStocks: UpdateUserStocksPipe,
        private getAuthUser: GetAuthUserPipe
    ) {
    }


    ngOnInit(): void {
        this.getUserStocks();
        this.getStockInfo();
        this.authUser = this.getAuthUser.transform();
    }

    getUserStocks() {
        this.subject.currentUserStocks.subscribe(dt => {
            this.userStocks = dt;
            this.addedToWatchlist = !!this.userStocks.find(us => us.symbol === this.selectedStock);
        });
    }

    getStockInfo() {
        this.loader.dataLoading = true;
        this.stocksService.getStockChartData({stock: this.selectedStock}).subscribe(dt => {
            this.chartData = dt.chart;
            this.tableData = new MatTableDataSource(dt.table);
            this.loader.dataLoading = false;
        });
    }

    axisFormatting(tick) {
        const xAxisComponent = this as any;
        const ticks = xAxisComponent.ticks;
        const tickPresent = ticks.find((t, i) => t === tick && moment(t, 'HH:mm:ss').minute() % 30 === 0);
        return tickPresent ? moment(tickPresent, 'HH:mm:ss').format('HH:mm A') : '';
    }

    normalizeColName(col): string {
        return normalizeColName(col);
    }


    updateUserStocks(stock) {
        const {userStocks, following} = this.updateStocks.transform(this.userStocks, stock, stock.type_id);
        this.addedToWatchlist = following;
        this.subscriptions.push(this.stocksService.updateFollowedStocks({
            user_id: this.authUser.id,
            stocks: userStocks
        }).subscribe(dt => {
            this.userStocks = dt.user_stocks;
            this.stocksUpdatedHere = true;
            this.subject.changeUserStocks(this.userStocks);
        }));
    }

}
