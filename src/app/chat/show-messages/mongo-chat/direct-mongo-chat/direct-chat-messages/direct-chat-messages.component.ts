import {Component, OnInit} from '@angular/core';
import {usersMessagesStore} from '@shared/stores/users-messages-store';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss']
})
export class DirectChatMessagesComponent implements OnInit {
    usersMessagesStore = usersMessagesStore;

    constructor() {
    }

    ngOnInit(): void {
    }

}
