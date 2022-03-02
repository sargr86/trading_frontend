import {Component, Inject, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {UsersService} from '@core/services/users.service';

@Component({
    selector: 'app-group-members-invitation-dialog',
    templateUrl: './group-members-invitation-dialog.component.html',
    styleUrls: ['./group-members-invitation-dialog.component.scss']
})
export class GroupMembersInvitationDialogComponent implements OnInit {
    selectedGroup;
    userContacts: User[] = [];
    selectedContacts: User[] = [];

    subscriptions: Subscription[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public authUser: User,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private usersService: UsersService
    ) {
    }

    ngOnInit(): void {
        this.selectedGroup = this.groupsMessagesStore.selectedGroupMessages;
        this.getUserContacts();
    }

    getUserContacts() {
        this.subscriptions.push(this.usersService.getUserContacts({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe((dt: User[]) => {
            this.userContacts = dt;
        }));
    }

    selectContact(event: Event, contact: User) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.selectedContacts.push(contact);
        } else {
            this.selectedContacts = this.selectedContacts.filter(c => c.id !== contact.id);
        }
    }

    filteredMembers() {
        return this.selectedGroup.chat_group_members.filter(m => m.id !== this.authUser.id)
    }

}
