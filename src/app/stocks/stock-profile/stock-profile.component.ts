import {Component, OnInit} from '@angular/core';
import {StocksService} from '@core/services/stocks.service';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-stock-profile',
    templateUrl: './stock-profile.component.html',
    styleUrls: ['./stock-profile.component.scss']
})
export class StockProfileComponent implements OnInit {
    activeTab = 'summary';
    indices;
    selectedStock;
    stockInfo;


    constructor(
        private stocksService: StocksService,
        public router: Router,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.stocksService.getIndices({}).subscribe(dt => {
            this.indices = dt;
        });

        this.selectedStock = this.route.snapshot?.params?.symbol;
    }


    changeTab(tab) {
        this.activeTab = tab;
    }

}
