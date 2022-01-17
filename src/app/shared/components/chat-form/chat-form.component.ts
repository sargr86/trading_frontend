import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '@env';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Subscription} from 'rxjs';
import {UserMessagesSubjectService} from '@core/services/user-messages-subject.service';

@Component({
    selector: 'app-chat-form',
    templateUrl: './chat-form.component.html',
    styleUrls: ['./chat-form.component.scss']
})
export class ChatFormComponent implements OnInit {
    isProduction = environment.production;
    subscriptions: Subscription [] = [];
    chatForm: FormGroup;
    authUser;

    selectedUser = null;
    @Output() sent = new EventEmitter();
    @Output() typing = new EventEmitter();
    @Output() seen = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private userMessagesStore: UserMessagesSubjectService,
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();
        this.subscriptions.push(this.userMessagesStore.selectedUserMessages$.subscribe((dt: any) => {
            this.selectedUser = dt;
            this.chatForm.patchValue({
                connection_id: this.selectedUser?.users_connections[0]?.id,
                to_id: this.selectedUser?.id,
                to_username: this.selectedUser?.username
            });
        }));
    }


    initForm() {
        this.chatForm = this.fb.group({
            from_username: [this.authUser.username],
            from_id: [this.authUser.id],
            connection_id: [''],
            to_id: [''],
            avatar: [this.authUser?.avatar],
            from_user: [this.authUser],
            // to_user: [null],
            to_username: [null],
            message: ['', Validators.required],
            personal: [1]
        });
    }

    setTyping() {
        this.typing.emit({
            from_id: this.chatForm.value.from_id,
            from_first_name: this.authUser.first_name,
            from_username: this.chatForm.value.from_username,
            to_username: this.chatForm.value.to_username,
            message: this.chatForm.value.message
        });
    }

    setSeen() {
        this.seen.emit({
            from_id: this.chatForm.value.from_id,
            to_id: this.chatForm.value.to_id,
            from_username: this.chatForm.value.from_username,
            to_username: this.chatForm.value.to_username,
            connection_id: this.chatForm.value.connection_id
        });
    }

    sendMessage(e) {
        if (e.keyCode === 13 && !e.shiftKey && this.chatForm.value.message.trim() !== '') {
            if (this.chatForm.valid) {
                this.sent.emit({
                    from_id: this.chatForm.value.from_id,
                    from_username: this.chatForm.value.from_username,
                    to_id: this.chatForm.value.to_id,
                    connection_id: this.chatForm.value.connection_id,
                    message: this.chatForm.value.message,
                    to_username: this.chatForm.value.to_username,
                    seen: false,
                    seen_at: ''
                });
                this.chatForm.patchValue({message: ''});
            }
        }
    }

}
