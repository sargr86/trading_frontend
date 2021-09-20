import { Component, OnInit } from '@angular/core';
import IsResponsive from '@core/helpers/is-responsive';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.scss']
})
export class GroupChatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

    isChatUsersListSize() {
        return IsResponsive.isChatUsersListSize();
    }
}
