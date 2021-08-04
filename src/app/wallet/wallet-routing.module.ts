import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowWalletComponent} from '@app/wallet/show-wallet/show-wallet.component';
import {SaveBankAccountComponent} from '@app/wallet/save-bank-account/save-bank-account.component';
import {ShowCardsComponent} from '@app/wallet/cards/show-cards/show-cards.component';
import {SaveCardComponent} from '@app/wallet/cards/save-card/save-card.component';


const routes: Routes = [

    {
        path: 'show',
        component: ShowWalletComponent,
        data: {
            title: 'Wallet'
        }
    },
    {
        path: 'save-bank-account',
        component: SaveBankAccountComponent
    },
    {
        path: 'cards',
        component: ShowCardsComponent,
        data: {
            title: 'User Cards'
        }
    },
    {
        path: 'cards/edit/:id',
        component: SaveCardComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WalletRoutingModule {
}
