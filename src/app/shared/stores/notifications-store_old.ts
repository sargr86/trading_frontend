import { Injectable } from '@angular/core';
import { action, observable} from 'mobx';


@Injectable()
export class NotificationsStore_old {
    @observable notifications = [];

    @action setNotifications(notifications: any) {
        this.notifications =  notifications;
    }

}

export const notificationsStore = new NotificationsStore_old();
