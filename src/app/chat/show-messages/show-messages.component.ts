import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss']
})
export class ShowMessagesComponent implements OnInit {
    activeTab = 'direct';
    authUser;
    usersMessages = [];
    selectedUserMessages = {messages: [], user: {}};
    activeUser;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private cdr: ChangeDetectorRef
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUsersMessages();
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

    getUsersMessages() {
        this.chatService.getGeneralChatMessages({from_id: this.authUser.id, to_id: '', personal: 1}).subscribe(dt => {
            this.usersMessages = dt;
            this.activeUser = dt[0].user;
            this.selectedUserMessages = this.usersMessages.find(m => m.user.id === this.activeUser.id);
            console.log(this.selectedUserMessages)
        });
    }

    makeUserActive(user) {
        this.activeUser = user;
        this.selectedUserMessages = this.usersMessages.find(m => m.user.id === user.id);
    }

}
