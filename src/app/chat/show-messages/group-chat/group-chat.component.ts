import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
    socketGroupUsers = [];
    inputGroupMembers = [];
    filteredContacts = [];

    memberCtrl = new FormControl();

    subscriptions: Subscription[] = [];

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];

    @Input() groups = [];
    @Input() authUser;

    chatForm: FormGroup;

    @ViewChild('chipsInput') chipsInput: ElementRef<HTMLInputElement>;
    @ViewChild('groupMessagesList') private messagesList: ElementRef;

    selectedGroupMessages = {messages: [], group: {}};

    constructor(
        private fb: FormBuilder,
        private chatService: ChatService,
        private usersService: UsersService,
        private socketService: SocketIoService,
        private toastr: ToastrService,
        private dialog: MatDialog
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
            name: ['', Validators.required]
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
    }

    addUserToSocket() {

        this.socketService.addNewUser({...this.authUser, group: true});
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [this.selectedGroup?.id],
            avatar: [this.authUser?.avatar],
            from_user: [this.authUser],
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

    getGroupMembers() {
        this.subscriptions.push(this.chatService.getGroupMembers({group_id: this.selectedGroup.id}).subscribe(dt => {
            this.groupMembers = dt;
        }));
    }


    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    makeGroupActive(group) {
        this.selectedGroup = group;
        this.groupChatDetailsForm.patchValue({group_id: this.selectedGroup.id});
        this.getGroupMembers();
        console.log(this.socketGroupUsers)
    }

    addGroup() {
        if (this.groupChatForm.valid) {
            this.subscriptions.push(this.chatService.addGroup(this.groupChatForm.value).subscribe(dt => {
                this.groups = dt;
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
                    this.groups = dt;
                });
            }
        }));
    }


    autoCompleteMemberSelected(e) {
        const value = e.option.value;

        if (!this.inputGroupMembers.find(gm => gm.id === value)) {
            this.inputGroupMembers.push(e.option.value);
            console.log(this.inputGroupMembers);
            this.groupChatDetailsForm.patchValue({member_ids: this.inputGroupMembers});
        }

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');
    }

    addMember(e) {

        this.chipsInput.nativeElement.value = '';
        this.memberCtrl.setValue('');

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
            // console.log(data)
            this.socketGroupUsers = data.groupUsers;
            // console.log(this.socketGroupUsers)
            if (data.group === this.selectedGroup.name && data.username !== this.authUser.username) {
                this.toastr.info(data.msg);
                this.getGroupMembers();
            }
        });
    }

    getUserCurrentStatus(groupMember) {
        const groupName = groupMember.group.name;
        // console.log(this.socketGroupUsers)
        if (this.socketGroupUsers && groupName === this.selectedGroup.name) {
            const foundInSocketUsers = !!this.socketGroupUsers.find(sGroupUser => sGroupUser.group === groupName && groupMember.member.username === sGroupUser.username);
            // console.log(foundInSocketUsers)
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
            const data = {...this.chatForm.value};


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

    setSeen() {

    }

    setTyping() {

    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }

}
