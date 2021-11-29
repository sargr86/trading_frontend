import {Component, OnInit} from '@angular/core';
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
    }

    getNotifications() {
        this.subscriptions.push(this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notifications = dt;
            this.notificationsStore.setNotifications(dt);
        }));
    }

    confirmConnection(notification) {
        console.log(notification)
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

}
