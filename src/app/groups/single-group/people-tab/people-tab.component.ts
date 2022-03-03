import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {GroupsService} from '@core/services/groups.service';
import {Subscription} from 'rxjs';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ChatService} from '@core/services/chat.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

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
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        private dialog: MatDialog,
        private isEmptyObj: CheckForEmptyObjectPipe,
    ) {
    }

    ngOnInit(): void {
        this.trackGroupsMessages();
        this.getAcceptedJoinGroup();
    }

    trackGroupsMessages() {
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe(dt => {
            this.selectedGroup = dt;
            this.admins = [];
            this.members = [];
            this.requestedMembers = [];
            console.log(this.selectedGroup)
            if (!this.isEmptyObj.transform(this.selectedGroup)) {
                this.filterMembers();
            }
        }));
    }

    getAcceptedJoinGroup() {
        this.subscriptions.push(this.socketService.getAcceptedJoinGroup().subscribe((data: any) => {
            const {rest} = data;
            console.log('accepted', rest.group)
            this.groupsMessagesStore.changeGroup(rest.group);
        }));
    }

    filterMembers() {
        this.selectedGroup.chat_group_members.map(m => {
            if (this.selectedGroup.creator_id === m.id) {
                this.admins.push(m);
            } else {
                if (m.chat_groups_members.confirmed) {
                    this.members.push(m);
                } else if (m.chat_groups_members.accepted) {
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
            this.groupsMessagesStore.changeGroup(selectedGroup);

            this.socketService.confirmJoinGroup({
                group: selectedGroup,
                user: this.authUser,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has confirmed  <strong>${member.first_name + ' ' + member.last_name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

    ignoreJoinGroup(member) {
        this.subscriptions.push(this.groupsService.ignoreGroupJoin({
            member_id: member.id,
            group_id: this.selectedGroup.id
        }).subscribe(dt => {
            const selectedGroup = dt.find(d => d.id === this.selectedGroup.id);
            this.groupsMessagesStore.changeGroup(selectedGroup);

            this.socketService.ignoreJoinGroup({
                group: selectedGroup,
                user: this.authUser,
                member,
                msg: `<strong>${this.authUser.first_name + ' ' + this.authUser.last_name}</strong>
                has declined  <strong>${member.name}</strong> to join the <strong>${selectedGroup.name}</strong> group`,
                link: `/channels/show?username=${this.authUser.username}`,
            });
        }));
    }

    removeMember(member) {
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

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
