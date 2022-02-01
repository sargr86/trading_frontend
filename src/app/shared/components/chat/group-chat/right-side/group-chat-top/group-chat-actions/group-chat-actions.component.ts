import {Component, Input, OnInit} from '@angular/core';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-chat-actions',
    templateUrl: './group-chat-actions.component.html',
    styleUrls: ['./group-chat-actions.component.scss']
})
export class GroupChatActionsComponent implements OnInit {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private dialog: MatDialog
    ) {
    }

    ngOnInit(): void {

    }

    toggleMembersForm() {
        this.groupsMessagesStore.showMembersForm = !this.groupsMessagesStore.showMembersForm;
    }

    removeGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroup({group_id: this.selectedGroup.id}).subscribe(dt => {
                    this.socketService.removeGroup({group: this.selectedGroup.name, username: this.authUser.username});
                    this.groupsMessagesStore.setGroupsMessages(dt);
                    this.selectedGroup = null;
                });
            }
        }));
    }

    leaveGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.leaveGroup({
                    member_id: this.authUser.id,
                    group_id: this.selectedGroup.id,
                }).subscribe(dt => {
                    this.groupsMessagesStore.setGroupsMessages(dt);
                    this.socketService.leaveGroup({group: this.selectedGroup, user: this.authUser});
                    this.selectedGroup = null;
                });
            }
        }));
    }

}
