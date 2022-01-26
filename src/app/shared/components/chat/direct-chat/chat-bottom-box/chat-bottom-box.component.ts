import {
    AfterViewChecked,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';
import {SocketIoService} from '@core/services/socket-io.service';
import * as moment from 'moment';
import {UsersService} from '@core/services/users.service';
import {Subscription} from 'rxjs';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';
import {DirectChatMessagesComponent} from '@shared/components/chat/direct-chat/direct-chat-messages/direct-chat-messages.component';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss'],
    providers: [DirectChatMessagesComponent]
})
export class ChatBottomBoxComponent implements OnInit, OnDestroy {
    authUser;

    messages = [];

    subscriptions: Subscription[] = [];

    @Input() channelUser;
    @Input() isOpenedFromChannelPage = false;
    @Output() closeBox = new EventEmitter();


    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private socketService: SocketIoService,
        private usersService: UsersService,
        private userMessagesStore: UserMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        // this.addUserToSocket();
        this.getUsersMessages();
    }

    addUserToSocket() {
        this.socketService.addNewUser(this.authUser);
    }

    getUsersMessages() {
        // const selectedContact = this.userMessagesStore.userMessages.find(d => d.id === this.channelUser.id);
        // if (selectedContact) {
        //     this.userMessagesStore.changeUser(selectedContact);
        // } else if (this.isOpenedFromChannelPage){
        //     console.log(this.channelUser)
        //     this.userMessagesStore.changeUser(this.channelUser);
        // }
        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
        }).subscribe(dt => {
            this.messages = dt;
            this.userMessagesStore.setUserMessages(dt);
            console.log(this.userMessagesStore.userMessages)
            this.userMessagesStore.changeUser(dt.find(d => d.id === this.channelUser.id));
            // this.userMessagesStore.changeUser(dt[0]);
            console.log(this.userMessagesStore.selectedUserMessages)
        }));

    }


    closeChatBox() {
        this.closeBox.emit();
    }

    ngOnDestroy() {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
