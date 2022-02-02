import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP} from '@core/constants/chat';
import {SocketIoService} from '@core/services/socket-io.service';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() modalMode = false;

    groupMembers = [];
    socketGroupsUsers = [];
    subscriptions: Subscription[] = [];


    constructor(
        private dialog: MatDialog,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getGroupMembers();
        this.getChatNotifications();
        this.getAcceptedJoinGroup();
        this.getDeclinedJoinGroup();
        this.getLeftGroup();
    }

    getGroupMembers() {
        this.groupMembers = this.selectedGroup.chat_group_members;
        this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.groupMembers = this.modalMode
                ? dt.chat_group_members
                : dt?.chat_group_members.filter((m, index) => index < ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP);
        });
    }

    removeSavedMember(member_id) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({group_id: this.selectedGroup.id, member_id}).subscribe(dt => {
                    this.selectedGroup = dt;
                    this.groupsMessagesStore.changeGroupMembers(this.selectedGroup);
                });
            }
        }));
    }

    getChatNotifications() {
        this.subscriptions.push(this.socketService.getChatNotifications().subscribe((data: any) => {
            this.socketGroupsUsers = data.groupsUsers;
        }));
    }

    getAcceptedJoinGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinGroup().subscribe((data: any) => {
            const {group} = data;
            this.selectedGroup.chat_group_members = group.chat_group_members;
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
        }));
    }

    getDeclinedJoinGroup() {
        this.subscriptions.push(this.socketService.getDeclinedJoinGroup().subscribe((data: any) => {
            const {groupMembers} = data;
            console.log('declined', groupMembers)
            this.selectedGroup.chat_group_members = groupMembers.chat_group_members;
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
        }));
    }

    getLeftGroup() {
        this.subscriptions.push(this.socketService.leaveGroupNotify().subscribe((data: any) => {
            const {leftMembers, group, username} = data;

            if (this.selectedGroup) {
                const membersBeforeLeave = this.selectedGroup.chat_group_members;
                this.selectedGroup.chat_group_members = membersBeforeLeave.filter(m => leftMembers.find(lm => lm.username === m.username));
                this.groupsMessagesStore.changeGroup(this.selectedGroup);
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
