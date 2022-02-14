import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsMessagesSubjectService {
    protected groupsMessagesSource = new BehaviorSubject([]);
    protected selectedGroupMessagesSource = new BehaviorSubject({});

    groupsMessages$ = this.groupsMessagesSource.asObservable();
    selectedGroupsMessages$ = this.selectedGroupMessagesSource.asObservable();

    private addGroupFormValue$ = new Subject<any>();

    showMembersForm = false;
    showBottomChatBox = false;

    constructor() {
    }

    get groupsMessages() {
        return this.groupsMessagesSource.getValue();
    }

    setGroupsMessages(messages: any) {
        this.groupsMessagesSource.next([...messages]);
    }

    get selectedGroupMessages() {
        console.log(this.selectedGroupMessagesSource.getValue())
        return this.selectedGroupMessagesSource.getValue() as any;
    }

    selectGroup(groupMessages: any) {
        // console.log('SELECT GROUP:', groupMessages)
        this.selectedGroupMessagesSource.next(groupMessages);
    }

    changeGroup(groupMessages: any) {
        let selectedGroup = this.groupsMessages.find(gm => gm.id === groupMessages.id);
        console.log(groupMessages)
        console.log('CHANGE GROUP:', groupMessages.name, this.selectedGroupMessages.name)
        if (selectedGroup) {
            // selectedGroup.chat_group_members = groupMessages?.chat_group_members;
            // selectedGroup.avatar = groupMessages.avatar;
            selectedGroup = groupMessages;
            console.log(groupMessages)
            if (groupMessages.id === this.selectedGroupMessages.id) {
                this.selectedGroupMessagesSource.next(selectedGroup);
            }
        }
        // console.log(this.selectedGroupMessages)
    }

    changeGroupMessages(group_id, messages) {
        const groupMessages = this.groupsMessages.find(um => um.id === group_id);
        if (groupMessages) {
            groupMessages.group_messages = messages;
        }
    }


    setAddGroupFormValue(value) {
        this.addGroupFormValue$.next(value);
    }

    get addGroupFormValue() {
        return this.addGroupFormValue$.asObservable();
    }

}
