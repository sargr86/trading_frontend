import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GroupsStoreService {
    protected groupsSource = new BehaviorSubject([]);
    protected selectedGroupSource = new BehaviorSubject({});

    groups$ = this.groupsSource.asObservable();
    selectedGroup$ = this.selectedGroupSource.asObservable();

    constructor() {
    }

    get groups() {
        return this.groupsSource.getValue();
    }

    setGroups(messages: any) {
        this.groupsSource.next([...messages]);
    }

    get selectedGroup() {
        return this.selectedGroupSource.getValue() as any;
    }

    selectGroup(group: any) {
        this.selectedGroupSource.next(group);
    }

    changeGroup(group: any) {
        const allGroups = [...this.groups];
        let selectedGroupIndex = allGroups.findIndex(gm => {
            return gm.id === group?.id;
        });

        if (selectedGroupIndex === -1) {
            selectedGroupIndex = 0;
        }

        allGroups[selectedGroupIndex] = group;
        this.setGroups(allGroups);
        if (group.id === this.selectedGroup.id) {
            this.selectGroup(group);
        }
    }

}
