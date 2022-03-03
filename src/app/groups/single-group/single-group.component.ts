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

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private groupsService: GroupsService,
        private route: ActivatedRoute,
        private userStore: UserStoreService,
        private dialog: MatDialog,
        private lowerCaseRemoveSpaces: LowercaseRemoveSpacesPipe
    ) {
    }

    ngOnInit(): void {
        this.getAuthUser();
        this.getSelectedGroup();
    }

    getAuthUser() {
        this.subscriptions.push(this.userStore.authUser$.subscribe(user => {
            this.authUser = user;
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

    isAuthUserMemberOfGroup() {
        return this.selectedGroup.chat_group_members.find(m => m.id === this.authUser.id);
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
