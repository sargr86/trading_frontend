import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {WalletRoutingModule} from './wallet-routing.module';
import {ShowWalletComponent} from './show-wallet/show-wallet.component';
import {MaterialModule} from '@core/modules/material.module';
import {WalletContentTabComponent} from './show-wallet/wallet-content-tab/wallet-content-tab.component';
import {PaymentsPurchaseHistoryTabComponent} from './show-wallet/payments-purchase-history-tab/payments-purchase-history-tab.component';
import {PaymentsReceivedHistoryTabComponent} from './show-wallet/payments-received-history-tab/payments-received-history-tab.component';
import {MetlCoinsPayoutScheduleTabComponent} from './show-wallet/metl-coins-payout-schedule-tab/metl-coins-payout-schedule-tab.component';
import {SharedModule} from '@shared/shared.module';
import {SaveBankAccountComponent} from './save-bank-account/save-bank-account.component';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';


@NgModule({
    declarations: [
        ShowWalletComponent,
        WalletContentTabComponent,
        PaymentsPurchaseHistoryTabComponent,
        PaymentsReceivedHistoryTabComponent,
        MetlCoinsPayoutScheduleTabComponent,
        SaveBankAccountComponent
    ],
    imports: [
        CommonModule,
        WalletRoutingModule,
        MaterialModule,
        SharedModule,
        BsDatepickerModule.forRoot(),


    ]
})
export class WalletModule {
}
