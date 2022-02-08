import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ChatService} from '@core/services/chat.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {UsersService} from '@core/services/users.service';
import {ConfirmationDialogComponent} from '@core/components/modals/confirmation-dialog/confirmation-dialog.component';
import {Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {ShowChatGroupMembersComponent} from '@core/components/modals/show-chat-group-members/show-chat-group-members.component';
import {SocketIoService} from '@core/services/socket-io.service';
import {ToastrService} from 'ngx-toastr';
import {GroupByPipe} from '@shared/pipes/group-by.pipe';
import * as moment from 'moment';
import {SubjectService} from '@core/services/subject.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';
import {environment} from '@env';

@Component({
    selector: 'app-group-chat',
    templateUrl: './group-chat.component.html',
    styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit, OnDestroy {

    groupChatForm: FormGroup;
    groupChatDetailsForm: FormGroup;

    showGroupChatForm = false;
    showMembersInput = false;

    selectedGroup;

    userContacts = [];
    groupMembers = [];
    socketGroupsUsers = [];
    inputGroupMembers = [];
    filteredContacts = [];

    memberCtrl = new FormControl();
    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    subscriptions: Subscription[] = [];

    typingText = {group: null, text: null};


    @Input() authUser;

    chatForm: FormGroup;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    @Output() groupRemoved = new EventEmitter();


    selectedGroupMessages = [];
    selectedRawMessages = [];

    groupsMessages = [];

    haveGroupJoinInvitation = false;
    isProduction = environment.production;

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private subject: SubjectService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private groupBy: GroupByPipe,
        private fixLineBreaks: FixTextLineBreaksPipe
    ) {
        this.subscriptions.push(this.memberCtrl.valueChanges.subscribe(search => {
            if (search) {
                this.filteredContacts = this.userContacts.filter(fc => {
                    const fullNameLowerCased = (fc.first_name + ' ' + fc.last_name).toLowerCase();
                    if (fullNameLowerCased.includes(search)) {
                        return !this.groupMembers.find(gm => gm.name.toLowerCase() === fullNameLowerCased);
                    }
                    return false;
                });
            }
        }));
    }


    ngOnInit(): void {

        this.initGroupChatForms();
        this.initForm();
        this.getGroupsMessages();
        this.addUserToSocket();

        this.getUserContacts();
        // this.getGroupJoinInvitation();
        this.getChatNotifications();
        this.getMessagesFromSocket();

        this.getTyping();
        this.getSeen();
    }

    initGroupChatForms() {
        this.groupChatForm = this.fb.group({
            creator_id: [this.authUser.id],
            name: ['', Validators.required],
            username: [this.authUser.username]
        });


        this.groupChatDetailsForm = this.fb.group({
            group_id: [''],
            member_ids: ['', Validators.required]
        });
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            group_id: [this.selectedGroup?.id],
            avatar: [this.authUser?.avatar],
            from_user: [this.authUser],
            to_id: [null],
            to_user: [null],
            to_group: [this.selectedGroup],
            message: ['', Validators.required],
            personal: [1]
        });
    }

    addUserToSocket() {
        this.socketService.addNewUser({...this.authUser, group: true});
    }

    getUserContacts() {
        this.subscriptions.push(this.usersService.getUserContacts({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.userContacts = dt;
        }));
    }

    getGroupsMessages(selectedGroupBefore = null) {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessages = dt;


            this.selectedGroup = dt.find(d => d.name === selectedGroupBefore) || dt[0];
            this.selectedGroupMessages = this.groupBy.transform(this.selectedGroup?.chat_group_messages, 'created_at');
            if (this.selectedGroup) {
                if (this.selectedGroup?.chat_group_messages.length > 0) {
                    this.scrollMsgsToBottom();
                }
                this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
                this.chatForm.patchValue({group_id: this.selectedGroup.id});
                this.groupMembers = this.selectedGroup?.chat_group_members;
                // this.getGroupMessages();
                // console.log(this.groupMembers)
            }
        }));
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
        this.chatForm.patchValue({group_id: this.selectedGroup.id});
        this.selectedGroupMessages = this.groupBy.transform(group.chat_group_messages, 'created_at');
        this.typingText.group = group;
        this.getTypingTextStatus({group: group.name, message: ''});
        this.getGroupMembers();
    }

    addGroup() {
        if (this.groupChatForm.valid) {
            this.subscriptions.push(this.chatService.addGroup(this.groupChatForm.value).subscribe(dt => {
                this.selectedGroup = dt.find(d => this.groupChatForm.value.name === d.name)
                this.getGroupsMessages(this.selectedGroup);
                this.socketService.setNewGroup(this.groupChatForm.value);
                this.groupChatForm.patchValue({name: ''});
            }));
        }

    }

    changeAvatar(e) {
        // this.selectedGroup.avatar = e.target.files[0].name;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', file.name);
        formData.append('group_id', this.selectedGroup.id);
        formData.append('member_id', this.authUser.id);
        formData.append('group_avatar_file', file);
        // console.log({avatar: e.target.files[0].name})
        this.subscriptions.push(this.chatService.changeGroupAvatar(formData).subscribe(dt => {
            this.groupsMessages = dt;
            this.selectedGroup = this.groupsMessages.find(group => this.selectedGroup.id === group.id);
        }));
    }

    removeInputMember(member) {
        const index = this.inputGroupMembers.indexOf(member);

        if (index >= 0) {
            this.inputGroupMembers.splice(index, 1);
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers});
        }
    }

    removeSavedMember(member_id) {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroupMember({group_id: this.selectedGroup.id, member_id}).subscribe(dt => {
                    this.groupMembers = dt?.chat_group_members;
                });
            }
        }));
    }

    removeGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroup({group_id: this.selectedGroup.id}).subscribe(dt => {
                    this.socketService.removeGroup({group: this.selectedGroup.name, username: this.authUser.username});
                    this.groupsMessages = dt;
                    this.selectedGroup = null;
                });
            }
        }));
    }


    autoCompleteMemberSelected(e) {
        const value = e.option.value;

        if (!this.inputGroupMembers.find(gm => gm.id === value)) {
            this.inputGroupMembers.push(e.option.value);
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers});
        }

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');
    }

    addMember(e) {

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');

        console.log(this.groupChatDetailsForm.value, this.selectedGroup)

        this.subscriptions.push(this.chatService.addGroupMembers(this.groupChatDetailsForm.value).subscribe(dt => {
            this.groupMembers = dt?.chat_group_members;
            this.socketService.inviteToNewGroup({members: this.inputGroupMembers, group_id: this.selectedGroup.id});
            this.inputGroupMembers = [];
        }));
    }

    leaveGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.leaveGroup({
                    member_id: this.authUser.id,
                    group_id: this.selectedGroup.id
                }).subscribe(dt => {
                    this.groupsMessages = dt;
                    this.socketService.leaveGroup({group: this.selectedGroup.name, username: this.authUser.username});
                    this.selectedGroup = null;
                });
            }
        }));
    }

    openAllMembersModal() {
        this.subscriptions.push(this.dialog.open(ShowChatGroupMembersComponent, {
            width: '300px',
            height: '400px'
        }).afterClosed().subscribe(dt => {

        }));
    }

    ifConfirmedToJoinTheGroup(group) {
        return group?.chat_group_members.find(member => member.id === this.authUser.id && member.chat_groups_members.confirmed);
    }

    // getGroupJoinInvitation() {
    //     this.subscriptions.push(this.socketService.inviteToGroupSent().subscribe((data: any) => {
    //         this.chatService.getChatGroups({user_id: this.authUser.id}).subscribe(dt => {
    //
    //             this.groupsMessages = dt;
    //             this.selectedGroup = this.groupsMessages.find(group => data.group_id === group.id);
    //             this.haveGroupJoinInvitation = true;
    //             console.log(this.selectedGroup)
    //         });
    //     }));
    // }

    acceptGroupJoin() {
        this.subscriptions.push(
            this.chatService.acceptGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.groupsMessages = dt;
                this.selectedGroup = this.groupsMessages.find(group => this.selectedGroup.id === group.id);
                console.log(this.selectedGroup)
                this.haveGroupJoinInvitation = false;
                this.socketService.acceptJoinToGroup({
                    group: this.selectedGroup.name,
                    username: this.authUser.username
                });
            })
        );
    }

    declineGroupJoin() {
        this.subscriptions.push(
            this.chatService.declineGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.groupsMessages = dt;
                this.socketService.declineJoinToGroup({
                    group: this.selectedGroup?.name,
                    username: this.authUser.username
                });
                this.selectedGroup = this.groupsMessages.find(group => this.selectedGroup.id === group.id);
            })
        );
    }

    getChatNotifications() {
        this.subscriptions.push(this.socketService.getChatNotifications().subscribe((data: any) => {
            this.socketGroupsUsers = data.groupsUsers;
            // console.log(this.socketGroupsUsers)
            if (data.groupRemoved) {
                this.getGroupsMessages();
                // this.selectedGroup = data.username !== this.authUser.username ? null : this.groupsMessages[this.groups.length - 1];
            } else if (data.groupCreated) {
                this.selectedGroup = this.groupsMessages.find(g => g.name === data.group);
                if (this.selectedGroup) {
                    this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
                    this.groupMembers = this.selectedGroup?.chat_group_members;
                }
            } else if (!data.joiningChat) {
                // if (data.username !== this.authUser.username) {
                this.toastr.info(data.msg);
                if (data.acceptingJoinGroup || data.decliningJoinGroup || data.leavingGroup) {

                    this.selectedGroup = this.groupsMessages.find(g => g.name === data.group);
                    if (this.selectedGroup) {
                        this.getGroupMembers();
                        // this.getGroupMessages();
                    }
                }

                this.groupMembers = this.selectedGroup?.chat_group_members;
                // }
            }
        }));
    }

    getGroupMembers() {
        this.subscriptions.push(this.chatService.getGroupMembers({group_id: this.selectedGroup.id}).subscribe(dt => {
            this.groupMembers = dt?.chat_group_members;

        }));
    }

    getUserCurrentStatus(groupMember) {
        // console.log(groupMember)
        const groupName = this.groupsMessages.find(gm => gm.id === groupMember?.chat_groups_members?.group_id)?.name;
        if (this.socketGroupsUsers && groupName === this.selectedGroup?.name) {
            return !!this.socketGroupsUsers.find(sGroupUser => sGroupUser.group === groupName && groupMember.username === sGroupUser.username);
        }
        return false;
    }


    sendMessage(e) {
        this.chatForm.patchValue({message: this.fixLineBreaks.transform(e.target.value)});

        if (e.keyCode === 13 && !e.shiftKey && this.chatForm.value.message.trim() !== '') {
            if (this.chatForm.valid) {
                const data = {...this.chatForm.value, group: this.selectedGroup.name};


                this.subscriptions.push(this.chatService.saveGroupMessage(data).subscribe(dt => {
                    // this.selectedUserMessages.messages = this.groupBy.transform(dt[0].messages, 'created_at');
                    // this.selectedUserMessages.user = dt[0].user;

                    this.socketService.sendMessage(data);
                    this.scrollMsgsToBottom();
                    // console.log(this.selectedUserMessages);
                }));
                this.chatForm.patchValue({message: ''});
            }
        }
    }

    scrollMsgsToBottom() {

        try {
            // console.log(this.messagesList.nativeElement, this.messagesList.nativeElement.scrollHeight)
            this.messagesList.nativeElement.scrollTop = this.messagesList.nativeElement.scrollHeight;
        } catch (err) {
            console.log(err);
        }
    }

    // getGroupMessages() {
    //     this.subscriptions.push(this.chatService.getGroupChatMessages({
    //         group_id: this.selectedGroup?.id,
    //         group: 1
    //     }).subscribe(dt => {
    //         this.selectedRawMessages = dt;
    //         this.selectedGroupMessages = this.groupBy.transform(dt, 'created_at');
    //
    //     }));
    // }

    getMessagesFromSocket() {
        this.subscriptions.push(this.socketService.onNewMessage().subscribe((dt: any) => {
            if (dt.group) {

                console.log('new message group chat!!!');
                // this.groupRemoved.emit({});
                this.getGroupsMessages(this.selectedGroup.name);
                // this.selectedGroupMessages = this.groupBy.transform(dt, 'created_at');
                this.typingText = {group: null, text: null};
                // this.getUsersMessages();
            }

        }));
    }


    getMessageClass(user) {
        this.scrollMsgsToBottom();
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    getSeen() {

        this.subscriptions.push(this.socketService.getSeen().subscribe((dt: any) => {
            // console.log('get seen', dt)
            // console.log(this.selectedGroup)
            this.getGroupsMessages(this.selectedGroup.name);
        }));
    }

    setSeen() {
        // console.log(this.selectedGroupMessages)
        // console.log(this.groupsMessages)
        const messages = this.selectedGroup?.chat_group_messages;
        const lastMessage = messages[messages.length - 1];
        const isOwnMessage = lastMessage?.from_id === this.authUser.id;
        // console.log('set seen')
        // console.log(isOwnMessage)
        // console.log(lastMessage)
        // console.log(this.selectedGroup)
        this.scrollMsgsToBottom();
        if (!isOwnMessage) {
            this.socketService.setSeen({
                message_id: lastMessage?.id,
                from_id: this.chatForm.value.from_id,
                to_id: this.chatForm.value.to_id,
                from_user: this.chatForm.value.from_user,
                group: this.selectedGroup.name,
                group_id: this.selectedGroup.id,
                seen: 1,
                seen_at: moment().format('YYYY-MM-DD, h:mm:ss a')
            });
        }
    }

    getSeenTooltip(message) {
        const seenDate = message.group_chat_messages_seen.created_at;
        const thisWeekDate = moment(seenDate).isSame(new Date(), 'week');
        const seenDateFormatted = moment(seenDate).format(thisWeekDate ? 'ddd HH:mm' : 'MMM DD, YYYY HH:mm');

        return `${message.first_name} ${message.last_name} at ${seenDateFormatted}`;
    }

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            console.log(dt.group, this.selectedGroup?.name)
            this.getTypingTextStatus(dt);

        });
    }

    setTyping() {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            group: this.selectedGroup.name,
            message: this.chatForm.value.message
        });
    }

    getTypingTextStatus(dt) {
        const sameGroupTyping = dt.from_user?.id !== this.authUser.id && dt.group === this.selectedGroup.name && dt.message;
        this.typingText = {
            group: sameGroupTyping ? this.selectedGroup?.name === dt.group : null,
            text: sameGroupTyping ? `${dt.from_user.username} is typing...` : null
        };
    }

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    isSeenByAuthUser(messages) {
        const f = messages.filter(message => {
            let found = false;
            if (message.from_id !== this.authUser.id) {
                found = !message.seen_by.find(sb => sb.id === this.authUser.id);
            }
            return found;
        });
        return f.length;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
