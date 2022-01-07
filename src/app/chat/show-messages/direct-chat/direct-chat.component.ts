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
import {ToastrService} from 'ngx-toastr';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {environment} from '@env';
import {notificationsStore} from '@shared/stores/notifications-store';
@Component({
    selector: 'app-direct-chat',
    templateUrl: './direct-chat.component.html',
    styleUrls: ['./direct-chat.component.scss']
})
export class DirectChatComponent implements OnInit, AfterViewChecked, OnDestroy {

    @Input() authUser;

    usersMessages = [];
    filteredUsersMessages = [];
    selectedUserMessages = {messages: [], user: {}, rawMessages: [], connection_id: null};
    activeUser;

    typingText: string;

    chatForm: FormGroup;
    showBlockedUsers = false;

    onlineUsers = [];
    blockedUsers = [];
    newMessageSources = [];

    subscriptions: Subscription[] = [];
    isProduction = environment.production;

    @ViewChild('directMessagesList') private messagesList: ElementRef;
    @Output() newMessagesCountReceived = new EventEmitter();

    notificationsStore = notificationsStore;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private socketService: SocketIoService,
        private usersService: UsersService,
        private toastr: ToastrService,
        private subject: SubjectService,
        private datePipe: DatePipe,
        private groupBy: GroupByPipe,
        private fb: FormBuilder,
        private getElegantDate: GetElegantDatePipe
    ) {
    }

    ngOnInit(): void {

        // this.addUserToSocket();
        this.getOnlineUsers();
        this.getMessagesFromSocket();
        this.getUsersMessages();
        this.initForm();
        this.getTyping();
        this.getSeen();
        this.getChatNotifications();
        this.getBlockUnblockUser();
        this.getAcceptedDeclinedRequests();
    }

    addUserToSocket() {
        this.socketService.addNewUser({...this.authUser, group: false});
    }

    getOnlineUsers() {
        this.socketService.getConnectedUsers({username: this.authUser.username});
        this.socketService.usersOnlineFeedback().subscribe((dt: any) => {
            this.onlineUsers = dt;
        });

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

    getAcceptedDeclinedRequests() {
        this.subscriptions.push(this.socketService.acceptedConnection().subscribe((dt: any) => {
            console.log('accepted', dt)
            this.getUsersMessages();
        }));

        this.subscriptions.push(this.socketService.declinedConnection().subscribe((dt: any) => {
            console.log('declined')

        }));
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            connection_id: [this.selectedUserMessages?.connection_id],
            to_id: [this.activeUser?.id],
            avatar: [this.authUser?.avatar],
            from_user: [this.authUser],
            to_user: [null],
            message: ['', Validators.required],
            personal: [1]
        });
    }

    isOwnMessage(user_id) {
        return user_id === this.authUser.id;
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
            this.blockedUsers = dt.filter(d => d.users_connections[0].is_blocked === 1);
            this.filteredUsersMessages = dt.filter(d => !!d.users_connections[0].is_blocked === this.showBlockedUsers);
            console.log(this.blockedUsers)
            this.newMessageSources = this.filteredUsersMessages.filter(fm => fm.unseens);
            this.subject.setNewMessagesSourceData({source: this.newMessageSources, type: 'direct'});
            this.activeUser = this.activeUser || this.filteredUsersMessages[0];
            // connection_id: this.filteredUsersMessages[0].users_connections[0].id
            // console.log(this.activeUser)

            const selectedMessages = this.filteredUsersMessages.find(m => m.id === this.activeUser?.id);
            this.selectedUserMessages.user = selectedMessages;
            this.selectedUserMessages.connection_id = selectedMessages?.users_connections[0].id;
            this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages?.users_connections[0].users_messages, 'created_at');
            this.selectedUserMessages.rawMessages = selectedMessages?.users_connections[0].users_messages;
            this.chatForm.patchValue({
                to_id: this.activeUser?.id,
                to_user: this.activeUser,
                connection_id: this.activeUser?.users_connections?.[0].id
            });
            // console.log(this.chatForm.value)
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
        this.selectedUserMessages = {messages: [], user: {}, rawMessages: [], connection_id: null};
        if (user) {
            this.chatForm.patchValue({
                to_id: user.id,
                to_user: this.activeUser,
                connection_id: this.activeUser.users_connections[0].id
            });
            const userMessages = JSON.parse(JSON.stringify(this.filteredUsersMessages.find(m => m.id === user.id)));
            this.selectedUserMessages = userMessages;
            this.selectedUserMessages.connection_id = userMessages?.users_connections[0].id;
            this.selectedUserMessages.messages = this.groupBy.transform(userMessages?.users_connections[0].users_messages, 'created_at');
            this.selectedUserMessages.rawMessages = userMessages?.users_connections[0].users_messages;
            if (!lastMsg?.seen) {
                this.setSeen();
            }
        }

    }

    toggleBlockedUsers(show) {
        this.showBlockedUsers = show;
        this.filteredUsersMessages = this.usersMessages.filter(d => {
            return !!d.users_connections?.[0].is_blocked === this.showBlockedUsers;
        });
        this.activeUser = this.filteredUsersMessages[0];
        if (this.activeUser) {
            const activeUserMessages = this.activeUser?.users_connections[0]?.users_messages;
            this.makeUserActive(this.activeUser, activeUserMessages[activeUserMessages.length - 1]);
        }

    }

    sendMessage(e) {
        if (e.keyCode === 13 && !e.shiftKey && this.chatForm.value.message.trim() !== '') {
            if (this.chatForm.valid) {
                const data = {...this.chatForm.value};


                // this.subscriptions.push(this.chatService.saveDirectMessage(data).subscribe(dt => {
                //     this.usersMessages = dt;
                //     this.filteredUsersMessages = dt.filter(d => !!d.users_connections[0].is_blocked === this.showBlockedUsers);
                //     const selectedMessages = this.filteredUsersMessages.find(m => m.id === this.activeUser?.id);
                //     this.selectedUserMessages.user = selectedMessages;
                //     this.selectedUserMessages.connection_id = selectedMessages?.users_connections[0].id;
                //     console.log(selectedMessages?.users_connections)
                //     this.selectedUserMessages.messages = this.groupBy.transform(selectedMessages?.users_connections[0].users_messages, 'created_at');
                //     this.selectedUserMessages.rawMessages = selectedMessages?.users_connections[0].users_messages;

                    this.socketService.sendMessage(data);
                    this.scrollMsgsToBottom();
                    console.log(this.selectedUserMessages);
                // }));
                this.chatForm.patchValue({message: ''});
            }
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
                    connection_id: this.chatForm.value.connection_id,
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

    unreadLastMessages(usersMessages) {
        const messages = usersMessages.users_connections[0]?.users_messages;
        const lastReceivedMessages = [];

        messages.reverse().some((message) => {
            if (message.from_id !== this.authUser.id) {
                lastReceivedMessages.push(message);
            }
            return message.from_id === this.authUser.id;
        });

        const params = {
            message_ids: lastReceivedMessages.map(m => m.id),
            to_user: usersMessages.username,
            from_user: this.authUser.username
        };

        if (params.message_ids.length > 0) {
            this.socketService.unreadLastMessages(params);
        }
    }

    blockUser(user) {
        const params = {
            connection_id: user.users_connections?.[0].id,
            user: this.authUser,
            block: +!this.showBlockedUsers,
            contact_username: user.username
        };

        this.subscriptions.push(this.usersService.blockUser(params).subscribe(dt => {
            this.activeUser = null;
            this.getUsersMessages();
            this.socketService.blockUnblockUser(params);
        }));
    }

    getBlockUnblockUser() {
        this.subscriptions.push(this.socketService.getBlockUnblockUser().subscribe((dt: any) => {
            // this.selectedUserMessages.messages = [];
            console.log('get block/unblock', dt)
            this.toastr.error(`${dt.user.username} blocked the connection between you two`)
            this.activeUser = null;
            this.getUsersMessages();
        }));
    }

    getSeenTooltip(message) {
        const user = this.selectedUserMessages.user as any;
        // const thisWeekDate = moment(message.seen_at).isSame(new Date(), 'week');
        // const seenDate = moment(message.seen_at).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');
        const seenDate = this.getElegantDate.transform(message.seen_at);

        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }

    checkIfLastMessageSeen(lastMsg) {
        return lastMsg?.seen === 0 && lastMsg?.from_id !== this.authUser.id;
    }

    getUserLastMessage(messages) {
        return messages[messages.length - 1];
    }

    getChatInputPlaceholder(activeUser) {
        return !this.ifContactBlocked(activeUser) ? 'Type your message' : 'Since the contact is blocked you will no longer be able to send messages to this user';
    }

    ifUnreadShown(lastMsg, user) {
        return lastMsg?.from_id !== this.authUser.id && !user.users_connections[0].is_blocked;
    }

    ifMoreActionsShown(lastMsg, user) {
        return !user.users_connections[0].is_blocked && (!lastMsg || lastMsg?.from_id === this.authUser.id || lastMsg?.seen === 1);
    }

    ifContactBlocked(user) {
        return user.users_connections?.[0].is_blocked;
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

    ngOnDestroy() {
        this.setTyping(null);
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
