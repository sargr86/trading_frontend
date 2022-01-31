import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-chat-left-side-holder',
    templateUrl: './group-chat-left-side-holder.component.html',
    styleUrls: ['./group-chat-left-side-holder.component.scss']
})
export class GroupChatLeftSideHolderComponent implements OnInit {
    @Input() authUser;

    constructor() {
    }

    ngOnInit(): void {
    }

}
