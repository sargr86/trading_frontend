import {Component, Input, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Subscription} from 'rxjs';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';

@Component({
    selector: 'app-direct-mongo-chat',
    templateUrl: './direct-mongo-chat.component.html',
    styleUrls: ['./direct-mongo-chat.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class DirectMongoChatComponent implements OnInit {
    @Input() authUser;
    subscriptions: Subscription[] = [];

    usersMessages = [];
    filteredUsersMessages = [];
    selectedUserMessages;


    blockedUsers = [];
    onlineUsers = [];
    showBlockedUsers = false;


    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        public mobileHelper: MobileResponsiveHelper
    ) {
    }

    ngOnInit(): void {
        this.getUsersMessages();
    }

    getUsersMessages() {
        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.usersMessages = dt;
            this.filteredUsersMessages = dt.filter(d => !!d.users_connections[0].is_blocked === this.showBlockedUsers);
            this.selectedUserMessages = this.filteredUsersMessages[0];
        }));
    }

    selectUserMessages(userMessages, lastMsg) {
        this.selectedUserMessages = userMessages;
    }

    toggleBlockedUsers(show) {
        this.showBlockedUsers = show;
        this.filteredUsersMessages = this.usersMessages.filter(d => {
            return !!d.users_connections?.[0].is_blocked === this.showBlockedUsers;
        });
        this.selectedUserMessages = this.filteredUsersMessages[0];
    }

    unreadLastMessages(usersMessages) {

    }

    blockUser(user) {

    }

    getUserLastMessage(messages) {
        return messages[messages.length - 1];
    }

    getUserCurrentStatus(username) {
        return this.onlineUsers.length === 0 || this.onlineUsers.includes(username);
    }

    ifContactsListActionsShown() {
        return this.filteredUsersMessages.length > 0;
    }

    ifContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    ifUnreadShown(lastMsg, user) {
        return lastMsg?.from_id !== this.authUser.id && !user.users_connections[0].is_blocked;
    }

    ifMoreActionsShown(lastMsg, user) {
        return !user.users_connections[0].is_blocked && (!lastMsg || lastMsg?.from_id === this.authUser.id || lastMsg?.seen === 1);
    }

    ifLastMessageSeen(lastMsg) {
        return lastMsg?.seen === 0 && lastMsg?.from_id !== this.authUser.id;
    }




}
