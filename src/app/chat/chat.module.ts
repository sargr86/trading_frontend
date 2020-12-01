import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ShowChatroomsComponent } from './show-chatrooms/show-chatrooms.component';


@NgModule({
  declarations: [ShowChatroomsComponent],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
