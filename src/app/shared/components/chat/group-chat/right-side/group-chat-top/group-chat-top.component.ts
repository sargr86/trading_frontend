import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {CheckForEmptyObjectPipe} from "@shared/pipes/check-for-empty-object.pipe";

@Component({
    selector: 'app-group-chat-top',
    templateUrl: './group-chat-top.component.html',
    styleUrls: ['./group-chat-top.component.scss']
})
export class GroupChatTopComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];

    groupJoinInvitations = [];
    invitationRowHidden = true;

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private isEmptyObj: CheckForEmptyObjectPipe
    ) {

    }

    ngOnInit(): void {
        this.getGroupJoinInvitation();
    }

    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
            this.groupJoinInvitations.push(data.group_id);
            const groupsMessages = this.groupMessagesStore.groupsMessages;
            groupsMessages.unshift(data.group_details);
            this.groupMessagesStore.setGroupsMessages(groupsMessages);
        }));
    }

    isChatTopShown() {
        return this.isEmptyObj.transform(this.selectedGroup);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
