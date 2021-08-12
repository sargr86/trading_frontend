import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
    displayedColumns = ['date', 'amount_submitted', 'payment_method', 'payment_group', 'status'];
    payments = [];
    filteredPayments = [];
    filterApplied = false;
    tableData;

    totals = {purchased: {coins: 0, dollars: 0}, transferred: {coins: 0, dollars: 0}};

    @Input() authUser: User;
    @Input() accountTransfers = [];
    @Input() userCards: Card[] = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @Output() changeTab = new EventEmitter();

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


        this.subject.getPurchasedBitsData().subscribe(dt => {
            this.getPaymentsHistory({});
        });
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
        this.filterApplied = true;
        this.getPaymentsHistory(e);
    }

    getPaymentsHistory(filters) {
        const params = {customer: this.userCards?.[0]?.stripe_customer_id, ...filters};
        this.totals = {purchased: {coins: 0, dollars: 0}, transferred: {coins: 0, dollars: 0}};
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getAllPaymentsHistory(params).subscribe(dt => {
                this.payments = dt;
                // this.subject.setPurchasedBitsData( dt);
                this.countTotals(dt.filter(d => d.transfer_group === 'purchases'), 'purchased');
                this.countTotals(dt.filter(d => d.transfer_group === 'transfers'), 'transferred');
                // this.filterPayments();
                this.filteredPayments = dt;
                this.tableData = new MatTableDataSource(this.filteredPayments);
                this.tableData.paginator = this.paginator;
            }));
        }
    }

    countTotals(dt, key) {
        dt.map(d => {
            this.totals[key].coins += (d.amount / (100 * 0.0199));
            this.totals[key].dollars += d.amount / 100;
        });


    }

    changeTabToPayouts() {
        this.changeTab.emit(3);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
