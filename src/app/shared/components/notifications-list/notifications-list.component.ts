import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationsService} from '@core/services/notifications.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';
import {AuthService} from '@core/services/auth.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

    authUser;
    subscriptions: Subscription[] = [];

    @Input() shownInSidebar = false;
    @Input() notificationsCategory = 'new';

    constructor(
        private notificationsService: NotificationsService,
        public notificationsStore: NotificationsSubjectStoreService,
        private usersMessagesStore: UsersMessagesSubjectService,
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
        this.getGroupJoinInvitation();

    }

    getNotifications() {
        this.subscriptions.push(this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notificationsStore.setInitialNotifications(dt);
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
        this.socketService.acceptConnection({
            notification_id: notification._id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has accepted your connection request`
        });

        console.log(this.notificationsStore.allNotifications, notification._id)
        const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
        console.log(notifications)
        this.notificationsStore.setInitialNotifications(notifications);
    }

    declineConnection(notification) {
        this.socketService.declineConnection({
            notification_id: notification._id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
            msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has declined your connection request`
        });

        const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
        this.notificationsStore.setInitialNotifications(notifications);
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
            const {notification, users_messages} = dt;

            this.usersMessagesStore.setUserMessages(users_messages);
            if (notification.to_user.id === this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);

            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            this.notificationsStore.updateNotifications(dt);
        }));
    }

    getDisconnectUsers() {
        this.subscriptions.push(this.socketService.getDisconnectUsers().subscribe((dt: any) => {
            console.log('disconnected', dt);
            console.log(this.usersMessagesStore.selectedUserMessages)
            if (dt.to_user.id === this.authUser.id) {
                this.notificationsStore.updateNotifications(dt);
            }
            this.usersMessagesStore.setUserMessages(dt.users_messages);
        }));
    }

    readNotification(n) {
        this.subscriptions.push(this.notificationsService.readNotification({
            id: n._id,
            type: n.type,
            read_by: this.authUser
        }).subscribe((dt: any) => {
            const notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(notifications);
        }));
    }

    markAllAsRead() {
        const notifications = this.notificationsStore.allNotifications.map(n => {
            return {id: n._id, type: n.type};
        });
        this.notificationsService.markNotificationsAsRead({
            notifications, user_id: this.authUser.id, read_by: this.authUser
        }).subscribe(dt => {
            const allNotifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(allNotifications);
        });
    }

    removeNotification(n) {
        this.subscriptions.push(this.notificationsService.removeNotification({
            id: n.id,
            type: n.notification_type.name
        }).subscribe((dt: any) => {
            const notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(notifications);
        }));
    }

    removeAll() {
        this.subscriptions.push(this.notificationsService.removeAllNotifications({
            user_id: this.authUser.id
        }).subscribe((dt: any) => {
            const notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(notifications);
        }));
    }

    cancelledUsersConnecting() {
        this.socketService.cancelledUsersConnecting().subscribe(dt => {
            // console.log(dt, 'cancelled')
            this.getNotifications();
        });
    }

    async onNotificationClick(notification) {
        const type = notification?.type;

        this.readNotification(notification);
        if (type === 'accept_group_invitation') {
            console.log(notification.link, decodeURI(notification.link))
            await this.router.navigateByUrl(notification.link);
            // this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            //     await this.router.navigate(['channels/show'], {queryParams: {username}})
            // );
        }

    }

    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
            console.log('aaa', data);
            if (this.authUser.id === data.to_id) {
                this.notificationsStore.updateNotifications(data);
                // console.log(this.notificationsStore.allNotifications)
                // this.setNotifications.transform(data);
            }
        }));
    }

    acceptGroupJoin(notification) {
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.chatService.acceptGroupJoin({
                group_id: selectedGroup.id,
                member_id: this.authUser.id,
                from_user: this.authUser,
            }).subscribe(dt => {
                this.socketService.acceptJoinToGroup({
                    group: selectedGroup,
                    user: this.authUser,
                    notification_id: notification._id,
                    msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has accepted to join the <strong>${selectedGroup.name}</strong> group`,
                    link: `/channels/show?username=${this.authUser.username}`,
                });
                this.groupMessagesStore.setGroupsMessages(dt);

                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

            })
        );
    }

    declineGroupJoin(notification) {
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.chatService.declineGroupJoin({
                group_id: notification.group_id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.socketService.declineJoinToGroup({
                    group: selectedGroup,
                    user: this.authUser,
                    notification_id: notification._id
                });

                console.log(notification)
                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

                this.groupMessagesStore.setGroupsMessages(dt);
            })
        );
    }

    isNotificationRead(notification) {
        return notification?.read;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
