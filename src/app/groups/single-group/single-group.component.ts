import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ActivatedRoute, Params} from '@angular/router';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {User} from '@shared/models/user';
import {GROUP_PAGE_TABS} from '@core/constants/global';
import {MatDialog} from '@angular/material/dialog';
import {LowercaseRemoveSpacesPipe} from '@shared/pipes/lowercase-remove-spaces.pipe';
import {GroupMembersInvitationDialogComponent} from '@core/components/modals/group-members-invitation-dialog/group-members-invitation-dialog.component';
import {GroupsService} from '@core/services/groups.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {group} from '@angular/animations';

@Component({
    selector: 'app-single-group',
    templateUrl: './single-group.component.html',
    styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit, OnDestroy {
    authUser: User;
    subscriptions: Subscription[] = [];


    selectedGroup;
    isOwnGroup = false;
    passedGroupName: string;
    groupTabs = GROUP_PAGE_TABS;
    groupPrivacy = 'public';

    userGroupConnStatus = 'not connected';

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private groupsService: GroupsService,
        private route: ActivatedRoute,
        private userStore: UserStoreService,
        private dialog: MatDialog,
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe,
        private isEmptyObj: CheckForEmptyObjectPipe,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
        this.trackSelectedGroup();
        this.getAuthUser();
        this.getSelectedGroup();
        this.getAcceptedJoinGroup();
        this.getConfirmedJoinGroup();
        this.getIgnoredJoinGroup();
        this.getRemovedSavedMember();
    }

    getAuthUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
        }));
    }

    trackSelectedGroup() {
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroup = dt;
            this.groupPrivacy = dt.privacy === 1 ? 'private' : 'public';
            if (!this.isEmptyObj.transform(dt) && this.authUser) {
                this.getUserGroupConnStatus();
            }
        }));
    }

    getSelectedGroup() {
        this.route.params.subscribe((params: Params) => {
            this.passedGroupName = params.name;

            if (!this.getGroupFromStore()) {
                this.getGroupFromServer();
            }
        });
    }

    getGroupFromStore() {
        this.selectedGroup = this.groupsMessagesStore.groupsMessages.find(g => {
            const groupName = this.lowerCaseRemoveSpaces.transform(g.name);
            return groupName === this.passedGroupName;
        });
        if (this.selectedGroup) {
            this.isOwnGroup = this.selectedGroup.creator_id === this.authUser.id;
            this.groupsMessagesStore.selectGroup(this.selectedGroup);
        }
        return !!this.selectedGroup;
    }

    getGroupFromServer() {
        this.groupsService.getGroupByCustomName({custom_name: this.passedGroupName}).subscribe(dt => {
            this.selectedGroup = dt;
            this.isOwnGroup = this.selectedGroup.creator_id === this.authUser.id;
            this.groupsMessagesStore.selectGroup(this.selectedGroup);
        });
    }

    getConfirmedMembersCount() {
        return this.selectedGroup?.chat_group_members?.filter(m => !!m.chat_groups_members.confirmed).length;
    }

    getAcceptedJoinGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('accepted', rest.group)
            this.groupsMessagesStore.changeGroup(rest.group);
        }));
    }

    getConfirmedJoinGroup() {
        this.subscriptions.push(this.socketService.getConfirmedJoinGroup().subscribe((data: any) => {
            const {notification, rest} = data;
            console.log('confirmed in group page', data)
            this.groupsMessagesStore.changeGroup(rest.group);
            console.log(this.groupsMessagesStore.groupsMessages)
        }));
    }

    getIgnoredJoinGroup() {
        this.subscriptions.push(this.socketService.getIgnoredJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('ignored in group page', rest)
            if (rest.member.id === this.authUser.id) {
                this.groupsMessagesStore.setGroupsMessages(rest.leftGroups);
                this.groupsMessagesStore.selectGroup(rest.group);
                this.userGroupConnStatus = 'not connected';
            }
            console.log(this.groupsMessagesStore.groupsMessages)
        }));
    }

    getRemovedSavedMember() {
        this.subscriptions.push(this.socketService.removeFromGroupNotify().subscribe((data: any) => {
            const {member, leftGroups} = data;
            console.log('removed from group in group page', data)
            // this.notificationsStore.updateNotifications(data);
            // if (member.id === this.authUser.id) {
            //     this.groupsMessagesStore.setGroupsMessages(leftGroups);
            //     this.groupsMessagesStore.selectGroup({});
            // } else {
            // console.log(group)
            this.groupsMessagesStore.changeGroup(data.group);
            if (member.id === this.authUser.id) {
                this.userGroupConnStatus = 'not connected';
            }
            // console.log(this.groupsMessagesStore.selectedGroupMessages)
            // console.log(this.groupsMessagesStore.groupsMessages)
            // }
        }));
    }

    getUserGroupConnStatus() {
        this.selectedGroup.chat_group_members.map(m => {
            if (m.id === this.authUser.id) {
                if (m.chat_groups_members.confirmed === 1) {
                    this.userGroupConnStatus = 'confirmed';
                } else {
                    if (m.chat_groups_members.accepted === 1) {
                        this.userGroupConnStatus = 'unconfirmed';
                    } else {
                        this.userGroupConnStatus = 'not connected';
                    }
                }
            }
        });
    }

    showJoinBtn() {
        return !this.isOwnGroup;
    }

    onOutletLoaded(component) {
        if (this.selectedGroup) {
            component.selectedGroup = this.selectedGroup;
            component.isOwnGroup = this.isOwnGroup;
            component.authUser = this.authUser;
        }
    }

    openMembersModal() {
        this.subscriptions.push(this.dialog.open(GroupMembersInvitationDialogComponent, {
            height: '690px',
            width: '950px',
            data: this.authUser
        }).afterClosed().subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
