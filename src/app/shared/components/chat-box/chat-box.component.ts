import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SubjectService} from '@core/services/subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

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
    @Output('sendMessage') sendMsg = new EventEmitter();
    @Input('videoRecordingState') videoRecordingState;

    constructor(
        private fb: FormBuilder,
        private subject: SubjectService,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
        if (!this.videoRecordingState) {
            this.videoRecordingState = 'idle';
        }
    }

    ngOnInit(): void {

        console.log(this.openViduToken)

        this.chatForm = this.fb.group({
            token: [this.openViduToken],
            from: [this.authUser.username],
            message: ['', Validators.required]
        });

        this.subject.getMsgData().subscribe((data) => {
            console.log(this.messages)
            console.log(data)
            // this.messageSent = sent;
            console.log(data.from.includes('clientData'))
            if (data.from.includes('clientData')) {

                const from = JSON.parse(data.from.replace(/}%\/%{/g, ','));
                data.from = from.clientData.myUserName;
                console.log(data.from)
                console.log(this.authUser.username)

            }

            if (data.from !== this.authUser.username) {

                this.messages.push(data);
                console.log(this.messages)
            }
        });

        this.subject.getVideoRecordingState().subscribe(data => {
            console.log(data)
            // this.videoRecordingState = data.recordingState;
            // console.log('VIDEO RECORDING STATE:' + this.videoRecordingState + '!!!!');
        });
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
