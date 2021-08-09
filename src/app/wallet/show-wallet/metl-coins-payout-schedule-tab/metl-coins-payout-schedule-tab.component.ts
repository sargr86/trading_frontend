import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Card} from '@shared/models/card';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {PaymentsService} from '@core/services/wallet/payments.service';

@Component({
    selector: 'app-metl-coins-payout-schedule-tab',
    templateUrl: './metl-coins-payout-schedule-tab.component.html',
    styleUrls: ['./metl-coins-payout-schedule-tab.component.scss']
})
export class MetlCoinsPayoutScheduleTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    accountPayouts = [];
    filteredPayouts = [];
    tableData;
    displayedColumns = ['date', 'payout_for', 'description', 'type', 'amount'];

    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private paymentsService: PaymentsService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe
    ) {
    }

    ngOnInit(): void {
        this.getPayoutsHistory({});
    }

    getPayoutsHistory(filters) {
        const params = {...filters};
        const stripeAccountId = this.userCards?.[0].stripe_account_id;
        if (stripeAccountId) {
            params.stripe_account_id = stripeAccountId;
        }

        this.subscriptions.push(this.paymentsService.getPayoutsHistory(params).subscribe(dt => {
            this.accountPayouts = dt;
            this.filteredPayouts = dt;
            this.tableData = new MatTableDataSource(this.filteredPayouts);
            this.tableData.paginator = this.paginator;
        }));
    }

    getFilters(e) {
        this.getPayoutsHistory(e);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
