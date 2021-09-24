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

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss']
})
export class ChatBottomBoxComponent implements OnInit, AfterViewChecked, OnDestroy {
    chatForm: FormGroup;
    authUser;

    loadingMessages = false;
    messages = [];
    typingText;

    @Input() channelUser;
    @Output() sendMsg = new EventEmitter();
    @Output() close = new EventEmitter();

    @ViewChild('directMessagesList') private messagesList: ElementRef;

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService,
        private socketService: SocketIoService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();
        this.addUserToSocket();
        this.loadPreviousMessages();
        this.getTyping();
        this.getMessagesFromSocket();
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
        });
    }

    addUserToSocket() {
        this.socketService.addNewUser(this.authUser.username);
    }

    loadPreviousMessages() {
        this.loadingMessages = true;
        this.chatService.getGeneralChatMessages({
            to_id: this.channelUser.id,
            from_id: this.authUser.id
        }).subscribe(dt => {
            this.messages = dt;
            this.loadingMessages = false;
        });
    }


    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};
            // console.log(data)
            this.sendMsg.emit(data);
            this.chatService.saveMessage(data).subscribe(dt => {
                this.messages = dt;
            });
            this.chatForm.patchValue({message: ''});
            this.setTyping();
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

    getSeen() {

        this.socketService.getSeen().subscribe((dt: any) => {
            // console.log('get seen', dt)
            this.loadPreviousMessages();
        });
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

    ngOnDestroy() {
        this.setTyping();
    }

}
