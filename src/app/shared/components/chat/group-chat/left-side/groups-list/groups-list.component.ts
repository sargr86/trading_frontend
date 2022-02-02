import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';

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
    ) {
    }

    ngOnInit(): void {
        this.getGroupsMessages();
        this.getGroupFormValue();
    }

    getGroupsMessages() {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            console.log('groups changed')
            this.filteredGroupsMessages = dt;
            this.selectedGroup = dt[0];
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
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
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
            this.socketService.setNewGroup(formValue);
        }));
    }


    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupsMessagesStore.changeGroup(group);
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
