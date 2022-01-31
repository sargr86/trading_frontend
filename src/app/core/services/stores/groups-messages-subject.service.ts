import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsMessagesSubjectService {
    protected groupsMessagesSource = new BehaviorSubject([]);
    protected selectedGroupMessagesSource = new BehaviorSubject([]);

    groupsMessages$ = this.groupsMessagesSource.asObservable();
    selectedGroupsMessages$ = this.selectedGroupMessagesSource.asObservable();

    showMembersForm = false;

    constructor() {
    }

    get groupsMessages() {
        return this.groupsMessagesSource.getValue();
    }

    setGroupsMessages(messages: any) {
        this.groupsMessagesSource.next([...messages]);
    }

    get selectedGroupMessages() {
        return this.selectedGroupMessagesSource.getValue() as any;
    }

    changeGroup(groupMessages: any) {
        this.selectedGroupMessagesSource.next(groupMessages);
    }

    changeGroupMembers(group) {
        this.selectedGroupMessagesSource.next(group);
    }


}
