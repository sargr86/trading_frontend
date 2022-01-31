import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-chat-members',
    templateUrl: './group-chat-members.component.html',
    styleUrls: ['./group-chat-members.component.scss']
})
export class GroupChatMembersComponent implements OnInit {
    @Input() selectedGroup;
    showMembersInput = false;

    constructor() {
    }

    ngOnInit(): void {
    }

}
