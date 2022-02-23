import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {API_URL} from '@core/constants/global';
import {ChatService} from '@core/services/chat.service';
import {FixTextLineBreaksPipe} from '@shared/pipes/fix-text-line-breaks.pipe';

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
    loadingMessages = false;

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
        private chatService: ChatService,
        private fixLineBreaks: FixTextLineBreaksPipe
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
        if (this.videoId) {
            this.loadingMessages = true;
            this.chatService.getChatMessages({video_id: this.videoId}).subscribe(dt => {
                this.messages = dt;
                this.loadingMessages = false;
            });
        }
    }

    // Getting messages from publisher or subscriber component
    getChatMessagesFromParentComponents() {
        this.subject.getMsgData().subscribe((data) => {
            const msgData = {from: '', avatar: '', message: ''};
            if (data.from.includes('clientData')) {
                const from = JSON.parse(data.from.replace(/}%\/%{/g, ','));
                msgData.from = from.clientData.myUserName;
                msgData.avatar = from.avatar;
                msgData.message = data.message;
            }

            if (msgData.from !== this.authUser.username) {

                this.messages.push(msgData);
            }
        });
    }

    getVideoRecordingState() {
        this.subject.getVideoRecordingState().subscribe(data => {
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
        // Getting video id for publisher and subscriber differently
        if (this.videoId && this.chatForm.valid) {
            const message = this.fixLineBreaks.transform(this.chatForm.value.message, e.target);
            this.chatForm.patchValue({message});
            const data = {video_id: this.videoId, ...this.chatForm.value};
            // console.log(data)
            this.messages.push(data);
            this.sendMsg.emit(data);
            this.chatForm.patchValue({message: ''});
        } else {
            console.log('video id is not set');
        }
    }

    addEmoji(e) {
        console.log(e)
        const message = this.chatForm.value.message;
        this.chatForm.patchValue({message: message + (e.emoji.native ? e.emoji.native : e.emoji.imageUrl)});
    }

}
