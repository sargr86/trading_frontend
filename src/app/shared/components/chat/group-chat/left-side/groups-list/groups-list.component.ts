import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SetNotificationsPipe} from "@shared/pipes/set-notifications.pipe";

@Component({
    selector: 'app-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrls: ['./groups-list.component.scss'],

})
export class GroupsListComponent implements OnInit, OnDestroy {
    @Input() authUser;


    subscriptions: Subscription[] = [];

    selectedGroup;
    filteredGroupsMessages = [];

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private setNotifications: SetNotificationsPipe
    ) {
    }

    ngOnInit(): void {
        this.getGroupsMessages();
        this.getGroupFormValue();
        this.removeGroupNotify();
    }

    getGroupsMessages() {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            // console.log('groups changed', dt)
            this.filteredGroupsMessages = dt;
            this.selectedGroup = dt[0];
            this.groupsMessagesStore.selectGroup(this.selectedGroup);
        });
    }

    getGroupFormValue() {
        this.subscriptions.push(this.groupsMessagesStore.addGroupFormValue.subscribe(dt => {
            this.addGroup(dt);
        }));
    }

    addGroup(formValue) {
        this.subscriptions.push(this.chatService.addGroup(formValue).subscribe(dt => {
            this.selectedGroup = dt.find(d => formValue.name === d.name);
            this.groupsMessagesStore.setGroupsMessages(dt);
            this.groupsMessagesStore.selectGroup(this.selectedGroup);
            this.socketService.setNewGroup(formValue);
        }));
    }

    removeGroupNotify() {
        this.subscriptions.push(this.socketService.removeGroupNotify().subscribe((data: any) => {
            // this.setNotifications.transform(data);
            this.refreshGroupsMessages();
        }));
    }

    refreshGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessagesStore.setGroupsMessages(dt);
        }));
    }


    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupsMessagesStore.selectGroup(group);
    }

    ifConfirmedToJoinTheGroup(group) {
        return group?.chat_group_members.find(member => member.id === this.authUser.id && member.chat_groups_members.confirmed);
    }

    isSeenByAuthUser(messages) {
        return messages.filter(message => {
            let found = false;
            if (message.from_id !== this.authUser.id) {
                found = !message.seen_by.find(sb => sb.id === this.authUser.id);
            }
            return found;
        }).length;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}