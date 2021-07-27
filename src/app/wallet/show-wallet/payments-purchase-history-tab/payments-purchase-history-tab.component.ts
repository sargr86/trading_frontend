import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PurchasesService} from '@core/services/purchases.service';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {Subscription} from 'rxjs';
import {LowercaseUnderscored2CapitalizedSpacedPipe} from '@shared/pipes/lowercase-underscored-2-capitalized-spaced.pipe';

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    purchases = [];
    filteredPurchases = [];
    tableData;
    displayedColumns = ['date', 'product_name', 'product_description', 'amount', 'payment_method', 'status'];

    @Input() userCards = [];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private purchasesService: PurchasesService,
        private datePipe: DatePipe,
        private currencyPipe: CurrencyPipe,
        private removeUndCapitalize: LowercaseUnderscored2CapitalizedSpacedPipe
    ) {

    }

    ngOnInit(): void {
        this.getPurchasesHistory();
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
            case 'status':
                content = this.removeUndCapitalize.transform(element.status);
                break;
            case 'payment_method':
                const card = element?.payment_method_details?.card;
                if (card) {
                    content = `**** **** **** ${card.last4}`;
                }
                break;
            case 'product_description':
                content = element.description;
                break;
            case 'product_name':
                content = element.metadata.name;
                break;
            default:
                content = element[col];
                break;
        }
        return content;
    }

    getFilters(e) {
        this.getPurchasesHistory(e);
    }

    getPurchasesHistory(filters = {}) {
        const params = {customer: this.userCards?.[0].stripe_customer_id, ...filters};
        this.subscriptions.push(this.purchasesService.getPurchasesHistory(params).subscribe(dt => {
            this.purchases = dt;
            this.filteredPurchases = dt;
            this.tableData = new MatTableDataSource(dt);
            this.tableData.paginator = this.paginator;
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
