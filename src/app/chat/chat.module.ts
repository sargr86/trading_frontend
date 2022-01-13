import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChatRoutingModule} from './chat-routing.module';
import {ShowChatroomsComponent} from './show-chatrooms/show-chatrooms.component';
import {ShowMessagesComponent} from './show-messages/show-messages.component';
import {SharedModule} from '@shared/shared.module';
import { DirectChatComponent } from './show-messages/direct-chat/direct-chat.component';
import { GroupChatComponent } from './show-messages/group-chat/group-chat.component';
import { DirectMongoChatComponent } from './show-messages/mongo-chat/direct-mongo-chat/direct-mongo-chat.component';
import { UsersListComponent } from './show-messages/mongo-chat/direct-mongo-chat/users-list/users-list.component';


@NgModule({
    declarations: [ShowChatroomsComponent, ShowMessagesComponent, DirectChatComponent, GroupChatComponent, DirectMongoChatComponent, UsersListComponent],
    imports: [
        CommonModule,
        ChatRoutingModule,
        SharedModule
    ]
})
export class ChatModule {
}
