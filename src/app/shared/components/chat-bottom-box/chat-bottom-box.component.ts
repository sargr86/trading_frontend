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
import {DirectChatMessagesComponent} from '@shared/components/direct-chat-messages/direct-chat-messages.component';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss'],
    providers: [DirectChatMessagesComponent]
})
export class ChatBottomBoxComponent implements OnInit, AfterViewChecked, OnDestroy {
    chatForm: FormGroup;
    authUser;

    loadingMessages = false;
    messages = [];
    typingText;

    subscriptions: Subscription[] = [];

    @Input() channelUser;
    @Output() close = new EventEmitter();

    @ViewChild('directMessagesList') private messagesList: ElementRef;

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
        this.initForm();
        this.addUserToSocket();
        // this.loadPreviousMessages();
        this.checkIfUsersConnected();
        this.getTyping();
        this.getMessagesFromSocket();
        this.getUsersMessages();
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [this.channelUser.id],
            avatar: [this.authUser.avatar],
            message: ['', Validators.required],
            from_user: [this.authUser],
            to_user: [this.channelUser],
            connection_id: [''],
            bottom_chat: 1
        });
    }

    checkIfUsersConnected() {
        this.usersService.checkIfUsersConnected({
            user_id: this.authUser.id,
            channel_user_id: this.channelUser.id
        }).subscribe(dt => {
            if (dt) {
                this.chatForm.patchValue({
                    connection_id: dt.id
                });

                console.log(this.chatForm.value)
            }
        });
    }

    addUserToSocket() {
        this.socketService.addNewUser(this.authUser);
    }

    getUsersMessages() {
        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.messages = dt;
            this.userMessagesStore.setUserMessages(dt);
            console.log(this.channelUser)
            this.userMessagesStore.changeUser(dt.find(d => d.id === this.channelUser.id));
        }));
    }

    loadPreviousMessages() {
        this.loadingMessages = true;
        this.chatService.getMessagesBetweenTwoUsers({
            to_id: this.channelUser.id,
            from_id: this.authUser.id
        }).subscribe(dt => {
            this.messages = dt;
            this.loadingMessages = false;
        });
    }


    sendMessage() {
        if (this.chatForm.valid) {
            const data = this.chatForm.value;
            this.chatService.saveDirectMessage(data).subscribe(dt => {
                this.messages = dt;
                this.socketService.sendMessage(data);
                this.chatForm.patchValue({message: ''});
                this.setTyping();
            });
        }
    }

    getMessagesFromSocket() {
        this.socketService.onNewMessage().subscribe((dt: any) => {
            this.typingText = null;
            this.loadPreviousMessages();
        });
    }

    setTyping() {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            to_user: this.chatForm.value.to_user,
            message: this.chatForm.value.message
        });
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            this.typingText = dt.message ? `${dt.from_user.username} is typing...` : null;
        });
    }

    closeChatBox() {
        this.close.emit();
    }

    getMessageClass(user) {
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    setSeen() {
        const userMessages = this.messages;
        if (userMessages.length > 0) {
            const isOwnMessage = userMessages[userMessages.length - 1]?.from_id === this.authUser.id;

            if (!isOwnMessage) {
                this.scrollMsgsToBottom();
                this.socketService.setSeen({
                    from_id: this.chatForm.value.from_id,
                    to_id: this.chatForm.value.to_id,
                    from_user: this.chatForm.value.from_user,
                    to_user: this.chatForm.value.to_user,
                    seen: 1,
                    seen_at: moment().format('YYYY-MM-DD, h:mm:ss a')
                });
            }
        }
    }

    getSeen() {

        this.socketService.getSeen().subscribe((dt: any) => {
            // console.log('get seen', dt)
            this.loadPreviousMessages();
        });
    }

    getSeenAvatar(msg) {
        if (msg.from_user.id !== this.authUser.id) {
            return msg.from_user.avatar;
        } else if (msg.to_user.id !== this.authUser.id) {
            return msg.to_user.avatar;
        }
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    ngAfterViewChecked() {
        // this.scrollMsgsToBottom();
    }

    ngOnDestroy() {
        this.setTyping();
    }

}
