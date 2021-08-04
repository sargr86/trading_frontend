import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowWalletComponent} from '@app/wallet/show-wallet/show-wallet.component';
import {SaveBankAccountComponent} from '@app/wallet/save-bank-account/save-bank-account.component';
import {ShowCardsComponent} from '@app/wallet/cards/show-cards/show-cards.component';


const routes: Routes = [
    {
        path: 'cards',
        component: ShowCardsComponent,
        data: {
            title: 'User Cards'
        }
    },
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
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WalletRoutingModule {
}
