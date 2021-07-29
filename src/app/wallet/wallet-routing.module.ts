import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowWalletComponent} from '@app/wallet/show-wallet/show-wallet.component';
import {SaveBankAccountComponent} from '@app/wallet/save-bank-account/save-bank-account.component';


const routes: Routes = [
    {
        path: 'show',
        component: ShowWalletComponent,
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
