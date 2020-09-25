import {Component, Input, OnInit} from '@angular/core';
import {StreamManager} from 'openvidu-browser';

@Component({
  selector: 'app-user-video',
  templateUrl: './user-video.component.html',
  styleUrls: ['./user-video.component.scss']
})
export class UserVideoComponent implements OnInit {


  @Input() streamManager: StreamManager;

  constructor() {
  }

  ngOnInit(): void {
  }

  getNicknameTag() { // Gets the nickName of the user
    return JSON.parse(this.streamManager.stream.connection.data.replace(/%/g, '').replace(/\//, '')).clientData;
  }

}
