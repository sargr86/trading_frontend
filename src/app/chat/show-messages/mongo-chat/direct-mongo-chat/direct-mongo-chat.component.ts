import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Subscription} from 'rxjs';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {UsersService} from '@core/services/users.service';
import {notificationsStore} from '@shared/stores/notifications-store';

@Component({
    selector: 'app-direct-mongo-chat',
    templateUrl: './direct-mongo-chat.component.html',
    styleUrls: ['./direct-mongo-chat.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class DirectMongoChatComponent implements OnInit, OnDestroy {
    @Input() authUser;
    subscriptions: Subscription[] = [];

    usersMessages = [];
    filteredUsersMessages = [];
    selectedUserMessages;


    blockedUsers = [];
    onlineUsers = [];
    showBlockedUsers = false;

    notificationsStore = notificationsStore;


    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private usersService: UsersService,
        public mobileHelper: MobileResponsiveHelper,
    ) {
    }

    ngOnInit(): void {
        this.getUsersMessages();
        this.getChatNotifications();
        this.getOnlineUsers();
        this.getBlockUnblockUser();
        this.getAcceptedDeclinedRequests();
        this.getCancelledUsersConnection();
        this.getDisconnectUser();
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
            return !!d.users_connections?.[0].is_blocked === show;
        });
        this.selectedUserMessages = this.filteredUsersMessages[0];
    }

    unreadLastMessages(usersMessages) {

    }

    getOnlineUsers() {
        this.socketService.getConnectedUsers({username: this.authUser.username});

        this.subscriptions.push(this.socketService.userOnlineFeedback().subscribe((dt: any) => {
            this.onlineUsers = dt;
        }));
    }

    getChatNotifications() {
        this.subscriptions.push(this.socketService.getChatNotifications().subscribe((data: any) => {
            console.log(data)
            this.onlineUsers = data.users;
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt);
            this.getUsersMessages();
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined');
        }));
    }

    getCancelledUsersConnection() {
        this.subscriptions.push(this.socketService.cancelledUsersConnecting().subscribe((dt: any) => {
            console.log('cancelled');
            this.getUsersMessages();
        }));
    }

    getDisconnectUser() {
        this.subscriptions.push(this.socketService.getDisconnectUsers({}).subscribe(dt => {
            console.log('disconnected', dt)
            this.setNotifications(dt);
            this.getUsersMessages();
        }));
    }

    blockUser(user) {
        const params = {
            connection_id: user.users_connections?.[0].id,
            user: this.authUser,
            block: +!this.showBlockedUsers,
            contact_username: user.username
        };

        this.subscriptions.push(this.usersService.blockUser(params).subscribe(dt => {
            this.getUsersMessages();
            this.socketService.blockUnblockUser({
                connection_id: user.users_connections?.[0].id,
                block: +!this.showBlockedUsers,
                from_id: this.authUser.id,
                to_id: user.id,
                msg: `<strong>${this.authUser.first_name} ${this.authUser.last_name}</strong> has blocked the connection between you two`,
                contact_username: user.username
            });
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            console.log('get block/unblock', dt);
            this.setNotifications(dt);
            this.getUsersMessages();
        }));
    }

    setNotifications(dt) {
        const notifications = this.notificationsStore.notifications;
        notifications.unshift(dt);
        this.notificationsStore.setNotifications(notifications);
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

    ngOnDestroy() {
        // this.setTyping(null);
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
