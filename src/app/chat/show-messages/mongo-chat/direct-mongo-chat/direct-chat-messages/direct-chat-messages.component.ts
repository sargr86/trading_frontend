import {Component, OnInit} from '@angular/core';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss']
})
export class DirectChatMessagesComponent implements OnInit {
    selectedUserMessages;

    constructor(
        private userMessagesStore: UserMessagesSubjectService,
    ) {
    }

    ngOnInit(): void {
        this.userMessagesStore.selectedUserMessages$.subscribe(dt => {
            this.selectedUserMessages = dt;
        });
    }

}
