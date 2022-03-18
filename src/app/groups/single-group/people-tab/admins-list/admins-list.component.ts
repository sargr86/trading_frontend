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
        console.log(this.admins)
    }

    isGroupCreator(admin) {
        return admin.id === this.selectedGroup.creator_id;
    }

    getRoleName(admin) {
        if (this.isGroupCreator(admin)) {
            return 'Group creator';
        } else {
            if (admin.groups_members.is_admin) {
                return 'Admin';
            } else {
                return 'Moderator';
            }
        }
    }

}
