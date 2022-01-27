import {Component, Input, OnInit} from '@angular/core';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-groups-list',
    templateUrl: './groups-list.component.html',
    styleUrls: ['./groups-list.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class GroupsListComponent implements OnInit {
    @Input() authUser;


    subscriptions: Subscription[] = [];

    selectedGroup;
    filteredGroupsMessages = [];

    constructor(
        public mobileHelper: MobileResponsiveHelper,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getGroupsMessages();
    }

    getGroupsMessages() {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            this.filteredGroupsMessages = dt;
            console.log(dt)
            this.selectedGroup = dt[0];
            this.groupsMessagesStore.changeGroup(this.selectedGroup);
        });
    }

    addGroup(formValue) {
        this.subscriptions.push(this.chatService.addGroup(formValue).subscribe(dt => {
            this.selectedGroup = dt.find(d => formValue.name === d.name)
            this.getGroupsMessages();
            this.socketService.setNewGroup(formValue);
        }));
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
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

}
