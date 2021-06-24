import {Component, OnInit} from '@angular/core';
import {UsersService} from '@core/services/users.service';
import {User} from '@shared/models/user';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Card} from '@shared/models/card';
import * as moment from 'moment';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-cards',
    templateUrl: './show-cards.component.html',
    styleUrls: ['./show-cards.component.scss']
})
export class ShowCardsComponent implements OnInit {
    userCards: Card[] = [];
    authUser: User;

    constructor(
        private usersService: UsersService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    ngOnInit(): void {
        this.getUserCards();
    }

    getUserCards() {
        this.usersService.getUserCards({user_id: this.authUser.id}).subscribe((dt: Card[]) => {
            this.userCards = dt;
        });
    }

    formatExpiryDate(date) {
        return moment(date, 'MM/YY').format('MM/YY');
    }

}
