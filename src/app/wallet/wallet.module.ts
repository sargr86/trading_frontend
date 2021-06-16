import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WalletRoutingModule } from './wallet-routing.module';
import { ShowWalletComponent } from './show-wallet/show-wallet.component';


@NgModule({
  declarations: [ShowWalletComponent],
  imports: [
    CommonModule,
    WalletRoutingModule
  ]
})
export class WalletModule { }
