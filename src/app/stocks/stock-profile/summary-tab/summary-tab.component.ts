import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {StocksService} from '@core/services/stocks.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {LoaderService} from '@core/services/loader.service';
import {XAxisTicksComponent} from '@swimlane/ngx-charts';
import * as moment from 'moment';

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

    axisFormatting(tick) {
        const xAxisComponent = this as any;
        const ticks = xAxisComponent.ticks;
        const tickPresent = ticks.find((t, i) => t === tick && moment(t, 'HH:mm:ss').minute() % 30 === 0);
        return tickPresent ? moment(tickPresent, 'HH:mm:ss').format('HH:mm A') : '';
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
