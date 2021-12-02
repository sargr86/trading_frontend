import {Component, Input, OnInit} from '@angular/core';
import {NotificationsService} from '@core/services/notifications.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {notificationsStore} from '@shared/stores/notifications-store';

@Component({
    selector: 'app-show-notifications',
    templateUrl: './show-notifications.component.html',
    styleUrls: ['./show-notifications.component.scss']
})
export class ShowNotificationsComponent implements OnInit {
    authUser;
    notifications = [];
    notificationsStore = notificationsStore;

    subscriptions: Subscription[] = [];

    @Input() shownInSidebar = false;

    constructor(
        private notificationsService: NotificationsService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService
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
            this.notifications = dt;
            console.log(dt)
            this.notificationsStore.setNotifications(dt);
        }));
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
            console.log('accepted', dt)
            this.notifications.push(dt);
            this.notificationsStore.setNotifications(this.notifications);
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined')
            this.notifications.push(dt);
            this.notificationsStore.setNotifications(this.notifications);
        }));
    }

    readNotification(id) {
        this.subscriptions.push(this.notificationsService.readNotification({id}).subscribe((dt: any) => {

        }));
    }

}
