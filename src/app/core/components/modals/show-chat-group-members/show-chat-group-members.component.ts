import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {GetAuthUserPipe} from "@shared/pipes/get-auth-user.pipe";

@Component({
    selector: 'app-show-chat-group-members',
    templateUrl: './show-chat-group-members.component.html',
    styleUrls: ['./show-chat-group-members.component.scss']
})
export class ShowChatGroupMembersComponent implements OnInit {
    selectedGroup;
    authUser;

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getGroupMembers();
    }

    getGroupMembers() {
        this.selectedGroup = this.groupsMessagesStore.selectedGroupMessages;
    }

}
