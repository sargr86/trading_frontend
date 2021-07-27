import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {WalletService} from '@core/services/wallet.service';
import {SubjectService} from '@core/services/subject.service';
import {Card} from '@shared/models/card';
import {CardsService} from '@core/services/cards.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {User} from '@shared/models/user';
import {CapitalizeAddSpacesPipe} from '@shared/pipes/capitalize-add-spaces.pipe';

@Component({
    selector: 'app-payments-received-history-tab',
    templateUrl: './payments-received-history-tab.component.html',
    styleUrls: ['./payments-received-history-tab.component.scss']
})
export class PaymentsReceivedHistoryTabComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];
    accountTransfers = [];
    filteredTransfers = [];
    tableData;
    displayedColumns = ['date', 'channel', 'type', 'amount'];

    @Input() authUser: User;
    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private walletService: WalletService,
        private subject: SubjectService,
        private cardsService: CardsService,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        private removeUndCapitalize: CapitalizeAddSpacesPipe
    ) {
    }

    ngOnInit(): void {
        this.getTransfersHistory({});
    }

    getTransfersHistory(filters) {
        const stripeAccountId = this.userCards?.[0].stripe_account_id;
        const params = this.getExactParams.transform({stripe_account_id: stripeAccountId, ...filters});
        this.subscriptions.push(this.walletService.getReceivedPaymentsHistory(params).subscribe(dt => {
            this.accountTransfers = dt;
            this.filteredTransfers = dt;
            this.tableData = new MatTableDataSource(dt);
            this.tableData.paginator = this.paginator;
        }));
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
            case 'channel':
                content = this.removeUndCapitalize.transform(element.metadata?.channel);
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

    getFilters(e) {
        this.getTransfersHistory(e);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
