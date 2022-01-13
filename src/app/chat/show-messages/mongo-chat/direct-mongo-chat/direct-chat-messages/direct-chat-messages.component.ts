import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-direct-chat-messages',
    templateUrl: './direct-chat-messages.component.html',
    styleUrls: ['./direct-chat-messages.component.scss']
})
export class DirectChatMessagesComponent implements OnInit, OnDestroy {
    subscriptions: Subscription[] = [];
    selectedUserMessages;

    constructor(
        private userMessagesStore: UserMessagesSubjectService,
        public mobileHelper: MobileResponsiveHelper,
    ) {
    }

    ngOnInit(): void {
        this.subscriptions.push(this.userMessagesStore.selectedUserMessages$.subscribe(dt => {
            this.selectedUserMessages = dt;
        }));
    }

    ifContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
