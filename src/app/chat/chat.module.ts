import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ShowChatroomsComponent } from './show-chatrooms/show-chatrooms.component';
import { ShowMessagesComponent } from './show-messages/show-messages.component';


@NgModule({
  declarations: [ShowChatroomsComponent, ShowMessagesComponent],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
