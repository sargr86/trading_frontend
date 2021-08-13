import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SubjectService} from '@core/services/subject.service';
import {ProductsService} from '@core/services/wallet/products.service';
import {PaymentsService} from '@core/services/wallet/payments.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-purchase-bits',
    templateUrl: './purchase-bits.component.html',
    styleUrls: ['./purchase-bits.component.scss']
})
export class PurchaseBitsComponent implements OnInit, OnDestroy {

    bitProducts = [];
    subscriptions: Subscription[] = [];

    coinImages = ['gold', 'silver', 'pink', 'green', 'blue'];
    authUser;

    @Input() totals;

    constructor(
        private dialog: MatDialog,
        private productsService: ProductsService,
        private paymentsService: PaymentsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.subscriptions.push(this.productsService.getStripeProducts().subscribe(dt => {
            this.bitProducts = dt;
        }));

        this.subject.getAllPaymentsData().subscribe(dt => {
            // console.log(dt)
        });
    }

    openPurchaseModal(purchase) {
        this.subscriptions.push(this.dialog.open(CompletePurchaseModalComponent, {
            data: purchase,
            width: '800px'
        }).afterClosed().subscribe((dt) => {
            if (dt) {
                this.subscriptions.push(this.paymentsService.getAllPaymentsHistory({user_id: this.authUser.id, ...dt}).subscribe(ph => {
                    this.totals = ph.user_coins;
                    this.subject.setAllPaymentsData(ph);
                }));
            }
        }));
    }

    createArray(len) {
        return new Array(len < 1 ? 1 : len);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
