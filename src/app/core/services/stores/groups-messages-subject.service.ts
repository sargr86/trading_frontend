import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsMessagesSubjectService {
    protected groupsMessagesSource = new BehaviorSubject([]);
    protected selectedGroupMessagesSource = new BehaviorSubject([]);

    groupsMessages$ = this.groupsMessagesSource.asObservable();
    selectedGroupsMessages$ = this.selectedGroupMessagesSource.asObservable();

    private addGroupFormValue$ = new Subject<any>();
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
        const selectedGroup = this.groupsMessages.find(gm => gm.id === groupMessages.id);
        // console.log(selectedGroup)
        if (selectedGroup) {
            selectedGroup.chat_group_members = groupMessages?.chat_group_members;
            this.selectedGroupMessagesSource.next(selectedGroup);
        }
        // console.log(selectedGroup)
    }

    // changeUserMessages(id, messages) {
    //     const userMessages = this.userMessages.find(um => um.id === id);
    //     if (userMessages) {
    //         userMessages.direct_messages = messages;
    //     }
    //
    // }


    changeGroupMembers(group) {
        this.selectedGroupMessagesSource.next(group);
    }


    setAddGroupFormValue(value) {
        this.addGroupFormValue$.next(value);
    }

    get addGroupFormValue() {
        return this.addGroupFormValue$.asObservable();
    }

}
