import {Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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

    subscriptions: Subscription[] = [];

    typingText;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() groups = [];
    @Input() authUser;

    chatForm: FormGroup;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    @Output() groupRemoved = new EventEmitter();

    selectedGroupMessages = [];
    selectedRawMessages = [];

    groupsMessages = [];

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private toastr: ToastrService,
        private dialog: MatDialog,
        private groupBy: GroupByPipe
    ) {
        this.subscriptions.push(this.memberCtrl.valueChanges.subscribe(search => {
            if (search) {
                this.filteredContacts = this.userContacts.filter(fc => {
                    const fullNameLowerCased = (fc.first_name + ' ' + fc.last_name).toLowerCase();
                    if (fullNameLowerCased.includes(search)) {
                        return !this.groupMembers.find(gm => gm.member.name.toLowerCase() === fullNameLowerCased);
                    }
                    return false;
                });
            }
        }));
    }


    ngOnInit(): void {
        this.groupChatForm = this.fb.group({
            creator_id: [this.authUser.id],
            name: ['', Validators.required],
            username: [this.authUser.username]
        });
        this.selectedGroup = this.groups[0];

        this.groupChatDetailsForm = this.fb.group({
            group_id: [''],
            member_ids: ['', Validators.required]
        });


        if (this.selectedGroup) {
            this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
            this.getGroupMembers();
        }

        this.addUserToSocket();
        this.getUserContacts();
        this.getGroupJoinInvitation();
        this.getChatNotifications();
        this.initForm();
        this.getMessagesFromSocket();
        this.getGroupMessages();
        this.getTyping();
        this.getSeen();
        this.getGroupsMessages();
    }

    addUserToSocket() {
        this.socketService.addNewUser({...this.authUser, group: true});
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

    getUserContacts() {
        this.subscriptions.push(this.usersService.getUserContacts({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.userContacts = dt;
        }));
    }

    getGroupsMessages() {
        this.subscriptions.push(this.chatService.getGroupsMessages({
            user_id: this.authUser.id,
            blocked: 0
        }).subscribe(dt => {
            this.groupsMessages = dt;
        }));
    }

    getGroupMembers() {
        if (this.selectedGroup) {
            this.subscriptions.push(this.chatService.getGroupMembers({group_id: this.selectedGroup.id}).subscribe(dt => {
                this.groupMembers = dt;
            }));
        }
    }


    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
        // console.log(group)
        this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
        this.chatForm.patchValue({group_id: this.selectedGroup.id});
        this.getGroupMembers();
        this.getGroupMessages();
    }

    addGroup() {
        if (this.groupChatForm.valid) {
            this.subscriptions.push(this.chatService.addGroup(this.groupChatForm.value).subscribe(dt => {
                this.groups = dt;
                if (this.groups.length === 1) {
                    this.selectedGroup = this.groups[1];
                }
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
            this.groups = dt;
            this.selectedGroup = this.groups.find(group => this.selectedGroup.id === group.id);
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
                    this.groupMembers = dt;
                });
            }
        }));

    }

    removeGroup() {
        this.subscriptions.push(this.dialog.open(ConfirmationDialogComponent).afterClosed().subscribe(confirmed => {
            if (confirmed) {
                this.chatService.removeGroup({group_id: this.selectedGroup.id}).subscribe(dt => {
                    this.socketService.removeGroup({group: this.selectedGroup.name, username: this.authUser.username});
                    this.groups = dt;
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
            this.groupMembers = dt;
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
                    this.groups = dt;
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

    getGroupJoinInvitation() {
        this.socketService.inviteToGroupSent().subscribe((data: any) => {
            this.chatService.getChatGroups({user_id: this.authUser.id}).subscribe(dt => {
                this.groups = dt;
                this.selectedGroup = this.groups.find(group => data.group_id === group.id);
            });
        });
    }

    getChatNotifications() {
        this.socketService.getChatNotifications().subscribe((data: any) => {
            this.socketGroupsUsers = data.groupsUsers;
            console.log(this.socketGroupsUsers)
            if (data.groupRemoved) {
                console.log('group removed')
                this.groupRemoved.emit({});
                this.selectedGroup = data.username !== this.authUser.username ? null : this.groups[this.groups.length - 1];
            } else if (data.groupCreated) {
                this.selectedGroup = this.groups.find(g => g.name === data.group);
                if (this.selectedGroup) {
                    this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
                    this.getGroupMembers();
                }
            } else {
                // if (data.username !== this.authUser.username) {
                this.toastr.info(data.msg);
                this.getGroupMembers();
                // }
            }
        });
    }

    getUserCurrentStatus(groupMember) {
        const groupName = groupMember?.group?.name;
        if (this.socketGroupsUsers && groupName === this.selectedGroup.name) {
            const foundInSocketUsers = !!this.socketGroupsUsers.find(sGroupUser => sGroupUser.group === groupName && groupMember.member.username === sGroupUser.username);
            return foundInSocketUsers;
        }
        return false;
    }

    acceptGroupJoin() {
        this.subscriptions.push(
            this.chatService.acceptGroupJoin({
                group_id: this.selectedGroup.id,
                member_id: this.authUser.id
            }).subscribe(dt => {
                this.groups = dt;
                this.selectedGroup = this.groups.find(group => this.selectedGroup.id === group.id);
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
                this.groups = dt;
                this.selectedGroup = this.groups.find(group => this.selectedGroup.id === group.id);
            })
        );
    }

    getSocketRoomUsers() {
        this.socketService.acceptJoinToGroup({
            group: this.selectedGroup.name,
            username: this.authUser.username
        });
    }


    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value, group: this.selectedGroup.name};


            this.chatService.saveMessage(data).subscribe(dt => {
                // this.selectedUserMessages.messages = this.groupBy.transform(dt[0].messages, 'created_at');
                // this.selectedUserMessages.user = dt[0].user;

                this.socketService.sendMessage(data);
                this.scrollMsgsToBottom();
                // console.log(this.selectedUserMessages);
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

    getGroupMessages() {
        this.subscriptions.push(this.chatService.getGroupChatMessages({
            group_id: this.selectedGroup?.id,
            group: 1
        }).subscribe(dt => {
            this.selectedRawMessages = dt;
            this.selectedGroupMessages = this.groupBy.transform(dt, 'created_at');

        }));
    }

    getMessagesFromSocket() {
        this.socketService.onNewMessage().subscribe((dt: any) => {
            if (dt.group) {

                console.log('new message group chat!!!');
                // this.groupRemoved.emit({});
                this.getGroupMessages();
                this.typingText = null;
                // this.getUsersMessages();
            }

        });
    }


    getMessageClass(user) {
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    getSeen() {

        this.socketService.getSeen().subscribe((dt: any) => {
            console.log('get seen', dt)
            this.getGroupMessages();
        });
    }

    setSeen() {
        const isOwnMessage = this.selectedRawMessages[this.selectedRawMessages.length - 1]?.from_id === this.authUser.id;
        console.log('set seen')
        this.scrollMsgsToBottom();
        if (!isOwnMessage) {
            this.socketService.setSeen({
                message_id: this.selectedRawMessages[this.selectedRawMessages.length - 1].id,
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

    getTyping() {
        this.socketService.getTyping().subscribe((dt: any) => {
            if (dt.from_user.id !== this.authUser.id) {
                this.typingText = dt.message ? `${dt.from_user.username} is typing...` : null;
            }
        });
    }

    setTyping() {
        this.socketService.setTyping({
            from_user: this.chatForm.value.from_user,
            group: this.selectedGroup.name,
            message: this.chatForm.value.message
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
