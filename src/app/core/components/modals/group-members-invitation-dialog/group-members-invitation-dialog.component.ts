import {Component, Inject, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {User} from '@shared/models/user';
import {Subscription} from 'rxjs';
import {UsersService} from '@core/services/users.service';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GetTwoArrayOfObjectsDifferencePipe} from '@shared/pipes/get-two-array-of-objects-difference.pipe';
import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {AbstractControl, FormArray, FormBuilder, FormGroup} from '@angular/forms';

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

    contactsInviteForm: FormGroup;

    constructor(
        @Inject(MAT_DIALOG_DATA) public authUser: User,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private usersMessagesStore: UsersMessagesSubjectService,
        private usersService: UsersService,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private dialog: MatDialogRef<GroupMembersInvitationDialogComponent>,
        private getArraysDifference: GetTwoArrayOfObjectsDifferencePipe,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.selectedGroup = this.groupsMessagesStore.selectedGroupMessages;
        this.getUserContactsFiltered();
        this.initForm();
    }

    initForm() {
        this.contactsInviteForm = this.fb.group({
            suggested_contacts: this.fb.array(this.getContactsFormGroup()),
            // selected_contacts: this.fb.array([])
        });

        this.contactsInviteForm.patchValue({
            suggested_contacts: this.selectedGroup.chat_group_members
        });

        // console.log(this.contactsInviteForm.value)
    }

    getContactsFormGroup() {
        const ret = [];
        this.usersMessagesStore.usersMessages.map((c, index) => {
            const found = this.selectedContacts.find(sc => sc.id === c.id);
            const foundInGroup = this.selectedGroup.chat_group_members.find(m => m.id === c.id);
            let connectionWithGroup = 'not joined';

            if (foundInGroup) {
                connectionWithGroup = !!foundInGroup.chat_groups_members.confirmed ? 'joined' : 'invited';
            }

            console.log('FOUND', found)
            ret.push(this.fb.group({
                name: 'contact_' + c.id,
                checked: !!found,
                status: connectionWithGroup,
                ...c
            }));
        });
        // console.log(ret)
        return ret;
    }

    getUserContactsFiltered() {
        this.usersMessagesStore.usersMessages.map(contact => {
            let connectionWithGroup = '';
            const foundInGroup = this.selectedGroup.chat_group_members.find(m => m.id === contact.id);
            if (foundInGroup) {
                const confirmationStatus = !!foundInGroup.chat_groups_members.confirmed;
                connectionWithGroup = confirmationStatus ? 'joined' : 'invited';
            } else {
                connectionWithGroup = 'not joined';
            }
            this.userContacts.push({...contact, connectionWithGroup});
        });

        console.log(this.userContacts)
    }


    filterOutAuthUser() {
        return this.selectedGroup.chat_group_members.filter(m => m.id !== this.authUser.id);
    }

    filterUnconfirmedMembers(allContacts, groupMembers) {
        const unconfirmedMembers = groupMembers.filter(m => m.chat_groups_members.confirmed === 0);
        console.log(unconfirmedMembers)
        this.userContacts = [...this.getArraysDifference.transform(allContacts, groupMembers), ...unconfirmedMembers];
        console.log(this.userContacts)
    }

    selectContact(event: Event, control: AbstractControl) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.selectedContacts.push(control.value);
        } else {
            this.selectedContacts = this.selectedContacts.filter(c => c.id !== control.value.id);
        }
        console.log(this.contactCtrls.value)
    }

    removeContactFromSelected(control: AbstractControl) {
        const foundControl = this.contactCtrls.controls.find(c => c.value.id === control.value.id);
        foundControl.patchValue({checked: false});
    }

    sendInvitationsToContacts() {

        this.subscriptions.push(this.chatService.addGroupMembers({
            group_id: this.selectedGroup.id,
            member_ids: this.selectedContacts.map(c => c.id)
        }).subscribe(dt => {
            console.log(dt)
            this.socketService.inviteToNewGroup({
                invited_members: this.selectedContacts,
                from_user: this.authUser,
                group: this.selectedGroup,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> has sent an invitation to join the <strong>${this.selectedGroup.name}</strong> group`,
            });
            this.groupsMessagesStore.changeGroup(dt);
            this.closeDialog();
        }));
    }

    ifUnconfirmedMember(contact) {
        // const memberDetails = contact.users_connections[0];
        // return memberDetails.confirmed === 0 && this.selectedGroup.id === memberDetails.group_id;
        return false;
    }

    closeDialog() {
        this.dialog.close();
    }

    filteredControls() {
        return this.contactCtrls.controls.filter(c => c.value.checked);
    }

    get contactCtrls() {
        return this.contactsInviteForm.controls.suggested_contacts as FormArray;
    }

    get checkedContactCtrls() {
        return this.contactCtrls.controls.filter(c => c.value.checked);
    }

}
