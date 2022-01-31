import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    groupMembers = [];
    subscriptions: Subscription[] = [];



    constructor(
        private dialog: MatDialog,
        private chatService: ChatService,
    ) {
    }

    ngOnInit(): void {

    }

    removeSavedMember(member_id) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({group_id: this.selectedGroup.id, member_id}).subscribe(dt => {
                    this.groupMembers = dt?.chat_group_members;
                });
            }
        }));
    }

    getUserCurrentStatus(groupMember) {
        // const groupName = this.groupsMessages.find(gm => gm.id === groupMember?.chat_groups_members?.group_id)?.name;
        // if (this.socketGroupsUsers && groupName === this.selectedGroup?.name) {
        //     return !!this.socketGroupsUsers.find(sGroupUser => sGroupUser.group === groupName && groupMember.username === sGroupUser.username);
        // }
        return false;
    }

    openAllMembersModal() {
        this.subscriptions.push(this.dialog.open(ShowChatGroupMembersComponent, {
            width: '300px',
            height: '400px'
        }).afterClosed().subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
