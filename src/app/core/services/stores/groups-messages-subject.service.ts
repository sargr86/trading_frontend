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

    selectGroup(groupMessages: any) {
        // console.log('SELECT GROUP:', groupMessages)
        this.selectedGroupMessagesSource.next(groupMessages);
    }

    changeGroup(groupMessages: any) {
        const selectedGroup = this.groupsMessages.find(gm => gm.id === groupMessages.id);
        // console.log('CHANGE GROUP:', groupMessages.name, this.selectedGroupMessages.name)
        if (selectedGroup) {
            selectedGroup.chat_group_members = groupMessages?.chat_group_members;

            if (groupMessages.id === this.selectedGroupMessages.id) {
                this.selectedGroupMessagesSource.next(selectedGroup);
            }
        }
        // console.log(this.selectedGroupMessages)
    }


    setAddGroupFormValue(value) {
        this.addGroupFormValue$.next(value);
    }

    get addGroupFormValue() {
        return this.addGroupFormValue$.asObservable();
    }

}
