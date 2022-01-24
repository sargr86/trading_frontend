import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

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
