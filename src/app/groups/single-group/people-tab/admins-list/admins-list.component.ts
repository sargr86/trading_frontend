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

    isGroupAdmin(admin) {
        return !!admin.groups_members.is_admin;
    }

    showActionsMenu(admin) {
        // console.log(admin.first_name + ' ' + admin.last_name, !this.isGroupCreator(admin), (!this.isOwnGroup && this.isGroupAdmin(admin)))
        // return !this.isGroupCreator(admin) || this.isGroupAdmin(admin) && admin.id === this.authUser.id;
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
