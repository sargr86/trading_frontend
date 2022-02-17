import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import {Subscription} from 'rxjs';
import {MobileResponsiveHelper} from '@core/helpers/mobile-responsive-helper';
import {UserMessagesSubjectService} from '@core/services/stores/user-messages-subject.service';


@Component({
    selector: 'app-direct-mongo-chat',
    templateUrl: './direct-mongo-chat.component.html',
    styleUrls: ['./direct-mongo-chat.component.scss'],
    providers: [{provide: MobileResponsiveHelper, useClass: MobileResponsiveHelper}]
})
export class DirectMongoChatComponent implements OnInit, OnDestroy {
    @Input() authUser;
    usersMessages = [];
    subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private userMessagesStore: UserMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.getUsersMessages();
    }

    getUsersMessages() {
        this.subscriptions.push(this.userMessagesStore.userMessages$.subscribe(dt =>{
            this.usersMessages = dt;
        }));
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
