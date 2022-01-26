import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-group-mongo-chat',
    templateUrl: './group-mongo-chat.component.html',
    styleUrls: ['./group-mongo-chat.component.scss']
})
export class GroupMongoChatComponent implements OnInit {
    @Input() authUser;

    constructor(

    ) {
    }

    ngOnInit(): void {
    }

}
