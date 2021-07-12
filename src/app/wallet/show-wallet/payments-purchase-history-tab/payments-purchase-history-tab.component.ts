import {Component, OnInit, ViewChild} from '@angular/core';
import {PurchasesService} from '@core/services/purchases.service';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {DatePipe} from "@angular/common";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit {
    purchases = [];
    tableData;
    displayedColumns = ['date', 'product_name', 'product_description', 'amount', 'payment_method'];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private purchasesService: PurchasesService,
        private datePipe: DatePipe
    ) {
    }

    ngOnInit(): void {
        this.purchasesService.getPurchasesHistory().subscribe(dt => {
            this.purchases = dt;
            this.tableData = new MatTableDataSource(dt);
            this.tableData.paginator = this.paginator;
        });
    }

    getColumnContentByItsName(col, element) {
        let content;

        switch (col) {
            case 'date':
                content = this.datePipe.transform(element.created * 1000);
                break;
            case 'amount':
                content = `${element.currency.toUpperCase()} ${element.amount / 100}`;
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
            default:
                content = element[col];
                break;
        }
        return content;
    }

    normalizeColName(col): string {
        return normalizeColName(col);
    }

}
