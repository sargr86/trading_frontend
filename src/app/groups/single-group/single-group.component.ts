import {Component, OnInit} from '@angular/core';
import {GroupsMessagesSubjectService} from '@core/services/stores/groups-messages-subject.service';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-single-group',
    templateUrl: './single-group.component.html',
    styleUrls: ['./single-group.component.scss']
})
export class SingleGroupComponent implements OnInit {
    selectedGroup;
    id: number;

    constructor(
        private groupsMessagesStore: GroupsMessagesSubjectService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.getSelectedGroup();
    }

    getSelectedGroup() {
        this.route.params.subscribe((params: Params) => {
            this.selectedGroup = this.groupsMessagesStore.groupsMessages.find(g => g.id === +params.id);
        });
    }

}
