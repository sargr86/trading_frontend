import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {StocksService} from '@core/services/stocks.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {LoaderService} from '@core/services/loader.service';

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
    displayedColumns: string[] = ['symbol', 'name', 'price', 'change', 'changesPercentage', 'marketCap', 'open', 'volume'];
    tableData;

    @Input('selectedStock') selectedStock;

    constructor(
        private stocksService: StocksService,
        public loader: LoaderService
    ) {
    }


    ngOnInit(): void {
        this.getStockInfo();
    }

    normalizeColName(col): string {
        return normalizeColName(col);
    }

    getStockInfo() {
        this.loader.dataLoading = true;
        this.stocksService.getStockChartData({stock: this.selectedStock}).subscribe(dt => {
            this.chartData = dt.chart;
            this.tableData = new MatTableDataSource(dt.table);
            this.loader.dataLoading = false;
        });
    }

}
