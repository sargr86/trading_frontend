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
    showGroupChatForm = false;

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
    }

    getGroupsMessages() {
        this.groupsMessagesStore.groupsMessages$.subscribe(dt => {
            this.filteredGroupsMessages = dt;
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

}
