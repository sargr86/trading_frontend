import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from "moment";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-group-chat-messages',
    templateUrl: './group-chat-messages.component.html',
    styleUrls: ['./group-chat-messages.component.scss']
})
export class GroupChatMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() authUser;
    @Input() selectedGroupMessages;

    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    subscriptions: Subscription[] = [];


    constructor() {
    }

    ngOnInit(): void {
        console.log(this.selectedGroupMessages)
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

    getMessageClass(user) {
        this.scrollMsgsToBottom();
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    getSeenTooltip(message) {
        const seenDate = message.group_chat_messages_seen.created_at;
        const thisWeekDate = moment(seenDate).isSame(new Date(), 'week');
        const seenDateFormatted = moment(seenDate).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');

        return `${message.first_name} ${message.last_name} at ${seenDateFormatted}`;
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
