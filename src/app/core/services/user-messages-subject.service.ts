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
        return this.selectedUserMessagesSource.getValue() as any;
    }

    // changeUserMessages(id, messages) {
    //     const userMessages = this.userMessages.find(um => um.id === id);
    //     if (userMessages) {
    //         userMessages.direct_messages = messages;
    //     }
    //
    //
    //
    // }

    changeUserMessages(userMessages){
        const allUserMessages = [...this.userMessages];
        const selectedUserIndex = allUserMessages.findIndex(gm => gm.id === userMessages.id);


        allUserMessages[selectedUserIndex] = userMessages;
        this.setUserMessages(allUserMessages);
        if (userMessages.id === this.selectedUserMessages.id) {
            this.changeUser(userMessages);
            console.log(this.selectedUserMessages)
            console.log(this.userMessages)
        }
    }


}
