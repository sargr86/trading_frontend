import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {UsersService} from '@core/services/users.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {DirectChatMessagesComponent} from '@shared/components/chat/direct-chat/direct-chat-messages/direct-chat-messages.component';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss'],
    providers: [DirectChatMessagesComponent]
})
export class ChatBottomBoxComponent implements OnInit, OnDestroy {
    authUser;

    messages = [];

    subscriptions: Subscription[] = [];

    @Input() channelUser;
    @Input() selectedGroup;
    @Input() chatBoxType = 'direct';
    @Input() isOpenedFromChannelPage = false;


    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private usersService: UsersService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
    }

    closeChatBox() {
        this.usersMessagesStore.showBottomChatBox = false;
        this.groupsMessagesStore.showBottomChatBox = false;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
