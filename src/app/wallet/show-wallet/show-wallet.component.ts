import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {CompletePurchaseModalComponent} from '@shared/components/complete-purchase-modal/complete-purchase-modal.component';
import {Card} from '@shared/models/card';
import {Subscription} from 'rxjs';
import {CardsService} from '@core/services/cards.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {normalizeColName} from '@core/helpers/normalizeTableColumnName';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
    selector: 'app-show-wallet',
    templateUrl: './show-wallet.component.html',
    styleUrls: ['./show-wallet.component.scss']
})
export class ShowWalletComponent implements OnInit {
    subscriptions: Subscription[] = [];
    userCards = [];
    authUser;
    activeTab;

    @ViewChild('tabGroup', {static: false}) tabGroup;

    constructor(
        private dialog: MatDialog,
        private cardsService: CardsService,
        private getAuthUser: GetAuthUserPipe,
        public router: Router,
        private route: ActivatedRoute,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUserCards();
        this.activeTab = localStorage.getItem('active_wallet_tab') || 'wallet';
    }

    async tabChange(e) {
        const tab = e?.tab.textLabel.toLowerCase().replace(/ /g, '_');
        localStorage.setItem('active_wallet_tab', tab);
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

    getActiveTab(tabGroup) {
        return tabGroup._tabs._results.map((tab, index) => {
            const t = tab.textLabel.toLowerCase().replace(/ /g, '_');
            return t === this.activeTab ? index : 0;
        }).find(t => t) || 0;
    }

}
