import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import {PurchasesService} from '@core/services/purchases.service';
import {switchMap} from 'rxjs/operators';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {StripeElementsOptions} from '@stripe/stripe-js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {API_URL, STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {UsersService} from '@core/services/users.service';
import {CardsService} from '@core/services/cards.service';
import {generateStripeCardData} from '@core/helpers/generate-stripe-card-data';
import * as moment from 'moment';
import {SubjectService} from "@core/services/subject.service";


@Component({
    selector: 'app-complete-purchase-modal',
    templateUrl: './complete-purchase-modal.component.html',
    styleUrls: ['./complete-purchase-modal.component.scss']
})
export class CompletePurchaseModalComponent implements OnInit {

    authUser;

    purchase;
    selectedCurrency = {name: 'USD', code: 'USD'};
    currentDate = new Date();

    creditCardForm: FormGroup;
    creditCardAdded = false;

    // Stripe
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};
    payPalConfig?: IPayPalConfig;

    reviewedPurchase = false;
    selectedCard;
    userCards = [];

    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private matDialogRef: MatDialogRef<CompletePurchaseModalComponent>,
        private purchasesService: PurchasesService,
        private stripeService: StripeService,
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private usersService: UsersService,
        private cardsService: CardsService,
        private subject: SubjectService
    ) {
        this.purchase = data;
        this.creditCardForm = fb.group({
            name: ['', [Validators.required]]
        });
    }


    ngOnInit(): void {
        this.initConfig();
        this.authUser = this.getAuthUser.transform();
        this.selectedCard = this.authUser?.users_cards.find(t => t.primary) || this.authUser?.users_cards[0];

        this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
            this.selectedCard = dt.find(t => t.primary) || dt[0];
            console.log(this.authUser.users_cards)
            console.log(this.selectedCard)
            console.log(this.purchase)
        });
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

        this.purchasesService.stripeCheckout({
            card: this.selectedCard,
            purchase: this.purchase
        })
            .pipe(
                switchMap(session => {
                    return this.stripeService.redirectToCheckout({
                        // sessionId: session.id,
                        clientReferenceId: this.selectedCard.id.toString(),
                        successUrl: API_URL + '/payment-success',
                        cancelUrl: API_URL + '/payment-cancel',
                        mode: 'payment',
                        lineItems: [
                            {
                                price: this.purchase.id,
                                quantity: 1
                            }
                        ]
                    });
                })
            )
            .subscribe(result => {

                if (result.error) {
                    alert(result.error.message);
                }
            });
    }

    addCard(): void {
        this.stripeService
            .createToken(this.card.element, {name: this.authUser.full_name})
            .subscribe(result => {
                if (result.token) {
                    this.cardsService.createStripeCard(generateStripeCardData(result, this.authUser, '')).subscribe(dt => {
                        this.creditCardAdded = true;
                    });
                } else if (result.error) {
                    // Error creating the token
                    console.log(result.error.message);
                }
            });


    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YYYY').format('MM/YY');
    }

    reviewPurchase() {
        this.reviewedPurchase = !this.reviewedPurchase;
    }

    selectCard(e) {
        this.selectedCard = this.authUser?.users_cards.find(t => t.name === e.target.value);
        console.log(this.selectedCard)
    }


    closeModal() {
        this.matDialogRef.close();
    }

}
