import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {ProductsService} from '@core/services/wallet/products.service';
import {PaymentsService} from '@core/services/wallet/payments.service';

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
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
        });

        this.subject.getPurchasedBitsData().subscribe(dt => {
            // console.log(dt)
        });
    }

    openPurchaseModal(purchase) {
        this.dialog.open(CompletePurchaseModalComponent, {
            data: purchase,
            width: '800px'
        }).afterClosed().subscribe((dt) => {
            this.totals = {purchased: {coins: 0, dollars: 0}, transferred: {coins: 0, dollars: 0}};
            if (dt) {
                this.paymentsService.getPurchasesHistory(dt).subscribe(ph => {
                    // this.subject.setPurchasedBitsData(d);
                    this.countTotals(ph.filter(d => d.transfer_group === 'purchases'), 'purchased');
                });
            }
        });
    }

    countTotals(dt, key) {
        dt.map(d => {
            this.totals[key].coins += (d.amount / 0.0199) / 100;
            this.totals[key].dollars += d.amount / 100;
        });


    }

    createArray(len) {
        return new Array(len < 1 ? 1 : len);
    }

}
