import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';

@Component({
    selector: 'app-right-sidebar',
    templateUrl: './right-sidebar.component.html',
    styleUrls: ['./right-sidebar.component.scss']
})
export class RightSidebarComponent implements OnInit {
    @Input() shownItems;
    @Output('closeSidenav') closeSidenav = new EventEmitter();
    @Output() openBottomChatBox = new EventEmitter();
    authUser;
    subscriptions = [];
    usersMessages = [];

    constructor(
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private userMessagesStore: UserMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUsersMessages();
    }

    getUsersMessages() {

        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
        }).subscribe(dt => {
            this.usersMessages = dt;
            this.userMessagesStore.setUserMessages(dt);
            console.log(this.userMessagesStore.userMessages)
        }));

    }


}
