import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {ProductsService} from '@core/services/wallet/products.service';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit {

    bitProducts = [];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];
    authUser;

    constructor(
        private dialog: MatDialog,
        private productsService: ProductsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
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
