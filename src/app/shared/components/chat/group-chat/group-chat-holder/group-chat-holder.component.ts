import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-chat-holder',
    templateUrl: './group-chat-holder.component.html',
    styleUrls: ['./group-chat-holder.component.scss']
})
export class GroupChatHolderComponent implements OnInit {
    @Input() authUser;

    constructor() {
    }

    ngOnInit(): void {
    }

}
