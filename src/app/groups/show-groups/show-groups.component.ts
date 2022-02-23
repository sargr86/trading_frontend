import { Component, OnInit } from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
  selector: 'app-show-groups',
  templateUrl: './show-groups.component.html',
  styleUrls: ['./show-groups.component.scss']
})
export class ShowGroupsComponent implements OnInit {

  constructor(
      public groupsMessagesStore: GroupsMessagesSubjectService
  ) { }

  ngOnInit(): void {
  }

}
