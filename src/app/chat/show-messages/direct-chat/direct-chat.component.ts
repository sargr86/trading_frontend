import {
    AfterViewChecked,
    ChangeDetectorRef,
    Component,
    ElementRef, EventEmitter,
    Input,
    OnDestroy,
    OnInit, Output,
    ViewChild
} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import * as moment from 'moment';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {SocketIoService} from '@core/services/socket-io.service';
import {DatePipe} from '@angular/common';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UsersService} from '@core/services/users.service';
import {SubjectService} from '@core/services/subject.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-direct-chat',
    templateUrl: './direct-chat.component.html',
    styleUrls: ['./direct-chat.component.scss']
})
export class DirectChatComponent implements OnInit, AfterViewChecked, OnDestroy {

    @Input() authUser;

    usersMessages = [];
    filteredUsersMessages = [];
    selectedUserMessages = {messages: [], user: {}, rawMessages: []};
    activeUser;

    typingText: string;

    chatForm: FormGroup;
    showBlockedUsers = false;

    onlineUsers = [];
    newMessageSources = [];

    subscriptions: Subscription[] = [];

    @ViewChild('directMessagesList') private messagesList: ElementRef;
    @Output() newMessagesCountReceived = new EventEmitter();

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private usersService: UsersService,
        private subject: SubjectService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
        private fb: FormBuilder,
    ) {
    }

    ngOnInit(): void {

        this.addUserToSocket();
        this.getOnlineUsers();
        this.getMessagesFromSocket();
        this.getUsersMessages();
        this.initForm();
        this.getTyping();
        this.getSeen();
        this.getChatNotifications();
    }

    addUserToSocket() {
        this.socketService.addNewUser({...this.authUser, group: false});
    }

    getOnlineUsers() {
        this.subscriptions.push(this.socketService.userOnlineFeedback().subscribe((dt: any) => {
            this.onlineUsers = dt;
        }));
    }

    getUserCurrentStatus(username) {
        return this.onlineUsers.length === 0 || this.onlineUsers.includes(username);
    }

    getChatNotifications() {
        this.subscriptions.push(this.socketService.getChatNotifications().subscribe((data: any) => {
            this.onlineUsers = data.users;
        }));
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

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    getUsersMessages() {
        this.selectedUserMessages.messages = [];
        this.subscriptions.push(this.chatService.getDirectMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.usersMessages = dt;
            const newMessagesSource = dt.filter(d => d.unseens > 0);
            this.newMessagesCountReceived.emit(newMessagesSource.length);
            console.log(this.usersMessages)
            this.filteredUsersMessages = dt.filter(d => !!d.user.blocked === this.showBlockedUsers);
            this.newMessageSources = this.filteredUsersMessages.filter(fm => fm.unseens);
            this.subject.setNewMessagesSourceData({source: this.newMessageSources, type: 'direct'});
            console.log('get messages!!!', this.newMessageSources)
            this.activeUser = this.activeUser || this.filteredUsersMessages[0]?.user;

            const selectedMessages = this.filteredUsersMessages.find(m => m.user.id === this.activeUser?.id);
            this.selectedUserMessages.user = selectedMessages?.user;
            this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages?.messages, 'created_at');
            this.selectedUserMessages.rawMessages = selectedMessages?.messages;
            this.chatForm.patchValue({to_id: this.activeUser?.id, to_user: this.activeUser});
        }));
    }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            console.log('new message direct chat!!!')
            this.typingText = null;
            this.getUsersMessages();

        }));
    }

    makeUserActive(user, lastMsg) {
        this.activeUser = user;
        this.selectedUserMessages = {messages: [], user: {}, rawMessages: []};
        if (user) {
            this.chatForm.patchValue({to_id: user.id, to_user: this.activeUser});
            const userMessages = JSON.parse(JSON.stringify(this.filteredUsersMessages.find(m => m.user.id === user.id)));
            this.selectedUserMessages.messages = this.groupBy.transform(userMessages.messages, 'created_at');
            this.selectedUserMessages.rawMessages = userMessages.messages;
            this.selectedUserMessages.user = userMessages.user;

            if (!lastMsg.seen) {
                this.setSeen();
            }
        }

    }

    toggleBlockedUsers(show) {
        this.showBlockedUsers = show;
        this.filteredUsersMessages = this.usersMessages.filter(d => {
            return !!d.user.blocked === this.showBlockedUsers;
        });
        this.activeUser = this.filteredUsersMessages[0]?.user;
        this.makeUserActive(this.activeUser, this.filteredUsersMessages[0]?.messages[this.filteredUsersMessages[0]?.messages.length - 1])
    }

    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};


            this.subscriptions.push(this.chatService.saveMessage(data).subscribe(dt => {
                this.selectedUserMessages.messages = this.groupBy.transform(dt[0].messages, 'created_at');
                this.selectedUserMessages.user = dt[0].user;

                this.socketService.sendMessage(data);
                this.scrollMsgsToBottom();
                console.log(this.selectedUserMessages);
            }));
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


    setTyping(msg = null) {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            to_user: this.chatForm.value.to_user,
            message: this.chatForm.value.message
        });
    }

    getTyping() {
        this.subscriptions.push(this.socketService.getTyping().subscribe((dt: any) => {
            console.log(dt.from_user.id, this.authUser.id, this.activeUser);
            if (dt.from_user.id !== this.authUser.id && this.activeUser.id === dt.from_user.id) {
                this.typingText = dt.message ? `${dt.from_user.first_name} is typing...` : null;
            }
        }));
    }

    setSeen() {
        console.log(this.selectedUserMessages.messages)
        const userMessages = this.selectedUserMessages.rawMessages;
        if (userMessages.length > 0) {
            const isOwnMessage = userMessages[userMessages.length - 1]?.from_id === this.authUser.id;
            console.log('set seen', isOwnMessage)
            this.scrollMsgsToBottom();
            if (!isOwnMessage) {
                this.socketService.setSeen({
                    message_id: userMessages[userMessages.length - 1].id,
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

        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            this.selectedUserMessages.messages = [];
            console.log('get seen', dt)
            this.getUsersMessages();
        }));
    }

    unreadLastMsg(from, lastMsg) {

        if (lastMsg.to_id === this.authUser.id && lastMsg.from_id === from.id) {
            const params = {
                to_id: this.authUser.id,
                to_user: this.authUser,
                from_user: {username: from.from, ...from},
                from_id: from.id,
                id: lastMsg.id,
                seen: 0
            };

            console.log(params)

            console.log('unread msg!!')
            this.socketService.setSeen(params);
        }


    }

    blockUser(user) {
        const params = {connection_id: user.id, user_id: this.authUser.id, block: +!this.showBlockedUsers};
        this.subscriptions.push(this.usersService.blockUser(params).subscribe(dt => {
            this.getUsersMessages();
        }));
    }

    getSeenTooltip(message) {
        const user = message.to_user;
        const thisWeekDate = moment(message.seen_at).isSame(new Date(), 'week');
        const seenDate = moment(message.seen_at).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');

        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }

    checkIfLastMessageSeen(lastMsg) {
        return lastMsg.seen === 0 && lastMsg.from_id !== this.authUser.id;
    }

    ngAfterViewChecked() {
        // this.scrollMsgsToBottom();
    }

    ngOnDestroy() {
        this.setTyping(null);
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
