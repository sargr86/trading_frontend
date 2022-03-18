import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-admins-list',
    templateUrl: './admins-list.component.html',
    styleUrls: ['./admins-list.component.scss']
})
export class AdminsListComponent implements OnInit {
    @Input() admins;
    @Input() authUser;
    @Input() selectedGroup;
    @Input() isOwnGroup;

    constructor() {
    }

    ngOnInit(): void {
    }

}
