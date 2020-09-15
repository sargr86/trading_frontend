import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '@shared/shared.module';
import {VideoComponent} from '@app/user/video/video.component';
import { CryptoCurrencyComponent } from './crypto-currency/crypto-currency.component';


@NgModule({
  declarations: [ProfileComponent, VideoComponent, CryptoCurrencyComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  exports: []
})
export class UserModule {
}
