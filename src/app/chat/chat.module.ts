import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ChatRoutingModule} from './chat-routing.module';
import {ShowChatroomsComponent} from './show-chatrooms/show-chatrooms.component';
import {ShowMessagesComponent} from './show-messages/show-messages.component';
import {SharedModule} from '@shared/shared.module';
import {DirectMongoChatComponent} from './show-messages/mongo-chat/direct-mongo-chat/direct-mongo-chat.component';
import { GroupMongoChatComponent } from './show-messages/mongo-chat/group-mongo-chat/group-mongo-chat.component';
import {SharedChatHelper} from '@core/helpers/shared-chat-helper';


@NgModule({
    declarations: [
        ShowChatroomsComponent,
        ShowMessagesComponent,
        DirectMongoChatComponent,
        GroupMongoChatComponent
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        SharedModule
    ],
    providers: [
    ]
})
export class ChatModule {
}
