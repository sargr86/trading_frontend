import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP} from '@core/constants/chat';
import {SocketIoService} from '@core/services/socket-io.service';
import {NotificationsSubjectStoreService} from '@core/services/stores/notifications-subject-store.service';

@Component({
    selector: 'app-members-list',
    templateUrl: './members-list.component.html',
    styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() authUser;
    @Input() modalMode = false;

    socketGroupsUsers = [];
    subscriptions: Subscription[] = [];

    membersCountLimit;


    constructor(
        private dialog: MatDialog,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private notificationsStore: NotificationsSubjectStoreService,
    ) {
    }

    ngOnInit(): void {
        this.getChatNotifications();
        this.getAcceptedJoinGroup();
        this.getDeclinedJoinGroup();
        this.getRemovedSavedMember();
        this.getLeftGroup();
        this.getMembersCountDelimiter();
    }

    getMembersCountDelimiter() {
        return this.modalMode ? this.selectedGroup.chat_group_members.length : ALLOWED_GROUP_MEMBERS_COUNT_ON_TOP;
    }

    removeSavedMember(member) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({
                    group_id: this.selectedGroup.id,
                    member_id: member.id
                }).subscribe(dt => {
                    this.selectedGroup = dt;
                    this.groupsMessagesStore.changeGroup(this.selectedGroup);
                    this.socketService.removeFromGroup({
                        member,
                        initiator: this.authUser,
                        group: this.selectedGroup
                    });
                });
            }
        }));
    }

    getRemovedSavedMember() {
        this.subscriptions.push(this.socketService.removeFromGroupNotify().subscribe((data: any) => {
            const {group, member, leftGroups} = data;
            console.log('removed from group', data)
            this.notificationsStore.updateNotifications(data);
            if (member.id === this.authUser.id) {
                this.groupsMessagesStore.setGroupsMessages(leftGroups);
                this.groupsMessagesStore.selectGroup({});
            } else {
                // console.log(group)
                this.groupsMessagesStore.changeGroup(group);
                // console.log(this.groupsMessagesStore.selectedGroupMessages)
                // console.log(this.groupsMessagesStore.groupsMessages)
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
            const {notification, rest} = data;
            console.log('accepted', data)
            console.log(this.notificationsStore.allNotifications)
            if (notification.from_user.id !== this.authUser.id) {
                this.notificationsStore.updateNotifications(notification);
            }
            console.log(this.notificationsStore.allNotifications)
            this.groupsMessagesStore.changeGroup(rest.group);
        }));
    }

    getDeclinedJoinGroup() {
        this.subscriptions.push(this.socketService.getDeclinedJoinGroup().subscribe((data: any) => {
            const {group} = data;
            console.log('declined', data);
            if (data.from_user.id === this.authUser.id) {
                this.groupsMessagesStore.selectGroup({});
            } else {
                this.notificationsStore.updateNotifications(data);
                this.groupsMessagesStore.changeGroup(group);
            }
        }));
    }

    getLeftGroup() {
        this.subscriptions.push(this.socketService.leaveGroupNotify().subscribe((data: any) => {
            const {group} = data;
            console.log(data)
            if (data.from_user.id === this.authUser.id) {
                this.groupsMessagesStore.selectGroup({});
            } else {
                this.notificationsStore.updateNotifications(data);
                this.groupsMessagesStore.changeGroup(group);
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

    ifRemoveMemberShown(m) {
        return this.authUser.id === this.selectedGroup?.creator_id
            && m.id !== this.selectedGroup?.creator_id && !this.modalMode;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
