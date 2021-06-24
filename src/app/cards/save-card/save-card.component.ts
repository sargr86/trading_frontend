import {Component, OnInit} from '@angular/core';
import {STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {StripeElementsOptions} from '@stripe/stripe-js';

@Component({
    selector: 'app-save-card',
    templateUrl: './save-card.component.html',
    styleUrls: ['./save-card.component.scss']
})
export class SaveCardComponent implements OnInit {

    // Stripe
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    constructor() {
    }

    ngOnInit(): void {
    }

}
