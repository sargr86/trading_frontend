import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GroupsService} from '@core/services/groups.service';
import {Subscription} from 'rxjs';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-people-tab',
    templateUrl: './people-tab.component.html',
    styleUrls: ['./people-tab.component.scss']
})
export class PeopleTabComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() isOwnGroup;
    @Input() authUser;

    admins = [];
    members = [];
    requestedMembers = [];

    subscriptions: Subscription[] = [];

    constructor(
        private groupsService: GroupsService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.trackGroupsMessages();
    }

    trackGroupsMessages() {
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe(dt => {
            this.selectedGroup = dt;
            this.admins = [];
            this.members = [];
            this.requestedMembers = [];
            this.filterMembers();
        }));
    }

    filterMembers() {
        this.selectedGroup.chat_group_members.map(m => {
            if (this.selectedGroup.creator_id === m.id) {
                this.admins.push(m);
            } else {
                if (m.chat_groups_members.confirmed) {
                    this.members.push(m);
                } else if (m.chat_groups_members.accepted) {
                    this.requestedMembers.push(m);
                }
            }
        });
    }

    confirmJoinGroup(member) {
        this.subscriptions.push(this.groupsService.confirmGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            console.log(dt)
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsMessagesStore.changeGroup(selectedGroup);
        }));
    }

    ignoreJoinGroup(member) {
        this.subscriptions.push(this.groupsService.ignoreGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            console.log(dt)
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsMessagesStore.changeGroup(selectedGroup);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
