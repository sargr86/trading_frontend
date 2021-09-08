import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Component({
    selector: 'app-chat-bottom-box',
    templateUrl: './chat-bottom-box.component.html',
    styleUrls: ['./chat-bottom-box.component.scss']
})
export class ChatBottomBoxComponent implements OnInit {
    chatForm: FormGroup;
    authUser;

    loadingMessages = false;
    messages = [];
    @Input() channelUser;

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();
    }

    initForm() {
        this.chatForm = this.fb.group({
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [this.channelUser.id],
            avatar: [this.authUser.avatar],
            message: ['', Validators.required]
        });
    }

    sendMessage(e) {
        console.log(this.chatForm.value)
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};
            // console.log(data)
            this.messages.push(data);
            // this.sendMsg.emit(data);
            this.chatForm.patchValue({message: ''});
        }
    }

}
