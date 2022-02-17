import {UsersMessagesSubjectService} from '@core/services/stores/users-messages-subject.service';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })

export class UnreadMessagesCounter {
    authUser;
    constructor(
        private usersMessagesStore: UsersMessagesSubjectService,
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    getUnreadMessagesCount() {
        const directMessages = this.usersMessagesStore.usersMessages
            ?.filter(m => m.direct_messages
                ?.filter(d => !d.seen && d.from_id !== this.authUser.id).length > 0).length;

        const groupMessages = this.groupsMessagesStore.groupsMessages
            ?.filter(m => {
                return m.group_messages
                    ?.find(message => {
                        let found = false;
                        if (message.from_id !== this.authUser.id) {
                            found = !message.seen.find(sb => sb.seen_by.id === this.authUser.id);
                        }
                        return found;
                    });
            }).length;
        return directMessages + groupMessages;
    }
}
