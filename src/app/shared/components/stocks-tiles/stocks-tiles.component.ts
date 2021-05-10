import {Component, Input, OnInit} from '@angular/core';
import {Stock} from '@shared/models/stock';
import {SubjectService} from '@core/services/subject.service';
import {STOCK_TILE_CHART_SETTINGS} from '@core/constants/charts';

@Component({
    selector: 'app-stocks-tiles',
    templateUrl: './stocks-tiles.component.html',
    styleUrls: ['./stocks-tiles.component.scss']
})
export class StocksTilesComponent implements OnInit {

    @Input('stocks') passedStocks: Stock[] = [];

    userStocks = [];
    stockChartSettings = STOCK_TILE_CHART_SETTINGS;

    constructor(
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.subject.currentUserStocks.subscribe((dt: any) => {
            this.userStocks = dt.stocks;
        });
    }

    isStockFollowed(stock) {
        return !!this.userStocks.find(s => s.name === stock.name);
    }

    updateFollowedStocksList(stock) {

    }

}
