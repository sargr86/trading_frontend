import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit {

    bitPurchases = [
        {bitPrice: 300, discount: 29, currencyPrice: 3, coinsLen: 1},
        {bitPrice: 300, discount: 30, currencyPrice: 3, coinsLen: 2},
        {bitPrice: 300, discount: 2, currencyPrice: 5, coinsLen: 3},
        {bitPrice: 300, discount: 29, currencyPrice: 3, coinsLen: 4},
        {bitPrice: 300, discount: 29, currencyPrice: 3, coinsLen: 5},
        {bitPrice: 300, discount: 29, currencyPrice: 308, coinsLen: 5},
    ];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];

    constructor(
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    openPurchaseModal(purchase) {
        this.dialog.open(CompletePurchaseModalComponent, {data: purchase, width: '800px'}).afterClosed().subscribe(dt => {

        });
    }

    createArray(len) {
        return new Array(len);
    }

}
