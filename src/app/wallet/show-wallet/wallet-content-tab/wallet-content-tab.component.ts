import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {CardsService} from '@core/services/cards.service';
import {PurchasesService} from '@core/services/purchases.service';
import {UsersService} from '@core/services/users.service';

import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {LowercaseUnderscored2CapitalizedSpacedPipe} from '@shared/pipes/lowercase-underscored-2-capitalized-spaced.pipe';
import {CurrencyPipe, DatePipe} from '@angular/common';

import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';

@Component({
    selector: 'app-wallet-content-tab',
    templateUrl: './wallet-content-tab.component.html',
    styleUrls: ['./wallet-content-tab.component.scss']
})
export class WalletContentTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    displayedColumns = ['date', 'amount_submitted', 'payment_method', 'status'];
    payments = [];
    filteredPayments = [];
    tableData;

    @Input() authUser: User;
    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    pageSize = 5;
    pageIndex = 0;

    constructor(
        public auth: AuthService,
        private cardsService: CardsService,
        private purchasesService: PurchasesService,
        private usersService: UsersService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private removeUndCapitalize: LowercaseUnderscored2CapitalizedSpacedPipe
    ) {
    }

    ngOnInit(): void {
        this.getPaymentsHistory({});
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
                content = this.removeUndCapitalize.transform(element.status);
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

    getFilters(e) {
        this.getPaymentsHistory(e);
    }

    getPaymentsHistory(filters) {
        const params = {customer: this.userCards?.[0]?.stripe_customer_id, ...filters};
        this.subscriptions.push(this.purchasesService.getAllPaymentsHistory(params).subscribe(dt => {
            this.payments = dt;
            this.filteredPayments = dt;
            this.tableData = new MatTableDataSource(this.filteredPayments);
            this.tableData.paginator = this.paginator;
        }));
    }

    addBankAccount() {
        this.usersService.addBankAccount({user_id: this.authUser.id}).subscribe(dt => {
            location.href = dt?.url;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
