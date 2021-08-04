import {Component, OnInit} from '@angular/core';
import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {LoaderService} from '@core/services/loader.service';
import {SubjectService} from '@core/services/subject.service';
import {Router} from '@angular/router';
import * as moment from 'moment';
import {CustomersService} from '@core/services/wallet/customers.service';

@Component({
    selector: 'app-show-cards',
    templateUrl: './show-cards.component.html',
    styleUrls: ['./show-cards.component.scss']
})
export class ShowCardsComponent implements OnInit {
    userCards: Card[] = [];
    selectedCard: Card;
    authUser: User;
    subscriptions: Subscription[] = [];

    showActions = false;

    constructor(
        public loader: LoaderService,
        public router: Router,
        private subject: SubjectService,
        private customersService: CustomersService
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        }));
    }



    formatExpiryDate(date) {
        return moment(date, 'MM/YYYY').format('MM/YY');
    }

    getBgClass(i) {
        return i === 0 ? 'bg-green' : (i === 1 ? 'bg-gold' : 'bg-gray');
    }

    makePrimary(c) {
        this.subscriptions.push(this.customersService.makePrimary({
            card_id: c.id,
            stripe_customer_id: c.customer,
            user_id: this.authUser.id
        }).subscribe(dt => {
            this.userCards = dt;
        }));
    }

    toggleActions(card, showActions) {
        this.showActions = showActions;
        if (showActions) {
            this.selectedCard = card;
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
