import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {CheckForEmptyObjectPipe} from '@shared/pipes/check-for-empty-object.pipe';

@Component({
    selector: 'app-group-chat-join-invitation',
    templateUrl: './group-chat-join-invitation.component.html',
    styleUrls: ['./group-chat-join-invitation.component.scss']
})
export class GroupChatJoinInvitationComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    @Output() updateInvitations = new EventEmitter();

    subscriptions: Subscription[] = [];

    invitationRowHidden = true;

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupMessagesStore: GroupsMessagesSubjectService,
        private isEmptyObj: CheckForEmptyObjectPipe
    ) {
    }

    ngOnInit(): void {
        this.invitationRowHidden = this.isInvitationRowHidden(this.selectedGroup);
        this.getGroupJoinInvitation();
        this.groupMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroup = dt;

            this.invitationRowHidden = this.isInvitationRowHidden(this.selectedGroup);
            // console.log(this.invitationRowHidden)
        });
    }

    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
            const groupsMessages = this.groupMessagesStore.groupsMessages;
            groupsMessages.unshift(data.group_details);
            this.groupMessagesStore.setGroupsMessages(groupsMessages);
        }));
    }

    acceptGroupJoin(){

    }

    declineGroupJoin(){

    }




    isInvitationRowHidden(group) {
        if (!this.isEmptyObj.transform(group)) {
            // console.log(group?.chat_group_members)
            return !!group?.chat_group_members?.
            find(member => member.id === this.authUser.id && member.chat_groups_members.confirmed);
        }

        return true;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
