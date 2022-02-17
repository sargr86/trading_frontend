import {Injectable} from '@angular/core';
import {GetElegantDatePipe} from '@shared/pipes/get-elegant-date.pipe';
import {GetAuthUserPipe} from '@shared/pipes/get-auth-user.pipe';

@Injectable()

export class SharedChatHelper {
    authUser;
    constructor(
        private getElegantDate: GetElegantDatePipe,
        private getAuthUser: GetAuthUserPipe
    ) {
        this.authUser = this.getAuthUser.transform();
    }

    getSeenTooltip(user, message) {

        const seenDate = this.getElegantDate.transform(message.seen_at);

        return `${user.first_name} ${user.last_name} at ${seenDate}`;
    }
}
