import {Component, OnInit} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {CustomersService} from '@core/services/wallet/customers.service';
import {cardsStore} from '@shared/stores/cards-store';

@Component({
    selector: 'app-show-wallet-cards',
    templateUrl: './show-wallet-cards.component.html',
    styleUrls: ['./show-wallet-cards.component.scss']
})
export class ShowWalletCardsComponent implements OnInit {
    authUser;
    userCards;
    cardsStore = cardsStore;

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private customersService: CustomersService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getCards();
    }

    getCards() {
        this.customersService.getUserCards({user_id: this.authUser.id}).subscribe(dt => {
            this.userCards = dt;
            this.cardsStore.setCards(dt);
            console.log(this.cardsStore.cards)
        });
    }

    removeCard(card) {
        const params = {
            card_id: card.id,
            stripe_customer_id: card.customer,
            stripe_account_id: card.stripe_account_id || '',
            user_id: this.authUser.id
        };
        this.customersService.removeStripeCard(params).subscribe((dt: any) => {
            this.userCards = dt;
            this.cardsStore.setCards(dt);
        });
    }

}
