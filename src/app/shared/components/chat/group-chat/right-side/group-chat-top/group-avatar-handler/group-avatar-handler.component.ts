import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ChatService} from '@core/services/chat.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';

@Component({
    selector: 'app-group-avatar-handler',
    templateUrl: './group-avatar-handler.component.html',
    styleUrls: ['./group-avatar-handler.component.scss']
})
export class GroupAvatarHandlerComponent implements OnInit, OnDestroy {
    @Input() authUser;
    @Input() selectedGroup;

    subscriptions: Subscription[] = [];
    removeAvatarShown = false;

    constructor(
        private chatService: ChatService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
    ) {
    }

    ngOnInit(): void {
    }

    changeAvatar(e = null) {
        const file = e?.target.files[0];

        const formData = new FormData();
        formData.append('avatar', file?.name || '');
        formData.append('group_id', this.selectedGroup.id);
        formData.append('member_id', this.authUser.id);

        if (file) {
            formData.append('group_avatar_file', file);
        }

        this.subscriptions.push(this.chatService.changeGroupAvatar(formData).subscribe(dt => {
            this.groupsMessagesStore.setGroupsMessages(dt);
        }));
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }


}
