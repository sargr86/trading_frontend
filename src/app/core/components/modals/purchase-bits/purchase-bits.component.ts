import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {PurchasesService} from '@core/services/purchases.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit {

    bitPurchases = [];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];
    authUser;

    constructor(
        private dialog: MatDialog,
        private purchasesService: PurchasesService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.purchasesService.getStripeProducts().subscribe(dt => {
            this.bitPurchases = dt;
        });
    }

    openPurchaseModal(purchase) {
        this.dialog.open(CompletePurchaseModalComponent, {
            data: purchase,
            width: '800px'
        }).afterClosed().subscribe(dt => {
            this.subject.setPurchasedBitsData(dt);
        });
    }

    createArray(len) {
        return new Array(len < 1 ? 1 : len);
    }

}
