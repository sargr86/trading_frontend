import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {Card} from '@shared/models/card';
import {Subscription} from 'rxjs';
import {CardsService} from '@core/services/cards.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-show-wallet',
    templateUrl: './show-wallet.component.html',
    styleUrls: ['./show-wallet.component.scss']
})
export class ShowWalletComponent implements OnInit {
    subscriptions: Subscription[] = [];
    userCards = [];
    authUser;
    constructor(
        private dialog: MatDialog,
        private cardsService: CardsService,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUserCards();
    }

    tabChange(e) {
        // console.log(e)
    }

    openModal() {
        this.dialog.open(CompletePurchaseModalComponent, {width: '800px'}).afterClosed().subscribe(dt => {

        });
    }

    getUserCards() {
        this.subscriptions.push(this.cardsService.getUserCards({user_id: this.authUser.id}).subscribe((dt: Card[]) => {
            this.userCards = dt;
        }));
    }

}
