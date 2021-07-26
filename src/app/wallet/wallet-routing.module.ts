import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ShowWalletComponent} from '@app/wallet/show-wallet/show-wallet.component';
import {CardGuard} from '@core/guards/card.guard';


const routes: Routes = [
    {
        path: 'show',
        component: ShowWalletComponent,
        canActivate: [CardGuard]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class WalletRoutingModule {
}
