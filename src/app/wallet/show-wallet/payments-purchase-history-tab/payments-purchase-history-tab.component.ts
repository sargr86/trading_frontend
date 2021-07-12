import {Component, OnInit} from '@angular/core';
import {PurchasesService} from '@core/services/purchases.service';

@Component({
    selector: 'app-payments-purchase-history-tab',
    templateUrl: './payments-purchase-history-tab.component.html',
    styleUrls: ['./payments-purchase-history-tab.component.scss']
})
export class PaymentsPurchaseHistoryTabComponent implements OnInit {
    purchases = [];

    constructor(
        private purchasesService: PurchasesService
    ) {
    }

    ngOnInit(): void {
        this.purchasesService.getPurchasesHistory().subscribe(dt => {
            this.purchases = dt;
        });
    }

}
