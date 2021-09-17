import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SocketIoService} from '@core/services/socket-io.service';
import IsResponsive from '@core/helpers/is-responsive';

import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';

import * as moment from 'moment';

@Component({
    selector: 'app-show-messages',
    templateUrl: './show-messages.component.html',
    styleUrls: ['./show-messages.component.scss']
})
export class ShowMessagesComponent implements OnInit, AfterViewChecked {
    activeTab = 'direct';
    authUser;
    usersMessages = [];
    selectedUserMessages = {messages: [], user: {}};
    activeUser;

    chatForm: FormGroup;
    typingText: string;

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
        this.authUser = this.getAuthUser.transform();
        this.addUserToSocket();
        // if (!this.isChatUsersListSize()) {
        this.getUsersMessages();
        // }
        this.initForm();
        this.getTyping();
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

    changeTab(tab) {
        this.activeTab = tab;
    }

    addUserToSocket() {
        this.socketService.addNewUser(this.authUser.username);
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
            this.usersMessages.find(m => m.user.id === dt?.from_id).messages.push(dt);
            const selectedMessages = this.usersMessages.find(m => m.user.id === this.activeUser?.id);
            this.selectedUserMessages = {messages: [], user: {}};
            this.selectedUserMessages.user = selectedMessages.user;
            this.typingText = null;
            this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages.messages, 'created_at');
            console.log(this.selectedUserMessages.messages)
            // this.selectedUserMessages.messages = this.groupBy.transform(this.selectedUserMessages.messages, 'created_at');

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
                console.log(this.selectedUserMessages)
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

    getMessageClass(user) {
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    order(um) {
        return um.sort((a, b) => {
            return +(+moment(b.messages[b.messages.length - 1].created_at) - (+moment(a.messages[a.messages.length - 1].created_at)));
        });

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

    setTyping() {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            to_user: this.chatForm.value.to_user,
            message: this.chatForm.value.message
        });
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            console.log(dt.message)
            this.typingText = dt.message ? `${dt.from_user.username} is typing...` : null;
        });
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

}
