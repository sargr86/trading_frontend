import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from '@core/services/auth.service';
import {CardsService} from '@core/services/cards.service';
import {UsersService} from '@core/services/users.service';

import {Router} from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {Subscription} from 'rxjs';

import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {FilterOutFalsyValuesFromObjectPipe} from '@shared/pipes/filter-out-falsy-values-from-object.pipe';
import {SubjectService} from '@core/services/subject.service';
import {AccountsService} from '@core/services/wallet/accounts.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {LoaderService} from '@core/services/loader.service';

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
    debitCardAccount;
    totals = {purchased: {coins: 0, dollars: 0}, transferred: {coins: 0, dollars: 0}};

    @Input() authUser: User;
    @Input() accountTransfers = [];
    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    pageSize = 5;
    pageIndex = 0;


    constructor(
        public auth: AuthService,
        private cardsService: CardsService,
        private paymentsService: PaymentsService,
        private accountsService: AccountsService,
        private usersService: UsersService,
        private getExactParams: FilterOutFalsyValuesFromObjectPipe,
        public router: Router,
        private subject: SubjectService,
        public loader: LoaderService
    ) {
    }

    ngOnInit(): void {
        this.getPaymentsHistory({});
        this.getStripeAccount();

        this.subject.getPurchasedBitsData().subscribe(dt => {
            this.getPaymentsHistory({});
        });

        this.countTotals(this.accountTransfers, 'transferred');
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
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory(params).subscribe(dt => {
                this.payments = dt;
                this.countTotals(dt, 'purchased');
                // this.filterPayments();
                this.filteredPayments = dt;
                this.tableData = new MatTableDataSource(this.filteredPayments);
                this.tableData.paginator = this.paginator;
            }));
        }
    }

    countTotals(dt, key) {
        dt.map(d => {
            this.totals[key].coins += d.amount;
            this.totals[key].dollars += d.amount / 100;
        });
    }

    async addBankAccount() {
        await this.router.navigate(['wallet/save-bank-account']);
    }


    getStripeAccount() {
        const params = {stripe_account_id: this.userCards?.[0]?.stripe_account_id};
        if (params.stripe_account_id) {
            this.accountsService.getStripeAccount(params).subscribe(dt => {
                const externalAccounts = dt?.external_accounts?.data;
                this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
                this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
            });
        }

    }

    removeBankAccount(bankAccount) {
        this.loader.dataLoading = true;
        const params = {account_id: bankAccount.account, bank_id: bankAccount.id};
        this.accountsService.removeBankAccount(params).subscribe(dt => {
            this.bankAccount = null;
            this.loader.dataLoading = false;
        });
    }

    removeDebitCard(debitCard) {
        this.loader.dataLoading = true;
        const params = {account_id: debitCard.account, card_id: debitCard.id};
        this.accountsService.removeDebitCard(params).subscribe(dt => {
            this.debitCardAccount = null;
            this.loader.dataLoading = false;
        });
    }

    setAsDefaultExtAccount(acc) {
        this.loader.dataLoading = true;
        this.accountsService.setAsDefaultExternalAccount({
            stripe_account_id: acc.account,
            ext_account_id: acc.id
        }).subscribe(dt => {
            const externalAccounts = dt?.external_accounts?.data;
            this.bankAccount = externalAccounts.filter(t => t.object === 'bank_account')[0];
            this.debitCardAccount = externalAccounts.filter(t => t.object === 'card')[0];
            this.loader.dataLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
