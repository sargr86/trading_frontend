import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {ProductsService} from '@core/services/wallet/products.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {COIN_WORTH} from '@core/constants/global';
import {CountPurchasedTransferredTotalsPipe} from '@shared/pipes/count-purchased-transfered-totals.pipe';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit {

    bitProducts = [];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];
    authUser;

    @Input() totals;

    constructor(
        private dialog: MatDialog,
        private productsService: ProductsService,
        private paymentsService: PaymentsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        private countTotals: CountPurchasedTransferredTotalsPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
        });

        this.subject.getAllPaymentsData().subscribe(dt => {
            // console.log(dt)
        });
    }

    openPurchaseModal(purchase) {
        this.dialog.open(CompletePurchaseModalComponent, {
            data: purchase,
            width: '800px'
        }).afterClosed().subscribe((dt) => {
            if (dt) {
                this.paymentsService.getAllPaymentsHistory(dt).subscribe(ph => {
                    this.totals = this.countTotals.transform(ph);
                    // this.subject.setAllPaymentsData({data: dt, totals: this.totals});
                });
            }
        });
    }

    createArray(len) {
        return new Array(len < 1 ? 1 : len);
    }

}
