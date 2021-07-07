import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '@core/services/users.service';
import {User} from '@shared/models/user';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Card} from '@shared/models/card';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {CardsService} from '@core/services/cards.service';
import {MAX_CARDS_PER_USER} from "@core/constants/global";

@Component({
    selector: 'app-show-cards',
    templateUrl: './show-cards.component.html',
    styleUrls: ['./show-cards.component.scss']
})
export class ShowCardsComponent implements OnInit, OnDestroy {
    userCards: Card[] = [];

    authUser: User;

    subscriptions: Subscription[] = [];

    showActions = false;
    selectedCard: Card;
    maxCardsPerUser = MAX_CARDS_PER_USER;


    constructor(
        private usersService: UsersService,
        private cardsService: CardsService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        public loader: LoaderService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getUserCards();
        console.log(this.authUser.users_cards)
    }

    getUserCards() {
        this.loader.dataLoading = true;
        this.subscriptions.push(this.cardsService.getUserCards({user_id: this.authUser.id}).subscribe((dt: Card[]) => {
            this.userCards = dt;
            this.loader.dataLoading = false;
        }));
    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YYYY').format('MM/YY');
    }

    toggleActions(card, showActions) {
        this.showActions = showActions;
        if (showActions) {
            this.selectedCard = card;
        }
    }

    async editCard(c) {
        await this.router.navigate([`/user/cards/edit/${c.id}`]);
    }

    removeCard(c) {
        this.subscriptions.push(this.cardsService.removeStripeCard({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe((dt: any) => {
            localStorage.setItem('token', (dt.hasOwnProperty('token') ? dt.token : ''));
            this.userCards = dt.cards;
        }));
    }

    makePrimary(c) {
        this.subscriptions.push(this.cardsService.makePrimary({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe(dt => {
            this.userCards = dt;
        }));
    }

    getBgClass(i, card) {
        if (this.showActions && this.selectedCard === card) {
            return '';
        } else {
            return i === 0 ? 'bg-green' : (i === 1 ? 'bg-gold' : 'bg-gray');
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
