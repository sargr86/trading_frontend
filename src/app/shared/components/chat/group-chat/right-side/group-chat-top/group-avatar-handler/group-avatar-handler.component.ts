import {Component, Input, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-avatar-handler',
    templateUrl: './group-avatar-handler.component.html',
    styleUrls: ['./group-avatar-handler.component.scss']
})
export class GroupAvatarHandlerComponent implements OnInit {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];

    constructor(
        private chatService: ChatService,
        private groupsMessagesStore: GroupsMessagesSubjectService
    ) {
    }

    ngOnInit(): void {
    }

    changeAvatar(e) {
        const file = e.target.files[0];
        const formData = new FormData();
        if (file) {

            formData.append('avatar', file.name);
            formData.append('group_id', this.selectedGroup.id);
            formData.append('member_id', this.authUser.id);
            formData.append('group_avatar_file', file);
            // console.log({avatar: e.target.files[0].name})
            this.subscriptions.push(this.chatService.changeGroupAvatar(formData).subscribe(dt => {
                this.groupsMessagesStore.setGroupsMessages(dt);
                // this.selectedGroup = dt.find(group => this.selectedGroup.id === group.id);
            }));
        }
    }


}
