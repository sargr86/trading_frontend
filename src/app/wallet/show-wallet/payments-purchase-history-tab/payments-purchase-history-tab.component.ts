import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {SubjectService} from '@core/services/subject.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {MatSort, Sort} from '@angular/material/sort';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit, AfterViewInit, OnDestroy {
    subscriptions: Subscription[] = [];
    purchases = [];
    filteredPurchases = [];
    tableData;
    displayedColumns = ['date', 'product_name', 'product_description', 'amount', 'payment_method', 'status'];

    @Input() userCards = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private paymentsService: PaymentsService,
        private subject: SubjectService
    ) {

    }

    ngOnInit(): void {
        this.getPurchasesHistory();
        // this.subject.getAllPaymentsData().subscribe(dt => {
        //     this.getPurchasesHistory({});
        // });
    }

    getFilters(e) {
        this.getPurchasesHistory(e);
    }

    getPurchasesHistory(filters = {}) {
        const params = {customer: this.userCards?.[0].stripe_customer_id, ...filters};
        if (params.customer) {
            this.subscriptions.push(this.paymentsService.getPurchasesHistory(params).subscribe(dt => {
                this.purchases = dt;
                this.filteredPurchases = dt;
                this.tableData = new MatTableDataSource(this.filteredPurchases);
                this.tableData.paginator = this.paginator;
                this.tableData.sort = this.sort;
            }));
        }
    }

    ngAfterViewInit() {
        this.sort.sortChange.subscribe((sort: Sort) => {
            this.filteredPurchases = sortTableData(this.filteredPurchases, 'created', sort.direction);
            this.paginator.pageIndex = 0;
            this.tableData = new MatTableDataSource(this.filteredPurchases);
            this.tableData.paginator = this.paginator;
        });

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
