import {Component, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {PROFILE_PAGE_TABS} from '@core/constants/global';
import {Router} from '@angular/router';

@Component({
    selector: 'app-show-profile',
    templateUrl: './show-profile.component.html',
    styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
    authUser;
    profileTabs = PROFILE_PAGE_TABS;
    subscriptions: Subscription[] = [];

    connectionsCount = 0;
    connections = [];
    connectionRequests = [];

    constructor(
        private userStore: UserStoreService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        public router: Router
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
            this.connections = dt.filter(d => d.users_connections[0].confirmed === 1);
            this.connectionRequests = dt.filter(d => d.users_connections[0].confirmed === 0);
        });
    }

    onOutletLoaded(component) {
        if (this.connections) {
            component.connections = this.connections;
            component.connectionRequests = this.connectionRequests;
            component.authUser = this.authUser;
        }
    }

}
