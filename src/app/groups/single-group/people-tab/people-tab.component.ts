import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-people-tab',
    templateUrl: './people-tab.component.html',
    styleUrls: ['./people-tab.component.scss']
})
export class PeopleTabComponent implements OnInit {
    @Input() selectedGroup;
    @Input() isOwnGroup;
    @Input() authUser;

    admins = [];
    members = [];
    requestedMembers = [];

    constructor() {
    }

    ngOnInit(): void {
        this.filterMembers();
    }

    filterMembers() {
        this.selectedGroup.chat_group_members.map(m => {
            if (this.selectedGroup.creator_id === m.id) {
                this.admins.push(m);
            } else {
                if (m.chat_groups_members.confirmed) {
                    this.members.push(m);
                } else {
                    this.requestedMembers.push(m);
                }
            }
        });
    }

}
