import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import * as moment from 'moment';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {SubjectService} from '@core/services/subject.service';

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
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private subject: SubjectService
    ) {
    }

    ngOnInit(): void {
        this.getSeen();
        this.getTyping();
        this.getMessagesFromSocket();
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            // console.log(dt)
            this.selectedGroupMessages = dt;
        }));

        if (!this.embedMode) {
            this.setNewMessageSources();
        }
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
        const seenDate = message.seen_at;
        const thisWeekDate = moment(seenDate, 'YYYY-MM-DD, hh:mm:ss').isSame(new Date(), 'week');
        const seenDateFormatted = moment(seenDate, 'YYYY-MM-DD, hh:mm:ss').format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');

        return `${message.seen_by.first_name} ${message.seen_by.last_name} at ${seenDateFormatted}`;
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList?.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    setSeen(formValue) {

        const messages = this.selectedGroupMessages.group_messages;
        if (messages) {
            const lastMessage = messages[messages?.length - 1];
            const isOwnLastMessage = lastMessage?.from_id === this.authUser.id;
            console.log(lastMessage)
            if (!isOwnLastMessage && lastMessage) {
                this.socketService.setSeen({
                    message_id: lastMessage?._id,
                    // seen: 1,
                    seen_at: moment().format('YYYY-MM-DD, hh:mm:ss'),
                    ...formValue
                });
            }
        }

    }

    getSeen() {

        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            // console.log('get seen', dt)
            // console.log(this.selectedGroup)
            const {group_id, group_messages} = dt;

            // if (this.selectedGroupMessages.id === dt.group_id){
            this.groupsMessagesStore.changeGroupMessages(group_id, group_messages);
            this.setNewMessageSources(true);
            // }
        }));
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

    sendMessage(formValue) {
        console.log(formValue)
        this.socketService.sendMessage(formValue);
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message group chat!!!', dt);

            this.resetTyping();
            this.scrollMsgsToBottom();
            this.setNewMessageSources();
        }));
    }

    setNewMessageSources(fromSeen = false) {

        const sources = this.groupsMessagesStore.groupsMessages?.filter(st => {
            const groupReceivedMessages = st.group_messages?.filter(gm => gm.from_id !== this.authUser.id);
            // console.log(groupReceivedMessages)
            const notSeenMessages = groupReceivedMessages?.filter(rm => {
                const isSeen = !!rm.seen.find(s => {
                    return s.seen_by.id === this.authUser.id;
                });
                // console.log(rm.message, isSeen)
                return isSeen === false;
            });
            // console.log(notSeenMessages, notSeenMessages?.length)
            return notSeenMessages?.length !== 0;
        });


        // console.log(this.groupsMessagesStore.groupsMessages)
        // console.log(sources)

        this.subject.setNewMessagesSourceData({sources: sources.length, type: 'group'});
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
