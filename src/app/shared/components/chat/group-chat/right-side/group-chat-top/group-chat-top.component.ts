import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-chat-top',
    templateUrl: './group-chat-top.component.html',
    styleUrls: ['./group-chat-top.component.scss']
})
export class GroupChatTopComponent implements OnInit {
    @Input() authUser;
    @Input() selectedGroupMessages;

    constructor() {
    }

    ngOnInit(): void {
    }


}
