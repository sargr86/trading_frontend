import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {PurchasesService} from '@core/services/purchases.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {CurrencyPipe, DatePipe} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {FormBuilder, FormGroup} from '@angular/forms';
import * as moment from 'moment';

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit {
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
                content = normalizeColName(element.status);
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

    normalizeColName(col): string {
        return normalizeColName(col);
    }

    getFilters(e) {
        this.getPurchasesHistory(e);
    }

    getPurchasesHistory(filters = {}){
        const params = {customer: this.userCards?.[0].stripe_customer_id, ...filters};
        this.purchasesService.getPurchasesHistory(params).subscribe(dt => {
            this.purchases = dt;
            this.filteredPurchases = dt;
            this.tableData = new MatTableDataSource(dt);
            this.tableData.paginator = this.paginator;
        });
    }


}
