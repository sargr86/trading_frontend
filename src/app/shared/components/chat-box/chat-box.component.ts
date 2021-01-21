import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import {ChatService} from '@core/services/chat.service';

@Component({
    selector: 'app-chat-box',
    templateUrl: './chat-box.component.html',
    styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
    chatForm: FormGroup;
    messageSent = false;
    messages = [];
    authUser;
    selectedUsersToReply = [];
    userSelected = false;
    apiUrl = API_URL;

    customEmojis = [
        {
            name: 'Octocat',
            shortNames: ['octocat'],
            text: '',
            emoticons: [],
            keywords: ['github'],
            imageUrl: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
        }
    ];


    @Input('openViduToken') openViduToken;
    @Input('session') session;
    @Input('videoId') videoId;
    @Output('sendMessage') sendMsg = new EventEmitter();
    @Input('videoRecordingState') videoRecordingState;

    constructor(
        private fb: FormBuilder,
        private subject: SubjectService,
        private getAuthUser: GetAuthUserPipe,
        private chatService: ChatService
    ) {
        this.authUser = this.getAuthUser.transform();
        if (!this.videoRecordingState) {
            this.videoRecordingState = 'idle';
        }
    }

    ngOnInit(): void {

        this.initForm();
        this.getChatMessagesFromParentComponents();
        this.getVideoRecordingState();
        this.loadVideoPreviousMessages();

    }

    initForm() {
        this.chatForm = this.fb.group({
            token: [this.openViduToken],
            from: [this.authUser.username],
            from_id: [this.authUser.id],
            to_id: [''],
            avatar: [this.authUser.avatar],
            message: ['', Validators.required]
        });
    }

    loadVideoPreviousMessages() {
        this.chatService.getChatMessages({video_id: this.videoId}).subscribe(dt => {
            this.messages = dt;
        });
    }

    // Getting messages from publisher or subscriber component
    getChatMessagesFromParentComponents() {
        this.subject.getMsgData().subscribe((data) => {
            console.log(this.messages)
            console.log(data)
            // this.messageSent = sent;
            console.log(data.from.includes('clientData'))
            if (data.from.includes('clientData')) {

                const from = JSON.parse(data.from.replace(/}%\/%{/g, ','));
                data.from = from.clientData.myUserName;
                data.avatar = from.clientData.avatar;
                console.log(data.from)
                console.log(this.authUser.username)

            }

            if (data.from !== this.authUser.username) {

                this.messages.push(data);
                console.log(this.messages)
            }
        });
    }

    getVideoRecordingState() {
        this.subject.getVideoRecordingState().subscribe(data => {
            console.log(data)
            this.videoRecordingState = data.recording ? 'started' : 'finished';
            // console.log('VIDEO RECORDING STATE:' + this.videoRecordingState + '!!!!');
        });
    }

    selectUserToReply(m) {

        if (m.from !== this.authUser.username) {
            this.userSelected = true;
            if (!this.selectedUsersToReply.includes(m.from)) {
                this.selectedUsersToReply.push(m.from);
                this.chatForm.patchValue({message: '@' + m.from + ''});
            } else {
                this.selectedUsersToReply = this.selectedUsersToReply.filter(f => f !== m.from);
                this.chatForm.patchValue({message: ''});
            }

            console.log(this.selectedUsersToReply)
        }
    }

    sendMessage(e) {
        console.log(this.chatForm.value)
        this.messages.push(this.chatForm.value);
        this.sendMsg.emit(this.chatForm.value);
        this.chatForm.patchValue({message: ''});
    }

    addEmoji(e) {
        console.log(e)
        const message = this.chatForm.value.message;
        this.chatForm.patchValue({message: message + (e.emoji.native ? e.emoji.native : e.emoji.imageUrl)});
    }

}
