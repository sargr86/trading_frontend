import {Component, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';

@Component({
    selector: 'app-show-profile',
    templateUrl: './show-profile.component.html',
    styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
    authUser;
    profileTabs = [];
    subscriptions: Subscription[] = [];

    connectionsCount = 0;

    constructor(
        private userStore: UserStoreService,
        private usersConnectionsStore: UsersMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getAuthUser();
        this.trackUserConnections();
        console.log(this.usersConnectionsStore.usersMessages)
    }

    getAuthUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        }));
    }

    trackUserConnections() {
        this.usersConnectionsStore.usersMessages$.subscribe(dt => {
            this.connectionsCount = dt.length;
            console.log(dt)
        });
    }

    onOutletLoaded(component) {

    }

    detectImageChange() {

    }

}
