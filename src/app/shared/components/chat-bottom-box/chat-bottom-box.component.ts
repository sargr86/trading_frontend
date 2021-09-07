import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss']
})
export class ChatBottomBoxComponent implements OnInit {

    @Input() channelUser;

    constructor() {
    }

    ngOnInit(): void {
    }

}
