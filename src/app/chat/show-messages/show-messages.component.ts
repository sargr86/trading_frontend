import {AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from '@core/services/chat.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import IsResponsive from '@core/helpers/is-responsive';

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

    @ViewChild('directMessagesList') private messagesList: ElementRef;

    constructor(
        private chatService: ChatService,
        private getAuthUser: GetAuthUserPipe,
        private fb: FormBuilder
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.getUsersMessages();
        this.initForm();
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [this.activeUser?.id],
            avatar: [this.authUser.avatar],
            message: ['', Validators.required],
            personal: [1]
        });
    }

    changeTab(tab) {
        this.activeTab = tab;
    }

    getUsersMessages() {
        this.chatService.getGeneralChatMessages({from_id: this.authUser.id, to_id: '', personal: 1}).subscribe(dt => {
            this.usersMessages = dt;
            this.activeUser = dt[0]?.user;
            this.selectedUserMessages = this.usersMessages.find(m => m.user.id === this.activeUser.id);
            this.chatForm.patchValue({to_id: this.activeUser?.id});
        });
    }

    makeUserActive(user) {
        this.activeUser = user;
        this.chatForm.patchValue({to_id: user.id});
        this.selectedUserMessages = this.usersMessages.find(m => m.user.id === user.id);
    }

    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};
            this.chatService.saveMessage(data).subscribe(dt => {
                this.selectedUserMessages = dt[0];
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

    getMessageClass(user) {
        return user.id === this.authUser.id ? 'my-message' : 'other-message';
    }

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }

    ngAfterViewChecked() {
        this.scrollMsgsToBottom();
    }

}
