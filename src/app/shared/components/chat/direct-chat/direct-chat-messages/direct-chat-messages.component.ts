import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import * as moment from 'moment';
import {SocketIoService} from '@core/services/socket-io.service';
import {ChatService} from '@core/services/chat.service';
import {SubjectService} from '@core/services/subject.service';
import {SharedChatHelper} from '@core/helpers/shared-chat-helper';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class DirectChatMessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
    @Input() authUser;
    @Input() embedMode = false;
    @ViewChild('directMessagesList') private messagesList: ElementRef;

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
        public sHelper: SharedChatHelper
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.userMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            this.selectedUserMessages = dt;
            this.typingText = null;
        }));

        this.getSeen();
        this.getTyping();
        this.getMessagesFromSocket();
    }



    setSeen(e) {
        const {owned, lastMessage} = this.sHelper.isLastMsgOwn(this.selectedUserMessages.direct_messages);
        if (!owned) {
            this.socketService.setSeen({
                message_id: lastMessage?._id,
                seen: 1,
                ...e
            });
        }
    }

    getSeen() {
        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            const {from_id, to_id, direct_messages} = dt;

            if (this.selectedUserMessages.id === to_id) {
                this.userMessagesStore.changeOneUserMessages(to_id, direct_messages);
            } else if (this.selectedUserMessages.id === from_id) {
                this.userMessagesStore.changeOneUserMessages(from_id, direct_messages);
            }

        }));
    }

    setTyping(e) {
        this.socketService.setTyping(e);
    }

    getTyping() {
        this.subscriptions.push(this.socketService.getTyping().subscribe((dt: any) => {
            if (dt.from_id !== this.authUser.id && this.selectedUserMessages.id === dt.from_id) {
                this.typingText = dt.message ? `${dt.from_first_name} is typing...` : null;
            }
        }));
    }


    sendMessage(e) {
        this.socketService.sendMessage(e);
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            this.typingText = null;

            this.sHelper.scrollMsgsToBottom(this.messagesList);
        }));
    }

    getMessagesByDate(dt) {
        return this.groupByDate.transform(dt, 'created_at');
    }

    isContactBlocked(user) {
        return user?.users_connections?.[0]?.is_blocked;
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

    identifyMessage(index, item) {
        return item._id;
    }

    ngAfterViewChecked() {
        this.sHelper.scrollMsgsToBottom(this.messagesList);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
