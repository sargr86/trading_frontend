import {Component, OnInit} from '@angular/core';
import {Card} from '@shared/models/card';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-show-cards',
    templateUrl: './show-cards.component.html',
    styleUrls: ['./show-cards.component.scss']
})
export class ShowCardsComponent implements OnInit {
    userCards: Card[] = [];
    authUser: User;
    subscriptions: Subscription[] = [];


    constructor() {
    }

    ngOnInit(): void {
    }

}
