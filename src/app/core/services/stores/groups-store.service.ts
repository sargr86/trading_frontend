import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsStoreService {
    protected groupsSource = new BehaviorSubject([]);
    protected selectedGroupsSource = new BehaviorSubject({});

    groups$ = this.groupsSource.asObservable();
    selectedGroups$ = this.selectedGroupsSource.asObservable();

    constructor() {
    }

    get groups() {
        return this.groupsSource.getValue();
    }

    setGroupsMessages(messages: any) {
        this.groupsSource.next([...messages]);
    }

    get selectedGroup() {
        return this.selectedGroupsSource.getValue() as any;
    }

    selectGroup(group: any) {
        this.selectedGroupsSource.next(group);
    }

    changeGroup(group: any) {
        const allGroupMessages = [...this.groups];
        let selectedGroupIndex = allGroupMessages.findIndex(gm => gm.id === group.id);

        if (selectedGroupIndex === -1) {
            selectedGroupIndex = 0;
        }

        allGroupMessages[selectedGroupIndex] = group;
        this.setGroupsMessages(allGroupMessages);
        if (group.id === this.selectedGroup.id) {
            this.selectGroup(group);
        }
    }

}
