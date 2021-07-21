import {Component, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {PurchasesService} from '@core/services/purchases.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-metl-coins-payout-schedule-tab',
    templateUrl: './metl-coins-payout-schedule-tab.component.html',
    styleUrls: ['./metl-coins-payout-schedule-tab.component.scss']
})
export class MetlCoinsPayoutScheduleTabComponent implements OnInit {
    subscriptions: Subscription[] = [];
    accountPayouts = [];
    filteredPayouts = [];
    tableData;
    displayedColumns = ['date', 'payout_for', 'type', 'amount'];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private purchasesService: PurchasesService,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
    ) {
        this.getPayoutsHistory({});
    }

    ngOnInit(): void {
    }

    getPayoutsHistory(filters) {
        this.purchasesService.getPayoutsHistory(filters).subscribe(dt => {
            this.accountPayouts = dt.data;
            this.filteredPayouts = dt.data;
            this.tableData = new MatTableDataSource(this.filteredPayouts);
            this.tableData.paginator = this.paginator;
        });
    }

    getFilters(e) {
        this.getPayoutsHistory(e);
    }

    normalizeColName(col): string {
        return normalizeColName(col);
    }

    getColumnContentByItsName(col, element) {
        let content;

        switch (col) {
            case 'date':
                content = this.datePipe.transform(element.created * 1000);
                break;
            case 'amount':
                content = this.currencyPipe.transform(element.amount / 100, element.currency.toUpperCase());
                break;
            case 'payout_for':
                content = element.metadata?.channel;
                break;
            case 'type':
                content = element.description;
                break;
            default:
                content = element[col];
                break;
        }
        return content;
    }

}
