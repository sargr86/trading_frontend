import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {CardsService} from '@core/services/cards.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';
import {PurchasesService} from '@core/services/purchases.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {CurrencyPipe, DatePipe} from '@angular/common';

@Component({
    selector: 'app-wallet-content-tab',
    templateUrl: './wallet-content-tab.component.html',
    styleUrls: ['./wallet-content-tab.component.scss']
})
export class WalletContentTabComponent implements OnInit {
    authUser;
    userCards = [];
    displayedColumns = ['date', 'amount_submitted', 'payment_method', 'status'];
    payments = [];
    filteredPayments = [];
    tableData;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    pageSize = 5;
    pageIndex = 0;

    constructor(
        public auth: AuthService,
        private cardsService: CardsService,
        private purchasesService: PurchasesService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        public router: Router,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        });

        this.purchasesService.getAllPaymentsHistory().subscribe(dt => {
            this.payments = dt;
            this.filteredPayments = dt;
            this.tableData = new MatTableDataSource(this.filteredPayments);
            this.tableData.paginator = this.paginator;
        });
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
            case 'amount_submitted':
                content = this.currencyPipe.transform(element.amount / 100, element.currency.toUpperCase());
                break;
            case 'status':
                content = normalizeColName(element.status);
                break;
            case 'payment_method':
                const card = element?.charges?.data?.[0]?.payment_method_details?.card;
                if (card) {
                    content = `**** **** **** ${card.last4}`;
                }
                break;
        }
        return content;
    }

    handle(e) {
        this.pageIndex = e.pageIndex;
        this.pageSize = e.pageSize;
        this.filterPayments();
    }

    filterPayments() {
        this.filteredPayments = this.payments.slice(this.pageIndex * this.pageSize,
            this.pageIndex * this.pageSize + this.pageSize);
    }


}
