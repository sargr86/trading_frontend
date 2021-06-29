import {Component, OnDestroy, OnInit} from '@angular/core';
import {UsersService} from '@core/services/users.service';
import {User} from '@shared/models/user';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Card} from '@shared/models/card';
import * as moment from 'moment';
import {Router} from '@angular/router';
import {Subscription} from "rxjs";
import {LoaderService} from "@core/services/loader.service";

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

    constructor(
        private usersService: UsersService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        public loader: LoaderService
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getUserCards();
    }

    getUserCards() {
        this.loader.dataLoading = true;
        this.subscriptions.push(this.usersService.getUserCards({user_id: this.authUser.id}).subscribe((dt: Card[]) => {
            this.userCards = dt;
            this.loader.dataLoading = false;
        }));
    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YY').format('MM/YY');
    }

    toggleActions(card, showActions) {
        this.showActions = showActions;
        if(showActions){
            this.selectedCard = card;
        }
    }

    async editCard(c) {
        await this.router.navigate([`/user/cards/edit/${c.id}`]);
    }

    removeCard(c) {
        this.subscriptions.push(this.usersService.removeStripeCard({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe((dt: Card[]) => {
            this.userCards = dt;
        }));
    }

    makePrimary(c) {
        this.subscriptions.push(this.usersService.makePrimary({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
