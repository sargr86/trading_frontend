import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserRoutingModule} from './user-routing.module';
import {ProfileComponent} from './profile/profile.component';
import {SharedModule} from '@shared/shared.module';
import {VideoComponent} from '@app/user/video/video.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { PurchaseBitsComponent } from './purchase-bits/purchase-bits.component';


@NgModule({
  declarations: [ProfileComponent, VideoComponent, PublisherComponent, SubscriberComponent, PurchaseBitsComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule
  ],
  exports: []
})
export class UserModule {
}
