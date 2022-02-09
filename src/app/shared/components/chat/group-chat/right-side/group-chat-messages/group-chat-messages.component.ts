import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from "@core/services/stores/groups-messages-subject.service";

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

    typingText = {
        group: false,
        text: ''
    };


    constructor(
        private chatService: ChatService,
        private groupByDate: GroupByPipe,
        private socketService: SocketIoService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getTyping();
        this.getMessagesFromSocket();
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            // console.log(dt)
            this.selectedGroupMessages = dt;
        }));
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

    setSeen(formValue) {
        console.log(formValue)

        const messages = this.selectedGroupMessages.group_messages;
        const lastMessage = messages[messages.length - 1];
        const isOwnLastMessage = lastMessage?.from_id === this.authUser.id;
        if (!isOwnLastMessage) {
            this.socketService.setSeen({
                message_id: lastMessage?._id,
                seen: 1,
                seen_at: moment().format('YYYY-MM-DD, h:mm:ss a'),
                ...formValue
            });
        }
    }

    setTyping(formValue) {
        // console.log(e)
        this.socketService.setTyping(formValue);
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            // console.log(dt.group_name, this.selectedGroupMessages?.name)
            this.getTypingTextStatus(dt);
        });
    }

    getTypingTextStatus(dt) {
        const sameGroupTyping = dt.from_id !== this.authUser.id && dt.group_name === this.selectedGroupMessages.name && dt.message;
        // console.log(sameGroupTyping)
        this.typingText = {
            group: sameGroupTyping ? this.selectedGroupMessages?.name === dt.group_name : null,
            text: sameGroupTyping ? `${dt.from_username} is typing...` : null
        };
    }

    sendMessage(e) {
        this.socketService.sendMessage(e);
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            // console.log('new message group chat!!!', dt);

            const {group_id, group_messages} = dt;

            // if (this.selectedGroupMessages.id === dt.group_id){
            this.groupsMessagesStore.changeGroupMessages(group_id, group_messages);
            this.resetTyping();
            // }

            // const newMessage = {...dt, name: dt.group_name, id: dt.group_id};
            // if (this.selectedGroupMessages.id === dt.group_id) {
            //     const groupMessages = this.groupsMessagesStore.selectedGroupMessages;
            //     groupMessages.group_messages.push(newMessage);
            //     this.groupsMessagesStore.changeGroup(groupMessages);
            //     this.resetTyping();
            // }

            // console.log(this.groupsMessagesStore.selectedGroupMessages)
        }));
    }

    setMessages() {

    }

    resetTyping() {
        this.typingText = {
            group: false,
            text: ''
        };
    }

    identifyDateKey(index, item) {
        return item.key;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}
