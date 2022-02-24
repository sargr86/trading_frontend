import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {UserStoreService} from '@core/services/stores/user-store.service';

@Component({
    selector: 'app-show-groups',
    templateUrl: './show-groups.component.html',
    styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {
    authUser;

    constructor(
        public groupsMessagesStore: GroupsMessagesSubjectService,
        private userStore: UserStoreService
    ) {
    }

    ngOnInit(): void {
        this.getAuthUser();
    }

    getAuthUser() {
        this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        });
    }

    filterGroups(type) {
        return this.groupsMessagesStore.groupsMessages.filter(g => {
            return type === 'managed' ?
                g.creator_id === this.authUser.id :
                g.creator_id !== this.authUser.id;
        });
    }

}
