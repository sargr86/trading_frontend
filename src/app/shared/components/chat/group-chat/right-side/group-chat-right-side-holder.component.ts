import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-chat-right-side-holder',
    templateUrl: './group-chat-right-side-holder.component.html',
    styleUrls: ['./group-chat-right-side-holder.component.scss']
})
export class GroupChatRightSideHolderComponent implements OnInit {

    @Input() authUser;
    subscriptions: Subscription[] = [];

    selectedGroupMessages;

    constructor(private groupsMessagesStore: GroupsMessagesSubjectService) {
    }

    ngOnInit(): void {
        this.getSelectedGroup();
    }

    getSelectedGroup() {
        this.subscriptions.push(this.groupsMessagesStore.selectedGroupsMessages$.subscribe((dt: any) => {
            this.selectedGroupMessages = dt;
            // console.log(dt?.chat_group_members)
        }));
    }
}

