import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserMessagesSubjectService {


    protected userMessagesSource = new BehaviorSubject([]);
    protected selectedUserMessagesSource = new BehaviorSubject([]);

    userMessages$ = this.userMessagesSource.asObservable();
    selectedUserMessages$ = this.selectedUserMessagesSource.asObservable();

    constructor() {
    }

    setUserMessages(messages: any) {
        this.userMessagesSource.next([...messages]);
    }

    changeUser(userMessages: any) {
        this.selectedUserMessagesSource.next(userMessages);
    }

    get userMessages() {
        return this.userMessagesSource.getValue();
    }

    get selectedUserMessages() {
        return this.selectedUserMessagesSource.getValue();
    }


}
