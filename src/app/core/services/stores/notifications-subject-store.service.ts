import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {sortTableData} from "@core/helpers/sort-table-data-by-column";

@Injectable({
    providedIn: 'root'
})
export class NotificationsSubjectStoreService {
    protected allNotificationsSource = new BehaviorSubject([]);
    protected unreadNotificationsSource = new BehaviorSubject([]);

    allNotifications$ = this.allNotificationsSource.asObservable();
    unreadNotifications$ = this.unreadNotificationsSource.asObservable();

    constructor() {
    }

    setAllNotifications(messages: any) {
        this.allNotificationsSource.next([...messages]);
    }

    addToNotifications(notification) {
        this.allNotifications.push(notification);
        const notifications = sortTableData(this.allNotifications, 'created_at', 'desc');
        this.setAllNotifications(notifications);
    }

    get allNotifications() {
        return this.allNotificationsSource.getValue();
    }

    setUnreadNotifications(messages: any) {
        this.allNotificationsSource.next([...messages]);
    }

    get unreadNotifications() {
        return this.unreadNotificationsSource.getValue();
    }
}
