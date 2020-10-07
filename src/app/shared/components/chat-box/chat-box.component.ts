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
  videoRecordingStarted = false;

  @Input('openViduToken') openViduToken;
  @Input('session') session;
  @Output('sendMessage') sendMsg = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private subject: SubjectService,
    private getAuthUser: GetAuthUserPipe
  ) {
    this.authUser = this.getAuthUser.transform();
  }

  ngOnInit(): void {

    console.log(this.openViduToken)

    this.chatForm = this.fb.group({
      token: [this.openViduToken],
      from: [this.authUser.username],
      message: ['', Validators.required]
    });

    this.subject.getMsgData().subscribe((data) => {
      // this.messageSent = sent;
      const from = JSON.parse(data.from.replace(/}%\/%{/g, ','));
      data.from = from.clientData.myUserName;
      console.log(data.from)
      if (data.from !== this.authUser.username) {

        this.messages.push(data);
      }
    });

    this.subject.getVideoRecordingState().subscribe(data => {
      this.videoRecordingStarted = data.recording;
    });
  }

  sendMessage(e) {
    console.log(this.chatForm.value)
    this.messages.push(this.chatForm.value);
    this.sendMsg.emit(this.chatForm.value);
    this.chatForm.patchValue({message: ''});
  }

}
