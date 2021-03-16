import {Component, OnInit} from '@angular/core';
import {StocksService} from '@core/services/stocks.service';

@Component({
    selector: 'app-stock-profile',
    templateUrl: './stock-profile.component.html',
    styleUrls: ['./stock-profile.component.scss']
})
export class StockProfileComponent implements OnInit {
    activeTab = 'summary';
    indices;

    constructor(
        private stocksService: StocksService
    ) {
    }

    ngOnInit(): void {
        this.stocksService.getIndices({}).subscribe(dt => {
            this.indices = dt;
        });
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

}
