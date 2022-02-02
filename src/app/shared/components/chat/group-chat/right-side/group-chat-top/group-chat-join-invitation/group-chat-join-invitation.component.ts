import {Component, Input, OnDestroy, OnInit} from '@angular/core';
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

    subscriptions: Subscription[] = [];
    haveGroupJoinInvitation = false;

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getGroupJoinInvitation();
    }

    getGroupJoinInvitation() {
        this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
            // console.log(data)
            // this.chatService.getGroupsMessages({user_id: this.authUser.id}).subscribe(dt => {
            const groupsMessages = this.groupMessagesStore.groupsMessages;
            groupsMessages.unshift(data.group_details);
            this.groupMessagesStore.setGroupsMessages(groupsMessages)
            // console.log(data)
            //
            //     this.groupsMessages = dt;
            //     this.selectedGroup = this.groupsMessages.find(group => data.group_id === group.id);
            this.haveGroupJoinInvitation = true;
            //     console.log(this.selectedGroup)
            // });
        }));
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
                this.haveGroupJoinInvitation = false;
                this.socketService.acceptJoinToGroup({
                    group: this.selectedGroup,
                    user: this.authUser
                });
            })
        );
    }

    declineGroupJoin() {
        this.subscriptions.push(
            this.chatService.declineGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                // this.selectedGroup = dt.find(group => this.selectedGroup.id === group.id);
                // console.log(this.selectedGroup)
                // this.selectedGroup = dt;
                this.groupMessagesStore.setGroupsMessages(dt);
                this.socketService.declineJoinToGroup({
                    group: this.selectedGroup,
                    user: this.authUser
                });
                // this.selectedGroup = this.groupsMessages.find(group => this.selectedGroup.id === group.id);
            })
        );
    }


    ifConfirmedToJoinTheGroup(group) {
        return group?.chat_group_members.find(member => member.id === this.authUser.id && member.chat_groups_members.confirmed);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
