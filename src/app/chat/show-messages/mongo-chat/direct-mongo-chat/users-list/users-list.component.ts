import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {notificationsStore} from '@shared/stores/notifications-store';
import {SocketIoService} from '@core/services/socket-io.service';
import {UsersService} from '@core/services/users.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';

@Component({
    selector: 'app-users-list',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Output() refresh = new EventEmitter();

    subscriptions: Subscription[] = [];
    filteredUsersMessages = [];
    selectedUserMessages;


    blockedUsers = [];
    onlineUsers = [];
    showBlockedUsers = false;

    notificationsStore = notificationsStore;

    constructor(
        private socketService: SocketIoService,
        private usersService: UsersService,
        private userMessagesStore: UserMessagesSubjectService,
        public mobileHelper: MobileResponsiveHelper,
    ) {
    }

    ngOnInit(): void {
        this.getUserMessages();
        this.getOnlineUsers();
        this.getBlockUnblockUser();
        this.getAcceptedDeclinedRequests();
        this.getCancelledUsersConnection();
        this.getDisconnectUser();
        this.getSeen();
    }

    selectUserMessages(userMessages, lastMsg) {
        this.selectedUserMessages = userMessages;
        this.userMessagesStore.changeUser(userMessages);
    }

    getUserMessages() {
        this.userMessagesStore.userMessages$.subscribe(dt => {
            console.log('users list!!!', dt)
            this.filteredUsersMessages = dt.filter(d => !!d.users_connections[0].is_blocked === this.showBlockedUsers);
            this.selectedUserMessages = this.filteredUsersMessages[0];
            this.userMessagesStore.changeUser(this.selectedUserMessages);
        });
    }

    toggleBlockedUsers(show) {
        this.showBlockedUsers = show;
        this.filteredUsersMessages = this.userMessagesStore.userMessages.filter(d => {
            return !!d.users_connections?.[0].is_blocked === show;
        });
        this.selectedUserMessages = this.filteredUsersMessages[0];
        this.userMessagesStore.changeUser(this.selectedUserMessages);
    }

    unreadLastMessages(usersMessages) {
        const messages = usersMessages.direct_messages;
        const lastReceivedMessages = [];

        messages.reverse().some((message) => {
            if (message.from_id !== this.authUser.id) {
                lastReceivedMessages.push(message);
            }
            return message.from_id === this.authUser.id;
        });
        messages.reverse();

        const params = {
            connection_id: usersMessages.users_connections?.[0].id,
            message_ids: lastReceivedMessages.map(m => m._id),
            to_user: usersMessages.username,
            from_user: this.authUser.username,
            from_id: this.authUser.id,
            to_id: usersMessages.id
        };

        if (params.message_ids.length > 0) {
            this.socketService.unreadLastMessages(params);
        }
    }

    getOnlineUsers() {

        this.socketService.getConnectedUsers({username: this.authUser.username});

        this.subscriptions.push(this.socketService.userOnlineFeedback().subscribe((dt: any) => {
            this.onlineUsers = dt;
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt);
            this.refresh.emit();
        }));
    }

    getCancelledUsersConnection() {
        this.subscriptions.push(this.socketService.cancelledUsersConnecting().subscribe((dt: any) => {
            console.log('cancelled');
            this.refresh.emit();
        }));
    }

    getDisconnectUser() {
        this.subscriptions.push(this.socketService.getDisconnectUsers({}).subscribe(dt => {
            console.log('disconnected', dt);
            this.setNotifications(dt);
            this.refresh.emit();
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
            this.refresh.emit();
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
            this.refresh.emit();
        }));
    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            const {from_id, to_id, direct_messages} = dt;

            if (this.selectedUserMessages.id === from_id) {
                this.userMessagesStore.changeUserMessages(from_id, direct_messages);
            } else {
                this.userMessagesStore.changeUserMessages(to_id, direct_messages);
            }
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
        return !user.users_connections[0].is_blocked && (!lastMsg || lastMsg?.from_id === this.authUser.id || lastMsg?.seen);
    }

    ifLastMessageUnseen(lastMsg) {
        return !lastMsg?.seen && lastMsg?.from_id !== this.authUser.id;
    }

    getUnseenMessagesCount(userMessages) {
        return userMessages.direct_messages.filter(um => !um.seen).length;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
