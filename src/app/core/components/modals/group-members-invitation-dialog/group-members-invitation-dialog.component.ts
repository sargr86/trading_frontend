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
        this.initForm();
    }

    initForm() {
        this.contactsInviteForm = this.fb.group({
            contacts: this.fb.array(this.getContactsFormGroup()),
        });
    }

    getContactsFormGroup() {
        const formArray = [];
        this.usersMessagesStore.usersMessages.map((c, index) => {
            const foundInSelected = this.selectedContacts.find(sc => sc.id === c.id);
            const foundInGroup = this.selectedGroup.chat_group_members.find(m => m.id === c.id);
            let connectionWithGroup = 'not joined';

            if (foundInGroup) {
                connectionWithGroup = !!foundInGroup.chat_groups_members.confirmed ? 'joined' : 'invited';
            }

            formArray.push(this.fb.group({
                name: 'contact_' + index,
                checked: !!foundInSelected,
                status: connectionWithGroup,
                ...c
            }));
        });
        return formArray;
    }

    selectContact(event: Event, control: AbstractControl) {
        const isChecked = (event.target as HTMLInputElement).checked;
        if (isChecked) {
            this.selectedContacts.push(control.value);
        } else {
            this.selectedContacts = this.selectedContacts.filter(c => c.id !== control.value.id);
        }
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

    checkJoinedMember(status) {
        return status === 'invited' || status === 'joined';
    }

    get contactCtrls() {
        return this.contactsInviteForm.controls.contacts as FormArray;
    }

    get checkedContactCtrls() {
        return this.contactCtrls.controls.filter(c => c.value.checked);
    }

    getCheckBoxControl(control) {
        return control.controls.checked;
    }

    closeDialog() {
        this.dialog.close();
    }

}
