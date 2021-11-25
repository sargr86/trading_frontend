import {Component, OnInit} from '@angular/core';
import {NotificationsService} from "@core/services/notifications.service";
import {GetAuthUserPipe} from "@shared/pipes/get-auth-user.pipe";
import * as moment from "moment";

@Component({
    selector: 'app-show-notifications',
    templateUrl: './show-notifications.component.html',
    styleUrls: ['./show-notifications.component.scss']
})
export class ShowNotificationsComponent implements OnInit {
    authUser;
    notifications = [];

    constructor(
        private notificationsService: NotificationsService,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getNotifications();
    }

    getNotifications() {
        this.notificationsService.getAuthUserNotifications({user_id: this.authUser.id}).subscribe((dt: any) => {
            this.notifications = dt;
        });
    }

}
