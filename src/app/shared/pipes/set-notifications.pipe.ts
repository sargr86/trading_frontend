import {Pipe, PipeTransform} from '@angular/core';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';

@Pipe({
    name: 'setNotifications'
})
export class SetNotificationsPipe implements PipeTransform {

    constructor(private notificationsStore: NotificationsSubjectStoreService) {

    }

    transform(dt: any): void {
        const notifications = this.notificationsStore.allNotifications;
        notifications.unshift(dt);
        this.notificationsStore.setAllNotifications(notifications);
    }

}
