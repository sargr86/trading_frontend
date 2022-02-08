import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {SocketIoService} from "@core/services/socket-io.service";

@Component({
    selector: 'app-group-chat-messages',
    templateUrl: './group-chat-messages.component.html',
    styleUrls: ['./group-chat-messages.component.scss']
})
export class GroupChatMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() authUser;
    @Input() selectedGroupMessages;
    @Input() embedMode = false;

    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    subscriptions: Subscription[] = [];
    groupsMessages = [];

    typingText;


    constructor(
        private chatService: ChatService,
        private groupByDate: GroupByPipe,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
        // console.log(this.selectedGroupMessages)
    }

    getMessagesByDate(dt) {
        return this.groupByDate.transform(dt, 'created_at');
    }


    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

    getMessageClass(user_id) {
        return user_id === this.authUser.id ? 'my-message' : 'other-message';
    }

    getSeenTooltip(message) {
        const seenDate = message.group_chat_messages_seen.created_at;
        const thisWeekDate = moment(seenDate).isSame(new Date(), 'week');
        const seenDateFormatted = moment(seenDate).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');

        return `${message.first_name} ${message.last_name} at ${seenDateFormatted}`;
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList?.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    setSeen(e) {
        // console.log(e)
    }

    setTyping(e) {
        // console.log(e)
    }

    sendMessage(e) {
        console.log(e)
        this.socketService.sendMessage(e);
    }

    identifyDateKey(index, item) {
        return item.key;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
