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
import {UserMessagesSubjectService} from "@core/services/user-messages-subject.service";

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
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private userMessagesStore: UserMessagesSubjectService,
        public auth: AuthService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        if (this.authUser) {
            this.getNotifications();
            this.getConnectWithUser();
            this.getAcceptedDeclinedRequests();
            this.cancelledUsersConnecting();
            this.getDisconnectUsers();
        }

    }

    getNotifications() {
        this.subscriptions.push(this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setAllNotifications(dt);
        }));
    }

    filterByCategory(notifications, category) {
        const filteredNotifications = notifications.filter(n => {
            const diff = moment().diff(n?.created_at, 'hours');
            return category === 'early' ? diff > 0 : diff <= 0;
        });
        // console.log(filteredNotifications, category);
        return filteredNotifications;
    }

    confirmConnection(notification) {
        this.socketService.acceptConnection({
            notification_id: notification.id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
        });
        this.notifications = this.notifications.filter(n => n.id !== notification.id);

        this.notificationsStore.setAllNotifications(this.notifications);
    }

    declineConnection(notification) {
        this.socketService.declineConnection({
            notification_id: notification.id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
        });

        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.notificationsStore.setAllNotifications(this.notifications);
    }

    getConnectWithUser() {
        this.subscriptions.push(this.socketService.getConnectWithUser().subscribe((dt: any) => {
            this.getNotifications();
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt);
            // console.log(dt.receiver_id, this.authUser.id)
            // console.log(this.notificationsStore.notifications, this.notifications)
            this.userMessagesStore.setUserMessages(dt.users_messages);
            if (dt.receiver_id === this.authUser.id) {
                // this.notifications.push(dt);
                // this.notifications = sortTableData(this.notifications, 'created_at', 'desc');
                // this.notificationsStore.setNotifications(this.notifications);
                this.getNotifications();
            }
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            // console.log('declined', dt);
            // this.notifications.push(dt);
            // this.notifications = sortTableData(this.notifications, 'created_at', 'desc');
            // this.notificationsStore.setNotifications(this.notifications);
            this.getNotifications();
        }));
    }

    getDisconnectUsers() {
        this.subscriptions.push(this.socketService.getDisconnectUsers().subscribe((dt: any) => {
            // console.log('disconnected', dt);
            this.getNotifications();
            // this.setNotifications.transform(dt);
            this.userMessagesStore.setUserMessages(dt.users_messages);
        }));
    }

    readNotification(n) {
        this.subscriptions.push(this.notificationsService.readNotification({
            id: n.id,
            type: n.notification_type.name
        }).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            console.log(dt);
            this.notificationsStore.setAllNotifications(dt);
        }));
    }

    markAllAsRead() {
        const ids = this.notificationsStore.allNotifications.map(n => n.id);
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
