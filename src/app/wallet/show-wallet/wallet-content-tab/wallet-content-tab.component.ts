import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {CardsService} from '@core/services/cards.service';
import {PurchasesService} from '@core/services/purchases.service';
import {UsersService} from '@core/services/users.service';

import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';

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
    bankAccount;

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
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        public router: Router,
    ) {
    }

    ngOnInit(): void {
        this.getPaymentsHistory({});
        this.getBankAccount();
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
            this.filterPayments();
            // this.filteredPayments = dt;
            this.tableData = new MatTableDataSource(this.filteredPayments);
            this.tableData.paginator = this.paginator;
        }));
    }

    async addBankAccount() {
        await this.router.navigate(['wallet/save-bank-account']);
        // this.usersService.addBankAccount({user_id: this.authUser.id}).subscribe(dt => {
        //     location.href = dt?.url;
        // });
    }

    getBankAccount() {
        const params = {stripe_account_id: this.userCards?.[0]?.stripe_account_id};
        this.usersService.getBankAccount(params).subscribe(dt => {
            this.bankAccount = dt?.external_accounts?.data;
            console.log(this.bankAccount)
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
