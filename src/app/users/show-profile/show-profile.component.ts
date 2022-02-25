import {Component, OnInit} from '@angular/core';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {PROFILE_PAGE_TABS} from '@core/constants/global';
import {ActivatedRoute, Router} from '@angular/router';
import {UsersService} from '@core/services/users.service';

@Component({
    selector: 'app-show-profile',
    templateUrl: './show-profile.component.html',
    styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
    authUser;
    profileUser;
    profileTabs = PROFILE_PAGE_TABS;
    subscriptions: Subscription[] = [];

    connectionsCount = 0;
    connections = [];
    connectionRequests = [];
    passedUsername: string;

    ownProfile = false;

    constructor(
        private userStore: UserStoreService,
        private usersConnectionsStore: UsersMessagesSubjectService,
        private usersService: UsersService,
        private route: ActivatedRoute,
        public router: Router
    ) {
    }

    ngOnInit(): void {
        this.passedUsername = this.route.snapshot.params.username;
        this.getAuthUser();
        this.trackUserConnections();
        this.getUserInfo();
        console.log(this.passedUsername)
    }

    getAuthUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        }));
    }

    getUserInfo() {
        this.ownProfile = this.authUser.username === this.passedUsername;
        if (this.passedUsername) {
            this.usersService.getUserInfo({
                username: this.passedUsername,
                own_channel: this.ownProfile
            }).subscribe(dt => {
                if (dt) {
                    this.profileUser = dt;
                }
            });
        }
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
