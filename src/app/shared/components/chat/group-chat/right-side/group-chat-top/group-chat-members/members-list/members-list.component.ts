import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP} from '@core/constants/chat';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() modalMode = false;

    groupMembers = [];
    subscriptions: Subscription[] = [];


    constructor(
        private dialog: MatDialog,
        private chatService: ChatService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getGroupMembers();
    }

    getGroupMembers() {
        this.groupMembers = this.selectedGroup.chat_group_members;
        this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.groupMembers = this.modalMode
                ? dt.chat_group_members
                : dt.chat_group_members.filter((m, index) => index < ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP);
        });
    }

    removeSavedMember(member_id) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({group_id: this.selectedGroup.id, member_id}).subscribe(dt => {
                    // this.groupMembers = dt?.chat_group_members;
                    this.selectedGroup = dt;
                    this.groupsMessagesStore.changeGroupMembers(this.selectedGroup);
                });
            }
        }));
    }

    getUserCurrentStatus(groupMember) {
        const groupName = this.groupsMessagesStore.groupsMessages.find(gm => gm.id === groupMember?.chat_groups_members?.group_id)?.name;
        // if (this.socketGroupsUsers && groupName === this.selectedGroup?.name) {
        //     return !!this.socketGroupsUsers.find(sGroupUser => sGroupUser.group === groupName && groupMember.username === sGroupUser.username);
        // }
        return false;
    }

    openAllMembersModal() {
        this.subscriptions.push(this.dialog.open(ShowChatGroupMembersComponent, {
            width: '700px',
            height: '500px',
        }).afterClosed().subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
