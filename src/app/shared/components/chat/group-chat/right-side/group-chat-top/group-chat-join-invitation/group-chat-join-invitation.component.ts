import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

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
        private groupMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.invitationRowHidden = this.ifConfirmedToJoinTheGroup(this.selectedGroup);
        this.groupMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroup = dt;
            // console.log(this.selectedGroup)
            this.invitationRowHidden = this.ifConfirmedToJoinTheGroup(this.selectedGroup);
            // console.log(this.invitationRowHidden)
            // console.log(dt.chat_group_members, this.invitationRowHidden);
        });
    }

    acceptGroupJoin() {
        this.subscriptions.push(
            this.chatService.acceptGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {

                console.log('accept', dt)

                this.selectedGroup = dt.find(group => this.selectedGroup.id === group.id);
                this.groupMessagesStore.setGroupsMessages(dt);
                // this.haveGroupJoinInvitation = false;
                this.socketService.acceptJoinToGroup({
                    group: this.selectedGroup,
                    user: this.authUser
                });
            })
        );
    }

    declineGroupJoin() {
        // console.log(this.selectedGroup)
        this.subscriptions.push(
            this.chatService.declineGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                // this.selectedGroup = dt.find(group => this.selectedGroup.id === group.id);
                // console.log(this.selectedGroup)
                // this.selectedGroup = dt;
                this.socketService.declineJoinToGroup({
                    group: this.selectedGroup,
                    user: this.authUser
                });
                this.groupMessagesStore.setGroupsMessages(dt);
                // this.selectedGroup = this.groupsMessages.find(group => this.selectedGroup.id === group.id);
            })
        );
    }


    ifConfirmedToJoinTheGroup(group) {
        return group?.chat_group_members?.find(member => member.id === this.authUser.id && member.chat_groups_members.confirmed);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
