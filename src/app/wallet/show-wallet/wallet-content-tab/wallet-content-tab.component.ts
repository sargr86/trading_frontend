import {Component, OnInit} from '@angular/core';
import {AuthService} from "@core/services/auth.service";
import {CardsService} from "@core/services/cards.service";
import {GetAuthUserPipe} from "@shared/pipes/get-auth-user.pipe";
import {SubjectService} from "@core/services/subject.service";
import {Router} from "@angular/router";

@Component({
    selector: 'app-wallet-content-tab',
    templateUrl: './wallet-content-tab.component.html',
    styleUrls: ['./wallet-content-tab.component.scss']
})
export class WalletContentTabComponent implements OnInit {
    authUser;
    userCards = [];

    constructor(
        public auth: AuthService,
        private cardsService: CardsService,
        private getAuthUser: GetAuthUserPipe,
        private subject: SubjectService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.subject.currentUserCards.subscribe(dt => {
            this.userCards = dt;
        });
    }


}
