import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {PurchasesService} from '@core/services/purchases.service';
import {switchMap} from 'rxjs/operators';
import {StripeService} from 'ngx-stripe';

@Component({
    selector: 'app-complete-purchase-modal',
    templateUrl: './complete-purchase-modal.component.html',
    styleUrls: ['./complete-purchase-modal.component.scss']
})
export class CompletePurchaseModalComponent implements OnInit {
    purchase;
    selectedCurrency = {name: 'USD', code: 'USD'};
    currentDate = new Date();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<CompletePurchaseModalComponent>,
        private purchasesService: PurchasesService,
        private stripeService: StripeService
    ) {
        this.purchase = data;
    }

    public payPalConfig?: IPayPalConfig;

    ngOnInit(): void {
        this.initConfig();
    }

    private initConfig(): void {
        this.payPalConfig = {
            currency: this.selectedCurrency.code,
            clientId: 'sb',
            createOrderOnClient: (data) => <ICreateOrderRequest>{
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: this.selectedCurrency.code,
                            value: this.purchase.currencyPrice,
                            breakdown: {
                                item_total: {
                                    currency_code: this.selectedCurrency.code,
                                    value: this.purchase.currencyPrice,
                                }
                            }
                        },
                        items: [
                            {
                                name: 'Enterprise Subscription',
                                quantity: '1',
                                category: 'DIGITAL_GOODS',
                                unit_amount: {
                                    currency_code: this.selectedCurrency.code,
                                    value: this.purchase.currencyPrice,
                                },
                            }
                        ]
                    }
                ]
            },
            advanced: {
                commit: 'true'
            },
            style: {
                label: 'paypal',
                layout: 'horizontal',
                tagline: false
            },
            onApprove: (data, actions) => {
                console.log('onApprove - transaction was approved, but not authorized', data, actions);
                actions.order.get().then(details => {
                    console.log('onApprove - you can get full order details inside onApprove: ', details);
                });
            },
            onClientAuthorization: (data) => {
                console.log('onClientAuthorization -' +
                    ' you should probably inform your server about completed transaction at this point', data);
                // this.showSuccess = true;
            },
            onCancel: (data, actions) => {
                console.log('OnCancel', data, actions);
            },
            onError: err => {
                console.log('OnError', err);
            },
            onClick: (data, actions) => {
                console.log('onClick', data, actions);
            },
        };
    }

    stripeCheckout() {
        this.purchasesService.stripeCheckout({})
            .pipe(
                switchMap(session => {
                    return this.stripeService.redirectToCheckout({sessionId: session.id})
                })
            )
            .subscribe(result => {
                // If `redirectToCheckout` fails due to a browser or network
                // error, you should display the localized error message to your
                // customer using `error.message`.
                if (result.error) {
                    alert(result.error.message);
                }
            });
    }


    closeModal() {
        this.matDialogRef.close();
    }

}
