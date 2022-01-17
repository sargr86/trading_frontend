import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import * as moment from 'moment';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from '@core/services/subject.service';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss']
})
export class DirectChatMessagesComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @ViewChild('directMessagesList') private messagesList: ElementRef;
    @Output() refresh = new EventEmitter();

    subscriptions: Subscription[] = [];

    selectedUserMessages;

    typingText = null;

    constructor(
        private userMessagesStore: UserMessagesSubjectService,
        private subject: SubjectService,
        private socketService: SocketIoService,
        private chatService: ChatService,
        public mobileHelper: MobileResponsiveHelper,
        private getElegantDate: GetElegantDatePipe,
        private groupByDate: GroupByPipe,
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.userMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            this.selectedUserMessages = dt;
            this.setNewMessageSources();
        }));

        this.scrollMsgsToBottom();
        this.getSeen();
        this.getTyping();
        this.getMessagesFromSocket();
    }

    setSeen(e) {
        const messages = this.selectedUserMessages.direct_messages;
        const lastMessage = messages[messages.length - 1];
        const isOwnLastMessage = lastMessage?.from_id === this.authUser.id;
        if (!isOwnLastMessage) {
            this.socketService.setSeen({
                message_id: lastMessage?._id,
                seen: 1,
                seen_at: moment().format('YYYY-MM-DD, h:mm:ss a'),
                ...e
            });
        }
    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            this.selectedUserMessages.messages = [];
            console.log('get seen', dt);
            this.refresh.emit();
        }));
    }

    setTyping(e) {
        // console.log('typing', e)
        this.socketService.setTyping(e);
    }

    getTyping() {
        this.subscriptions.push(this.socketService.getTyping().subscribe((dt: any) => {
            // console.log(dt.from_id, this.authUser.id, this.selectedUserMessages);
            if (dt.from_id !== this.authUser.id && this.selectedUserMessages.id === dt.from_id) {
                this.typingText = dt.message ? `${dt.from_first_name} is typing...` : null;
            }
        }));
    }

    sendMessage(e) {
        console.log('sent', e);
        this.socketService.sendMessage(e);
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message direct chat!!!')
            this.typingText = null;
            this.scrollMsgsToBottom();
            this.updateMessagesStore(dt);
        }));
    }

    updateMessagesStore(dt) {
        const selectedUserMessages = this.userMessagesStore.selectedUserMessages as any;
        selectedUserMessages.direct_messages = dt;
        this.userMessagesStore.changeUser(selectedUserMessages);

        this.setNewMessageSources();
        console.log(this.userMessagesStore.selectedUserMessages)
    }

    setNewMessageSources() {
        const sources = this.userMessagesStore.userMessages.filter(m => m.direct_messages.filter(d => !d.seen).length > 0);
        this.subject.setNewMessagesSourceData({sources: sources.length, type: 'direct'});
    }

    getMessagesByDate(dt) {
        return this.groupByDate.transform(dt, 'created_at');
    }

    getSeenTooltip(message) {
        const user = this.selectedUserMessages;
        const seenDate = this.getElegantDate.transform(message.seen_at);

        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }

    isContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    isOwnMessage(from_id) {
        return from_id === this.authUser.id ? 'my-message' : 'other-message';
    }

    isSeenByOtherUser(msg) {
        return msg.seen && msg.to_id !== this.authUser.id;
    }

    backToUsers() {
        this.selectedUserMessages = null;
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    identifyDateKey(index, item) {
        return item.key;
    }

    identifyMessage(index, item) {
        return item._id;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
