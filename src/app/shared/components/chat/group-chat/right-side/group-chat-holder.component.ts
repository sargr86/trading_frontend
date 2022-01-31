import {Component, Input, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {Subscription} from 'rxjs';

@Component({
    selector: 'app-group-chat-holder',
    templateUrl: './group-chat-holder.component.html',
    styleUrls: ['./group-chat-holder.component.scss']
})
export class GroupChatHolderComponent implements OnInit {
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
        }));
    }

}
