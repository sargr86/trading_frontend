import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {LoaderService} from '@core/services/loader.service';
import {STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {StripeElementsOptions} from '@stripe/stripe-js';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-save-card',
    templateUrl: './save-card.component.html',
    styleUrls: ['./save-card.component.scss']
})
export class SaveCardComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    editCase = false;

    // Stripe card
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    saveCardForm: FormGroup;

    constructor(
        public router: Router,
        public loader: LoaderService,
        private fb: FormBuilder
    ) {
        this.saveCardForm = this.fb.group({
            name: ['', Validators.required],
            primary: [0]
        });
    }

    ngOnInit(): void {
    }

    saveCard() {

    }

    async goToCardsList() {
        await this.router.navigate(['/user/cards']);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
