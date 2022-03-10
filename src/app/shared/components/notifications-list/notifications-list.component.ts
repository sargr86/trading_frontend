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
import {UserStoreService} from '@core/services/stores/user-store.service';
import {group} from '@angular/animations';
import {GroupsService} from '@core/services/groups.service';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];

    @Input() shownInSidebar = false;
    @Input() notificationsCategory = 'new';
    @Input() authUser;

    constructor(
        private notificationsService: NotificationsService,
        public notificationsStore: NotificationsSubjectStoreService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private groupsService: GroupsService,
        private userStore: UserStoreService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        public auth: AuthService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        if (this.userStore.isAuthenticated()) {
            this.getNotifications();
            this.getConnectWithUser();
            this.cancelledUsersConnecting();
        }
        this.getAcceptedDeclinedRequests();
        this.getConfirmedJoinGroup();
        this.getJoinGroup();
        this.getIgnoredJoinGroup();
        this.getDisconnectUsers();
        this.getGroupJoinInvitation();
        this.getRemovedFromGroup();
        this.getLeftGroup();
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

        // console.log(this.notificationsStore.allNotifications, notification._id)
        const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
        // console.log(notifications)
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
            console.log(this.usersMessagesStore.selectedUserMessages);
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
            console.log(notification.link, decodeURI(notification.link));
            await this.router.navigateByUrl(notification.link);
            // this.router.navigateByUrl('/', {skipLocationChange: true}).then(async () =>
            //     await this.router.navigate(['channels/show'], {queryParams: {username}})
            // );
        }

    }

    // ---------------- GROUPS STUFF-----------------------------------------------------------
    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToChatGroupSent().subscribe((data: any) => {
            console.log('aaa', this.authUser);
            if (this.authUser?.id === data.to_id) {
                this.notificationsStore.updateNotifications(data);
                // console.log(this.notificationsStore.allNotifications)
                // this.setNotifications.transform(data);
            }
        }));
    }

    acceptChatGroupJoin(notification) {
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.chatService.acceptGroupJoin({
                group_id: selectedGroup.id,
                member_id: this.authUser.id,
                from_user: this.authUser,
            }).subscribe(dt => {
                this.socketService.acceptJoinToChatGroup({
                    group: selectedGroup,
                    from_user: this.authUser,
                    notification_id: notification._id,
                    msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has accepted to join the <strong>${selectedGroup.name}</strong> group`,
                    link: `/channels/show?username=${this.authUser.username}`,
                    group_type: 'page'
                });
                console.log('ACCEPTED', dt)
                this.groupsMessagesStore.setGroupsMessages(dt);

                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

            })
        );
    }

    declineChatGroupJoin(notification) {
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.chatService.declineGroupJoin({
                group_id: notification.group_id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.socketService.declineJoinToChatGroup({
                    group: selectedGroup,
                    from_user: this.authUser,
                    notification_id: notification._id,
                    message: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has declined joining the <strong>${selectedGroup.name}</strong> group`,
                });

                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

                this.groupsMessagesStore.setGroupsMessages(dt);
            })
        );
    }

    acceptPageGroupJoin(notification) {
        console.log(notification)
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.groupsService.acceptGroupJoin({
                group_id: selectedGroup.id,
                member_id: this.authUser.id,
                from_user: this.authUser
            }).subscribe(dt => {
                this.socketService.acceptJoinToPageGroup({
                    group: selectedGroup,
                    from_user: this.authUser,
                    notification_id: notification._id,
                    msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has accepted to join the <strong>${selectedGroup.name}</strong> group`,
                    link: `/channels/show?username=${this.authUser.username}`,
                    group_type: 'page'
                });
                console.log('ACCEPTED', dt)
                this.groupsMessagesStore.setGroupsMessages(dt);

                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

            })
        );
    }

    declinePageGroupJoin(notification) {
        const selectedGroup = {id: notification.group_id, name: notification.group_name};
        this.subscriptions.push(
            this.groupsService.declineGroupJoin({
                group_id: notification.group_id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.socketService.declineJoinToPageGroup({
                    group: selectedGroup,
                    from_user: this.authUser,
                    notification_id: notification._id,
                    message: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has declined joining the <strong>${selectedGroup.name}</strong> group`,
                });

                const notifications = this.notificationsStore.allNotifications.filter(n => n._id !== notification._id);
                this.notificationsStore.setInitialNotifications(notifications);

                this.groupsMessagesStore.setGroupsMessages(dt);
            })
        );
    }

    getJoinGroup() {
        this.subscriptions.push(this.socketService.getJoinGroup().subscribe((data: any) => {
            const {notification, rest} = data;
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
            this.groupsMessagesStore.changeGroup(rest.group);
        }));
    }

    getConfirmedJoinGroup() {
        this.subscriptions.push(this.socketService.getConfirmedJoinGroup().subscribe((data: any) => {
            const {notification, rest} = data;
            console.log('confirmed in notifications', data)
            // console.log(this.notificationsStore.allNotifications)
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
            this.groupsMessagesStore.changeGroup(rest.group);
        }));
    }

    getIgnoredJoinGroup() {
        this.subscriptions.push(this.socketService.getIgnoredJoinGroup().subscribe((data: any) => {
            const {notification, rest} = data;
            console.log('ignored in notifications list', data)
            // console.log(this.notificationsStore.allNotifications)
            // console.log(this.notificationsStore.allNotifications)
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
        }));
    }

    getRemovedFromGroup() {
        this.subscriptions.push(this.socketService.removeFromChatGroupNotify().subscribe((data: any) => {
            const {currentUserNotifications, member, leftGroups} = data;
            console.log(data)
            this.notificationsStore.setAllNotifications(currentUserNotifications);

            if (member.id === this.authUser.id) {
                console.log('here')
                this.groupsMessagesStore.setGroupsMessages(leftGroups);
                if (this.router.url.includes('chat/messages')) {
                    this.groupsMessagesStore.selectGroup({});
                } else {
                    console.log('OK')
                    this.groupsMessagesStore.changeGroup(data.group);
                }
            } else if (!this.router.url.includes('chat/messages')) {
                this.groupsMessagesStore.changeGroup(data.group);
                console.log(this.groupsMessagesStore.selectedGroupMessages)
            }

            // console.log(this.notificationsStore.allNotifications)
        }));
    }

    getLeftGroup() {
        this.subscriptions.push(this.socketService.leaveChatGroupNotify().subscribe((data: any) => {
            const {group} = data;
            console.log('left', data)
            if (data.from_user.id === this.authUser.id) {
                this.groupsMessagesStore.selectGroup({});
            } else {
                this.notificationsStore.updateNotifications(data);
                this.groupsMessagesStore.changeGroup(group);
            }
        }));
    }

    isNotificationRead(notification) {
        return notification?.read;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
