import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-show-groups',
    templateUrl: './show-groups.component.html',
    styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {
    authUser;
    groups = [];

    subscriptions: Subscription[] = [];

    constructor(
        public groupsMessagesStore: GroupsMessagesSubjectService,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        this.getAuthUser();
        this.trackGroups();
    }

    trackGroups() {
        this.subscriptions.push(this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            this.groups = dt;
        }));
    }

    getAuthUser() {
        this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        });
    }

    filterGroups(type) {
        return this.groups.filter(g => {
            return type === 'managed' ?
                g.creator_id === this.authUser.id :
                g.creator_id !== this.authUser.id;
        });
    }

}
