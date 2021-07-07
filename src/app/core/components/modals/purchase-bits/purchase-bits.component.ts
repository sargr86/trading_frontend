import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {PurchasesService} from '@core/services/purchases.service';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit {

    bitPurchases = [
        // {bitPrice: 100, discount: 29, currencyPrice: 10, coinsLen: 1},
        // {bitPrice: 200, discount: 30, currencyPrice: 20, coinsLen: 2},
        // {bitPrice: 300, discount: 2, currencyPrice: 30, coinsLen: 3},
        // {bitPrice: 400, discount: 29, currencyPrice: 40, coinsLen: 4},
        // {bitPrice: 500, discount: 29, currencyPrice: 50, coinsLen: 5},
    ];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];

    constructor(
        private dialog: MatDialog,
        private purchasesService: PurchasesService
    ) {
    }

    ngOnInit(): void {
        this.purchasesService.getStripeProducts().subscribe(dt => {
            this.bitPurchases = dt;
        });
    }

    openPurchaseModal(purchase) {
        this.dialog.open(CompletePurchaseModalComponent, {data: purchase, width: '800px'}).afterClosed().subscribe(dt => {

        });
    }

    createArray(len) {
        return new Array(len);
    }

}
