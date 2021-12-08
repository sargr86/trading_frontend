import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {NotificationsService} from '@core/services/notifications.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {Router} from '@angular/router';
import {notificationsStore} from '@shared/stores/notifications-store';
import {sortTableData} from '@core/helpers/sort-table-data-by-column';
import * as moment from 'moment';

@Component({
    selector: 'app-notifications-list',
    templateUrl: './notifications-list.component.html',
    styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {

    authUser;
    notifications = [];
    notificationsStore = notificationsStore;

    subscriptions: Subscription[] = [];

    @Input() shownInSidebar = false;
    @Input() notificationsCategory = 'new';

    constructor(
        private notificationsService: NotificationsService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getNotifications();
        this.getConnectWithUser();
        this.getAcceptedDeclinedRequests();
    }

    getNotifications() {
        this.subscriptions.push(this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            console.log(dt)
            this.notificationsStore.setNotifications(dt);
        }));
    }

    filterByCategory(notifications, category) {
        // console.log('OK')
        const filteredNotifications = notifications.filter(n => {
            const diff = moment().diff(n.created_at, 'hours');
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

        this.notificationsStore.setNotifications(this.notifications);
    }

    declineConnection(notification) {
        this.socketService.declineConnection({
            notification_id: notification.id,
            connection_id: notification.connection_id,
            to_user: notification.from_user,
            from_user: notification.to_user,
        });

        this.notifications = this.notifications.filter(n => n.id !== notification.id);
        this.notificationsStore.setNotifications(this.notifications);
    }

    getConnectWithUser() {
        this.subscriptions.push(this.socketService.getConnectWithUser().subscribe((dt: any) => {
            this.getNotifications();
        }));
    }

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt);
            this.notifications.push(dt);
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setNotifications(this.notifications);
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined', dt);
            this.notifications.push(dt);
            this.notificationsStore.setNotifications(this.notifications);
        }));
    }

    readNotification(n) {
        this.subscriptions.push(this.notificationsService.readNotification({
            id: n.id,
            type: n.notification_type.name
        }).subscribe((dt: any) => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            console.log(dt);
            this.notificationsStore.setNotifications(dt);
        }));
    }

    markAllAsRead() {
        const ids = this.notificationsStore.notifications.map(n => n.id);
        console.log(this.notificationsStore.notifications)
        this.notificationsService.markNotificationsAsRead({ids, user_id: this.authUser.id}).subscribe(dt => {
            this.notifications = sortTableData(dt, 'created_at', 'desc');
            this.notificationsStore.setNotifications(dt);
        });
        console.log(ids)
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
