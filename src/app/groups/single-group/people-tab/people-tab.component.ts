import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GroupsService} from '@core/services/groups.service';
import {Subscription} from 'rxjs';
import {SocketIoService} from '@core/services/socket-io.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';
import {GroupsStoreService} from '@core/services/stores/groups-store.service';

@Component({
    selector: 'app-people-tab',
    templateUrl: './people-tab.component.html',
    styleUrls: ['./people-tab.component.scss']
})
export class PeopleTabComponent implements OnInit, OnDestroy {
    @Input() selectedGroup;
    @Input() isOwnGroup;
    @Input() authUser;

    admins = [];
    members = [];
    requestedMembers = [];

    subscriptions: Subscription[] = [];

    constructor(
        private groupsService: GroupsService,
        private groupsStore: GroupsStoreService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        private dialog: MatDialog,
        private isEmptyObj: CheckForEmptyObjectPipe,
    ) {
    }

    ngOnInit(): void {
        this.trackGroups();
        this.getAcceptedJoinPageGroup();
    }

    trackGroups() {
        this.subscriptions.push(this.groupsStore.selectedGroup$.subscribe(dt => {
            // console.log(dt);
            this.selectedGroup = dt;
            this.admins = [];
            this.members = [];
            this.requestedMembers = [];

            if (!this.isEmptyObj.transform(this.selectedGroup)) {
                this.filterMembers();
            }
        }));
    }

    getAcceptedJoinPageGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinPageGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('accepted', rest.group);
            // this.groupsStore.changeGroup(rest.group);
        }));
    }

    filterMembers() {
        this.selectedGroup?.group_members?.map(m => {
            if (this.selectedGroup.creator_id === m.id) {
                this.admins.push(m);
            } else {
                if (m.groups_members.confirmed) {
                    this.members.push(m);
                } else if (m.groups_members.accepted) {
                    this.requestedMembers.push(m);
                }
            }
        });
    }

    confirmJoinGroup(member) {
        this.subscriptions.push(this.groupsService.confirmGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsStore.changeGroup(selectedGroup);

            this.socketService.confirmJoinGroup({
                group: selectedGroup,
                from_user: this.authUser,
                member,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has confirmed  <strong>${member.first_name + ' ' + member.last_name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

    ignoreJoinGroup(member) {
        console.log(member);
        this.subscriptions.push(this.groupsService.ignoreGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsStore.changeGroup(selectedGroup);

            this.socketService.ignoreJoinGroup({
                group: selectedGroup,
                from_user: this.authUser,
                member,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has declined  <strong>${member.first_name}</strong> <strong>${member.last_name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

    makeAdmin(member) {

    }

    makeModerator(member) {

    }

    removeMember(member) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.groupsService.removeGroupMember({
                    group_id: this.selectedGroup.id,
                    member_id: member.id
                }).subscribe(dt => {
                    this.selectedGroup = dt;
                    this.groupsStore.changeGroup(this.selectedGroup);
                    this.socketService.removeFromPageGroup({
                        member,
                        from_user: this.authUser,
                        group: this.selectedGroup,
                        group_type: 'page',
                        msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong> removed  <strong>${member.first_name + ' ' + member.last_name}</strong>
                       from <strong>${this.selectedGroup.name}</strong> group`,
                    });
                });
            }
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
