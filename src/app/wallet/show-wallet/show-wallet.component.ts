import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';

@Component({
    selector: 'app-show-wallet',
    templateUrl: './show-wallet.component.html',
    styleUrls: ['./show-wallet.component.scss']
})
export class ShowWalletComponent implements OnInit {

    constructor(
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {
    }

    openModal() {
        this.dialog.open(CompletePurchaseModalComponent).afterClosed().subscribe(dt => {

        });
    }

}
