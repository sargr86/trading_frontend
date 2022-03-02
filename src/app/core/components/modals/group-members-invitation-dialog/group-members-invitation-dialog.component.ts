import {Component, Inject, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {UsersService} from '@core/services/users.service';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';

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
        private usersService: UsersService,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private dialog: MatDialogRef<GroupMembersInvitationDialogComponent>
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

    sendInvitationsToContacts() {

        this.subscriptions.push(this.chatService.addGroupMembers({
            group_id: this.selectedGroup.id,
            member_ids: this.selectedContacts.map(c => c.id)
        }).subscribe(dt => {

            this.socketService.inviteToNewGroup({
                invited_members: this.selectedContacts,
                from_user: this.authUser,
                group: this.selectedGroup,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has sent an invitation to join the <strong>${this.selectedGroup.name}</strong> group`,
            });
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
        }));
    }

    closeDialog() {
        this.dialog.close();
    }

}
