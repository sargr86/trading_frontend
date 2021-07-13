import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {PurchasesService} from "@core/services/purchases.service";

@Component({
    selector: 'app-show-wallet',
    templateUrl: './show-wallet.component.html',
    styleUrls: ['./show-wallet.component.scss']
})
export class ShowWalletComponent implements OnInit {

    constructor(
        private dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {

    }

    tabChange(e) {
        console.log(e)
    }

    openModal() {
        this.dialog.open(CompletePurchaseModalComponent, {width: '800px'}).afterClosed().subscribe(dt => {

        });
    }

}
