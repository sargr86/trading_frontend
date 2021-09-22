import {AfterViewChecked, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import * as moment from 'moment';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-direct-chat',
    templateUrl: './direct-chat.component.html',
    styleUrls: ['./direct-chat.component.scss']
})
export class DirectChatComponent implements OnInit, AfterViewChecked, OnDestroy {

    @Input() authUser;

    usersMessages = [];
    selectedUserMessages = {messages: [], user: {}};
    activeUser;

    typingText: string;

    chatForm: FormGroup;

    @ViewChild('directMessagesList') private messagesList: ElementRef;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {

        this.addUserToSocket();
        this.getUsersMessages();
        this.initForm();
        this.getTyping();
        this.getSeen();
    }

    addUserToSocket() {
        this.socketService.addNewUser(this.authUser.username);
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [this.activeUser?.id],
            avatar: [this.authUser?.avatar],
            from_user: [this.authUser],
            to_user: [null],
            message: ['', Validators.required],
            personal: [1]
        });
    }

    getMessageClass(user) {
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    getSeenAvatar(msg) {
        if (msg.from_user.id !== this.authUser.id) {
            return msg.from_user.avatar;
        } else if (msg.to_user.id !== this.authUser.id) {
            return msg.to_user.avatar;
        }
    }

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    order(um) {
        return um.sort((a, b) => {
            return +(+moment(b.messages[b.messages.length - 1].created_at) - (+moment(a.messages[a.messages.length - 1].created_at)));
        });

    }

    getUsersMessages() {
        this.getMessagesFromSocket();
        this.chatService.getGeneralChatMessages({from_id: this.authUser.id, to_id: '', personal: 1}).subscribe(dt => {
            this.usersMessages = dt;

            if (!this.isChatUsersListSize()) {
                this.activeUser = dt[0]?.user;
                const selectedMessages = this.usersMessages.find(m => m.user.id === this.activeUser?.id);
                this.selectedUserMessages.user = selectedMessages?.user;
                this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages?.messages, 'created_at');
                this.chatForm.patchValue({to_id: this.activeUser?.id, to_user: this.activeUser});
            } else {

            }
        });
    }

    getMessagesFromSocket() {
        this.socketService.onNewMessage().subscribe((dt: any) => {

            // this.usersMessages.find(m => m.user.id === this.activeUser?.id)
            // this.usersMessages.find(m => m.user.id === dt?.from_id).messages.push(dt);
            // const selectedMessages = this.usersMessages.find(m => m.user.id === this.activeUser?.id);
            // this.selectedUserMessages = {messages: [], user: {}};
            // this.selectedUserMessages.user = selectedMessages.user;
            this.typingText = null;
            // this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages.messages, 'created_at');
            // console.log(this.selectedUserMessages.messages);
            // this.selectedUserMessages.messages = this.groupBy.transform(this.selectedUserMessages.messages, 'created_at');
            this.getUsersMessages();

        });
    }

    makeUserActive(user) {
        this.activeUser = user;
        this.selectedUserMessages = {messages: [], user: {}};
        this.chatForm.patchValue({to_id: user.id, to_user: this.activeUser});
        const userMessages = JSON.parse(JSON.stringify(this.usersMessages.find(m => m.user.id === user.id)));
        this.selectedUserMessages.messages = this.groupBy.transform(userMessages.messages, 'created_at');
        this.selectedUserMessages.user = userMessages.user;

    }

    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};


            this.chatService.saveMessage(data).subscribe(dt => {
                this.selectedUserMessages.messages = this.groupBy.transform(dt[0].messages, 'created_at');
                this.selectedUserMessages.user = dt[0].user;

                this.socketService.sendMessage(data);
                this.scrollMsgsToBottom();
                console.log(this.selectedUserMessages);
            });
            this.chatForm.patchValue({message: ''});
        }
    }

    scrollMsgsToBottom() {
        try {
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    getDateText(dateCreated) {
        const today = moment();
        const yesterday = moment().subtract(1, 'day');
        const passedDate = moment(dateCreated, 'dddd, MMMM Do');

        if (passedDate.isSame(today, 'day')) {
            return 'Today';
        } else if (passedDate.isSame(yesterday, 'day')) {
            return 'Yesterday';
        }

        return dateCreated;
    }

    setTyping(msg = null) {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            to_user: this.chatForm.value.to_user,
            message: this.chatForm.value.message
        });
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            // console.log(dt.message);
            this.typingText = dt.message ? `${dt.from_user.username} is typing...` : null;
        });
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
            this.selectedUserMessages.messages = [];
            // console.log('get seen', dt)
            this.getUsersMessages();
        });
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

    ngOnDestroy() {
        this.setTyping(null);
    }



}
