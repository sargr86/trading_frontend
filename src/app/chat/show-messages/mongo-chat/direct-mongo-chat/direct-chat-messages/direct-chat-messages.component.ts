import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';

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
        public mobileHelper: MobileResponsiveHelper,
        private getElegantDate: GetElegantDatePipe,
        private groupByDate: GroupByPipe,
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.userMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            this.selectedUserMessages = dt;
        }));
    }

    setSeen(e) {
        console.log('seen', e)
    }

    setTyping(e) {
        console.log('typing', e)
    }

    sendMessage(e) {
        console.log('sent', e)
    }

    getMessagesByDate(dt) {
        return this.groupByDate.transform(dt, 'created_at');
    }

    getSeenTooltip(message) {
        const user = message.to_user;
        const seenDate = this.getElegantDate.transform(message.seen_at);

        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }

    isContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    isOwnMessage(from_id) {
        return from_id === this.authUser.id ? 'my-message' : 'other-message';
    }

    backToUsers() {
        this.selectedUserMessages = null;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
