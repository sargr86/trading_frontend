import {Component, OnInit, ViewChild} from '@angular/core';
import {WalletService} from '@core/services/wallet.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {Card} from '@shared/models/card';
import {CardsService} from '@core/services/cards.service';
import {Subscription} from 'rxjs';
import {MatPaginator} from '@angular/material/paginator';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';

@Component({
    selector: 'app-payments-received-history-tab',
    templateUrl: './payments-received-history-tab.component.html',
    styleUrls: ['./payments-received-history-tab.component.scss']
})
export class PaymentsReceivedHistoryTabComponent implements OnInit {
    authUser;
    userCards: Card[] = [];
    subscriptions: Subscription[] = [];
    accountTransfers = [];
    tableData;
    displayedColumns = ['date', 'channel', 'type', 'amount'];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private walletService: WalletService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private cardsService: CardsService,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();


        // this.subject.currentUserCards.subscribe(dt => {
        //     this.userCards = dt;
        // });

        this.subscriptions.push(this.cardsService.getUserCards({user_id: this.authUser.id}).subscribe(dt => {
            this.userCards = dt;
            this.getTransfersHistory({});
        }));

    }

    getTransfersHistory(filters) {
        console.log(this.userCards)
        const stripeAccountId = this.userCards?.[0].stripe_account_id;
        const params = {stripe_account_id: stripeAccountId, ...filters};
        this.subscriptions.push(this.walletService.getReceivedPaymentsHistory(params).subscribe(dt => {
            this.accountTransfers = dt.data;
            this.tableData = new MatTableDataSource(dt.data);
            this.tableData.paginator = this.paginator;
        }));
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
            case 'channel':
                content = normalizeColName(element.metadata?.channel);
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

}
