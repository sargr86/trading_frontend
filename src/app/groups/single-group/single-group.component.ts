import {Component, OnDestroy, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ActivatedRoute, Params} from '@angular/router';
import {UserStoreService} from '@core/services/stores/user-store.service';
import {Subscription} from 'rxjs';
import {User} from '@shared/models/user';
import {GROUP_PAGE_TABS} from '@core/constants/global';
import {MatDialog} from '@angular/material/dialog';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';

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
    id: number;
    groupTabs = GROUP_PAGE_TABS;

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private route: ActivatedRoute,
        private userStore: UserStoreService,
        private dialog: MatDialog
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
            this.id = +params.id;
            this.selectedGroup = this.groupsMessagesStore.groupsMessages.find(g => g.id === this.id);
            if (this.selectedGroup) {
                console.log(this.id)
                this.isOwnGroup = this.selectedGroup.creator_id === this.authUser.id;
                this.groupsMessagesStore.selectGroup(this.selectedGroup);
            }
            // console.log(this.groupsMessagesStore.selectedGroupMessages)
        });
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
        this.subscriptions.push(this.dialog.open(ShowChatGroupMembersComponent, {
            height: '548px',
            width: '548px'
        }).afterClosed().subscribe(dt => {

        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
