import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationsService} from '@core/services/notifications.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';
import * as moment from 'moment';
import {AuthService} from '@core/services/auth.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

    authUser;
    notifications = [];

    subscriptions: Subscription[] = [];

    @Input() shownInSidebar = false;
    @Input() notificationsCategory = 'new';

    constructor(
        private notificationsService: NotificationsService,
        public notificationsStore: NotificationsSubjectStoreService,
        private userMessagesStore: UserMessagesSubjectService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private chatService: ChatService,
        public auth: AuthService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        if (this.authUser) {
            this.getNotifications();
            this.getConnectWithUser();
            this.cancelledUsersConnecting();
        }
        this.getAcceptedDeclinedRequests();
        this.getDisconnectUsers();

    }

    getNotifications() {
        this.subscriptions.push(this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notificationsStore.setInitialNotifications(dt);
            this.notifications = this.notificationsStore.allNotifications;
            // console.log(this.notifications);
        }));
    }

    filterByCategory(notifications, category) {
        // const filteredNotifications = notifications.filter(n => {
        //     const diff = moment().diff(n?.created_at, 'hours');
        //     return category === 'early' ? diff > 0 : diff <= 0;
        // });
        // console.log(filteredNotifications, category);
        return notifications;
    }

    acceptConnection(notification) {
        console.log(notification)
        this.socketService.acceptConnection({
            notification_id: notification._id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has accepted your connection request`
        });
        this.notifications = this.notifications.filter(n => n.id !== notification.id);

        this.notificationsStore.setInitialNotifications(this.notifications);
    }

    declineConnection(notification) {
        console.log(notification)
        this.socketService.declineConnection({
            notification_id: notification._id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has declined your connection request`
        });

        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.notificationsStore.setAllNotifications(this.notifications);
    }

    getConnectWithUser() {
        this.subscriptions.push(this.socketService.getConnectWithUser().subscribe((dt: any) => {
            if (this.authUser.id === dt.notification.to_user.id) {
                this.notificationsStore.updateNotifications(dt.notification);
            }
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt);
            this.userMessagesStore.setUserMessages(dt.users_messages);
            if (dt.to_user.id === this.authUser.id) {
                this.notificationsStore.updateNotifications(dt);
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            this.notificationsStore.updateNotifications(dt);
        }));
    }

    getDisconnectUsers() {
        this.subscriptions.push(this.socketService.getDisconnectUsers().subscribe((dt: any) => {
            console.log('disconnected', dt.users_messages);
            this.getNotifications();
            // this.setNotifications.transform(dt);
            this.userMessagesStore.setUserMessages(dt.users_messages);
        }));
    }

    readNotification(n) {
        this.subscriptions.push(this.notificationsService.readNotification({
            id: n._id,
            type: n.type
        }).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            console.log(dt);
            this.notificationsStore.setAllNotifications(dt);
        }));
    }

    markAllAsRead() {
        const ids = this.notificationsStore.allNotifications.map(n => n._id);
        this.notificationsService.markNotificationsAsRead({ids, user_id: this.authUser.id}).subscribe(dt => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(dt);
        });
    }

    removeNotification(n) {
        this.subscriptions.push(this.notificationsService.removeNotification({
            id: n.id,
            type: n.notification_type.name
        }).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(dt);
        }));
    }

    removeAll() {
        this.subscriptions.push(this.notificationsService.removeAllNotifications({
            user_id: this.authUser.id
        }).subscribe((dt: any) => {
            this.notifications = dt;
            this.notificationsStore.setAllNotifications(dt);
        }));
    }

    cancelledUsersConnecting() {
        this.socketService.cancelledUsersConnecting().subscribe(dt => {
            // console.log(dt, 'cancelled')
            this.getNotifications();
        });
    }

    onNotificationClick(type) {
        if (type === 'group_join_invitation') {
            this.router.navigate(['chat/messages']);
        }
    }

    acceptGroupJoin(notification) {
        console.log(notification)
        // this.subscriptions.push(
        //     this.chatService.acceptGroupJoin({
        //         group_id: notification.group_id,
        //         member_id: this.authUser.id,
        //         from_user: this.authUser
        //     }).subscribe(dt => {
        //
        //         this.socketService.acceptJoinToGroup({group: this.selectedGroup, user: this.authUser});
        //         this.groupMessagesStore.setGroupsMessages(dt);
        //     })
        // );
    }

    declineGroupJoin(notification) {
        // this.subscriptions.push(
        //     this.chatService.declineGroupJoin({
        //         group_id: notification.group_id,
        //         member_id: this.authUser.id
        //     }).subscribe(dt => {
        //         this.socketService.declineJoinToGroup({
        //             group: this.selectedGroup,
        //             user: this.authUser
        //         });
        //         this.groupMessagesStore.setGroupsMessages(dt);
        //     })
        // );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
