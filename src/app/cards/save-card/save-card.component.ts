import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {STRIPE_CARD_OPTIONS} from '@core/constants/global';
import {StripeElementsOptions} from '@stripe/stripe-js';
import {generateStripeCardData} from '@core/helpers/generate-stripe-card-data';
import {StripeCardComponent, StripeService} from 'ngx-stripe';
import {UsersService} from '@core/services/users.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '@shared/models/user';
import {Card} from '@shared/models/card';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';

@Component({
    selector: 'app-save-card',
    templateUrl: './save-card.component.html',
    styleUrls: ['./save-card.component.scss']
})
export class SaveCardComponent implements OnInit, OnDestroy {

    // Stripe
    cardOptions = STRIPE_CARD_OPTIONS;
    elementsOptions: StripeElementsOptions = {locale: 'en'};

    authUser: User;
    saveCardForm: FormGroup;

    cardId;
    editCase = false;
    cardDetails;

    subscriptions: Subscription[] = [];

    @ViewChild(StripeCardComponent) card: StripeCardComponent;

    constructor(
        private stripeService: StripeService,
        private usersService: UsersService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        public loader: LoaderService
    ) {
        this.saveCardForm = this.fb.group({
            name: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.cardId = this.route.snapshot.params?.id;
        this.editCase = !!this.cardId;
        if (this.editCase) {
            this.getCardDetails();
        }
    }

    getCardDetails() {
        this.usersService.getCardDetails({card_id: this.cardId}).subscribe((dt: Card) => {
            this.cardDetails = dt;
            this.saveCardForm.patchValue({name: dt.name});
        });
    }

    saveCard(): void {
        this.loader.dataLoading = true;
        if (this.editCase) {
            this.subscriptions.push(this.usersService.updateStripeCard({
                card_id: this.cardId,
                ...this.saveCardForm.value
            }).subscribe(async (dt) => {
                this.loader.dataLoading = false;
                this.toastr.success('The card info has been updated successfully');
                await this.router.navigate(['/user/cards']);
            }));
        } else {

            this.subscriptions.push(this.stripeService
                .createToken(this.card.element, {name: this.authUser.full_name})
                .subscribe(result => {
                    if (result.token) {
                        const cardData = generateStripeCardData(result, this.authUser, this.saveCardForm.value.name);
                        this.usersService.createStripeCard(cardData).subscribe(async (dt) => {
                            this.loader.dataLoading = false;
                            this.toastr.success('The card has been added successfully');
                            await this.router.navigate(['/user/cards']);

                        });
                    } else if (result.error) {
                        this.toastr.error(result.error.message);
                    }
                }));


        }

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
