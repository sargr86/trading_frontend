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

    multi = [
        {
            name: 'USA',
            series: [
                {
                    name: '1990',
                    value: 250000000
                },
                {
                    name: '2009',
                    value: 109000000
                },
                {
                    name: '2010',
                    value: 309000000
                },
                {
                    name: '2011',
                    value: 311000000
                }
            ]
        }
    ];
    view: any[] = [300, 150];

    // options
    legend: boolean = false;
    showLabels: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    showYAxisLabel: boolean = false;
    showXAxisLabel: boolean = false;
    xAxisLabel: string = 'Year';
    yAxisLabel: string = 'Population';
    timeline: boolean = true;
    referenceLines = [
        {
            name: '2009',
            value: 209000000
        }
    ];

    colorScheme = {
        domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    };


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
