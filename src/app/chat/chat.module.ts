import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChatRoutingModule} from './chat-routing.module';
import {ShowChatroomsComponent} from './show-chatrooms/show-chatrooms.component';
import {ShowMessagesComponent} from './show-messages/show-messages.component';
import {SharedModule} from '@shared/shared.module';
import {DirectChatComponent} from './show-messages/direct-chat/direct-chat.component';
import {GroupChatComponent} from './show-messages/group-chat/group-chat.component';
import {DirectMongoChatComponent} from './show-messages/mongo-chat/direct-mongo-chat/direct-mongo-chat.component';


@NgModule({
    declarations: [
        ShowChatroomsComponent,
        ShowMessagesComponent,
        DirectChatComponent,
        GroupChatComponent,
        DirectMongoChatComponent
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        SharedModule
    ]
})
export class ChatModule {
}
