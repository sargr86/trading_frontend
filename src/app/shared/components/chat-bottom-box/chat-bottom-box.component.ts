import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {ChatService} from '@core/services/chat.service';

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
    @Output() sendMsg = new EventEmitter();

    constructor(
        private fb: FormBuilder,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService
    ) {
    }

    ngOnInit(): void {
        this.authUser = this.getAuthUser.transform();
        this.initForm();
        this.loadPreviousMessages();
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

    loadPreviousMessages() {
        this.loadingMessages = true;
        this.chatService.getGeneralChatMessages({
            to_id: this.channelUser.id,
            from_id: this.authUser.id
        }).subscribe(dt => {
            this.messages = dt;
            this.loadingMessages = false;
        });
    }


    sendMessage(e) {
        if (this.chatForm.valid) {
            const data = {...this.chatForm.value};
            // console.log(data)
            this.sendMsg.emit(data);
            this.chatService.saveMessage(data).subscribe(dt => {
                this.messages = dt;
            });
            this.chatForm.patchValue({message: ''});
        }
    }


}
